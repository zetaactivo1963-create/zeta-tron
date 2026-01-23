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
  guagua?: boolean | null;
  
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

/* ================== SMALL HOOK ================== */
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

/* ================== COMPONENT ================== */
export default function AdminPage() {
  const isMobile = useIsMobile(740);

  const [pin, setPin] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resumen, setResumen] = useState<ResumenCandidato[]>([]);

  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState<"todos" | "pendiente" | "aprobado" | "rechazado">(
    "todos"
  );

  // Barra de búsqueda (lo que escribes)
  const [search, setSearch] = useState("");

  // Para evitar que cada teclazo pegue a Supabase (si quieres), se puede usar local.
  // Pero aquí lo dejamos simple y el query lo hace fetchTickets().
  // Aun así, el filtrado local se mantiene por si estás mirando tickets ya cargados.
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
        "id,ticket_code,name,phone,qty,payment_method,status,proof_url,created_at,checked_in,checked_in_at,asociacion,candidato,guagua"
      )
      .order("created_at", { ascending: false });

    // filtro por status
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

    // ===== RESUMEN POR CANDIDATO =====
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
      const org = (t.asociacion && t.asociacion.trim()) ? t.asociacion : "Sin organización";
      if (!acc[org]) acc[org] = { organizacion: org, personas: 0 };
      acc[org].personas += 1; // conteo por persona/compra (si quieres por qty, cambia a += t.qty)
      return acc;
    }, {});
    return Object.values(obj).sort((a, b) => b.personas - a.personas);
  }, [tickets]);

  /* ================== ACTIONS ================== */
  function handlePin(e: React.FormEvent) {
    e.preventDefault();
    if (pin === PIN) {
      setAuthorized(true);
      // fetchTickets() se dispara por useEffect
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
        // eslint-disable-next-line no-console
        console.error(error);
        return;
      }

      // WhatsApp SOLO si es aprobado
      if (status === "aprobado") {
        const phoneClean = (ticket.phone ?? "").replace(/\D/g, "");
        const mensaje = encodeURIComponent(
          `ZETA TRON 🚀\n` +
            `Show de Neófitos\n\n` +
            `Código: ${ticket.ticket_code}\n` +
            `Nombre: ${ticket.name}\n` +
            `Cantidad: ${ticket.qty}\n\n` +
            `Presenta este mensaje en la entrada`
        );

        // redirige
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
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.error(error);
      }

      await fetchTickets();
    } finally {
      setLoading(false);
    }
  }

  /* ================== DERIVED LISTS ================== */
  const ticketsNoEntrados = useMemo(
    () => filteredTickets.filter((t) => !t.checked_in),
    [filteredTickets]
  );
  const ticketsEntrados = useMemo(
    () => filteredTickets.filter((t) => t.checked_in),
    [filteredTickets]
  );

  /* ================== TOTALS ================== */
const PRICE = 15;
const GUAGUA_EXTRA = 10;

  const totalTickets = useMemo(
  () => filteredTickets.reduce((acc, t) => acc + (t.qty ?? 0), 0),
  [filteredTickets]
);

// Total aprobado (incluye ATH + puerta, y suma guagua si aplica)
const totalRecaudado = useMemo(() => {
  return tickets
    .filter((t) => t.status === "aprobado")
    .reduce((acc, t) => {
      const qty = t.qty ?? 0;
      const unit = PRICE + (t.guagua ? GUAGUA_EXTRA : 0);
      return acc + qty * unit;
    }, 0);
}, [tickets]);

// ATH aprobado (incluye guagua)
const totalATH = useMemo(() => {
  return tickets
    .filter((t) => t.status === "aprobado" && t.payment_method !== "puerta")
    .reduce((acc, t) => {
      const qty = t.qty ?? 0;
      const unit = PRICE + (t.guagua ? GUAGUA_EXTRA : 0);
      return acc + qty * unit;
    }, 0);
}, [tickets]);

// Puerta aprobado (incluye guagua)
const totalPuertaMonto = useMemo(() => {
  return tickets
    .filter((t) => t.status === "aprobado" && t.payment_method === "puerta")
    .reduce((acc, t) => {
      const qty = t.qty ?? 0;
      const unit = PRICE + (t.guagua ? GUAGUA_EXTRA : 0);
      return acc + qty * unit;
    }, 0);
}, [tickets]);

