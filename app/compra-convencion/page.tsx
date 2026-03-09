"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Rajdhani, Inter } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
});

type Step = "form" | "review" | "payment" | "done";
type Status = "activo" | "militante";
type Attendees = "solo" | "pareja";
type PurchaseType = "convencion" | "eventos";

// PRECIOS
const PRICES = {
  especial: {
    activo: { solo: 200, pareja: 350 },
    militante: { solo: 225, pareja: 400 },
  },
  regular: {
    activo: { solo: 225, pareja: 450 },
    militante: { solo: 250, pareja: 500 },
  },
  eventos: {
    gala: { solo: 125, pareja: 190 },
    cena: { solo: 90, pareja: 175 },
    brunch: { solo: 75, pareja: 140 },
  },
};

const FEE_PERCENT = 0.03; // 3%

// Determinar si estamos en precio especial o regular
function getCurrentPriceType(): "especial" | "regular" {
  const now = new Date();
  const cutoff = new Date("2026-04-11T23:59:59");
  return now <= cutoff ? "especial" : "regular";
}

export default function CompraConvencion() {
  const [copiado, setCopiado] = useState(false);
  const [step, setStep] = useState<Step>("form");
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [capitulo, setCapitulo] = useState("");
  const [status, setStatus] = useState<Status>("activo");
  const [attendees, setAttendees] = useState<Attendees>("solo");
  
  // Nuevo: tipo de compra
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("convencion");
  
  // Eventos adicionales (SOLO si compra eventos individuales)
  const [gala, setGala] = useState(false);
  const [cena, setCena] = useState(false);
  const [brunch, setBrunch] = useState(false);
  
  // Hotel
  const [hotelReservation, setHotelReservation] = useState<"si" | "no" | "">(""); 
  
  // Menores
  const [totalPeople, setTotalPeople] = useState("");
  const [minors, setMinors] = useState("");
  
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ath" | "stripe">("ath");
  
  // Alert state
  const [alert, setAlert] = useState<{show: boolean, message: string}>({show: false, message: ""});

  // Precio automático según fecha
  const priceType = getCurrentPriceType();

  function showAlert(message: string) {
    setAlert({show: true, message});
    setTimeout(() => setAlert({show: false, message: ""}), 3000);
  }

  // CÁLCULOS
  const subtotal = (() => {
    if (purchaseType === "convencion") {
      // Solo paquete de convención
      return PRICES[priceType][status][attendees];
    } else {
      // Solo eventos individuales
      let total = 0;
      if (gala) total += PRICES.eventos.gala[attendees];
      if (cena) total += PRICES.eventos.cena[attendees];
      if (brunch) total += PRICES.eventos.brunch[attendees];
      return total;
    }
  })();

  const fee = Math.round(subtotal * FEE_PERCENT * 100) / 100;
  const total = subtotal + fee;

  function goToReview(e: React.FormEvent) {
    e.preventDefault();

    if (name.trim().length < 3) {
      showAlert("Por favor escribe tu nombre completo");
      return;
    }

    if (!email.includes("@")) {
      showAlert("Email inválido");
      return;
    }

    if (phone.length !== 10) {
      showAlert("El teléfono debe tener 10 dígitos");
      return;
    }

    if (!capitulo) {
      showAlert("Debes seleccionar tu capítulo");
      return;
    }

    if (!hotelReservation) {
      showAlert("Indica si reservaste habitación en el hotel");
      return;
    }

    if (purchaseType === "eventos" && !gala && !cena && !brunch) {
      showAlert("Debes seleccionar al menos un evento");
      return;
    }

    setStep("review");
  }

  async function confirmarPago() {
    if (paymentMethod === "ath" && !receipt) {
      showAlert("Debes subir la evidencia de pago ATH Móvil");
      return;
    }

    const code = `CONV${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      setLoading(true);

      let proofUrl = null;

      if (paymentMethod === "ath" && receipt) {
        const extension = receipt.name.split(".").pop();
        const filePath = `ath/${code}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("ath-confirmaciones")
          .upload(filePath, receipt, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("ath-confirmaciones")
          .getPublicUrl(filePath);

        proofUrl = publicData.publicUrl;
      }

      const { error: insertError } = await supabase.from("tickets").insert({
        ticket_code: code,
        event_slug: "sigma-convention-98",
        name,
        phone,
        email: email,
        qty: attendees === "solo" ? 1 : 2,
        payment_method: paymentMethod,
        status: paymentMethod === "stripe" ? "aprobado" : "pendiente",
        proof_url: proofUrl,
        
        // Datos específicos convención
        address: `${address}, ${zipCode}`,
        capitulo,
        member_status: status,
        attendees_type: attendees,
        price_type: purchaseType === "convencion" ? priceType : "eventos_only",
        include_gala: purchaseType === "eventos" ? gala : false,
        include_cena: purchaseType === "eventos" ? cena : false,
        include_brunch: purchaseType === "eventos" ? brunch : false,
        hotel_reservation: hotelReservation,
        total_people: totalPeople ? parseInt(totalPeople) : null,
        minors_count: minors ? parseInt(minors) : null,
        
        // Montos
        subtotal: subtotal,
        fee: fee,
        total: total,
      });

      if (insertError) throw insertError;

      setTicketCode(code);
      setStep("done");
    } catch (err) {
      console.error(err);
      showAlert("Error procesando el pago");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={main} className={inter.className}>
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
          <h2 className={rajdhani.className} style={title}>
            ¡INSCRIPCIÓN RECIBIDA!
          </h2>

          <p style={text}>
            Código de confirmación:
            <br />
            <b style={{ fontSize: 20, color: "#d4af37" }}>{ticketCode}</b>
          </p>

          <div style={summaryBox}>
            <p><b>Nombre:</b> {name}</p>
            <p><b>Email:</b> {email}</p>
            <p><b>Capítulo:</b> {capitulo}</p>
            
            {purchaseType === "convencion" ? (
              <>
                <p><b>Paquete:</b> {status.toUpperCase()} - {attendees === "solo" ? "Individual" : "Pareja"}</p>
                <p><b>Precio:</b> {priceType === "especial" ? "Especial" : "Regular"}</p>
              </>
            ) : (
              <>
                <p><b>Eventos seleccionados:</b></p>
                {gala && <p>✓ Gala Viernes</p>}
                {cena && <p>✓ Cena Sábado</p>}
                {brunch && <p>✓ Brunch Domingo</p>}
              </>
            )}
            
            <p><b>Hotel:</b> {hotelReservation === "si" ? "Sí reservó" : "No reservó"}</p>
            
            <hr style={{border: "1px solid rgba(212,175,55,0.3)", margin: "12px 0"}} />
            <p style={{fontSize: 16}}><b>Total pagado:</b> <span style={{color: "#d4af37"}}>${total.toFixed(2)}</span></p>
          </div>

          <p style={{...text, fontSize: 13, marginTop: 16}}>
            Recibirás confirmación por email una vez sea {paymentMethod === "ath" ? "aprobado tu pago" : "procesado el pago"}.
          </p>

          <button
            style={primaryBtn}
            onClick={() => (window.location.href = "/events/sigma-convention-98")}
          >
            Volver al evento
          </button>
        </div>
      )}

      {/* FORM */}
      {step === "form" && (
        <form onSubmit={goToReview} style={card}>
          <h1 className={rajdhani.className} style={title}>
            98ª Convención Anual ΦΣΑ
          </h1>

          <p style={text}>
            9-11 de octubre 2026
            <br />
            Costa Bahía Convention Center, Guayanilla PR
          </p>

          {/* TIPO DE COMPRA */}
          <label style={label}>¿Qué deseas comprar? *</label>
          <div style={{display: "flex", flexDirection: "column", gap: 12, marginBottom: 24}}>
            <label style={radioLabelBlock}>
              <input
                type="radio"
                checked={purchaseType === "convencion"}
                onChange={() => setPurchaseType("convencion")}
              />
              <div style={{marginLeft: 12}}>
                <div style={{fontWeight: 600}}>Paquete de Convención</div>
                <div style={{fontSize: 13, opacity: 0.8}}>Acceso completo a los 3 días de convención</div>
              </div>
            </label>
            <label style={radioLabelBlock}>
              <input
                type="radio"
                checked={purchaseType === "eventos"}
                onChange={() => setPurchaseType("eventos")}
              />
              <div style={{marginLeft: 12}}>
                <div style={{fontWeight: 600}}>Solo eventos sociales</div>
                <div style={{fontSize: 13, opacity: 0.8}}>Gala, Cena y/o Brunch (sin convención)</div>
              </div>
            </label>
          </div>

          <label style={label}>Nombre completo *</label>
          <input
            type="text"
            placeholder="Tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
            required
          />

          <label style={label}>Dirección postal *</label>
          <input
            type="text"
            placeholder="Dirección completa"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={input}
            required
          />

          <label style={label}>Código postal *</label>
          <input
            type="text"
            placeholder="00000"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
            style={input}
            maxLength={5}
            required
          />

          <label style={label}>Email *</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
            required
          />

          <label style={label}>Teléfono *</label>
          <input
            type="tel"
            placeholder="Teléfono (10 dígitos)"
            value={phone}
            inputMode="numeric"
            maxLength={10}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setPhone(onlyNums);
            }}
            style={input}
            required
          />

          <label style={label}>Capítulo *</label>
          <select
            value={capitulo}
            onChange={(e) => setCapitulo(e.target.value)}
            style={input}
            required
          >
            <option value="">Selecciona tu capítulo</option>
            <option value="Alpha Activo">Alpha Activo</option>
            <option value="Alpha Boriquen">Alpha Boriquen</option>
            <option value="Beta Activo">Beta Activo</option>
            <option value="Beta Boriquen">Beta Boriquen</option>
            <option value="Gamma Activo">Gamma Activo</option>
            <option value="Gamma Boriquen">Gamma Boriquen</option>
            <option value="Zeta Activo">Zeta Activo</option>
            <option value="Delta Boriquen">Delta Boriquen</option>
            <option value="Ypsilon Boriquen">Ypsilon Boriquen</option>
            <option value="Kappa Boriquen">Kappa Boriquen</option>
            <option value="Alpha Columbia Boriquen">Alpha Columbia Boriquen</option>
            <option value="Omega Columbia Boriquen">Omega Columbia Boriquen</option>
            <option value="Tau Columbia Boriquen">Tau Columbia Boriquen</option>
            <option value="Pasivo">Pasivo</option>
          </select>

          <label style={label}>Actualmente soy: *</label>
          <div style={{display: "flex", gap: 16, marginBottom: 20}}>
            <label style={radioLabel}>
              <input
                type="radio"
                checked={status === "activo"}
                onChange={() => setStatus("activo")}
              />
              <span style={{marginLeft: 8}}>Activo</span>
            </label>
            <label style={radioLabel}>
              <input
                type="radio"
                checked={status === "militante"}
                onChange={() => setStatus("militante")}
              />
              <span style={{marginLeft: 8}}>Militante</span>
            </label>
          </div>

          <label style={label}>Asistencia: *</label>
          <div style={{display: "flex", gap: 16, marginBottom: 20}}>
            <label style={radioLabel}>
              <input
                type="radio"
                checked={attendees === "solo"}
                onChange={() => setAttendees("solo")}
              />
              <span style={{marginLeft: 8}}>Individual</span>
            </label>
            <label style={radioLabel}>
              <input
                type="radio"
                checked={attendees === "pareja"}
                onChange={() => setAttendees("pareja")}
              />
              <span style={{marginLeft: 8}}>Pareja</span>
            </label>
          </div>

          {purchaseType === "convencion" && (
            <div style={packageBox}>
              <div style={{fontWeight: 700, marginBottom: 8, color: "#d4af37"}}>
                Paquete seleccionado:
              </div>
              <div style={{fontSize: 18, fontWeight: 600}}>
                {status.toUpperCase()} - {attendees === "solo" ? "Individual" : "Pareja"}
              </div>
              <div style={{fontSize: 14, opacity: 0.8, marginTop: 4}}>
                Precio {priceType === "especial" ? "Especial" : "Regular"}
              </div>
              <div style={{fontSize: 24, fontWeight: 700, color: "#d4af37", marginTop: 8}}>
                ${PRICES[priceType][status][attendees]}
              </div>
            </div>
          )}

          {purchaseType === "eventos" && (
            <>
              <label style={{...label, marginTop: 0, display: "block"}}>
                Selecciona los eventos: *
              </label>
              
              <label style={checkboxLabel}>
                <input
                  type="checkbox"
                  checked={gala}
                  onChange={(e) => setGala(e.target.checked)}
                />
                <span style={{marginLeft: 10}}>
                  Gala - Viernes PM 
                  <span style={{color: "#d4af37", marginLeft: 8, fontWeight: 700}}>
                    ${PRICES.eventos.gala[attendees]}
                  </span>
                </span>
              </label>

              <label style={checkboxLabel}>
                <input
                  type="checkbox"
                  checked={cena}
                  onChange={(e) => setCena(e.target.checked)}
                />
                <span style={{marginLeft: 10}}>
                  Cena - Sábado PM
                  <span style={{color: "#d4af37", marginLeft: 8, fontWeight: 700}}>
                    ${PRICES.eventos.cena[attendees]}
                  </span>
                </span>
              </label>

              <label style={checkboxLabel}>
                <input
                  type="checkbox"
                  checked={brunch}
                  onChange={(e) => setBrunch(e.target.checked)}
                />
                <span style={{marginLeft: 10}}>
                  Brunch - Domingo AM
                  <span style={{color: "#d4af37", marginLeft: 8, fontWeight: 700}}>
                    ${PRICES.eventos.brunch[attendees]}
                  </span>
                </span>
              </label>
            </>
          )}

          {/* MENORES */}
          <label style={label}>Cantidad de personas en su taquilla *</label>
          <input
            type="number"
            placeholder="Incluyéndolo a usted y menores de edad"
            value={totalPeople}
            onChange={(e) => setTotalPeople(e.target.value)}
            style={input}
            min="1"
            required
          />

          <label style={label}>¿Cuántos menores estarán en su taquilla?</label>
          <input
            type="number"
            placeholder="0"
            value={minors}
            onChange={(e) => setMinors(e.target.value)}
            style={input}
            min="0"
          />

          {/* HOTEL */}
          <label style={label}>¿Reservó o reservará habitación en el hotel de la convención? *</label>
          <div style={{display: "flex", gap: 16, marginBottom: 20}}>
            <label style={radioLabel}>
              <input
                type="radio"
                checked={hotelReservation === "si"}
                onChange={() => setHotelReservation("si")}
              />
              <span style={{marginLeft: 8}}>Sí</span>
            </label>
            <label style={radioLabel}>
              <input
                type="radio"
                checked={hotelReservation === "no"}
                onChange={() => setHotelReservation("no")}
              />
              <span style={{marginLeft: 8}}>No</span>
            </label>
          </div>

          <div style={totalBox}>
            <div style={totalRow}>
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div style={totalRow}>
              <span>Cargo por servicio (3%):</span>
              <span>${fee.toFixed(2)}</span>
            </div>
            <div style={{...totalRow, fontSize: 20, fontWeight: 700, color: "#d4af37", marginTop: 8, paddingTop: 12, borderTop: "1px solid rgba(212,175,55,0.3)"}}>
              <span>TOTAL:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <p style={requiredNote}>* Campo obligatorio</p>

          <button type="submit" style={primaryBtn}>
            REVISAR INSCRIPCIÓN
          </button>
        </form>
      )}

      {/* REVIEW */}
      {step === "review" && (
        <div style={card}>
          <h2 className={rajdhani.className} style={subtitle}>
            CONFIRMA TU INFORMACIÓN
          </h2>

          <div style={summaryBox}>
            <p><b>Nombre:</b> {name}</p>
            <p><b>Email:</b> {email}</p>
            <p><b>Teléfono:</b> {phone}</p>
            <p><b>Dirección:</b> {address}, {zipCode}</p>
            <p><b>Capítulo:</b> {capitulo}</p>
            <p><b>Status:</b> {status.toUpperCase()}</p>
            
            {purchaseType === "convencion" ? (
              <>
                <p><b>Paquete:</b> {priceType === "especial" ? "ESPECIAL" : "REGULAR"} - {attendees === "solo" ? "Individual" : "Pareja"}</p>
                <p><b>Precio:</b> ${PRICES[priceType][status][attendees]}</p>
              </>
            ) : (
              <>
                <hr style={{border: "1px solid rgba(212,175,55,0.2)", margin: "12px 0"}} />
                <p style={{fontWeight: 700, marginBottom: 8}}>Eventos seleccionados:</p>
                {gala && <p>✓ Gala Viernes PM - ${PRICES.eventos.gala[attendees]}</p>}
                {cena && <p>✓ Cena Sábado PM - ${PRICES.eventos.cena[attendees]}</p>}
                {brunch && <p>✓ Brunch Domingo AM - ${PRICES.eventos.brunch[attendees]}</p>}
              </>
            )}
            
            <p><b>Personas en taquilla:</b> {totalPeople}</p>
            {minors && <p><b>Menores:</b> {minors}</p>}
            <p><b>Hotel:</b> {hotelReservation === "si" ? "Sí reservó" : "No reservó"}</p>

            <hr style={{border: "1px solid rgba(212,175,55,0.3)", margin: "12px 0"}} />
            <p><b>Subtotal:</b> ${subtotal}</p>
            <p><b>Cargo por servicio (3%):</b> ${fee.toFixed(2)}</p>
            <p style={{fontSize: 18, fontWeight: 700, color: "#d4af37"}}>
              <b>TOTAL A PAGAR:</b> ${total.toFixed(2)}
            </p>
          </div>

          <button
            style={primaryBtn}
            type="button"
            onClick={() => setStep("payment")}
          >
            CONTINUAR AL PAGO
          </button>

          <button type="button" onClick={() => setStep("form")} style={linkBtn}>
            Editar información
          </button>
        </div>
      )}

      {/* PAYMENT */}
      {step === "payment" && (
        <div style={card}>
          <h2 className={rajdhani.className} style={subtitle}>
            MÉTODO DE PAGO
          </h2>

          <p style={{ ...text, textAlign: "center", fontSize: 18, fontWeight: 600 }}>
            Total: <span style={{color: "#d4af37"}}>${total.toFixed(2)}</span>
          </p>

          {/* Selector de método */}
          <div style={{display: "flex", flexDirection: "column", gap: 12, marginBottom: 24}}>
            <label style={radioLabelBlock}>
              <input
                type="radio"
                checked={paymentMethod === "ath"}
                onChange={() => setPaymentMethod("ath")}
              />
              <div style={{marginLeft: 12}}>
                <div style={{fontWeight: 600}}>ATH Móvil Business</div>
                <div style={{fontSize: 13, opacity: 0.8}}>Pago instantáneo</div>
              </div>
            </label>
            <label style={radioLabelBlock}>
              <input
                type="radio"
                checked={paymentMethod === "stripe"}
                onChange={() => setPaymentMethod("stripe")}
              />
              <div style={{marginLeft: 12}}>
                <div style={{fontWeight: 600}}>Tarjeta de Crédito/Débito</div>
                <div style={{fontSize: 13, opacity: 0.8}}>Procesado por Stripe (próximamente)</div>
              </div>
            </label>
          </div>

          {paymentMethod === "ath" && (
            <>
              <a
                href="https://www.athmovil.com/pay?publicToken=phisigmaalpha"
                target="_blank"
                rel="noopener noreferrer"
                style={athBtn}
              >
                Pagar por ATH Móvil Business
              </a>

              <div style={{ fontSize: 15, opacity: 0.9, marginTop: 10, textAlign: "center" }}>
                <span
                  onClick={() => {
                    navigator.clipboard.writeText("phisigmaalpha");
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
                    color: copiado ? "#0f0" : "#d4af37",
                    textShadow: copiado ? "0 0 20px rgba(0,255,0,0.9)" : "0 0 12px rgba(212,175,55,0.9)",
                    transition: "all 0.3s ease",
                  }}
                >
                  phisigmaalpha
                </span>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    letterSpacing: 1,
                    color: copiado ? "#0f0" : "#999",
                    opacity: 0.9,
                    transition: "all 0.3s ease",
                  }}
                >
                  {copiado ? "✓ COPIADO" : "👆 TOCA PARA COPIAR"}
                </div>

                <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
                  Adjunta confirmación de pago para continuar
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

              <button style={primaryBtn} onClick={confirmarPago} disabled={loading}>
                {loading ? "Subiendo..." : "Confirmar pago"}
              </button>
            </>
          )}

          {paymentMethod === "stripe" && (
            <>
              <div style={{
                padding: 20,
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: 10,
                textAlign: "center",
                marginBottom: 20,
              }}>
                <p style={{margin: 0, fontSize: 14}}>
                  El pago con tarjeta estará disponible próximamente.
                  <br />
                  Por ahora, usa ATH Móvil Business.
                </p>
              </div>

              <button style={{...primaryBtn, opacity: 0.5, cursor: "not-allowed"}} disabled>
                Pagar con tarjeta (próximamente)
              </button>
            </>
          )}

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
  background: "linear-gradient(135deg, #0a0a14 0%, #1a1a2e 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  position: "relative" as const,
};

