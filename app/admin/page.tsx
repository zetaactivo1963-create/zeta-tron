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

        window.open(`https://wa.me/1${phoneClean}?text=${mensaje}`, '_blank');
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

  async function deleteTicket(ticket: Ticket) {
    if (!confirm(`¿Seguro que quieres eliminar el ticket ${ticket.ticket_code}?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("tickets").delete().eq("id", ticket.id);

      if (error) {
        alert("Error eliminando ticket");
        console.error(error);
      } else {
        alert("Ticket eliminado exitosamente");
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
      <main style={{...main, alignItems: "center"}}>
        <form onSubmit={handlePin} style={{ 
          ...card, 
          textAlign: "center",
          width: "100%",
          maxWidth: "360px",
        }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ color: "#e0e0e0", marginBottom: 6, fontSize: 26, fontWeight: 600, margin: 0 }}>
              ADMIN
            </h1>
            <p style={{ color: "#909090", fontSize: 13, margin: 0, marginTop: 4 }}>
              Zeta's Grid 2.0
            </p>
          </div>
          <input
            type="password"
            placeholder="Ingresa el PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{
              ...searchInput, 
              textAlign: "center", 
              fontSize: 15, 
              padding: "12px",
              width: "100%",
              marginBottom: 14,
            }}
            autoFocus
          />
          <button type="submit" style={{...registerPuertaBtn, margin: 0}}>
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
          <h1 style={{ margin: 0, color: "#e0e0e0", fontSize: 24, fontWeight: 600 }}>
            ADMIN ZETA'S GRID 2.0
          </h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ ...statPill, background: "rgba(74,144,226,0.15)", borderColor: "rgba(74,144,226,0.3)", color: "#5fa3e8", fontWeight: 700, fontSize: 16 }}>
              💰 Total: ${totalDinero}
            </div>
            <button style={refreshBtn} onClick={fetchTickets}>
              ⟳ Refrescar
            </button>
          </div>
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
        </div>

        {/* ===== DESGLOSE DINERO ===== */}
        <details style={{ marginBottom: 20, color: "#d0d0d0" }}>
          <summary style={{ cursor: "pointer", fontSize: 14, opacity: 0.85, fontWeight: 500 }}>
            📊 Ver desglose de dinero por tipo
          </summary>
          <div
            style={{
              marginTop: 12,
              padding: 16,
              border: "1px solid rgba(100,100,100,0.25)",
              borderRadius: 10,
              fontSize: 13,
              background: "rgba(30,30,30,0.4)",
            }}
          >
            <p style={{ marginBottom: 8, color: "#c0c0c0" }}>
              <b>Newbie's:</b> {ticketsPorTipo.newbies} x $15 = <span style={{ color: "#5fa3e8" }}>${dineroPorTipo.newbies}</span>
            </p>
            <p style={{ marginBottom: 8, color: "#c0c0c0" }}>
              <b>Pre-venta:</b> {ticketsPorTipo.preventa} x $20 = <span style={{ color: "#5fa3e8" }}>${dineroPorTipo.preventa}</span>
            </p>
            <p style={{ marginBottom: 8, color: "#c0c0c0" }}>
              <b>Entrada:</b> {ticketsPorTipo.entrada} x $25 = <span style={{ color: "#5fa3e8" }}>${dineroPorTipo.entrada}</span>
            </p>
            <hr style={{ border: "1px solid rgba(100,100,100,0.2)", margin: "12px 0" }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#e0e0e0" }}>
              <b>TOTAL:</b> <span style={{ color: "#5fa3e8" }}>${totalDinero}</span>
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
                            <>
                              <button
                                style={{ ...actionBtn, background: "#ffc107", color: "#000" }}
                                onClick={() => checkIn(t)}
                              >
                                CHECK-IN
                              </button>
                              <button
                                style={{ ...actionBtn, background: "#dc3545", color: "#fff" }}
                                onClick={() => deleteTicket(t)}
                              >
                                🗑️ Eliminar
                              </button>
                            </>
                          )}

                          {t.status === "rechazado" && (
                            <button
                              style={{ ...actionBtn, background: "#dc3545", color: "#fff" }}
                              onClick={() => deleteTicket(t)}
                            >
                              🗑️ Eliminar
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
                        <>
                          <button
                            style={{ ...actionBtnMobile, background: "#ffc107", color: "#000" }}
                            onClick={() => checkIn(t)}
                          >
                            ⚡ CHECK-IN
                          </button>
                          <button
                            style={{ ...actionBtnMobile, background: "#dc3545", color: "#fff" }}
                            onClick={() => deleteTicket(t)}
                          >
                            🗑️ Eliminar ticket
                          </button>
                        </>
                      )}

                      {t.status === "rechazado" && (
                        <button
                          style={{ ...actionBtnMobile, background: "#dc3545", color: "#fff" }}
                          onClick={() => deleteTicket(t)}
                        >
                          🗑️ Eliminar ticket
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
                          <button
                            style={{ ...actionBtn, background: "#dc3545", color: "#fff" }}
                            onClick={() => deleteTicket(t)}
                          >
                            🗑️
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
                    <button
                      style={{ ...actionBtnMobile, background: "#dc3545", color: "#fff", marginTop: 8 }}
                      onClick={() => deleteTicket(t)}
                    >
                      🗑️ Eliminar ticket
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ===== PAGO EN PUERTA ===== */}
        <div style={{ marginTop: 50, borderTop: "1px solid rgba(100,100,100,0.2)", paddingTop: 20 }}>
          <h2 style={{ margin: 0, color: "#e0e0e0", fontWeight: 600, fontSize: 18 }}>Pago en la puerta</h2>

          <p style={{ marginTop: 10, opacity: 0.9, color: "#b0b0b0", fontSize: 14 }}>
            Pagos en puerta registrados: <b style={{color: "#e0e0e0"}}>{totalPuertaCantidad}</b>
            <br />
            Total cobrado en puerta: <b style={{color: "#5fa3e8"}}>${totalPuertaMonto}</b>
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
  background: "#0a0a0a",
  color: "#e0e0e0",
  display: "flex",
  justifyContent: "center",
  padding: 16,
};

const card = {
  padding: 32,
  borderRadius: 16,
  background: "rgba(20,20,20,0.95)",
  border: "1px solid rgba(100,100,100,0.3)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  maxWidth: 400,
};

const topHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 20,
};

const refreshBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(150,150,150,0.4)",
  color: "#d0d0d0",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.2s",
  fontSize: 14,
};

const stats: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  marginBottom: 20,
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
  border: "1px solid rgba(100,100,100,0.3)",
  borderRadius: 10,
  padding: "10px 14px",
  background: "rgba(40,40,40,0.6)",
  color: "#d0d0d0",
  fontSize: 13,
  fontWeight: 500,
};

const searchInput: React.CSSProperties = {
  background: "rgba(20,20,20,0.8)",
  color: "#e0e0e0",
  border: "1px solid rgba(100,100,100,0.3)",
  padding: "10px 14px",
  borderRadius: 8,
  outline: "none",
  minWidth: 240,
  width: "min(360px, 100%)",
  fontSize: 14,
};

const select: React.CSSProperties = {
  background: "rgba(20,20,20,0.8)",
  color: "#e0e0e0",
  border: "1px solid rgba(100,100,100,0.3)",
  padding: "10px 14px",
  borderRadius: 8,
  outline: "none",
  minWidth: 180,
  fontSize: 14,
};

const tableWrap: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
  border: "1px solid rgba(100,100,100,0.2)",
  borderRadius: 12,
  background: "rgba(15,15,15,0.6)",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 900,
};

const th: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid rgba(100,100,100,0.2)",
  fontSize: 12,
  color: "#a0a0a0",
  position: "sticky",
  top: 0,
  background: "rgba(15,15,15,0.95)",
  zIndex: 1,
  textAlign: "center" as const,
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
};

const td: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid rgba(80,80,80,0.15)",
  fontSize: 13,
  color: "#d0d0d0",
  verticalAlign: "middle" as const,
  textAlign: "center" as const,
};

const actionBtn: React.CSSProperties = {
  padding: "8px 14px",
  fontSize: 12,
  borderRadius: 6,
  minWidth: 90,
  marginRight: 6,
  marginBottom: 4,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  transition: "all 0.2s",
};

const actionBtnMobile: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 13,
  transition: "all 0.2s",
};

const sectionHeaderRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 12,
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  color: "#e0e0e0",
  fontSize: 18,
  fontWeight: 600,
};

const emptyBox: React.CSSProperties = {
  padding: 20,
  border: "1px dashed rgba(100,100,100,0.3)",
  borderRadius: 10,
  color: "#a0a0a0",
  background: "rgba(30,30,30,0.3)",
  textAlign: "center" as const,
  fontSize: 13,
};

const registerPuertaBtn: React.CSSProperties = {
  background: "#4a90e2",
  color: "#fff",
  padding: "14px 20px",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  borderRadius: 8,
  width: "100%",
  maxWidth: 420,
  fontSize: 14,
  transition: "all 0.2s",
  boxShadow: "0 2px 8px rgba(74,144,226,0.3)",
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
  backdropFilter: "blur(4px)",
};

const loaderBox: React.CSSProperties = {
  textAlign: "center",
  color: "#e0e0e0",
  padding: 24,
  border: "1px solid rgba(100,100,100,0.3)",
  borderRadius: 12,
  background: "rgba(20,20,20,0.95)",
};

const spinnerCSS = `
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(150,150,150,0.2);
  border-top: 3px solid #e0e0e0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }
`;

const cardRow: React.CSSProperties = {
  border: "1px solid rgba(100,100,100,0.2)",
  borderRadius: 12,
  padding: 16,
  background: "rgba(25,25,25,0.6)",
  marginBottom: 12,
};

const cardRowTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  paddingBottom: 12,
  borderBottom: "1px solid rgba(100,100,100,0.15)",
};

const cardRowBody: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  paddingTop: 12,
};

const cardRowActions: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const cardField: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const cardLabel: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.7,
  color: "#a0a0a0",
};

const cardValue: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#e0e0e0",
  textAlign: "right",
};

const refreshBtnInline = {
  padding: "6px 12px",
  background: "rgba(30,30,30,0.8)",
  color: "#d0d0d0",
  border: "1px solid rgba(100,100,100,0.3)",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  transition: "all 0.2s",
};

const deleteBtn: React.CSSProperties = {
  ...actionBtn,
  background: "#dc3545",
  color: "#fff",
};

const responsiveCSS = `
@media (max-width: 740px) {
  input[type="text"], select {
    width: 100% !important;
    min-width: 0 !important;
  }
}
`;
