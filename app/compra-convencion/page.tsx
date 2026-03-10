"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

type Step = "form" | "review" | "payment" | "done";

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

const FEE_PERCENT = 0.03;

function getCurrentPriceType(): "especial" | "regular" {
  const now = new Date();
  const cutoff = new Date("2026-04-11T23:59:59");
  return now <= cutoff ? "especial" : "regular";
}

export default function CompraConvencion() {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  
  // Datos personales
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [capitulo, setCapitulo] = useState("");
  
  // Tipo de inscripción
  const [purchaseType, setPurchaseType] = useState<"convencion" | "eventos">("convencion");
  const [status, setStatus] = useState<"activo" | "militante">("activo");
  const [attendees, setAttendees] = useState<"solo" | "pareja">("solo");
  
  // Eventos sociales
  const [gala, setGala] = useState(false);
  const [cena, setCena] = useState(false);
  const [brunch, setBrunch] = useState(false);
  
  // Hotel y otros
  const [hotelReservation, setHotelReservation] = useState<"si" | "no" | "">("");
  const [totalPeople, setTotalPeople] = useState("");
  const [minors, setMinors] = useState("");
  
  // Pago
  const [paymentMethod, setPaymentMethod] = useState<"ath" | "tarjeta" | "efectivo" | "paypal" | "cheque">("ath");
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
      alert("Indica si reservaste habitación");
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
        minors_count: minors ? parseInt(minors) : null,
        
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
      {loading && (
        <div style={loadingOverlay}>
          <div style={spinner} />
          <p>Procesando inscripción...</p>
        </div>
      )}

      {/* DONE */}
      {step === "done" && (
        <div style={container}>
          <div style={card}>
            <div style={successIcon}>✅</div>
            <h1 style={successTitle}>¡Inscripción Recibida!</h1>
            <p style={successText}>
              Tu código de confirmación es:
            </p>
            <div style={codeBox}>{ticketCode}</div>

            <div style={summaryBox}>
              <h3 style={summaryTitle}>Resumen de tu inscripción</h3>
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
              <div style={{...summaryRow, marginTop: 16, paddingTop: 16, borderTop: "2px solid #dee2e6"}}>
                <span style={{fontSize: 18}}>Total pagado:</span>
                <strong style={{fontSize: 20, color: "#0056b3"}}>${total.toFixed(2)}</strong>
              </div>
            </div>

            <p style={infoText}>
              Recibirás confirmación por email una vez sea aprobado tu pago.
            </p>

            <Link href="/events/sigma-convention-98">
              <button style={primaryButton}>Volver al evento</button>
            </Link>
          </div>
        </div>
      )}

      {/* FORM */}
      {step === "form" && (
        <div style={container}>
          <div style={formCard}>
            <div style={formHeader}>
              <h1 style={formTitle}>Inscripción Convención 98</h1>
              <p style={formSubtitle}>9-11 de octubre 2026 • Costa Bahía, Guayanilla PR</p>
            </div>

            <form onSubmit={goToReview}>
              {/* TIPO DE INSCRIPCIÓN */}
              <div style={section}>
                <h2 style={sectionTitle}>1. Tipo de Inscripción</h2>
                
                <div style={radioGroup}>
                  <label style={radioCard}>
                    <input
                      type="radio"
                      checked={purchaseType === "convencion"}
                      onChange={() => setPurchaseType("convencion")}
                      style={radio}
                    />
                    <div>
                      <div style={radioTitle}>Paquete de Convención</div>
                      <div style={radioDesc}>Acceso completo a los 3 días de convención</div>
                    </div>
                  </label>

                  <label style={radioCard}>
                    <input
                      type="radio"
                      checked={purchaseType === "eventos"}
                      onChange={() => setPurchaseType("eventos")}
                      style={radio}
                    />
                    <div>
                      <div style={radioTitle}>Solo Eventos Sociales</div>
                      <div style={radioDesc}>Gala, Cena y/o Brunch (sin convención)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* DATOS PERSONALES */}
              <div style={section}>
                <h2 style={sectionTitle}>2. Información del Participante</h2>
                
                <div style={formGroup}>
                  <label style={label}>Nombre completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={input}
                    placeholder="Nombre y apellidos"
                    required
                  />
                </div>

                <div style={formGrid}>
                  <div style={formGroup}>
                    <label style={label}>Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={input}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div style={formGroup}>
                    <label style={label}>Teléfono *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      style={input}
                      placeholder="7871234567"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div style={formGroup}>
                  <label style={label}>Dirección Postal *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={input}
                    placeholder="Calle, pueblo, estado"
                    required
                  />
                </div>

                <div style={formGroup}>
                  <label style={label}>Código Postal *</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                    style={{...input, maxWidth: 200}}
                    placeholder="00000"
                    maxLength={5}
                    required
                  />
                </div>

                <div style={formGroup}>
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
                </div>
              </div>

              {/* DETALLES DE INSCRIPCIÓN */}
              <div style={section}>
                <h2 style={sectionTitle}>3. Detalles de Inscripción</h2>

                <div style={formGrid}>
                  <div style={formGroup}>
                    <label style={label}>Actualmente soy: *</label>
                    <div style={{display: "flex", gap: 16}}>
                      <label style={checkLabel}>
                        <input
                          type="radio"
                          checked={status === "activo"}
                          onChange={() => setStatus("activo")}
                        />
                        <span>Activo</span>
                      </label>
                      <label style={checkLabel}>
                        <input
                          type="radio"
                          checked={status === "militante"}
                          onChange={() => setStatus("militante")}
                        />
                        <span>Militante</span>
                      </label>
                    </div>
                  </div>

                  <div style={formGroup}>
                    <label style={label}>Asistencia: *</label>
                    <div style={{display: "flex", gap: 16}}>
                      <label style={checkLabel}>
                        <input
                          type="radio"
                          checked={attendees === "solo"}
                          onChange={() => setAttendees("solo")}
                        />
                        <span>Individual</span>
                      </label>
                      <label style={checkLabel}>
                        <input
                          type="radio"
                          checked={attendees === "pareja"}
                          onChange={() => setAttendees("pareja")}
                        />
                        <span>Pareja</span>
                      </label>
                    </div>
                  </div>
                </div>

                {purchaseType === "convencion" && (
                  <div style={priceBox}>
                    <div style={priceBoxTitle}>Paquete seleccionado</div>
                    <div style={priceBoxCategory}>{status.toUpperCase()} - {attendees === "solo" ? "Individual" : "Pareja"}</div>
                    <div style={priceBoxType}>Precio {priceType === "especial" ? "Especial" : "Regular"}</div>
                    <div style={priceBoxAmount}>${PRICES[priceType][status][attendees]}</div>
                  </div>
                )}

                {purchaseType === "eventos" && (
                  <div style={formGroup}>
                    <label style={label}>Selecciona los eventos: *</label>
                    <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                      <label style={checkboxCard}>
                        <input
                          type="checkbox"
                          checked={gala}
                          onChange={(e) => setGala(e.target.checked)}
                        />
                        <div style={{flex: 1}}>
                          <strong>Gala - Viernes PM</strong>
                          <div style={{fontSize: 14, opacity: 0.7}}>Individual: $125 • Pareja: $190</div>
                        </div>
                      </label>

                      <label style={checkboxCard}>
                        <input
                          type="checkbox"
                          checked={cena}
                          onChange={(e) => setCena(e.target.checked)}
                        />
                        <div style={{flex: 1}}>
                          <strong>Cena - Sábado PM</strong>
                          <div style={{fontSize: 14, opacity: 0.7}}>Individual: $90 • Pareja: $175</div>
                        </div>
                      </label>

                      <label style={checkboxCard}>
                        <input
                          type="checkbox"
                          checked={brunch}
                          onChange={(e) => setBrunch(e.target.checked)}
                        />
                        <div style={{flex: 1}}>
                          <strong>Brunch - Domingo AM</strong>
                          <div style={{fontSize: 14, opacity: 0.7}}>Individual: $75 • Pareja: $140</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <div style={formGrid}>
                  <div style={formGroup}>
                    <label style={label}>Cantidad de personas en su taquilla *</label>
                    <input
                      type="number"
                      value={totalPeople}
                      onChange={(e) => setTotalPeople(e.target.value)}
                      style={input}
                      placeholder="Incluyendo menores"
                      min="1"
                      required
                    />
                  </div>

                  <div style={formGroup}>
                    <label style={label}>¿Cuántos menores de edad?</label>
                    <input
                      type="number"
                      value={minors}
                      onChange={(e) => setMinors(e.target.value)}
                      style={input}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div style={formGroup}>
                  <label style={label}>¿Reservó habitación en el hotel? *</label>
                  <div style={{display: "flex", gap: 16}}>
                    <label style={checkLabel}>
                      <input
                        type="radio"
                        checked={hotelReservation === "si"}
                        onChange={() => setHotelReservation("si")}
                      />
                      <span>Sí</span>
                    </label>
                    <label style={checkLabel}>
                      <input
                        type="radio"
                        checked={hotelReservation === "no"}
                        onChange={() => setHotelReservation("no")}
                      />
                      <span>No</span>
                    </label>
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
                  <span style={reviewLabel}>Personas:</span>
                  <span style={reviewValue}>{totalPeople} {minors && `(${minors} menores)`}</span>
                </div>
                <div style={reviewItem}>
                  <span style={reviewLabel}>Hotel:</span>
                  <span style={reviewValue}>{hotelReservation === "si" ? "Sí reservó" : "No reservó"}</span>
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
            <button style={secondaryButton} onClick={() => setStep("form")}>
              Editar Información
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT */}
      {step === "payment" && (
        <div style={container}>
          <div style={formCard}>
            <h1 style={formTitle}>Método de Pago</h1>
            <p style={{textAlign: "center", fontSize: 18, marginBottom: 32}}>
              Total a pagar: <strong style={{color: "#0056b3", fontSize: 24}}>${total.toFixed(2)}</strong>
            </p>

            <div style={section}>
              <h3 style={sectionTitle}>Selecciona tu método de pago</h3>

              <div style={paymentGrid}>
                <label style={paymentCard}>
                  <input
                    type="radio"
                    checked={paymentMethod === "ath"}
                    onChange={() => setPaymentMethod("ath")}
                    style={radio}
                  />
                  <div>
                    <div style={paymentTitle}>💳 ATH Móvil Business</div>
                    <div style={paymentDesc}>Pago instantáneo</div>
                  </div>
                </label>

                <label style={paymentCard}>
                  <input
                    type="radio"
                    checked={paymentMethod === "tarjeta"}
                    onChange={() => setPaymentMethod("tarjeta")}
                    style={radio}
                  />
                  <div>
                    <div style={paymentTitle}>💳 Tarjeta (Visa/MasterCard)</div>
                    <div style={paymentDesc}>Próximamente</div>
                  </div>
                </label>

                <label style={paymentCard}>
                  <input
                    type="radio"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    style={radio}
                  />
                  <div>
                    <div style={paymentTitle}>💵 PayPal</div>
                    <div style={paymentDesc}>Paga en 3 plazos</div>
                  </div>
                </label>
              </div>

              {paymentMethod === "ath" && (
                <div style={athSection}>
                  <h3 style={{marginBottom: 16, textAlign: "center"}}>Paga con ATH Móvil Business</h3>
                  <p style={{textAlign: "center", marginBottom: 24}}>
                    Envía <strong>${total.toFixed(2)}</strong> a:
                  </p>
                  <div style={athUsername}>phisigmaalpha</div>
                  <p style={{textAlign: "center", fontSize: 14, opacity: 0.7, marginBottom: 24}}>
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
                        <span style={{color: "#28a745"}}>✓ Evidencia cargada: {receipt.name}</span>
                      ) : (
                        <span>📤 Subir evidencia de pago</span>
                      )}
                    </label>
                  </div>

                  <button style={primaryButton} onClick={confirmarPago} disabled={!receipt || loading}>
                    {loading ? "Procesando..." : "CONFIRMAR PAGO"}
                  </button>
                </div>
              )}

              {paymentMethod === "tarjeta" && (
                <div style={disabledSection}>
                  <p>El pago con tarjeta estará disponible próximamente.</p>
                  <p>Por favor usa ATH Móvil Business.</p>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div style={disabledSection}>
                  <p>El pago con PayPal estará disponible próximamente.</p>
                  <p>Por favor usa ATH Móvil Business.</p>
                </div>
              )}
            </div>

            <button style={secondaryButton} onClick={() => setStep("review")}>
              Volver
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ==================== STYLES ==================== */

const main: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8f9fa",
  padding: "40px 20px",
};

const container: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
};

const formCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  padding: 40,
};

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 48,
  textAlign: "center",
};

