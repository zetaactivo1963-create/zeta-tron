"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

type Step = "form" | "review" | "payment" | "done";

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

const FEE_PERCENT = 0.03;

function getCurrentPriceType(): "especial" | "regular" {
  const now = new Date();
  const cutoff = new Date("2026-04-11T23:59:59");
  return now <= cutoff ? "especial" : "regular";
}

export default function CompraConvencion() {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [capitulo, setCapitulo] = useState("");
  
  const [purchaseType, setPurchaseType] = useState<"convencion" | "eventos">("convencion");
  const [status, setStatus] = useState<"activo" | "militante">("activo");
  const [attendees, setAttendees] = useState<"solo" | "pareja">("solo");
  
  const [gala, setGala] = useState(false);
  const [cena, setCena] = useState(false);
  const [brunch, setBrunch] = useState(false);
  
  const [hotelReservation, setHotelReservation] = useState<"si" | "no" | "">("");
  const [totalPeople, setTotalPeople] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState<"ath" | "tarjeta">("ath");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [ticketCode, setTicketCode] = useState("");

  const priceType = getCurrentPriceType();

  const subtotal = (() => {
    if (purchaseType === "convencion") {
      return PRICES[priceType][status][attendees];
    } else {
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
      alert("Por favor escribe tu nombre completo");
      return;
    }

    if (!email.includes("@")) {
      alert("Email inválido");
      return;
    }

    if (phone.length !== 10) {
      alert("El teléfono debe tener 10 dígitos");
      return;
    }

    if (!capitulo) {
      alert("Debes seleccionar tu capítulo");
      return;
    }

    if (!hotelReservation) {
      alert("Indica si reservaste o reservarás habitación");
      return;
    }

    if (purchaseType === "eventos" && !gala && !cena && !brunch) {
      alert("Debes seleccionar al menos un evento");
      return;
    }

    setStep("review");
  }

  async function confirmarPago() {
    if (paymentMethod === "ath" && !receipt) {
      alert("Debes subir la evidencia de pago ATH Móvil");
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
        email,
        qty: attendees === "solo" ? 1 : 2,
        payment_method: paymentMethod,
        status: "pendiente",
        proof_url: proofUrl,
        
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
        
        subtotal,
        fee,
        total,
      });

      if (insertError) throw insertError;

      setTicketCode(code);
      setStep("done");
    } catch (err) {
      console.error(err);
      alert("Error procesando la inscripción");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={main} className={inter.className}>
      <style>{animationCSS}</style>
      
      {loading && (
        <div style={loadingOverlay}>
          <div style={spinner} />
          <p style={{marginTop: 20, fontSize: 18}}>Procesando inscripción...</p>
        </div>
      )}

      {/* HEADER */}
      <header style={header}>
        <Link href="/events/sigma-convention-98" style={backButton}>
          <span style={backArrow}>←</span>
          <span>VOLVER AL EVENTO</span>
        </Link>
      </header>

      {/* DONE */}
      {step === "done" && (
        <div style={container}>
          <div style={successCard}>
            <div style={successCheck}>✓</div>
            <h1 style={successTitle}>Inscripción Recibida</h1>
            <p style={successSubtitle}>Tu código de confirmación es:</p>
            <div style={codeBox}>{ticketCode}</div>

            <div style={summaryCard}>
              <div style={summaryRow}>
                <span>Nombre:</span>
                <strong>{name}</strong>
              </div>
              <div style={summaryRow}>
                <span>Email:</span>
                <strong>{email}</strong>
              </div>
              <div style={summaryRow}>
                <span>Capítulo:</span>
                <strong>{capitulo}</strong>
              </div>
              {purchaseType === "convencion" ? (
                <div style={summaryRow}>
                  <span>Paquete:</span>
                  <strong>{status.toUpperCase()} - {attendees === "solo" ? "Individual" : "Pareja"}</strong>
                </div>
              ) : (
                <div style={summaryRow}>
                  <span>Eventos:</span>
                  <strong>
                    {gala && "Gala "}
                    {cena && "Cena "}
                    {brunch && "Brunch"}
                  </strong>
                </div>
              )}
              <div style={{...summaryRow, marginTop: 16, paddingTop: 16, borderTop: "2px solid #d4af37"}}>
                <span style={{fontSize: 18}}>Total pagado:</span>
                <strong style={{fontSize: 22, color: "#d4af37"}}>${total.toFixed(2)}</strong>
              </div>
            </div>

            <p style={infoText}>
              Recibirás confirmación por email una vez sea aprobado tu pago.
            </p>

            <Link href="/events/sigma-convention-98">
              <button style={primaryButton}>VOLVER AL EVENTO</button>
            </Link>
          </div>
        </div>
      )}

      {/* FORM */}
      {step === "form" && (
        <div style={container}>
          <div style={formCard}>
            <h1 style={formTitle}>Inscripción Convención 98</h1>
            <p style={formSubtitle}>9-11 de octubre 2026 • Costa Bahía, Guayanilla PR</p>

            <form onSubmit={goToReview}>
              {/* TIPO */}
              <div style={section}>
                <h2 style={sectionTitle}>1. Tipo de Inscripción</h2>
                
                <div style={optionsGrid}>
                  <div 
                    style={{...optionCard, ...(purchaseType === "convencion" ? optionCardActive : {})}}
                    onClick={() => setPurchaseType("convencion")}
                  >
                    <div style={optionTitle}>Paquete de Convención</div>
                    <div style={optionDesc}>Acceso completo a los 3 días</div>
                  </div>

                  <div 
                    style={{...optionCard, ...(purchaseType === "eventos" ? optionCardActive : {})}}
                    onClick={() => setPurchaseType("eventos")}
                  >
                    <div style={optionTitle}>Solo Eventos Sociales</div>
                    <div style={optionDesc}>Gala, Cena y/o Brunch</div>
                  </div>
                </div>
              </div>

              {/* DATOS */}
              <div style={section}>
                <h2 style={sectionTitle}>2. Información Personal</h2>
                
                <div style={formGroup}>
                  <label style={label}>Nombre completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={input}
                    required
                  />
                </div>

                <div style={formGrid}>
                  <div style={formGroup}>
                    <label style={label}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={input}
                      required
                    />
                  </div>

                  <div style={formGroup}>
                    <label style={label}>Teléfono (10 dígitos)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      style={input}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div style={formGroup}>
                  <label style={label}>Dirección Postal</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={input}
                    required
                  />
                </div>

                <div style={formGroup}>
                  <label style={label}>Código Postal</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                    style={{...input, maxWidth: 200}}
                    maxLength={5}
                    required
                  />
                </div>

                <div style={formGroup}>
                  <label style={label}>Capítulo</label>
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
                </div>
              </div>

              {/* DETALLES */}
              <div style={section}>
                <h2 style={sectionTitle}>3. Detalles de Inscripción</h2>

                <div style={formGroup}>
                  <label style={label}>Actualmente soy:</label>
                  <div style={optionsGrid}>
                    <div 
                      style={{...optionCardSmall, ...(status === "activo" ? optionCardActive : {})}}
                      onClick={() => setStatus("activo")}
                    >
                      Activo
                    </div>
                    <div 
                      style={{...optionCardSmall, ...(status === "militante" ? optionCardActive : {})}}
                      onClick={() => setStatus("militante")}
                    >
                      Militante
                    </div>
                  </div>
                </div>

                <div style={formGroup}>
                  <label style={label}>Asistencia:</label>
                  <div style={optionsGrid}>
                    <div 
                      style={{...optionCardSmall, ...(attendees === "solo" ? optionCardActive : {})}}
                      onClick={() => setAttendees("solo")}
                    >
                      Individual
                    </div>
                    <div 
                      style={{...optionCardSmall, ...(attendees === "pareja" ? optionCardActive : {})}}
                      onClick={() => setAttendees("pareja")}
                    >
                      Pareja
                    </div>
                  </div>
                </div>

                {purchaseType === "convencion" && (
                  <div style={priceBox}>
                    <div style={priceBoxLabel}>Paquete seleccionado</div>
                    <div style={priceBoxCategory}>{status.toUpperCase()} - {attendees === "solo" ? "Individual" : "Pareja"}</div>
                    <div style={priceBoxType}>Precio {priceType === "especial" ? "Especial" : "Regular"}</div>
                    <div style={priceBoxAmount}>${PRICES[priceType][status][attendees]}</div>
                  </div>
                )}

                {purchaseType === "eventos" && (
                  <div style={formGroup}>
                    <label style={label}>Selecciona los eventos:</label>
                    <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                      <div 
                        style={{...checkboxCard, ...(gala ? checkboxCardActive : {})}}
                        onClick={() => setGala(!gala)}
                      >
                        <div style={{flex: 1}}>
                          <strong>Gala - Viernes PM</strong>
                          <div style={{fontSize: 14, opacity: 0.7, marginTop: 4}}>
                            Individual: $125 • Pareja: $190
                          </div>
                        </div>
                      </div>

                      <div 
                        style={{...checkboxCard, ...(cena ? checkboxCardActive : {})}}
                        onClick={() => setCena(!cena)}
                      >
                        <div style={{flex: 1}}>
                          <strong>Cena - Sábado PM</strong>
                          <div style={{fontSize: 14, opacity: 0.7, marginTop: 4}}>
                            Individual: $90 • Pareja: $175
                          </div>
                        </div>
                      </div>

                      <div 
                        style={{...checkboxCard, ...(brunch ? checkboxCardActive : {})}}
                        onClick={() => setBrunch(!brunch)}
                      >
                        <div style={{flex: 1}}>
                          <strong>Brunch - Domingo AM</strong>
                          <div style={{fontSize: 14, opacity: 0.7, marginTop: 4}}>
                            Individual: $75 • Pareja: $140
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div style={formGroup}>
                  <label style={label}>Cantidad de personas en su taquilla (incluyendo usted y niños)</label>
                  <input
                    type="number"
                    value={totalPeople}
                    onChange={(e) => setTotalPeople(e.target.value)}
                    style={input}
                    min="1"
                    required
                  />
                </div>

                <div style={formGroup}>
                  <label style={label}>¿Reservó o reservará habitación en el hotel de la convención?</label>
                  <div style={optionsGrid}>
                    <div 
                      style={{...optionCardSmall, ...(hotelReservation === "si" ? optionCardActive : {})}}
                      onClick={() => setHotelReservation("si")}
                    >
                      Sí
                    </div>
                    <div 
                      style={{...optionCardSmall, ...(hotelReservation === "no" ? optionCardActive : {})}}
                      onClick={() => setHotelReservation("no")}
                    >
                      No
                    </div>
                  </div>
                </div>
              </div>

              {/* TOTAL */}
              <div style={totalSection}>
                <div style={totalRow}>
                  <span>Subtotal:</span>
                  <span>${subtotal}</span>
                </div>
                <div style={totalRow}>
                  <span>Cargo por servicio (3%):</span>
                  <span>${fee.toFixed(2)}</span>
                </div>
                <div style={{...totalRow, ...totalFinal}}>
                  <span>TOTAL A PAGAR:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" style={primaryButton}>
                REVISAR INSCRIPCIÓN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW */}
      {step === "review" && (
        <div style={container}>
          <div style={formCard}>
            <Link href="#" onClick={(e) => { e.preventDefault(); setStep("form"); }} style={backButtonInline}>
              <span style={backArrow}>←</span>
              <span>EDITAR INFORMACIÓN</span>
            </Link>

            <h1 style={formTitle}>Confirma tu Información</h1>

            <div style={reviewSection}>
              <h3 style={reviewTitle}>Datos Personales</h3>
              <div style={reviewGrid}>
                <div style={reviewItem}>
                  <span style={reviewLabel}>Nombre:</span>
                  <span style={reviewValue}>{name}</span>
                </div>
                <div style={reviewItem}>
                  <span style={reviewLabel}>Email:</span>
                  <span style={reviewValue}>{email}</span>
                </div>
                <div style={reviewItem}>
                  <span style={reviewLabel}>Teléfono:</span>
                  <span style={reviewValue}>{phone}</span>
                </div>
                <div style={reviewItem}>
                  <span style={reviewLabel}>Dirección:</span>
                  <span style={reviewValue}>{address}, {zipCode}</span>
                </div>
                <div style={reviewItem}>
                  <span style={reviewLabel}>Capítulo:</span>
                  <span style={reviewValue}>{capitulo}</span>
                </div>
              </div>
            </div>

            <div style={reviewSection}>
              <h3 style={reviewTitle}>Inscripción</h3>
              <div style={reviewGrid}>
                {purchaseType === "convencion" ? (
                  <>
                    <div style={reviewItem}>
                      <span style={reviewLabel}>Paquete:</span>
                      <span style={reviewValue}>{status.toUpperCase()} - {attendees === "solo" ? "Individual" : "Pareja"}</span>
                    </div>
                    <div style={reviewItem}>
                      <span style={reviewLabel}>Precio:</span>
                      <span style={reviewValue}>{priceType === "especial" ? "Especial" : "Regular"} - ${PRICES[priceType][status][attendees]}</span>
                    </div>
                  </>
                ) : (
                  <div style={reviewItem}>
                    <span style={reviewLabel}>Eventos:</span>
                    <span style={reviewValue}>
                      {gala && "Gala "}
                      {cena && "Cena "}
                      {brunch && "Brunch"}
                    </span>
                  </div>
                )}
                <div style={reviewItem}>
                  <span style={reviewLabel}>Personas en taquilla:</span>
                  <span style={reviewValue}>{totalPeople}</span>
                </div>
                <div style={reviewItem}>
                  <span style={reviewLabel}>Hotel:</span>
                  <span style={reviewValue}>{hotelReservation === "si" ? "Sí reservó/reservará" : "No reservó"}</span>
                </div>
              </div>
            </div>

            <div style={totalSection}>
              <div style={totalRow}>
                <span>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              <div style={totalRow}>
                <span>Cargo por servicio (3%):</span>
                <span>${fee.toFixed(2)}</span>
              </div>
              <div style={{...totalRow, ...totalFinal}}>
                <span>TOTAL A PAGAR:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button style={primaryButton} onClick={() => setStep("payment")}>
              CONTINUAR AL PAGO
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT */}
      {step === "payment" && (
        <div style={container}>
          <div style={formCard}>
            <Link href="#" onClick={(e) => { e.preventDefault(); setStep("review"); }} style={backButtonInline}>
              <span style={backArrow}>←</span>
              <span>VOLVER</span>
            </Link>

            <h1 style={formTitle}>Método de Pago</h1>
            <p style={{textAlign: "center", fontSize: 20, marginBottom: 40}}>
              Total a pagar: <strong style={{color: "#d4af37", fontSize: 28}}>${total.toFixed(2)}</strong>
            </p>

            <div style={section}>
              <div style={optionsGrid}>
                <div 
                  style={{...optionCard, ...(paymentMethod === "ath" ? optionCardActive : {})}}
                  onClick={() => setPaymentMethod("ath")}
                >
                  <div style={optionTitle}>ATH Móvil Business</div>
                  <div style={optionDesc}>Pago instantáneo</div>
                </div>

                <div 
                  style={{...optionCard, opacity: 0.5}}
                >
                  <div style={optionTitle}>Tarjeta de Crédito</div>
                  <div style={optionDesc}>Próximamente</div>
                </div>
              </div>

              {paymentMethod === "ath" && (
                <div style={athSection}>
                  <h3 style={{marginBottom: 20, textAlign: "center", fontSize: 20}}>Paga con ATH Móvil Business</h3>
                  <p style={{textAlign: "center", marginBottom: 24, fontSize: 16}}>
                    Envía <strong style={{color: "#d4af37"}}>${total.toFixed(2)}</strong> a:
                  </p>
                  <div 
                    style={athUsername}
                    onClick={() => {
                      navigator.clipboard.writeText("phisigmaalpha");
                      alert("Username copiado: phisigmaalpha");
                    }}
                  >
                    phisigmaalpha
                  </div>
                  <p style={{textAlign: "center", fontSize: 13, opacity: 0.7, marginBottom: 32}}>
                    Toca para copiar el username
                  </p>

                  <div style={uploadSection}>
                    <label style={uploadButton}>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                      />
                      {receipt ? (
                        <span style={{color: "#28a745"}}>Evidencia cargada: {receipt.name}</span>
                      ) : (
                        <span>Subir evidencia de pago</span>
                      )}
                    </label>
                  </div>

                  <button style={primaryButton} onClick={confirmarPago} disabled={!receipt || loading}>
                    {loading ? "PROCESANDO..." : "CONFIRMAR PAGO"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ==================== STYLES ==================== */

const animationCSS = `
  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const main: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0f1729",
  padding: "0 0 60px 0",
};

const header: React.CSSProperties = {
  padding: "20px 40px",
  background: "rgba(15,23,41,0.95)",
  borderBottom: "1px solid rgba(212,175,55,0.3)",
  backdropFilter: "blur(10px)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const backButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 24px",
  background: "rgba(212,175,55,0.1)",
  border: "2px solid #d4af37",
  borderRadius: 8,
  color: "#d4af37",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: 1,
  transition: "all 0.3s",
};

const backButtonInline: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 20px",
  background: "rgba(212,175,55,0.1)",
  border: "2px solid #d4af37",
  borderRadius: 8,
  color: "#d4af37",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 1,
  marginBottom: 24,
  transition: "all 0.3s",
};

const backArrow: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
};

const container: React.CSSProperties = {
  maxWidth: 800,
  margin: "40px auto",
  padding: "0 20px",
};

const formCard: React.CSSProperties = {
  background: "rgba(26,40,71,0.95)",
  borderRadius: 16,
  padding: 48,
  border: "2px solid rgba(212,175,55,0.3)",
  color: "#fff",
  animation: "fadeIn 0.5s",
};

const formTitle: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
  marginBottom: 8,
  textAlign: "center",
  color: "#d4af37",
  letterSpacing: 1,
};

const formSubtitle: React.CSSProperties = {
  fontSize: 16,
  textAlign: "center",
  marginBottom: 40,
  opacity: 0.8,
};

const section: React.CSSProperties = {
  marginBottom: 40,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 24,
  color: "#d4af37",
  letterSpacing: 1,
};

const formGroup: React.CSSProperties = {
  marginBottom: 24,
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: 10,
  fontWeight: 600,
  fontSize: 14,
  color: "#d4af37",
  letterSpacing: 0.5,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 14,
  background: "rgba(15,23,41,0.6)",
  border: "2px solid rgba(212,175,55,0.3)",
  borderRadius: 8,
  fontSize: 15,
  color: "#fff",
  outline: "none",
  transition: "all 0.3s",
};

const optionsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const optionCard: React.CSSProperties = {
  padding: 24,
  background: "rgba(15,23,41,0.6)",
  border: "3px solid rgba(212,175,55,0.3)",
  borderRadius: 12,
  cursor: "pointer",
  transition: "all 0.3s",
  textAlign: "center",
};

const optionCardActive: React.CSSProperties = {
  background: "rgba(212,175,55,0.2)",
  border: "3px solid #d4af37",
  boxShadow: "0 0 20px rgba(212,175,55,0.3)",
  transform: "scale(1.02)",
};

const optionCardSmall: React.CSSProperties = {
  padding: 16,
  background: "rgba(15,23,41,0.6)",
  border: "3px solid rgba(212,175,55,0.3)",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.3s",
  textAlign: "center",
  fontSize: 15,
  fontWeight: 600,
};

const optionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 8,
  color: "#fff",
};

const optionDesc: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.7,
};

const checkboxCard: React.CSSProperties = {
  padding: 20,
  background: "rgba(15,23,41,0.6)",
  border: "3px solid rgba(212,175,55,0.3)",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.3s",
};

const checkboxCardActive: React.CSSProperties = {
  background: "rgba(212,175,55,0.2)",
  border: "3px solid #d4af37",
  boxShadow: "0 0 20px rgba(212,175,55,0.3)",
};

const priceBox: React.CSSProperties = {
  padding: 32,
  background: "rgba(212,175,55,0.15)",
  border: "3px solid #d4af37",
  borderRadius: 12,
  textAlign: "center",
  marginTop: 20,
};

const priceBoxLabel: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.7,
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: 1,
};

const priceBoxCategory: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 8,
};

const priceBoxType: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.8,
  marginBottom: 16,
};

const priceBoxAmount: React.CSSProperties = {
  fontSize: 40,
  fontWeight: 700,
  color: "#d4af37",
};

const totalSection: React.CSSProperties = {
  padding: 32,
  background: "rgba(15,23,41,0.8)",
  borderRadius: 12,
  border: "2px solid rgba(212,175,55,0.3)",
  marginBottom: 32,
};

const totalRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 12,
  fontSize: 16,
};

const totalFinal: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#d4af37",
  paddingTop: 16,
  borderTop: "2px solid rgba(212,175,55,0.3)",
  marginTop: 16,
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: 18,
  background: "#d4af37",
  color: "#0f1729",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: 1,
  textTransform: "uppercase",
  transition: "all 0.3s",
  boxShadow: "0 4px 16px rgba(212,175,55,0.3)",
};

const reviewSection: React.CSSProperties = {
  marginBottom: 32,
  padding: 24,
  background: "rgba(15,23,41,0.6)",
  borderRadius: 12,
  border: "2px solid rgba(212,175,55,0.3)",
};

const reviewTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 20,
  color: "#d4af37",
};

const reviewGrid: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const reviewItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid rgba(212,175,55,0.1)",
};

const reviewLabel: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.7,
};

const reviewValue: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  textAlign: "right",
};

const athSection: React.CSSProperties = {
  marginTop: 32,
  padding: 32,
  background: "rgba(15,23,41,0.6)",
  borderRadius: 12,
  border: "2px solid #d4af37",
};

const athUsername: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: "#d4af37",
  textAlign: "center",
  padding: 24,
  background: "rgba(212,175,55,0.1)",
  borderRadius: 12,
  border: "3px solid #d4af37",
  cursor: "pointer",
  marginBottom: 8,
  transition: "all 0.3s",
};

const uploadSection: React.CSSProperties = {
  marginBottom: 24,
};

const uploadButton: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 20,
  background: "rgba(212,175,55,0.1)",
  border: "3px dashed #d4af37",
  borderRadius: 12,
  textAlign: "center",
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 600,
  color: "#d4af37",
  transition: "all 0.3s",
};

const successCard: React.CSSProperties = {
  background: "rgba(26,40,71,0.95)",
  borderRadius: 16,
  padding: 60,
  border: "3px solid #d4af37",
  color: "#fff",
  textAlign: "center",
};

const successCheck: React.CSSProperties = {
  fontSize: 80,
  color: "#28a745",
  marginBottom: 24,
};

const successTitle: React.CSSProperties = {
  fontSize: 40,
  fontWeight: 700,
  marginBottom: 16,
  color: "#d4af37",
};

const successSubtitle: React.CSSProperties = {
  fontSize: 16,
  marginBottom: 16,
  opacity: 0.8,
};

const codeBox: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: "#d4af37",
  padding: 24,
  background: "rgba(212,175,55,0.15)",
  borderRadius: 12,
  border: "3px solid #d4af37",
  marginBottom: 32,
  letterSpacing: 2,
};

const summaryCard: React.CSSProperties = {
  padding: 32,
  background: "rgba(15,23,41,0.6)",
  borderRadius: 12,
  border: "2px solid rgba(212,175,55,0.3)",
  marginBottom: 32,
  textAlign: "left",
};

const summaryRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 12,
  fontSize: 15,
};

const infoText: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.7,
  marginBottom: 32,
};

const loadingOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,41,0.95)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  zIndex: 9999,
};

const spinner: React.CSSProperties = {
  width: 60,
  height: 60,
  border: "4px solid rgba(212,175,55,0.3)",
  borderTop: "4px solid #d4af37",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};
