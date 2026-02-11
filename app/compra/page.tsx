"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Rajdhani, Inter } from "next/font/google";

const ATH_NUMBER = "9392533384";

const tron = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const ui = Inter({
  subsets: ["latin"],
});

const ORGANIZACIONES = [
  "Mu Alpha Phi",
  "Eta Gamma Delta",
  "Sigma Epsilon Chi",
  "Phi Sigma Alpha",
  "Amistad",
];

const PRICE_TYPES = [
  { value: "newbies", label: "All Newbie's", price: 15 },
  { value: "preventa", label: "Pre-venta", price: 20 },
  { value: "entrada", label: "Entrada", price: 25 },
];

type Step = "form" | "review" | "ath" | "done";
type PriceType = "newbies" | "preventa" | "entrada";

export default function Compra() {
  const [copiado, setCopiado] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [metodoPago, setMetodoPago] = useState<"" | "ath">("" );
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [priceType, setPriceType] = useState<PriceType>("preventa");
  const [asociacion, setAsociacion] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  
  // Alert state
  const [alert, setAlert] = useState<{show: boolean, message: string}>({show: false, message: ""});

  const currentPrice = PRICE_TYPES.find((p) => p.value === priceType)?.price || 20;
  const total = qty * currentPrice;

  function showAlert(message: string) {
    setAlert({show: true, message});
    setTimeout(() => setAlert({show: false, message: ""}), 3000);
  }

  function goToReview(e: React.FormEvent) {
    e.preventDefault();

    if (name.trim().length < 3) {
      showAlert("Por favor escribe tu nombre completo");
      return;
    }

    if (phone.length !== 10) {
      showAlert("El teléfono debe tener 10 dígitos");
      return;
    }

    if (!asociacion) {
      showAlert("Debes seleccionar una organización");
      return;
    }

    setMetodoPago("");
    setStep("review");
  }

  async function confirmarATH() {
    if (!receipt) {
      showAlert("Debes subir la evidencia de pago ATH Móvil");
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
        event_slug: "zeta-grid-2",
        name,
        phone,
        qty,
        payment_method: "ath",
        status: "pendiente",
        proof_url: publicData.publicUrl,
        asociacion,
        price_type: priceType,
      });

      if (insertError) throw insertError;

      setMetodoPago("ath");
      setTicketCode(code);
      setStep("done");
    } catch (err) {
      console.error(err);
      showAlert("Error procesando el pago ATH");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={main} className={ui.className}>
      {/* ALERT */}
      {alert.show && (
        <div style={alertBox}>
          <span style={alertIcon}>⚠️</span>
          <span>{alert.message}</span>
        </div>
      )}

      {/* DONE */}
      {step === "done" && (
        <div style={{ ...card, textAlign: "center" }}>
          <h2 className={tron.className} style={title}>
            PAGO RECIBIDO
          </h2>

          <p style={text}>
            Código de referencia:
            <br />
            <b style={{ fontSize: 18 }}>{ticketCode}</b>
          </p>

          <div style={summaryBox}>
            <p><b>Nombre:</b> {name}</p>
            <p><b>Teléfono:</b> {phone}</p>
            <p><b>Cantidad:</b> {qty}</p>
            <p><b>Tipo:</b> {PRICE_TYPES.find((p) => p.value === priceType)?.label}</p>
            <p><b>Organización:</b> {asociacion}</p>
            <p><b>Total pagado:</b> <span style={{color: "#ff5722"}}>${total}</span></p>
          </div>

          <button
            style={primaryBtn}
            onClick={() => (window.location.href = "/events/zeta-grid-2")}
          >
            Volver al evento
          </button>
        </div>
      )}

      {/* FORM */}
      {step === "form" && (
        <form onSubmit={goToReview} style={card}>
          <h1 className={tron.className} style={title}>
            Zeta'sGrid 2.0
          </h1>

          <p style={text}>
            Viernes 27 de febrero 2026 · 7:00 PM
            <br />
            Bambalinas Música & Teatro, Aguada PR
            <br />
            <br />
            <b>ThrowBack WelcomeNewbies Show</b>
            <br />
            <br />
            PHI SIGMA ALPHA · Capítulo Zeta · ΦΣΑ
            <br />
            Nos Reservamos el derecho de admisión
          </p>

          <label style={label}>Nombre completo *</label>
          <input
            type="text"
            placeholder="Tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            style={input}
          />

          <label style={label}>Teléfono *</label>
          <input
            type="tel"
            placeholder="Teléfono (10 dígitos)"
            value={phone}
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setPhone(onlyNums);
            }}
            style={input}
          />

          <label style={label}>Cantidad</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              style={qtyBtn}
            >
              −
            </button>
            <div style={{ minWidth: 48, textAlign: "center", fontSize: 18, fontWeight: 600 }}>
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

          <label style={{ ...label, marginBottom: 8, display: "block" }}>
            Tipo de taquilla
          </label>
          <div style={{ marginBottom: 20 }}>
            {PRICE_TYPES.map((type) => (
              <label
                key={type.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: priceType === type.value ? "rgba(255,87,34,0.14)" : "rgba(255,255,255,0.04)",
                  border: priceType === type.value ? "1px solid rgba(255,87,34,0.70)" : "1px solid rgba(255,255,255,0.10)",
                  boxShadow: priceType === type.value ? "0 0 24px rgba(255,87,34,0.22)" : "0 0 0 rgba(0,0,0,0)",
                  cursor: "pointer",
                  transition: "all 220ms ease",
                  marginBottom: 10,
                  userSelect: "none" as const,
                }}
              >
                <input
                  type="radio"
                  name="priceType"
                  value={type.value}
                  checked={priceType === type.value}
                  onChange={(e) => setPriceType(e.target.value as PriceType)}
                  style={{ display: "none" }}
                />

                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: priceType === type.value ? "2px solid #ff5722" : "2px solid rgba(255,255,255,0.3)",
                    background: priceType === type.value ? "#ff5722" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 200ms ease",
                    flexShrink: 0,
                  }}
                >
                  {priceType === type.value && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#000",
                      }}
                    />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    {type.label}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                    ${type.price} por taquilla
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontSize: 18, color: "#ff5722" }}>
                  ${type.price}
                </div>
              </label>
            ))}
          </div>

          <label style={label}>Organización *</label>
          <select
            value={asociacion}
            onChange={(e) => setAsociacion(e.target.value)}
            style={select}
            required
          >
            <option value="">Selecciona una organización</option>
            {ORGANIZACIONES.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>

          <p style={requiredNote}>* Campo obligatorio</p>

          <button type="submit" style={primaryBtn}>
            REVISAR COMPRA
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            style={secondaryBtn}
          >
            Regresar
          </button>
        </form>
      )}

      {/* REVIEW */}
      {step === "review" && (
        <div style={card}>
          <h2 className={tron.className} style={subtitle}>
            CONFIRMA TU INFORMACIÓN
          </h2>

          <div style={summaryBox}>
            <p><b>Nombre:</b> {name}</p>
            <p><b>Teléfono:</b> {phone}</p>
            <p><b>Cantidad de taquillas:</b> {qty}</p>
            <p><b>Tipo:</b> {PRICE_TYPES.find((p) => p.value === priceType)?.label}</p>
            <p><b>Precio unitario:</b> ${currentPrice}</p>
            <p><b>Organización:</b> {asociacion}</p>
            <hr style={{border: "1px solid rgba(255,87,34,0.3)", margin: "12px 0"}} />
            <p style={{fontSize: 18, fontWeight: 700}}>
              <b>TOTAL:</b> <span style={{color: "#ff5722"}}>${total}</span>
            </p>
          </div>

          <p style={{ ...text, marginTop: 12, marginBottom: 20 }}>
            📅 <b>Viernes 27 de febrero 2026 · 7:00 PM</b>
            <br />
            📍 Bambalinas Música & Teatro, Aguada PR
          </p>

          <p style={{ ...text, marginTop: 12 }}>
            Verifica que toda la información esté correcta antes de continuar.
          </p>

          <hr style={{ border: "1px solid rgba(255,87,34,0.4)", margin: "20px 0" }} />

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
            ATH Móvil · ${total}
          </button>

          <button type="button" onClick={() => setStep("form")} style={linkBtn}>
            Editar información
          </button>
        </div>
      )}

      {/* ATH */}
      {step === "ath" && (
        <div style={card}>
          <h2 className={tron.className} style={subtitle}>
            ATH MÓVIL
          </h2>

          <p style={{ ...text, textAlign: "center" }}>
            Envía <b>${total}</b> a Kenneth Morales
          </p>

          <a
            href="https://athm-ulink-prod-static-website.s3.amazonaws.com/qr-code?content=74ff061b98d7ab2708799bcd255ebef8f923d29c3248bf5b518b8be08e2055a8"
            target="_blank"
            rel="noopener noreferrer"
            style={athBtn}
          >
            Pagar por ATH Móvil
          </a>

          <div style={{ fontSize: 15, opacity: 0.9, marginTop: 10, textAlign: "center" }}>
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
                color: copiado ? "#0f0" : "#ff5722",
                textShadow: copiado ? "0 0 20px rgba(0,255,0,0.9)" : "0 0 12px rgba(255,87,34,0.9)",
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
                color: copiado ? "#0f0" : "#ffccbc",
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

          <button type="button" style={linkBtn} onClick={() => setStep("review")}>
            Volver
          </button>
        </div>
      )}
    </main>
  );
}