const formHeader: React.CSSProperties = {
  marginBottom: 40,
  textAlign: "center",
  borderBottom: "2px solid #dee2e6",
  paddingBottom: 24,
};

const formTitle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 8,
  color: "#1a1a2e",
};

const formSubtitle: React.CSSProperties = {
  fontSize: 16,
  color: "#6c757d",
};

const section: React.CSSProperties = {
  marginBottom: 40,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 20,
  color: "#1a1a2e",
};

const formGroup: React.CSSProperties = {
  marginBottom: 20,
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
  fontSize: 14,
  color: "#495057",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 12,
  border: "1px solid #ced4da",
  borderRadius: 6,
  fontSize: 15,
  outline: "none",
  transition: "border 0.2s",
};

const radioGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const radioCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 16,
  border: "2px solid #dee2e6",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.2s",
};

const radio: React.CSSProperties = {
  width: 20,
  height: 20,
  cursor: "pointer",
};

const radioTitle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 16,
  marginBottom: 4,
};

const radioDesc: React.CSSProperties = {
  fontSize: 14,
  color: "#6c757d",
};

const checkLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  fontSize: 15,
};

const checkboxCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 16,
  border: "1px solid #dee2e6",
  borderRadius: 8,
  cursor: "pointer",
};

const priceBox: React.CSSProperties = {
  padding: 24,
  background: "#e7f3ff",
  border: "2px solid #0056b3",
  borderRadius: 8,
  textAlign: "center",
  marginTop: 20,
};