const alertBox = {
  position: "fixed" as const,
  top: 20,
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(212,175,55,0.95)",
  color: "#000",
  padding: "16px 24px",
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(212,175,55,0.5)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontWeight: 600,
  fontSize: 15,
  maxWidth: "90%",
};

const alertIcon = {
  fontSize: 20,
};

const card = {
  width: "100%",
  maxWidth: 600,
  padding: 40,
  borderRadius: 16,
  background: "rgba(15,15,25,0.95)",
  border: "1px solid rgba(212,175,55,0.3)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  color: "#ffffff",
};

const title = {
  fontSize: 32,
  letterSpacing: 2,
  color: "#d4af37",
  textAlign: "center" as const,
  marginBottom: 12,
};

const subtitle = {
  fontSize: 24,
  color: "#d4af37",
  marginBottom: 20,
  textAlign: "center" as const,
};

const text = {
  fontSize: 14,
  opacity: 0.9,
  marginBottom: 24,
  textAlign: "center" as const,
  lineHeight: 1.6,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 16,
  background: "#0a0a14",
  color: "#d4af37",
  border: "1px solid rgba(212,175,55,0.4)",
  borderRadius: 8,
  outline: "none",
  fontSize: 15,
};

const label = {
  fontSize: 13,
  opacity: 0.8,
  marginBottom: 8,
  display: "block",
  color: "#d4af37",
  fontWeight: 600,
};