/* ==================== STYLES ==================== */

const main = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #331100, #000)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  position: "relative" as const,
};

const alertBox = {
  position: "fixed" as const,
  top: 20,
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(255,87,34,0.95)",
  color: "#fff",
  padding: "16px 24px",
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(255,87,34,0.5)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontWeight: 600,
  fontSize: 15,
  maxWidth: "90%",
  animation: "slideDown 0.3s ease",
};

const alertIcon = {
  fontSize: 20,
};

const card = {
  width: "100%",
  maxWidth: 480,
  padding: 32,
  borderRadius: 14,
  background: "rgba(0,0,0,0.65)",
  border: "1px solid rgba(255,87,34,0.6)",
  boxShadow: "0 0 30px rgba(255,87,34,0.25), inset 0 0 20px rgba(255,87,34,0.15)",
  color: "#ffffff",
};

const title = {
  fontSize: 34,
  letterSpacing: 3,
  color: "#ff5722",
  textAlign: "center" as const,
  marginBottom: 16,
};

const subtitle = {
  fontSize: 22,
  color: "#ff5722",
  marginBottom: 16,
};

const text = {
  fontSize: 14,
  opacity: 0.9,
  marginBottom: 14,
  textAlign: "center" as const,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  background: "#000",
  color: "#ff5722",
  border: "1px solid rgba(255,87,34,0.6)",
  boxShadow: "0 0 12px rgba(255,87,34,0.25)",
  borderRadius: 8,
  outline: "none",
  WebkitAppearance: "none" as const,
  WebkitBoxShadow: "0 0 0px 1000px #000 inset",
};