const priceBoxTitle: React.CSSProperties = {
  fontSize: 14,
  color: "#6c757d",
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: 1,
};

const priceBoxCategory: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 4,
};

const priceBoxType: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.7,
  marginBottom: 12,
};

const priceBoxAmount: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: "#0056b3",
};

const totalSection: React.CSSProperties = {
  padding: 24,
  background: "#f8f9fa",
  borderRadius: 8,
  marginBottom: 32,
};

const totalRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 12,
  fontSize: 16,
};

const totalFinal: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "#0056b3",
  paddingTop: 12,
  borderTop: "2px solid #dee2e6",
  marginTop: 12,
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: 16,
  background: "#0056b3",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s",
  marginBottom: 12,
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: 16,
  background: "transparent",
  color: "#6c757d",
  border: "1px solid #dee2e6",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const reviewSection: React.CSSProperties = {
  marginBottom: 32,
  padding: 24,
  background: "#f8f9fa",
  borderRadius: 8,
};

const reviewTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 16,
  color: "#1a1a2e",
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
};

const reviewLabel: React.CSSProperties = {
  fontSize: 14,
  color: "#6c757d",
};

const reviewValue: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  textAlign: "right",
};

const paymentGrid: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginBottom: 32,
};

const paymentCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 16,
  border: "2px solid #dee2e6",
  borderRadius: 8,
  cursor: "pointer",
};