const radioLabel = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  fontSize: 15,
};

const radioLabelBlock = {
  display: "flex",
  alignItems: "center",
  padding: "12px",
  background: "rgba(212,175,55,0.05)",
  borderRadius: 8,
  border: "1px solid rgba(212,175,55,0.2)",
  cursor: "pointer",
  fontSize: 15,
};

const checkboxLabel = {
  display: "flex",
  alignItems: "center",
  padding: "12px",
  marginBottom: 10,
  background: "rgba(212,175,55,0.05)",
  borderRadius: 8,
  border: "1px solid rgba(212,175,55,0.2)",
  cursor: "pointer",
  fontSize: 15,
};

const packageBox = {
  padding: 20,
  background: "rgba(212,175,55,0.1)",
  border: "1px solid rgba(212,175,55,0.3)",
  borderRadius: 10,
  marginBottom: 16,
  textAlign: "center" as const,
};

const totalBox = {
  marginTop: 24,
  marginBottom: 20,
  padding: 20,
  background: "rgba(0,0,0,0.3)",
  borderRadius: 10,
  border: "1px solid rgba(212,175,55,0.3)",
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 8,
  fontSize: 16,
};

const requiredNote = {
  fontSize: 12,
  color: "#999",
  fontStyle: "italic",
  marginTop: -12,
  marginBottom: 20,
};