const label = {
  fontSize: 12,
  opacity: 0.75,
  marginBottom: 6,
  display: "block",
};

const select = {
  width: "100%",
  padding: 12,
  marginBottom: 16,
  background: "#000",
  color: "#ff5722",
  border: "1px solid rgba(255,87,34,0.6)",
  borderRadius: 8,
  outline: "none",
};

const requiredNote = {
  fontSize: 11,
  color: "#999",
  fontStyle: "italic",
  marginTop: -8,
  marginBottom: 16,
};

const primaryBtn = {
  width: "100%",
  padding: 14,
  background: "#ff5722",
  color: "#000",
  fontWeight: 700,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 10,
  boxShadow: "0 0 20px rgba(255,87,34,0.4)",
  transition: "all 0.2s ease",
};

const secondaryBtn = {
  ...primaryBtn,
  background: "transparent",
  color: "#ff5722",
  border: "1px solid #ff5722",
  boxShadow: "none",
};

const linkBtn = {
  marginTop: 14,
  background: "transparent",
  color: "#ffccbc",
  border: "none",
  cursor: "pointer",
  textDecoration: "underline",
  width: "100%",
  padding: 8,
};

const summaryBox = {
  border: "1px solid rgba(255,87,34,0.4)",
  padding: 16,
  marginTop: 16,
  marginBottom: 20,
  borderRadius: 8,
  background: "rgba(255,87,34,0.05)",
};

const qtyBtn = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "1px solid #ff5722",
  background: "#000",
  color: "#ff5722",
  fontSize: 22,
  cursor: "pointer",
};

const athBtn = {
  display: "block",
  width: "100%",
  padding: "14px",
  background: "#ff5a1f",
  color: "#000",
  fontWeight: "bold" as const,
  borderRadius: 8,
  textAlign: "center" as const,
  textDecoration: "none",
  marginBottom: 12,
  boxShadow: "0 0 20px rgba(255,90,31,0.4)",
};

const uploadWrapper = {
  display: "flex",
  justifyContent: "center",
  marginTop: 16,
};

const uploadMini = {
  padding: "10px 16px",
  borderRadius: 999,
  border: "1px dashed #ff5722",
  fontSize: 13,
  color: "#ffccbc",
  cursor: "pointer",
  boxShadow: "0 0 10px rgba(255,87,34,0.25)",
  transition: "all 0.25s ease",
  background: "rgba(0,0,0,0.6)",
};
