"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

/* ================== TYPES ================== */
type Ticket = {
  id: string;
  ticket_code: string;
  name: string;
  phone: string;
  qty: number;
  payment_method: string;
  status: string;
  proof_url: string | null;
  created_at: string;
  checked_in: boolean;
  checked_in_at?: string | null;
  asociacion?: string | null;
  candidato?: string | null;
  price_type?: string | null; // NUEVO: tipo de precio
};

type ResumenCandidato = {
  candidato: string;
  taquillas: number;
  total: number;
};

type ResumenOrgRow = {
  organizacion: string;
  personas: number;
};

const PIN = "1963";

/* ================== HELPERS ================== */
function formatMetodo(m: string) {
  if (!m) return "—";
  if (m === "puerta") return "Puerta";
  if (m === "ath") return "ATH";
  if (m === "tarjeta") return "Tarjeta";
  return m;
}

function formatStatus(s: string) {
  if (!s) return "—";
  return s;
}

function statusColor(s: string) {
  if (s === "aprobado") return "#0f0";
  if (s === "rechazado") return "#f00";
  return "#ff0";
}

function formatPriceType(type: string | null | undefined) {
  if (!type) return "Entrada";
  if (type === "newbies") return "Newbi's";
  if (type === "preventa") return "Pre-venta";
  if (type === "entrada") return "Entrada";
  return type;
}