const primaryBtn = {
  width: "100%",
  padding: 16,
  background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 50%, #d4af37 100%)",
  color: "#000",
  fontWeight: 700,
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  marginTop: 10,
  fontSize: 16,
  letterSpacing: 1,
  boxShadow: "0 4px 16px rgba(212,175,55,0.3)",
  transition: "all 0.2s ease",
};

const linkBtn = {
  marginTop: 16,
  background: "transparent",
  color: "#d4af37",
  border: "none",
  cursor: "pointer",
  textDecoration: "underline",
  width: "100%",
  padding: 10,
  fontSize: 14,
};

const summaryBox = {
  border: "1px solid rgba(212,175,55,0.3)",
  padding: 20,
  marginTop: 16,
  marginBottom: 24,
  borderRadius: 10,
  background: "rgba(212,175,55,0.05)",
  fontSize: 14,
  lineHeight: 1.8,
};

const athBtn = {
  display: "block",
  width: "100%",
  padding: "16px",
  background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 100%)",
  color: "#000",
  fontWeight: "bold" as const,
  borderRadius: 10,
  textAlign: "center" as const,
  textDecoration: "none",
  marginBottom: 16,
  fontSize: 16,
  boxShadow: "0 4px 16px rgba(212,175,55,0.4)",
};

const uploadWrapper = {
  display: "flex",
  justifyContent: "center",
  marginTop: 20,
  marginBottom: 20,
};

const uploadMini = {
  padding: "12px 20px",
  borderRadius: 999,
  border: "1px dashed #d4af37",
  fontSize: 14,
  color: "#d4af37",
  cursor: "pointer",
  boxShadow: "0 0 10px rgba(212,175,55,0.2)",
  transition: "all 0.25s ease",
  background: "rgba(212,175,55,0.1)",
};
