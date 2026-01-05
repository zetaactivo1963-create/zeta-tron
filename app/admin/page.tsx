"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
};

type ResumenCandidato = {
  candidato: string;
  taquillas: number;
  total: number;
};

const PIN = "1963";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resumen, setResumen] = useState<ResumenCandidato[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<
    "todos" | "pendiente" | "aprobado" | "rechazado"
  >("todos");
  const [search, setSearch] = useState("");
  const filteredTickets = tickets.filter((t) => {
    if (!search) return true;

    return (
      t.ticket_code?.toLowerCase().includes(search.toLowerCase()) ||
      t.phone?.includes(search)
    );
  });

  // ===== LOGIN =====
  function handlePin(e: React.FormEvent) {
    e.preventDefault();
    if (pin === PIN) {
      setAuthorized(true);
      fetchTickets();
    } else {
      alert("PIN incorrecto");
    }
  }

  // ===== FETCH TICKETS =====
  async function fetchTickets() {
    setLoading(true);

    let query = supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    // filtro por status
    if (filter !== "todos") {
      query = query.eq("status", filter);
    }

    // 🔎 BUSCAR POR CÓDIGO O TELÉFONO
    if (search && search.trim() !== "") {
      query = query.or(`ticket_code.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("DB ERROR:", error);
      alert("Error cargando tickets");
    } else {
      setTickets(data as Ticket[]);
    }

    // ===== RESUMEN POR CANDIDATO =====
    const { data: resumenData } = await supabase
      .from("resumen_por_candidato")
      .select("*");

    if (resumenData) {
      setResumen(resumenData as ResumenCandidato[]);
    }

    setLoading(false);
  }

useEffect(() => {
  if (authorized) fetchTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [authorized, filter]);


  const resumenOrganizacion = Object.values(
    tickets.reduce(
      (
        acc: Record<string, { organizacion: string; personas: number }>,
        t
      ) => {
        // OJO: en tu DB la columna se llama "asociacion", NO "organizacion"

        if (!acc[org]) {
          acc[org] = { organizacion: org, personas: 0 };
        }

        acc[org].personas += 1;
        return acc;
      },
      {}
    )
  );

  // ===== STATUS UPDATE =====
  async function updateStatus(
    ticket: Ticket,
    status: "aprobado" | "rechazado"
  ) {
    setLoading(true);

    const { error } = await supabase
      .from("tickets")
      .update({ status })
      .eq("id", ticket.id);

    if (error) {
      alert("Error actualizando ticket");
      console.error(error);
      setLoading(false);
      return;
    }

    // WhatsApp SOLO si es aprobado
    if (status === "aprobado") {
      const phoneClean = ticket.phone.replace(/\D/g, "");

      const mensaje = encodeURIComponent(
        `ZETA TRON 🚀\n` +
          `Show de Neófitos\n\n` +
          `Código: ${ticket.ticket_code}\n` +
          `Nombre: ${ticket.name}\n` +
          `Cantidad: ${ticket.qty}\n\n` +
          `Presenta este mensaje en la entrada`
      );

      window.location.href = `https://wa.me/1${phoneClean}?text=${mensaje}`;
    }

    await fetchTickets();
    setLoading(false);
  }

  async function marcarPagoPuerta(ticket: Ticket) {
    setLoading(true);

    const { error } = await supabase
      .from("tickets")
      .update({
        status: "aprobado",
        payment_method: "puerta",
      })
      .eq("id", ticket.id);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      alert("Error registrando pago en puerta");
    }

    await fetchTickets();
    setLoading(false);
  }

  async function checkIn(ticket: Ticket) {
    setLoading(true);

    const { error } = await supabase
      .from("tickets")
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .eq("id", ticket.id);

    if (error) {
      console.error("DB ERROR:", error);
      alert("Error registrando entrada");
    }

    await fetchTickets();
    setLoading(false);
  }

  async function undoCheckIn(ticket: Ticket) {
    setLoading(true);

    const { error } = await supabase
      .from("tickets")
      .update({ checked_in: false })
      .eq("id", ticket.id);

    if (error) {
      alert("Error revirtiendo entrada");
      console.error(error);
    }

    await fetchTickets();
    setLoading(false);
  }

  const ticketsNoEntrados = filteredTickets.filter((t) => !t.checked_in);

  const ticketsEntrados = filteredTickets.filter((t) => t.checked_in);

  // ===== TOTALES =====
  const totalTickets = filteredTickets.reduce((acc, t) => acc + t.qty, 0);
  const totalATH = tickets
    .filter((t) => t.status === "aprobado" && t.payment_method !== "puerta")
    .reduce((acc, t) => acc + t.qty * 25, 0);

  const totalPagosPuerta = tickets
    .filter((t) => t.status === "aprobado" && t.payment_method === "puerta")
    .reduce((acc, t) => acc + t.qty, 0);

  const totalPuertaMonto = tickets
    .filter((t) => t.status === "aprobado" && t.payment_method === "puerta")
    .reduce((acc, t) => acc + t.qty * 30, 0);

  const totalRecaudado = totalATH + totalPuertaMonto;

  // ===== PAGOS EN PUERTA =====
  const ticketsPuerta = tickets.filter(
    (t) => t.payment_method === "puerta" && t.status === "aprobado"
  );

  const totalPuertaCantidad = ticketsPuerta.reduce((acc, t) => acc + t.qty, 0);

  // ===== LOADING =====
  if (authorized && loading) {
    return (
      <div style={overlay}>
        <div style={loaderBox}>
          <div className="spinner" />
          <p>Cargando tickets…</p>
        </div>
        <style>{spinnerCSS}</style>
      </div>
    );
  }

  // ===== LOGIN VIEW =====
  if (!authorized) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handlePin}
          style={{
            width: 260,
            padding: 24,
            border: "1px solid #0ff",
            textAlign: "center",
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
            }}
          >
            Entrar
          </button>
        </form>
      </main>
    );
  }

  // ===== ADMIN VIEW =====
  return (
    <main style={main}>
      <div style={{ width: "100%", maxWidth: 1200 }}>
        <h1 style={{ color: "#0ff" }}>ADMIN · TICKETS</h1>

        {/* ===== DASHBOARD ===== */}
        <div style={stats}>
          <div>
            Total tickets: <b>{totalTickets}</b>
          </div>
          <div>
            Total aprobado: <b>${totalRecaudado}</b>
          </div>
          <div>
            Pagos en puerta: <b>{totalPagosPuerta}</b> (${totalPuertaMonto})
          </div>
          <input
            type="text"
            placeholder="🔍 Código o teléfono"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "#000",
              color: "#0ff",
              border: "1px solid #0ff",
              padding: "6px 10px",
              minWidth: 220,
            }}
          />

          <select
            value={filter}