function getPriceValue(type: string | null | undefined): number {
  if (!type || type === "entrada") return 25;
  if (type === "preventa") return 20;
  if (type === "newbies") return 15;
  return 25;
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

/* ================== COMPONENT ================== */
export default function AdminPage() {
  const isMobile = useIsMobile(740);

  const [pin, setPin] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resumen, setResumen] = useState<ResumenCandidato[]>([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState<"todos" | "pendiente" | "aprobado" | "rechazado">("todos");
  const [search, setSearch] = useState("");

  const filteredTickets = useMemo(() => {
    const s = search.trim();
    if (!s) return tickets;

    const sLower = s.toLowerCase();
    const sDigits = s.replace(/\D/g, "");

    return tickets.filter((t) => {
      const code = (t.ticket_code ?? "").toLowerCase();
      const name = (t.name ?? "").toLowerCase();
      const phone = t.phone ?? "";
      const phoneDigits = phone.replace(/\D/g, "");

      return (
        code.includes(sLower) ||
        name.includes(sLower) ||
        phone.includes(s) ||
        (sDigits && phoneDigits.includes(sDigits))
      );
    });
  }, [tickets, search]);

  /* ================== FETCH ================== */
  const fetchTickets = useCallback(async () => {
    setLoading(true);

    try {
      let query = supabase
        .from("tickets")
        .select(
          "id,ticket_code,name,phone,qty,payment_method,status,proof_url,created_at,checked_in,checked_in_at,asociacion,candidato,price_type"
        )
        .order("created_at", { ascending: false });

      if (filter !== "todos") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("DB ERROR:", error);
        alert("Error cargando tickets");
      } else {
        setTickets((data ?? []) as Ticket[]);
      }

      // Resumen por candidato
      const { data: resumenData, error: resumenErr } = await supabase
        .from("resumen_por_candidato")
        .select("*");

      if (resumenErr) {
        console.error("RESUMEN ERROR:", resumenErr);
      } else if (resumenData) {
        setResumen(resumenData as ResumenCandidato[]);
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!authorized) return;
    fetchTickets();
  }, [authorized, fetchTickets]);

  /* ================== RESUMEN ORG ================== */
  const resumenOrganizacion: ResumenOrgRow[] = useMemo(() => {
    const obj = tickets.reduce((acc: Record<string, ResumenOrgRow>, t) => {
      const org = t.asociacion && t.asociacion.trim() ? t.asociacion : "Sin organización";
      if (!acc[org]) acc[org] = { organizacion: org, personas: 0 };
      acc[org].personas += 1;
      return acc;
    }, {});
    return Object.values(obj).sort((a, b) => b.personas - a.personas);
  }, [tickets]);

  /* ================== ACTIONS ================== */
  function handlePin(e: React.FormEvent) {
    e.preventDefault();
    if (pin === PIN) {
      setAuthorized(true);
    } else {
      alert("PIN incorrecto");
    }
  }

  async function updateStatus(ticket: Ticket, status: "aprobado" | "rechazado") {
    setLoading(true);

    try {
      const { error } = await supabase.from("tickets").update({ status }).eq("id", ticket.id);

      if (error) {
        alert("Error actualizando ticket");
        console.error(error);
        return;
      }

      // WhatsApp SOLO si es aprobado
      if (status === "aprobado") {
        const phoneClean = (ticket.phone ?? "").replace(/\D/g, "");
        const priceValue = getPriceValue(ticket.price_type);
        const mensaje = encodeURIComponent(
          `ZETA'S GRID 2.0 🚀\n` +
            `TrowBack WelcomeNewbi Show\n\n` +
            `Código: ${ticket.ticket_code}\n` +
            `Nombre: ${ticket.name}\n` +
            `Cantidad: ${ticket.qty}\n` +
            `Tipo: ${formatPriceType(ticket.price_type)}\n\n` +
            `Presenta este mensaje en la entrada`
        );

        window.location.href = `https://wa.me/1${phoneClean}?text=${mensaje}`;
      }

      await fetchTickets();
    } finally {
      setLoading(false);
    }
  }

  async function marcarPagoPuerta(ticket: Ticket) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tickets")
        .update({ status: "aprobado", payment_method: "puerta" })
        .eq("id", ticket.id);

      if (error) {
        console.error("SUPABASE ERROR:", error);
        alert("Error registrando pago en puerta");
      }

      await fetchTickets();
    } finally {
      setLoading(false);
    }
  }

  async function checkIn(ticket: Ticket) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tickets")
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq("id", ticket.id);

      if (error) {
        console.error("DB ERROR:", error);
        alert("Error registrando entrada");
      }

      await fetchTickets();
    } finally {
      setLoading(false);
    }
  }

  async function undoCheckIn(ticket: Ticket) {
    setLoading(true);
    try {
      const { error } = await supabase.from("tickets").update({ checked_in: false }).eq("id", ticket.id);

      if (error) {
        alert("Error revirtiendo entrada");
        console.error(error);
      }

      await fetchTickets();
    } finally {
      setLoading(false);
    }
  }

  /* ================== DERIVED LISTS ================== */
  const ticketsNoEntrados = useMemo(() => filteredTickets.filter((t) => !t.checked_in), [filteredTickets]);
  const ticketsEntrados = useMemo(() => filteredTickets.filter((t) => t.checked_in), [filteredTickets]);

  /* ================== TOTALS ================== */
  // Total de taquillas APROBADAS
  const totalTickets = useMemo(
    () =>
      tickets
        .filter((t) => t.status === "aprobado")
        .reduce((acc, t) => acc + (t.qty ?? 0), 0),
    [tickets]
  );

  // Total dinero (por tipo de precio)
  const totalDinero = useMemo(() => {
    return tickets
      .filter((t) => t.status === "aprobado")
      .reduce((acc, t) => {
        const priceValue = getPriceValue(t.price_type);
        return acc + t.qty * priceValue;
      }, 0);
  }, [tickets]);

  // Desglose por tipo de precio
  const ticketsPorTipo = useMemo(() => {
    const tipos = { newbies: 0, preventa: 0, entrada: 0 };
    tickets
      .filter((t) => t.status === "aprobado")
      .forEach((t) => {
        const type = t.price_type || "entrada";
        if (type === "newbies") tipos.newbies += t.qty;
        else if (type === "preventa") tipos.preventa += t.qty;
        else tipos.entrada += t.qty;
      });
    return tipos;
  }, [tickets]);

  const dineroPorTipo = useMemo(() => {
    return {
      newbies: ticketsPorTipo.newbies * 15,
      preventa: ticketsPorTipo.preventa * 20,
      entrada: ticketsPorTipo.entrada * 25,
    };
  }, [ticketsPorTipo]);

  // Puerta: cantidad y monto
  const totalPuertaCantidad = useMemo(
    () =>
      tickets
        .filter((t) => t.status === "aprobado" && t.payment_method === "puerta")
        .reduce((acc, t) => acc + (t.qty ?? 0), 0),
    [tickets]
  );

  const totalPuertaMonto = useMemo(() => {
    return tickets
      .filter((t) => t.status === "aprobado" && t.payment_method === "puerta")
      .reduce((acc, t) => {
        const priceValue = getPriceValue(t.price_type);
        return acc + t.qty * priceValue;
      }, 0);
  }, [tickets]);

  /* ================== RENDER ================== */
  if (!authorized) {
    return (
      <main style={main}>
        <form onSubmit={handlePin} style={{ ...card, maxWidth: 360, textAlign: "center" }}>
          <h1 style={{ color: "#0ff", marginBottom: 20 }}>ADMIN</h1>
          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={searchInput}
          />
          <button type="submit" style={registerPuertaBtn}>
            Entrar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main style={main}>
      <style>{spinnerCSS}</style>
      <style>{responsiveCSS}</style>

      {loading && (
        <div style={overlay}>
          <div style={loaderBox}>
            <div className="spinner" />
            <p>Cargando...</p>
          </div>
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 1400 }}>
        {/* ===== TOP HEADER ===== */}
        <div style={topHeader}>
          <h1 style={{ margin: 0, color: "#0ff" }}>ADMIN ZETA'S GRID 2.0</h1>
          <button style={refreshBtn} onClick={fetchTickets}>
            ⟳ Refrescar
          </button>
        </div>

        {/* ===== STATS ===== */}
        <div style={stats}>
          <div style={statPill}>
            <b>Total taquillas:</b> {totalTickets}
          </div>
          <div style={statPill}>
            <b>Newbi's ($15):</b> {ticketsPorTipo.newbies}
          </div>
          <div style={statPill}>
            <b>Pre-venta ($20):</b> {ticketsPorTipo.preventa}
          </div>
          <div style={statPill}>
            <b>Entrada ($25):</b> {ticketsPorTipo.entrada}
          </div>

          <div style={statsRight}>
            <div style={{ ...statPill, background: "rgba(0,255,0,0.1)", borderColor: "#0f0" }}>
              <b>Total dinero:</b> ${totalDinero}
            </div>
          </div>
        </div>

        {/* ===== DESGLOSE DINERO ===== */}
        <details style={{ marginBottom: 20, color: "#0ff" }}>
          <summary style={{ cursor: "pointer", fontSize: 14, opacity: 0.9 }}>
            📊 Ver desglose de dinero por tipo
          </summary>
          <div
            style={{
              marginTop: 10,
              padding: 12,
              border: "1px solid rgba(0,255,255,0.3)",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <p>
              <b>Newbi's:</b> {ticketsPorTipo.newbies} x $15 = ${dineroPorTipo.newbies}
            </p>
            <p>
              <b>Pre-venta:</b> {ticketsPorTipo.preventa} x $20 = ${dineroPorTipo.preventa}
            </p>
            <p>
              <b>Entrada:</b> {ticketsPorTipo.entrada} x $25 = ${dineroPorTipo.entrada}
            </p>
            <hr style={{ border: "1px solid rgba(0,255,255,0.3)", margin: "10px 0" }} />
            <p>
              <b>TOTAL:</b> ${totalDinero}
            </p>
          </div>
        </details>

        {/* ===== SEARCH & FILTER ===== */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Buscar por código, nombre o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} style={select}>
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        {/* ===== RESUMEN CANDIDATOS ===== */}
        {resumen.length > 0 && (
          <details style={{ marginBottom: 20, color: "#0ff" }}>
            <summary style={{ cursor: "pointer", fontSize: 14, opacity: 0.9 }}>
              📊 Resumen por Candidato
            </summary>
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Candidato</th>
                    <th style={th}>Taquillas</th>
                    <th style={th}>Total $</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.map((r, i) => (
                    <tr key={i}>
                      <td style={td}>{r.candidato}</td>
                      <td style={td}>{r.taquillas}</td>
                      <td style={td}>${r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}

        {/* ===== RESUMEN ORGANIZACIONES ===== */}
        {resumenOrganizacion.length > 0 && (
          <details style={{ marginBottom: 20, color: "#0ff" }}>
            <summary style={{ cursor: "pointer", fontSize: 14, opacity: 0.9 }}>
              📊 Resumen por Organización
            </summary>
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Organización</th>
                    <th style={th}>Personas</th>
                  </tr>
                </thead>
                <tbody>
                  {resumenOrganizacion.map((r, i) => (
                    <tr key={i}>
                      <td style={td}>{r.organizacion}</td>
                      <td style={td}>{r.personas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}

        {/* ===== TICKETS SIN ENTRAR ===== */}
        <div style={{ marginBottom: 40 }}>
          <div style={sectionHeaderRow}>
            <h2 style={sectionTitle}>Tickets por entrar ({ticketsNoEntrados.length})</h2>
            <button style={refreshBtnInline} onClick={fetchTickets}>
              ⟳
            </button>
          </div>

          {!isMobile ? (
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Código</th>
                    <th style={th}>Nombre</th>
                    <th style={th}>Tel</th>
                    <th style={th}>Qty</th>
                    <th style={th}>Tipo</th>
                    <th style={th}>Método</th>
                    <th style={th}>Status</th>
                    <th style={th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsNoEntrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={td}>
                        <div style={emptyBox}>No hay tickets por entrar en esta vista.</div>
                      </td>
                    </tr>
                  ) : (
                    ticketsNoEntrados.map((t) => (
                      <tr key={t.id}>
                        <td style={td}>{t.ticket_code}</td>
                        <td style={td}>{t.name}</td>
                        <td style={td}>{t.phone}</td>
                        <td style={td}>{t.qty}</td>
                        <td style={td}>{formatPriceType(t.price_type)}</td>
                        <td style={td}>{formatMetodo(t.payment_method)}</td>
                        <td style={{ ...td, color: statusColor(t.status) }}>{formatStatus(t.status)}</td>
                        <td style={td}>
                          {t.status === "pendiente" && (
                            <>
                              <button
                                style={{ ...actionBtn, background: "#0f0", color: "#000" }}
                                onClick={() => updateStatus(t, "aprobado")}
                              >
                                Aprobar
                              </button>
                              <button
                                style={{ ...actionBtn, background: "#f00", color: "#fff" }}
                                onClick={() => updateStatus(t, "rechazado")}
                              >
                                Rechazar
                              </button>
                              {t.proof_url && (
                                <a
                                  href={t.proof_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ ...actionBtn, background: "#09f", color: "#fff", textDecoration: "none" }}
                                >
                                  Ver evidencia
                                </a>
                              )}
                            </>
                          )}

                          {t.status === "aprobado" && (
                            <button
                              style={{ ...actionBtn, background: "#ff0", color: "#000" }}
                              onClick={() => checkIn(t)}
                            >
                              CHECK-IN
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ticketsNoEntrados.length === 0 ? (
                <div style={emptyBox}>No hay tickets por entrar en esta vista.</div>
              ) : (
                ticketsNoEntrados.map((t) => (
                  <div key={t.id} style={cardRow}>
                    <div style={cardRowTop}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#0ff" }}>{t.ticket_code}</div>
                        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{t.name}</div>
                      </div>
                      <div
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: statusColor(t.status) === "#0f0" ? "rgba(0,255,0,0.2)" : "rgba(255,255,0,0.2)",
                          color: statusColor(t.status),
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {formatStatus(t.status)}
                      </div>
                    </div>

                    <div style={cardRowBody}>
                      <div style={cardField}>
                        <span style={cardLabel}>Teléfono</span>
                        <span style={cardValue}>{t.phone}</span>
                      </div>
                      <div style={cardField}>
                        <span style={cardLabel}>Cantidad</span>
                        <span style={cardValue}>{t.qty}</span>
                      </div>
                      <div style={cardField}>
                        <span style={cardLabel}>Tipo</span>
                        <span style={cardValue}>{formatPriceType(t.price_type)}</span>
                      </div>
                      <div style={cardField}>
                        <span style={cardLabel}>Método</span>
                        <span style={cardValue}>{formatMetodo(t.payment_method)}</span>
                      </div>
                    </div>

                    <div style={cardRowActions}>
                      {t.status === "pendiente" && (
                        <>
                          <button
                            style={{ ...actionBtnMobile, background: "#0f0", color: "#000" }}
                            onClick={() => updateStatus(t, "aprobado")}
                          >
                            ✓ Aprobar
                          </button>
                          <button
                            style={{ ...actionBtnMobile, background: "#f00", color: "#fff" }}
                            onClick={() => updateStatus(t, "rechazado")}
                          >
                            ✕ Rechazar
                          </button>
                          {t.proof_url && (
                            <a
                              href={t.proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                ...actionBtnMobile,
                                background: "#09f",
                                color: "#fff",
                                textDecoration: "none",
                                display: "block",
                                textAlign: "center",
                              }}
                            >
                              Ver evidencia
                            </a>
                          )}
                        </>
                      )}

                      {t.status === "aprobado" && (
                        <button
                          style={{ ...actionBtnMobile, background: "#ff0", color: "#000" }}
                          onClick={() => checkIn(t)}
                        >
                          ⚡ CHECK-IN
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ===== TICKETS ENTRADOS ===== */}
        <div style={{ marginBottom: 40 }}>
          <div style={sectionHeaderRow}>
            <h2 style={sectionTitle}>Tickets entrados ({ticketsEntrados.length})</h2>
            <button style={refreshBtnInline} onClick={fetchTickets}>
              ⟳
            </button>
          </div>

          {!isMobile ? (
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Código</th>
                    <th style={th}>Nombre</th>
                    <th style={th}>Tel</th>
                    <th style={th}>Qty</th>
                    <th style={th}>Tipo</th>
                    <th style={th}>Método</th>
                    <th style={th}>Hora entrada</th>
                    <th style={th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsEntrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={td}>
                        <div style={emptyBox}>No hay tickets entrados en esta vista.</div>
                      </td>
                    </tr>
                  ) : (
                    ticketsEntrados.map((t) => (
                      <tr key={t.id}>
                        <td style={td}>{t.ticket_code}</td>
                        <td style={td}>{t.name}</td>
                        <td style={td}>{t.phone}</td>
                        <td style={td}>{t.qty}</td>
                        <td style={td}>{formatPriceType(t.price_type)}</td>
                        <td style={td}>{formatMetodo(t.payment_method)}</td>
                        <td style={td}>
                          {t.checked_in_at ? new Date(t.checked_in_at).toLocaleTimeString("es-PR") : "—"}
                        </td>
                        <td style={td}>
                          <button
                            style={{ ...actionBtn, background: "#f90", color: "#000" }}
                            onClick={() => undoCheckIn(t)}
                          >
                            Revertir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ticketsEntrados.length === 0 ? (
                <div style={emptyBox}>No hay tickets entrados en esta vista.</div>
              ) : (
                ticketsEntrados.map((t) => (
                  <div key={t.id} style={cardRow}>
                    <div style={cardRowTop}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#0ff" }}>{t.ticket_code}</div>
                        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{t.name}</div>
                      </div>
                      <div
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: "rgba(0,255,0,0.2)",
                          color: "#0f0",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        ✓ ENTRADO
                      </div>
                    </div>

                    <div style={cardRowBody}>
                      <div style={cardField}>
                        <span style={cardLabel}>Teléfono</span>
                        <span style={cardValue}>{t.phone}</span>
                      </div>
                      <div style={cardField}>
                        <span style={cardLabel}>Cantidad</span>
                        <span style={cardValue}>{t.qty}</span>
                      </div>
                      <div style={cardField}>
                        <span style={cardLabel}>Tipo</span>
                        <span style={cardValue}>{formatPriceType(t.price_type)}</span>
                      </div>
                      <div style={cardField}>
                        <span style={cardLabel}>Método</span>
                        <span style={cardValue}>{formatMetodo(t.payment_method)}</span>
                      </div>
                      <div style={cardField}>
                        <span style={cardLabel}>Hora</span>
                        <span style={cardValue}>
                          {t.checked_in_at ? new Date(t.checked_in_at).toLocaleTimeString("es-PR") : "—"}
                        </span>
                      </div>
                    </div>

                    <button
                      style={{ ...actionBtnMobile, background: "#f90", color: "#000" }}
                      onClick={() => undoCheckIn(t)}
                    >
                      ↩ Revertir entrada
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ===== PAGO EN PUERTA ===== */}
        <div style={{ marginTop: 50, borderTop: "1px solid rgba(0,255,255,0.35)", paddingTop: 20 }}>
          <h2 style={{ margin: 0, color: "#0ff" }}>Pago en la puerta</h2>

          <p style={{ marginTop: 10, opacity: 0.9, color: "#bff" }}>
            Pagos en puerta registrados: <b>{totalPuertaCantidad}</b>
            <br />
            Total cobrado en puerta: <b>${totalPuertaMonto}</b>
          </p>

          <button
            style={registerPuertaBtn}
            onClick={async () => {
              setLoading(true);

              try {
                const { error } = await supabase.from("tickets").insert({
                  ticket_code: `PUERTA-${Date.now()}`,
                  event_slug: "zeta-grid-2",
                  name: "Pago en puerta",
                  phone: "PUERTA",
                  qty: 1,
                  payment_method: "puerta",
                  status: "aprobado",
                  checked_in: true,
                  checked_in_at: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  price_type: "entrada", // SIEMPRE $25
                });

                if (error) {
                  console.error("DB ERROR:", error);
                  alert("Error registrando pago en puerta");
                }

                await fetchTickets();
              } finally {
                setLoading(false);
              }
            }}
            type="button"
          >
            + Registrar pago en puerta ($25)
          </button>
        </div>
      </div>
    </main>
  );
}

/* ================== STYLES ================== */
const main: React.CSSProperties = {
  minHeight: "100vh",
  background: "#000",
  color: "#0ff",
  display: "flex",
  justifyContent: "center",
  padding: 16,
};

const card = {
  padding: 24,
  borderRadius: 12,
  background: "rgba(0,0,0,0.8)",
  border: "1px solid rgba(0,255,255,0.4)",
};

const topHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 10,
};

const refreshBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(0,255,255,0.55)",
  color: "#0ff",
  padding: "8px 12px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
};

const stats: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  marginBottom: 18,
  flexWrap: "wrap",
};

const statsRight: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
  marginLeft: "auto",
};

const statPill: React.CSSProperties = {
  border: "1px solid rgba(0,255,255,0.35)",
  borderRadius: 12,
  padding: "10px 12px",
  background: "rgba(0,255,255,0.05)",
  color: "#bff",
  fontSize: 14,
};

const searchInput: React.CSSProperties = {
  background: "#000",
  color: "#0ff",
  border: "1px solid #0ff",
  padding: "10px 12px",
  borderRadius: 10,
  outline: "none",
  minWidth: 240,
  width: "min(360px, 100%)",
};

const select: React.CSSProperties = {
  background: "#000",
  color: "#0ff",
  border: "1px solid #0ff",
  padding: 10,
  borderRadius: 10,
  outline: "none",
  minWidth: 180,
};

const tableWrap: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
  border: "1px solid rgba(0,255,255,0.25)",
  borderRadius: 12,
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 900,
};

const th: React.CSSProperties = {
  padding: "10px 10px",
  borderBottom: "1px solid rgba(0,255,255,0.25)",
  fontSize: 13,
  color: "#9ff",
  position: "sticky",
  top: 0,
  background: "#000",
  zIndex: 1,
};

const td: React.CSSProperties = {
  padding: "10px 10px",
  borderBottom: "1px solid rgba(0,255,255,0.12)",
  fontSize: 13,
  color: "#dff",
  verticalAlign: "top",
};

const actionBtn: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 13,
  borderRadius: 10,
  minWidth: 95,
  marginRight: 8,
  marginBottom: 6,
  border: "none",
  cursor: "pointer",
  fontWeight: 800,
};

const actionBtnMobile: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  fontWeight: 900,
};

const sectionHeaderRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 10,
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  color: "#bff",
  fontSize: 18,
};

const emptyBox: React.CSSProperties = {
  padding: 14,
  border: "1px dashed rgba(0,255,255,0.35)",
  borderRadius: 12,
  color: "#9ff",
  background: "rgba(0,255,255,0.05)",
};

const registerPuertaBtn: React.CSSProperties = {
  background: "#0ff",
  color: "#000",
  padding: "12px 14px",
  fontWeight: 900,
  border: "none",
  cursor: "pointer",
  borderRadius: 12,
  width: "100%",
  maxWidth: 420,
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const loaderBox: React.CSSProperties = {
  textAlign: "center",
  color: "#0ff",
  padding: 18,
  border: "1px solid rgba(0,255,255,0.45)",
  borderRadius: 14,
  background: "rgba(0,0,0,0.55)",
};

const spinnerCSS = `
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0,255,255,0.2);
  border-top: 3px solid #0ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }
`;

const cardRow: React.CSSProperties = {
  border: "1px solid rgba(0,255,255,0.25)",
  borderRadius: 16,
  padding: 14,
  background: "rgba(0,255,255,0.04)",
};

const cardRowTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  paddingBottom: 10,
  borderBottom: "1px solid rgba(0,255,255,0.15)",
};

const cardRowBody: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  paddingTop: 10,
};

const cardRowActions: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const cardField: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const cardLabel: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.75,
  color: "#9ff",
};

const cardValue: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#dff",
  textAlign: "right",
};

const refreshBtnInline = {
  padding: "6px 10px",
  background: "#000",
  color: "#0ff",
  border: "1px solid #0ff",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
};

const responsiveCSS = `
@media (max-width: 740px) {
  input[type="text"], select {
    width: 100% !important;
    min-width: 0 !important;
  }
}
`;