// Cantidad de taquillas en puerta (solo qty)
const totalPuertaCantidad = useMemo(() => {
  return tickets
    .filter((t) => t.status === "aprobado" && t.payment_method === "puerta")
    .reduce((acc, t) => acc + (t.qty ?? 0), 0);
}, [tickets]);

  /* ================== LOADING OVERLAY ================== */
  if (authorized && loading) {
    return (
      <div style={overlay}>
        <div style={loaderBox}>
          <div className="spinner" />
          <p style={{ marginTop: 8 }}>Cargando tickets…</p>
        </div>
        <style>{spinnerCSS}</style>
      </div>
    );
  }

  /* ================== LOGIN VIEW ================== */
  if (!authorized) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <form
          onSubmit={handlePin}
          style={{
            width: "100%",
            maxWidth: 320,
            padding: 24,
            border: "1px solid #0ff",
            textAlign: "center",
            borderRadius: 10,
          }}
        >
          <h3 style={{ marginBottom: 16, color: "#0ff" }}>Acceso Directiva</h3>

          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              background: "#000",
              border: "1px solid #0ff",
              color: "#0ff",
              textAlign: "center",
              marginBottom: 12,
              borderRadius: 8,
              outline: "none",
            }}
          />

          <button
            style={{
              width: "100%",
              padding: 10,
              background: "#0ff",
              color: "#000",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              borderRadius: 8,
            }}
          >
            Entrar
          </button>
        </form>
      </main>
    );
  }

  /* ================== UI HELPERS ================== */
  const SearchBar = (
    <input
      type="text"
      placeholder="🔍 Código o teléfono"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={searchInput}
    />
  );

  const FilterSelect = (
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value as "todos" | "pendiente" | "aprobado" | "rechazado")}
      style={select}
    >
      <option value="todos">Todos</option>
      <option value="pendiente">Pendientes</option>
      <option value="aprobado">Aprobados</option>
      <option value="rechazado">Rechazados</option>
    </select>
  );

  /* ================== MOBILE CARDS ================== */
  function TicketCard({
    t,
    mode,
  }: {
    t: Ticket;
    mode: "no_entrados" | "entrados";
  }) {
    const isEntrado = !!t.checked_in;

    return (
      <div style={cardRow}>
        <div style={cardRowTop}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Código</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#0ff" }}>{t.ticket_code}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Status</div>
            <div style={{ fontWeight: 800, color: statusColor(t.status) }}>{formatStatus(t.status)}</div>
          </div>
        </div>

        <div style={cardRowBody}>
          <div style={cardField}>
            <span style={cardLabel}>Nombre</span>
            <span style={cardValue}>{t.name || "—"}</span>
          </div>

          <div style={cardField}>
            <span style={cardLabel}>Teléfono</span>
            <span style={cardValue}>{t.phone || "—"}</span>
          </div>

          <div style={cardGrid2}>
            <div style={cardField}>
              <span style={cardLabel}>Cantidad</span>
              <span style={cardValue}>{t.qty}</span>
            </div>
            <div style={cardField}>
              <span style={cardLabel}>Método</span>
              <span style={cardValue}>{formatMetodo(t.payment_method)}</span>
            </div>
          </div>

          <div style={cardGrid2}>
            <div style={cardField}>
              <span style={cardLabel}>Organización</span>
              <span style={cardValue}>{t.asociacion || "—"}</span>
            </div>
            <div style={cardField}>
              <span style={cardLabel}>Evidencia</span>
              <span style={cardValue}>
                {t.proof_url ? (
                  <a href={t.proof_url} target="_blank" rel="noopener noreferrer" style={{ color: "#0ff" }}>
                    Ver
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </div>

          <div style={cardGrid2}>
  <div style={cardField}>
    <span style={cardLabel}>Candidato</span>
    <span style={cardValue}>{t.candidato || "Ninguno"}</span>
  </div>
  <div style={cardField}>
    <span style={cardLabel}>Guagua</span>
    <span style={cardValue}>{t.guagua ? "Sí" : "No"}</span>
  </div>
</div>      

          {mode === "entrados" && (
            <div style={cardField}>
              <span style={cardLabel}>Hora entrada</span>
              <span style={cardValue}>
                {t.checked_in_at ? new Date(t.checked_in_at).toLocaleTimeString() : "—"}
              </span>
            </div>
          )}
        </div>

        <div style={cardRowActions}>
          {mode === "no_entrados" ? (
            <>
              {!isEntrado ? (
                <>
                  <button
                    style={{ ...actionBtnMobile, background: "#0f0" }}
                    onClick={() => updateStatus(t, "aprobado")}
                  >
                    Aprobar
                  </button>

                  <button
                    style={{ ...actionBtnMobile, background: "#f00", color: "#fff" }}
                    onClick={() => updateStatus(t, "rechazado")}
                  >
                    Rechazar
                  </button>

                  {t.status === "aprobado" && (
                    <button
                      style={{ ...actionBtnMobile, background: "#0ff", color: "#000" }}
                      onClick={() => checkIn(t)}
                    >
                      Marcar ENTRÓ
                    </button>
                  )}

                  {t.payment_method === "puerta" && t.status !== "aprobado" && (
                    <button
                      style={{ ...actionBtnMobile, background: "#ff0", color: "#000" }}
                      onClick={() => marcarPagoPuerta(t)}
                    >
                      Cobrar en puerta
                    </button>
                  )}
                </>
              ) : (
                <div style={{ color: "#0f0", fontWeight: 800 }}>✔ ENTRADO</div>
              )}
            </>
          ) : (
            <button
              style={{ ...actionBtnMobile, background: "#ff0", color: "#000" }}
              onClick={() => undoCheckIn(t)}
            >
              Deshacer check-in
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ================== ADMIN VIEW ================== */
  return (
    <main style={main}>
      {/* global responsive helpers */}
      <style>{responsiveCSS}</style>

      <div style={{ width: "100%", maxWidth: 1200 }}>
        <div style={topHeader}>
          <h1 style={{ color: "#0ff", margin: 0 }}>ADMIN · TICKETS</h1>
        </div>

        {/* ===== DASHBOARD ===== */}
        <div style={stats}>
          <div style={statPill}>
            Total tickets: <b>{totalTickets}</b>
          </div>

          <div style={statPill}>
            Guagua: <b>{totalGuagua}</b>
          </div>

          <div style={statPill}>
            Total aprobado: <b>${totalRecaudado}</b>
          </div>

          <div style={statPill}>
            Puerta: <b>{totalPagosPuerta}</b> (${totalPuertaMonto})
          </div>

          <div style={statsRight}>
  {SearchBar}
  {FilterSelect}

  <button
    type="button"
    onClick={fetchTickets}
    style={refreshBtnInline}
  >
    ↻
  </button>
</div>
        </div>

        {/* ===== RESUMENES ===== */}
        <div style={{ marginTop: 26 }}>
          <div style={sectionHeaderRow}>
            <h2 style={sectionTitle}>Resumen por organización</h2>
          </div>

          <div style={tableWrap}>
            <table style={{ ...table, minWidth: 520 }}>
              <thead>
                <tr>
                  <th style={{ ...th, textAlign: "left" }}>Organización</th>
                  <th style={{ ...th, textAlign: "center", width: 120 }}>Personas</th>
                </tr>
              </thead>
              <tbody>
                {resumenOrganizacion.map((o) => (
                  <tr key={o.organizacion}>
                    <td style={td}>{o.organizacion}</td>
                    <td style={{ ...td, textAlign: "center" }}>{o.personas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ height: 16 }} />

          <div style={sectionHeaderRow}>
            <h2 style={sectionTitle}>Resumen por candidato</h2>
          </div>

          <div style={tableWrap}>
            <table style={{ ...table, minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={{ ...th, textAlign: "left" }}>Candidato</th>
                  <th style={{ ...th, textAlign: "center", width: 130 }}>Taquillas</th>
                  <th style={{ ...th, textAlign: "center", width: 130 }}>Total $</th>
                </tr>
              </thead>
              <tbody>
                {resumen.map((r) => (
                  <tr key={r.candidato}>
                    <td style={td}>{r.candidato}</td>
                    <td style={{ ...td, textAlign: "center" }}>{r.taquillas}</td>
                    <td style={{ ...td, textAlign: "center" }}>${r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== Listado de guagua ===== */}
         <div style={{ height: 16 }} />

          <div style={sectionHeaderRow}>
            <h2 style={sectionTitle}>Guagua (Mayagüez ➜ Arecibo)</h2>
          </div>

          <div style={tableWrap}>
            <table style={{ ...table, minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={{ ...th, textAlign: "left" }}>Nombre</th>
                  <th style={{ ...th, textAlign: "left" }}>Teléfono</th>
                  <th style={{ ...th, textAlign: "center", width: 90 }}>Qty</th>
                  <th style={{ ...th, textAlign: "left", width: 200 }}>Candidato</th>
                </tr>
              </thead>
              <tbody>
                {listaGuagua.map((t) => (
                  <tr key={t.id}>
                    <td style={td}>{t.name || "—"}</td>
                    <td style={td}>{t.phone || "—"}</td>
                    <td style={{ ...td, textAlign: "center" }}>{t.qty ?? 0}</td>
                    <td style={td}>{t.candidato || "Ninguno"}</td>
                  </tr>
                ))}

                {listaGuagua.length === 0 && (
                  <tr>
                    <td style={td} colSpan={4}>
                      <div style={emptyBox}>No hay personas marcadas con guagua.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        {/* ===== TICKETS REGISTRADOS ===== */}
        <div style={{ marginTop: 32 }}>
          <div style={sectionHeaderRow}>
            <h2 style={sectionTitle}>Tickets registrados</h2>

            {/* mini search duplicate for iphone (si quieres arriba fijo) */}
            {isMobile ? (
              <div style={{ width: "100%", marginTop: 10 }}>
                {SearchBar}
                <div style={{ marginTop: 10 }}>{FilterSelect}</div>
              </div>
            ) : null}
          </div>

          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ticketsNoEntrados.map((t) => (
                <TicketCard key={t.id} t={t} mode="no_entrados" />
              ))}
              {ticketsNoEntrados.length === 0 && (
                <div style={emptyBox}>No hay tickets en esta vista.</div>
              )}
            </div>
          ) : (
            <div style={tableWrap}>
              <table style={{ ...table, minWidth: 980 }}>
                <thead>
                  <tr>
                    <th style={{ ...th, textAlign: "left" }}>Código</th>
                    <th style={{ ...th, textAlign: "left" }}>Nombre</th>
                    <th style={{ ...th, textAlign: "left" }}>Teléfono</th>
                    <th style={{ ...th, textAlign: "left", width: 80 }}>Cant.</th>
                    <th style={{ ...th, textAlign: "left", width: 110 }}>Método</th>
                    <th style={{ ...th, textAlign: "left", width: 110 }}>Status</th>
                    <th style={{ ...th, textAlign: "left", width: 110 }}>Evidencia</th>
                    <th style={{ ...th, textAlign: "left", width: 160 }}>Candidato</th>
                    <th style={{ ...th, textAlign: "left", width: 100 }}>Guagua</th>
                    <th style={{ ...th, textAlign: "left", width: 420 }}>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {ticketsNoEntrados.map((t) => (
                    <tr key={t.id}>
                      <td style={td}>{t.ticket_code}</td>
                      <td style={td}>{t.name}</td>
                      <td style={td}>{t.phone}</td>
                      <td style={td}>{t.qty}</td>
                      <td style={td}>{formatMetodo(t.payment_method)}</td>
                      <td style={{ ...td, color: statusColor(t.status), fontWeight: 700 }}>
                        {formatStatus(t.status)}
                      </td>
                      <td style={td}>
                        {t.proof_url ? (
                          <a href={t.proof_url} target="_blank" rel="noopener noreferrer" style={{ color: "#0ff" }}>
                            Ver
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td style={td}>{t.candidato || "—"}</td>
<td style={{ ...td, textAlign: "center" }}>
  {t.guagua ? "Sí" : "No"}
</td>
                      
                      <td style={td}>
                        {t.checked_in ? (
                          <span style={{ color: "#0f0", fontWeight: "bold" }}>✔ ENTRADO</span>
                        ) : (
                          <>
                            <button style={{ ...actionBtn, background: "#0f0" }} onClick={() => updateStatus(t, "aprobado")}>
                              ✓
                            </button>

                            <button style={{ ...actionBtn, background: "#f00", color: "#fff" }} onClick={() => updateStatus(t, "rechazado")}>
                              ✕
                            </button>

                            {t.status === "aprobado" && (
                              <button
                                style={{ ...actionBtn, background: "#0ff", marginLeft: 6, color: "#000" }}
                                onClick={() => checkIn(t)}
                              >
                                ENTRÓ
                              </button>
                            )}

                            {t.payment_method === "puerta" && t.status !== "aprobado" && (
                              <button style={{ ...actionBtn, background: "#ff0", color: "#000" }} onClick={() => marcarPagoPuerta(t)}>
                                COBRAR EN PUERTA
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}

                  {ticketsNoEntrados.length === 0 && (
                    <tr>
                      <td style={td} colSpan={8}>
                        <div style={emptyBox}>No hay tickets en esta vista.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== ENTRADOS ===== */}
        <div style={{ marginTop: 34 }}>
          <div style={sectionHeaderRow}>
            <h2 style={sectionTitle}>Tickets ENTRADOS</h2>
          </div>

          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ticketsEntrados.map((t) => (
                <TicketCard key={t.id} t={t} mode="entrados" />
              ))}
              {ticketsEntrados.length === 0 && (
                <div style={emptyBox}>No hay tickets entrados en esta vista.</div>
              )}
            </div>
          ) : (
            <div style={tableWrap}>
              <table style={{ ...table, minWidth: 980 }}>
                <thead>
                  <tr>
                    <th style={{ ...th, textAlign: "left" }}>Código</th>
                    <th style={{ ...th, textAlign: "left" }}>Nombre</th>
                    <th style={{ ...th, textAlign: "left" }}>Teléfono</th>
                    <th style={{ ...th, textAlign: "left", width: 80 }}>Cant.</th>
                    <th style={{ ...th, textAlign: "left", width: 160 }}>Hora entrada</th>
                    <th style={{ ...th, textAlign: "left", width: 160 }}>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {ticketsEntrados.map((t) => (
                    <tr key={t.id}>
                      <td style={td}>{t.ticket_code}</td>
                      <td style={td}>{t.name}</td>
                      <td style={td}>{t.phone}</td>
                      <td style={td}>{t.qty}</td>
                      <td style={td}>
                        {t.checked_in_at ? new Date(t.checked_in_at).toLocaleTimeString() : "—"}
                      </td>
                      <td style={td}>
                        <button style={{ ...actionBtn, background: "#ff0", color: "#000" }} onClick={() => undoCheckIn(t)}>
                          DESHACER
                        </button>
                      </td>
                    </tr>
                  ))}

                  {ticketsEntrados.length === 0 && (
                    <tr>
                      <td style={td} colSpan={6}>
                        <div style={emptyBox}>No hay tickets entrados en esta vista.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== PAGO EN PUERTA (ADMIN) ===== */}
        <div style={{ marginTop: 50, borderTop: "1px solid rgba(0,255,255,0.35)", paddingTop: 20 }}>
          <h2 style={{ margin: 0 }}>Pago en la puerta</h2>

          <p style={{ marginTop: 10, opacity: 0.9 }}>
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
                  event_slug: "zeta-tron",
                  name: "Pago en puerta",
                  phone: "PUERTA",
                  qty: 1,
                  payment_method: "puerta",
                  status: "aprobado",
                  checked_in: true,
                  checked_in_at: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                });

                if (error) {
                  // eslint-disable-next-line no-console
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
            + Registrar pago en puerta ($15)
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

const cardGrid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
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

/* Responsive: barra búsqueda full width en iphone */
const responsiveCSS = `
@media (max-width: 740px) {
  /* inputs/select full width dentro del dashboard */
  input[type="text"], select {
    width: 100% !important;
    min-width: 0 !important;
  }
}
`;
