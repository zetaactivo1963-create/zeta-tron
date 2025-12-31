"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Orbitron, Inter } from "next/font/google";
const ATH_NUMBER = "9392533384"; // Kenneth

/* ================== FONTS ================== */
const tron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const ui = Inter({
  subsets: ["latin"],
});

/* ================== DATA ================== */
const CANDIDATOS = [
  "Adrian Monagas",
  "Alexander Jaime",
  "Andres Santos",
  "Daniel Beltrán",
  "Daniel Mora",
  "Dereck Pérez",
  "Gohan Martínez",
  "Ian Pérez",
  "Isaac Vizcarrondo",
  "Jatniel Justiniano",
  "Marcos Marcial",
  "Marcos Juarbe",
  "Ricardo Matías",
  "Yadiel Acevedo",
  "Yadiel Díaz",
  "Zabdiel Rodríguez",
];

type Step = "form" | "review" | "ath" | "puerta" | "done";

/* ================== COMPONENT ================== */
export default function Compra() {
  const PRECIO = 25;
  const FEE_TARJETA = 1.03;
  const [copiado, setCopiado] = useState(false);

  const [step, setStep] = useState<Step>("form");
  const [metodoPago, setMetodoPago] = useState<
    "" | "ath" | "tarjeta" | "puerta"
  >("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [asociacion, setAsociacion] = useState("");
  const [vendidaPor, setVendidaPor] = useState("no");
  const [candidato, setCandidato] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ticketCode, setTicketCode] = useState("");

  /* ================== TOTALS ================== */
  const totalBase = qty * PRECIO;
  const totalATH = totalBase;
  const totalPuerta = qty * 30;

  /* ================== FLOW ================== */
  function goToReview(e: React.FormEvent) {
    e.preventDefault();
    setMetodoPago("");
    setStep("review");
  }

  async function confirmarATH() {
    if (!receipt) {
      alert("Debes subir la evidencia de pago ATH Móvil");
      return;
    }

    const code = `Z${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      setLoading(true);

      const extension = receipt.name.split(".").pop();
      const filePath = `ath/${code}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("ath-confirmaciones")
        .upload(filePath, receipt, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("ath-confirmaciones")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("tickets").insert({
        ticket_code: code,
        event_slug: "zeta-tron",
        name,
        phone,
        qty,
        payment_method: "ath",
        status: "pendiente",
        proof_url: publicData.publicUrl,
        asociacion,
        candidato: candidato || "Ninguno",
      });

      if (insertError) throw insertError;

      setMetodoPago("ath");
      setTicketCode(code);
      setStep("done");
    } catch (err) {
      console.error(err);
      alert("Error procesando el pago ATH");
    } finally {
      setLoading(false);
    }
  }

  async function confirmarPagoPuerta() {
    const code = `Z${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      setLoading(true);

      const { error } = await supabase.from("tickets").insert({
        ticket_code: code,
        event_slug: "zeta-tron",
        name,
        phone,
        qty,
        payment_method: "puerta",
        status: "pendiente",
        asociacion,
        candidato: candidato || "Ninguno",
      });

      if (error) throw error;

      setMetodoPago("puerta");
      setTicketCode(code);
      setStep("done");
    } catch (err) {
      console.error(err);
      alert("Error creando reserva");
    } finally {
      setLoading(false);
    }
  }

  /* ================== DONE ================== */
  if (step === "done") {
    const esPuerta = metodoPago === "puerta";

    return (
      <main style={main}>
        <div style={{ ...card, textAlign: "center" }}>
          <h2 className={tron.className} style={title}>
            {esPuerta ? "RESERVA CONFIRMADA" : "PAGO RECIBIDO"}
          </h2>

          <p style={text}>
            Código de referencia:
            <br />
            <b style={{ fontSize: 18 }}>{ticketCode}</b>
          </p>

          <div style={summaryBox}>
            <p>
              <b>Nombre:</b> {name}
            </p>
            <p>
              <b>Teléfono:</b> {phone}
            </p>
            <p>
              <b>Cantidad:</b> {qty}
            </p>

            {esPuerta && (
              <p>
                <b>Total en puerta:</b>{" "}
                <span style={{ color: "#00ffff" }}>${totalPuerta}</span>
              </p>
            )}
          </div>

          <button
            style={primaryBtn}
            onClick={() => (window.location.href = "/events/zeta-tron")}
          >
            Volver al evento
          </button>
        </div>
      </main>
    );
  }

  /* ================== UI ================== */
  return (
    <main style={main} className={ui.className}>
      {/* ===== FORM ===== */}
      {step === "form" && (
        <form onSubmit={goToReview} style={card}>
          <h1 className={tron.className} style={title}>
            Zeta's "Welcome to the Grid"
          </h1>

          <p style={text}>
            SAB-24-ENE-26 - 7:00pm
            <br />
            "Bambalinas" - Coliseo Aguada
            <br />
            <br />
            <b>$25 · OPEN BAR</b>
            <br />
            <br />
            TRON SHOW · Capítulo Zeta · ΦΣΑ
          </p>

          <input
            style={input}
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            style={input}
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label style={label}>Cantidad</label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              style={qtyBtn}
            >
              −
            </button>

            <div
              style={{
                minWidth: 48,
                textAlign: "center",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {qty}
            </div>

            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              style={qtyBtn}
            >
              +
            </button>
          </div>

          <label style={label}>Parentezco</label>
          <select
            style={input}
            value={asociacion}
            onChange={(e) => setAsociacion(e.target.value)}
          >
            <option value="">Ninguna</option>
            <option value="Amiigo/Familiar">Amiigo/Familiar</option>
            <option value="Phi Sigma Alpha">Phi Sigma Alpha</option>
            <option value="Eta Gamma Delta">Eta Gamma Delta</option>
            <option value="Mu Alpha Phi">Mu Alpha Phi</option>
            <option value="Sigma Epsilon Chi">Sigma Epsilon Chi</option>
            <option value="Nu Sigma Beta">Nu Sigma Beta</option>
            <option value="Otra">Otra</option>
          </select>

          <label style={label}>¿Te vendió un candidato?</label>
          <select
            style={input}
            value={vendidaPor}
            onChange={(e) => setVendidaPor(e.target.value)}
          >
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>

          {vendidaPor === "si" && (
            <select
              style={input}
              value={candidato}
              onChange={(e) => setCandidato(e.target.value)}
              required
            >
              <option value="">Selecciona</option>
              {CANDIDATOS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}

          <button style={primaryBtn}>REVISAR COMPRA</button>
        </form>
      )}

      {/* ===== REVIEW ===== */}
      {step === "review" && (
        <div style={card}>
          <h2 className={tron.className} style={subtitle}>
            CONFIRMA TU INFORMACIÓN
          </h2>

          {/* ===== RESUMEN ===== */}
          <div style={summaryBox}>
            <p>
              <b>Nombre:</b> {name}
            </p>
            <p>
              <b>Teléfono:</b> {phone}
            </p>
            <p>
              <b>Cantidad de taquillas:</b> {qty}
            </p>
            <p>
              <b>Total base:</b> ${totalBase}
            </p>

            {asociacion && (
              <p>
                <b>Asociación:</b> {asociacion}
              </p>
            )}

            {vendidaPor === "si" && (
              <p>
                <b>Candidato:</b> {candidato}
              </p>
            )}

            {vendidaPor === "no" && (
              <p>
                <b>Vendida por candidato:</b> No
              </p>
            )}
          </div>

          <p style={{ ...text, marginTop: 12 }}>
            Verifica que toda la información esté correcta antes de continuar.
          </p>

          <hr
            style={{
              border: "1px solid rgba(0,255,255,0.4)",
              margin: "20px 0",
            }}
          />

          {/* ===== MÉTODOS DE PAGO ===== */}
          <h3 className={tron.className} style={{ marginBottom: 10 }}>
            MÉTODO DE PAGO
          </h3>

          <button
            style={primaryBtn}
            type="button"
            onClick={() => {
              setMetodoPago("ath");
              setReceipt(null);
              setStep("ath");
            }}
          >
            ATH Móvil · ${totalATH}
          </button>

          <button
            style={secondaryBtn}
            type="button"
            onClick={() => {
              setMetodoPago("puerta");
              setStep("puerta");
            }}
          >
            Pago en la puerta · ${totalPuerta}
          </button>

          <button type="button" onClick={() => setStep("form")} style={linkBtn}>
            Editar información
          </button>
        </div>
      )}

      {/* ===== ATH ===== */}
      {step === "ath" && (
        <div style={card}>
          <h2 className={tron.className} style={subtitle}>
            ATH MÓVIL
          </h2>

          <a
            href="https://athmovil.com"
            target="_blank"
            rel="noopener noreferrer"
            style={athBtn}
          >
            Abrir ATH Móvil
          </a>

          <div
            style={{
              fontSize: 15,
              opacity: 0.9,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Envía <b>${totalATH}</b> a Kenneth Morales
            <br />
            <span
              onClick={() => {
                navigator.clipboard.writeText("9392533384");
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
              }}
              style={{
                display: "inline-block",
                marginTop: 10,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: "pointer",
                color: copiado ? "#0f0" : "#00ffff",
                textShadow: copiado
                  ? "0 0 20px rgba(0,255,0,0.9)"
                  : "0 0 12px rgba(0,255,255,0.9)",
                transition: "all 0.3s ease",
              }}
            >
              (939) 253-3384
            </span>
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                letterSpacing: 1,
                color: copiado ? "#0f0" : "#7ffcff",
                opacity: 0.9,
                transition: "all 0.3s ease",
              }}
            >
              {copiado ? "✓ COPIADO" : "👆 TOCA PARA COPIAR"}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
              Recuerda adjuntar confirmación de pago para continuar.
            </div>
          </div>

          <div style={uploadWrapper}>
            <label style={uploadMini}>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
              />

              {receipt ? (
                <span style={{ color: "#0f0" }}>✔ Evidencia cargada</span>
              ) : (
                <span>📤 Subir evidencia</span>
              )}
            </label>
          </div>

          <button style={primaryBtn} onClick={confirmarATH} disabled={loading}>
            {loading ? "Subiendo..." : "Confirmar pago"}
          </button>

          <button style={linkBtn} onClick={() => setStep("review")}>
            Volver
          </button>
        </div>
      )}

      {/* ===== PUERTA ===== */}
      {step === "puerta" && (
        <div style={card}>
          <h2 className={tron.className} style={subtitle}>
            PAGO EN PUERTA
          </h2>

          <p style={text}>
            Total a pagar:
            <br />
            <b>${totalPuerta}</b>
          </p>

          <button
            style={primaryBtn}
            onClick={confirmarPagoPuerta}
            disabled={loading}
          >
            Confirmar reserva
          </button>

          <button style={linkBtn} onClick={() => setStep("review")}>
            Volver
          </button>
        </div>
      )}
    </main>
  );
}

/* ================== STYLES ================== */
const main = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #001a1a, #000)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  width: "100%",
  maxWidth: 480,
  padding: 32,
  borderRadius: 14,
  background: "rgba(0,0,0,0.65)",
  border: "1px solid rgba(0,255,255,0.6)",
  boxShadow:
    "0 0 30px rgba(0,255,255,0.25), inset 0 0 20px rgba(0,255,255,0.15)",
  color: "#ffffff",
};

const title = {
  fontSize: 34,
  letterSpacing: 3,
  color: "#00ffff",
  textAlign: "center" as const,
};

const subtitle = {
  fontSize: 22,
  color: "#00ffff",
};

const text = {
  fontSize: 14,
  opacity: 0.9,
  marginBottom: 14,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  background: "#050505",
  color: "#ffffff",
  border: "1px solid rgba(0,255,255,0.6)",
  boxShadow: "0 0 12px rgba(0,255,255,0.25)",
};

const label = {
  fontSize: 12,
  opacity: 0.75,
};

const primaryBtn = {
  width: "100%",
  padding: 14,
  background: "#00ffff",
  color: "#000",
  fontWeight: 700,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 10,
};

const secondaryBtn = {
  ...primaryBtn,
  background: "#ff4d00",
  color: "#000",
};

const linkBtn = {
  marginTop: 14,
  background: "transparent",
  color: "#9ff",
  border: "none",
  cursor: "pointer",
  textDecoration: "underline",
};

const summaryBox = {
  border: "1px solid rgba(0,255,255,0.4)",
  padding: 16,
  marginTop: 16,
  marginBottom: 20,
};

const qtyBtn = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "1px solid #0ff",
  background: "#000",
  color: "#0ff",
  fontSize: 22,
  cursor: "pointer",
};

const athBtn = {
  display: "block",
  width: "100%",
  padding: "14px",
  background: "#ff5a1f",
  color: "#000",
  fontWeight: "bold",
  borderRadius: 8,
  textAlign: "center" as const,
  textDecoration: "none",
  marginBottom: 12,
};



const uploadWrapper = {
  display: "flex",
  justifyContent: "center",
  marginTop: 16,
};

const uploadMini = {
  padding: "10px 16px",
  borderRadius: 999,
  border: "1px dashed #0ff",
  fontSize: 13,
  color: "#9ff",
  cursor: "pointer",
  boxShadow: "0 0 10px rgba(0,255,255,0.25)",
  transition: "all 0.25s ease",
  background: "rgba(0,0,0,0.6)",
};