onChange={(e) =>
  setFilter(e.target.value as "todos" | "pendiente" | "aprobado" | "rechazado")
}            style={select}
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
        <div style={{ marginTop: 40 }}>
          <h2 style={{ marginBottom: 12 }}>Resumen por organización</h2>

          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ ...table, marginBottom: 20, minWidth: 420 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Organización</th>
                  <th style={{ textAlign: "center" }}>Personas</th>
                </tr>
              </thead>
              <tbody>
                {resumenOrganizacion.map((o) => (
                  <tr key={o.organizacion}>
                    <td>{o.organizacion}</td>
                    <td style={{ textAlign: "center" }}>{o.personas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <h2 style={{ marginBottom: 12 }}>Resumen por candidato</h2>

          <table style={{ ...table, marginBottom: 40 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Candidato</th>
                <th>Taquillas</th>
                <th>Total $</th>
              </tr>
            </thead>
            <tbody>
              {resumen.map((r) => (
                <tr key={r.candidato}>
                  <td>{r.candidato}</td>
                  <td style={{ textAlign: "center" }}>{r.taquillas}</td>
                  <td style={{ textAlign: "center" }}>${r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== TABLE ===== */}
        <h2 style={{ marginBottom: 12 }}>Tickets registrados</h2>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Código</th>
                <th style={{ textAlign: "left" }}>Nombre</th>
                <th style={{ textAlign: "left" }}>Teléfono</th>
                <th style={{ textAlign: "left" }}>Cant.</th>
                <th style={{ textAlign: "left" }}>Método</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Evidencia</th>
                <th style={{ textAlign: "left" }}>Acción</th>
              </tr>
            </thead>

            <tbody>
              {ticketsNoEntrados.map((t) => (
                <tr key={t.id}>
                  <td>{t.ticket_code}</td>
                  <td>{t.name}</td>
                  <td>{t.phone}</td>
                  <td>{t.qty}</td>
                  <td>{t.payment_method}</td>
                  <td
                    style={{
                      color:
                        t.status === "aprobado"
                          ? "#0f0"
                          : t.status === "rechazado"
                          ? "#f00"
                          : "#ff0",
                    }}
                  >
                    {t.status}
                  </td>
                  <td>
                    {t.proof_url ? (
                      <a
                        href={t.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0ff" }}
                      >
                        Ver
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {t.checked_in ? (
                      <span style={{ color: "#0f0", fontWeight: "bold" }}>
                        ✔ ENTRADO
                      </span>
                    ) : (
                      <>
                        <button
                          style={{ ...actionBtn, background: "#0f0" }}
                          onClick={() => updateStatus(t, "aprobado")}
                        >
                          ✓
                        </button>

                        <button
                          style={{ ...actionBtn, background: "#f00" }}
                          onClick={() => updateStatus(t, "rechazado")}
                        >
                          ✕
                        </button>

                        {t.status === "aprobado" && (
                          <button
                            style={{
                              ...actionBtn,
                              background: "#0ff",
                              marginLeft: 6,
                            }}
                            onClick={() => checkIn(t)}
                          >
                            ENTRÓ
                          </button>
                        )}
                      </>
                    )}

                    {t.payment_method === "puerta" &&
                      t.status !== "aprobado" && (
                        <button
                          style={{ ...actionBtn, background: "#ff0" }}
                          onClick={() => marcarPagoPuerta(t)}
                        >
                          COBRAR EN PUERTA
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== TABLA ENTRADOS ===== */}
        <h2 style={{ marginBottom: 12, marginTop: 40 }}>Tickets ENTRADOS</h2>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ ...table, minWidth: 1000 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Código</th>
                <th style={{ textAlign: "left" }}>Nombre</th>
                <th style={{ textAlign: "left" }}>Teléfono</th>
                <th style={{ textAlign: "left" }}>Cant.</th>
                <th style={{ textAlign: "left" }}>Hora entrada</th>
                <th style={{ textAlign: "left" }}>Acción</th>
              </tr>
            </thead>

            <tbody>
              {ticketsEntrados.map((t) => (
                <tr key={t.id}>
                  <td>{t.ticket_code}</td>
                  <td>{t.name}</td>
                  <td>{t.phone}</td>
                  <td>{t.qty}</td>
                  <td>
                    {t.checked_in_at
                      ? new Date(t.checked_in_at).toLocaleTimeString()
                      : "—"}
                  </td>
                  <td>
                    <button
                      style={{ ...actionBtn, background: "#ff0" }}
                      onClick={() => undoCheckIn(t)}
                    >
                      DESHACER
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== SECCIÓN PAGO EN PUERTA ===== */}
        <div
          style={{ marginTop: 60, borderTop: "1px solid #0ff", paddingTop: 20 }}
        >
          <h2>Pago en la puerta</h2>

          <p style={{ marginTop: 10 }}>
            Pagos en puerta registrados: <b>{totalPuertaCantidad}</b>
            <br />
            Total cobrado en puerta: <b>${totalPuertaMonto}</b>
          </p>

          <button
            style={{
              background: "#0ff",
              color: "#000",
              padding: "10px 14px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              marginBottom: 20,
            }}
            onClick={async () => {
              setLoading(true);

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
                console.error("DB ERROR:", error);
                alert("Error registrando pago en puerta");
              }

              await fetchTickets();
              setLoading(false);
            }}
          >
            + Registrar pago en puerta ($30)
          </button>
        </div>
      </div>
    </main>
  );
}

/* ===== STYLES ===== */

const main = {
  minHeight: "100vh",
  background: "#000",
  color: "#0ff",
  display: "flex",
  justifyContent: "center",
  padding: 24,
};

const stats = {
  display: "flex",
  gap: 20,
  alignItems: "center",
  marginBottom: 20,
};

const select = {
  background: "#000",
  color: "#0ff",
  border: "1px solid #0ff",
  padding: 6,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 1000,
};

const actionBtn = {
  padding: "12px 16px",
  fontSize: 14,
  borderRadius: 6,
  minWidth: 100,
  marginBottom: 8,
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const loaderBox = {
  textAlign: "center" as const,
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
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