const paymentTitle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 16,
  marginBottom: 4,
};

const paymentDesc: React.CSSProperties = {
  fontSize: 14,
  color: "#6c757d",
};

const athSection: React.CSSProperties = {
  padding: 24,
  background: "#f8f9fa",
  borderRadius: 8,
  marginTop: 24,
};

const athUsername: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: "#0056b3",
  textAlign: "center",
  padding: 20,
  background: "#fff",
  borderRadius: 8,
  border: "2px solid #0056b3",
  cursor: "pointer",
  marginBottom: 8,
};

const uploadSection: React.CSSProperties = {
  marginBottom: 24,
};

const uploadButton: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 16,
  background: "#fff",
  border: "2px dashed #0056b3",
  borderRadius: 8,
  textAlign: "center",
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 600,
  color: "#0056b3",
  transition: "all 0.2s",
};

const disabledSection: React.CSSProperties = {
  padding: 32,
  textAlign: "center",
  background: "#fff3cd",
  borderRadius: 8,
  marginTop: 24,
};

const successIcon: React.CSSProperties = {
  fontSize: 64,
  marginBottom: 24,
};

const successTitle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 16,
  color: "#28a745",
};

const successText: React.CSSProperties = {
  fontSize: 16,
  marginBottom: 16,
  color: "#6c757d",
};

const codeBox: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: "#0056b3",
  padding: 20,
  background: "#e7f3ff",
  borderRadius: 8,
  marginBottom: 32,
};

const summaryBox: React.CSSProperties = {
  padding: 24,
  background: "#f8f9fa",
  borderRadius: 8,
  marginBottom: 32,
  textAlign: "left",
};

const summaryTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 16,
};

const summaryRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 12,
  fontSize: 15,
};

const infoText: React.CSSProperties = {
  fontSize: 14,
  color: "#6c757d",
  marginBottom: 32,
};

const loadingOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  zIndex: 9999,
};

const spinner: React.CSSProperties = {
  width: 50,
  height: 50,
  border: "4px solid rgba(255,255,255,0.3)",
  borderTop: "4px solid #fff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginBottom: 16,
};
