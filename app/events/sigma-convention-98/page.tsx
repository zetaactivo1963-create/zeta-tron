"use client";

import Link from "next/link";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function SigmaConvention98() {
  return (
    <main className={rajdhani.className} style={main}>
      {/* HEADER */}
      <header style={header}>
        <Link href="/" style={logoLink}>
          <span style={logoIcon}>🎫</span>
          <span style={logoText}>TICKETEDY</span>
        </Link>
      </header>

      {/* HERO */}
      <section style={hero}>
        <div style={badge98}>98</div>
        <h1 style={heroTitle}>CONVENCIÓN ANUAL</h1>
        <h2 style={heroSubtitle}>PHI SIGMA ALPHA</h2>
        
        <div style={heroInfo}>
          <div style={heroInfoItem}>
            <span style={heroIcon}>📅</span>
            <span>9, 10 y 11 de octubre de 2026</span>
          </div>
          <div style={heroInfoItem}>
            <span style={heroIcon}>📍</span>
            <span>Costa Bahía Convention Center & Casino • Guayanilla, PR</span>
          </div>
        </div>

        <Link href="/compra-convencion">
          <button style={ctaButton}>INSCRÍBETE AHORA</button>
        </Link>
      </section>

      {/* INCLUYE */}
      <section style={section}>
        <h2 style={sectionTitle}>¿QUÉ INCLUYE LA CONVENCIÓN?</h2>
        <div style={grid3}>
          <div style={featureCard}>
            <div style={featureIcon}>📋</div>
            <h3 style={featureTitle}>Acceso Completo</h3>
            <p style={featureText}>3 días de convención con todas las actividades oficiales</p>
          </div>
          <div style={featureCard}>
            <div style={featureIcon}>📚</div>
            <h3 style={featureTitle}>Materiales</h3>
            <p style={featureText}>Documentación y recursos de la convención</p>
          </div>
          <div style={featureCard}>
            <div style={featureIcon}>🤝</div>
            <h3 style={featureTitle}>Networking</h3>
            <p style={featureText}>Conexión con hermanos de todos los capítulos</p>
          </div>
        </div>
      </section>

      {/* TARIFAS */}
      <section style={{...section, background: "#f8f9fa"}}>
        <h2 style={sectionTitle}>TARIFAS DE CONVENCIÓN</h2>
        
        <div style={priceNotice}>
          💰 Precio Especial válido hasta el <strong>11 de abril de 2026</strong>
          <br />
          Precio Regular válido hasta el <strong>19 de septiembre de 2026</strong>
        </div>

        <div style={priceTable}>
          <div style={priceTableRow}>
            <div style={priceTableHeader}>CATEGORÍA</div>
            <div style={priceTableHeader}>ESPECIAL SOLO</div>
            <div style={priceTableHeader}>ESPECIAL PAREJA</div>
            <div style={priceTableHeader}>REGULAR SOLO</div>
            <div style={priceTableHeader}>REGULAR PAREJA</div>
          </div>
          
          <div style={priceTableRow}>
            <div style={priceTableCell}><strong>Activo</strong></div>
            <div style={priceTableCell}>$200</div>
            <div style={priceTableCell}>$350</div>
            <div style={priceTableCell}>$225</div>
            <div style={priceTableCell}>$450</div>
          </div>
          
          <div style={priceTableRow}>
            <div style={priceTableCell}><strong>Militante</strong></div>
            <div style={priceTableCell}>$225</div>
            <div style={priceTableCell}>$400</div>
            <div style={priceTableCell}>$250</div>
            <div style={priceTableCell}>$500</div>
          </div>
        </div>

        <p style={feeNote}>+ 3% cargo por servicio de procesamiento</p>
      </section>

      {/* EVENTOS ADICIONALES */}
      <section style={section}>
        <h2 style={sectionTitle}>EVENTOS SOCIALES OPCIONALES</h2>
        <p style={sectionSubtitle}>Puedes comprar estos eventos sin necesidad de inscribirte a la convención</p>
        
        <div style={eventsGrid}>
          <div style={eventCard}>
            <div style={eventHeader}>
              <span style={eventEmoji}>🌟</span>
              <h3 style={eventTitle}>Gala</h3>
            </div>
            <p style={eventTime}>Viernes por la noche</p>
            <div style={eventPrices}>
              <div style={eventPrice}>Individual: <strong>$125</strong></div>
              <div style={eventPrice}>Pareja: <strong>$190</strong></div>
            </div>
          </div>

          <div style={eventCard}>
            <div style={eventHeader}>
              <span style={eventEmoji}>🍽️</span>
              <h3 style={eventTitle}>Cena</h3>
            </div>
            <p style={eventTime}>Sábado por la noche</p>
            <div style={eventPrices}>
              <div style={eventPrice}>Individual: <strong>$90</strong></div>
              <div style={eventPrice}>Pareja: <strong>$175</strong></div>
            </div>
          </div>

          <div style={eventCard}>
            <div style={eventHeader}>
              <span style={eventEmoji}>🥐</span>
              <h3 style={eventTitle}>Brunch</h3>
            </div>
            <p style={eventTime}>Domingo por la mañana</p>
            <div style={eventPrices}>
              <div style={eventPrice}>Individual: <strong>$75</strong></div>
              <div style={eventPrice}>Pareja: <strong>$140</strong></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOTEL */}
      <section style={{...section, background: "#f8f9fa"}}>
        <h2 style={sectionTitle}>🏨 HOSPEDAJE EN COSTA BAHÍA</h2>
        
        <div style={hotelBox}>
          <h3 style={hotelBoxTitle}>Tarifa Especial Grupal</h3>
          <p style={hotelBoxText}>
            Desde <strong style={{color: "#0056b3", fontSize: 24}}>$160.00</strong> por noche
            <br />
            <span style={{fontSize: 14, opacity: 0.8}}>+ 8% hotel fee + 11% impuesto gubernamental</span>
          </p>
          
          <div style={hotelFeatures}>
            <div style={hotelFeature}>✓ Desayuno incluido</div>
            <div style={hotelFeature}>✓ Piscina estilo laguna</div>
            <div style={hotelFeature}>✓ Wi-Fi gratis</div>
            <div style={hotelFeature}>✓ Estacionamiento</div>
          </div>

          <div style={hotelContact}>
            <p style={{margin: 0, fontWeight: 600}}>Para reservar:</p>
            <p style={{margin: "8px 0", fontSize: 18}}>📞 (787) 221-6835</p>
            <p style={{margin: 0, fontSize: 14}}>
              Código: <strong>FRATERNIDAD PHI SIGMA ALPHA</strong>
            </p>
          </div>

          <p style={{fontSize: 13, opacity: 0.8, marginTop: 16}}>
            Persona adicional: $20.00 + impuestos por noche (máximo 4 por habitación)
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={ctaSection}>
        <h2 style={{fontSize: 36, marginBottom: 16, color: "#fff"}}>
          ¿Listo para inscribirte?
        </h2>
        <p style={{fontSize: 18, marginBottom: 32, opacity: 0.9}}>
          Asegura tu lugar en la 98ª Convención Anual
        </p>
        <Link href="/compra-convencion">
          <button style={ctaButtonLarge}>INSCRIBIRME AHORA</button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        <p style={{margin: 0, opacity: 0.7}}>
          © 2026 Ticketedy • Plataforma oficial de inscripciones
        </p>
      </footer>
    </main>
  );
}

/* ==================== STYLES ==================== */

const main: React.CSSProperties = {
  minHeight: "100vh",
  background: "#fff",
  color: "#1a1a2e",
};

const header: React.CSSProperties = {
  padding: "20px 40px",
  borderBottom: "1px solid #e0e0e0",
  background: "#fff",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const logoLink: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  textDecoration: "none",
  color: "#1a1a2e",
};

const logoIcon: React.CSSProperties = {
  fontSize: 28,
};

const logoText: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: 2,
};

const hero: React.CSSProperties = {
  padding: "80px 20px",
  textAlign: "center",
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  color: "#fff",
};

const badge98: React.CSSProperties = {
  fontSize: 100,
  fontWeight: 700,
  background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 50%, #d4af37 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: 20,
  letterSpacing: 10,
};

const heroTitle: React.CSSProperties = {
  fontSize: 56,
  fontWeight: 700,
  margin: 0,
  marginBottom: 12,
  letterSpacing: 4,
};

const heroSubtitle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 500,
  color: "#d4af37",
  margin: 0,
  marginBottom: 40,
  letterSpacing: 3,
};

const heroInfo: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  alignItems: "center",
  marginBottom: 40,
  fontSize: 18,
};

const heroInfoItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const heroIcon: React.CSSProperties = {
  fontSize: 24,
};

const ctaButton: React.CSSProperties = {
  padding: "18px 48px",
  fontSize: 18,
  fontWeight: 700,
  background: "#d4af37",
  color: "#1a1a2e",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  letterSpacing: 1,
  transition: "all 0.3s",
  boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
};

const section: React.CSSProperties = {
  padding: "80px 20px",
  maxWidth: 1200,
  margin: "0 auto",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
  textAlign: "center",
  marginBottom: 16,
  color: "#1a1a2e",
  letterSpacing: 1,
};

const sectionSubtitle: React.CSSProperties = {
  fontSize: 16,
  textAlign: "center",
  marginBottom: 48,
  opacity: 0.7,
};

const grid3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 32,
  marginTop: 48,
};

const featureCard: React.CSSProperties = {
  padding: 32,
  background: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: 12,
  textAlign: "center",
};

const featureIcon: React.CSSProperties = {
  fontSize: 48,
  marginBottom: 16,
};

const featureTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 12,
  color: "#1a1a2e",
};

const featureText: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  opacity: 0.8,
  margin: 0,
};

const priceNotice: React.CSSProperties = {
  textAlign: "center",
  padding: 20,
  background: "#fff3cd",
  border: "1px solid #ffc107",
  borderRadius: 8,
  marginBottom: 32,
  fontSize: 15,
  lineHeight: 1.8,
};

const priceTable: React.CSSProperties = {
  border: "1px solid #dee2e6",
  borderRadius: 8,
  overflow: "hidden",
  background: "#fff",
};

const priceTableRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
  borderBottom: "1px solid #dee2e6",
};

const priceTableHeader: React.CSSProperties = {
  padding: 16,
  background: "#1a1a2e",
  color: "#fff",
  fontWeight: 700,
  fontSize: 13,
  textAlign: "center",
  borderRight: "1px solid rgba(255,255,255,0.1)",
};

const priceTableCell: React.CSSProperties = {
  padding: 16,
  textAlign: "center",
  borderRight: "1px solid #dee2e6",
  fontSize: 16,
};

const feeNote: React.CSSProperties = {
  textAlign: "center",
  marginTop: 16,
  fontSize: 14,
  fontStyle: "italic",
  opacity: 0.7,
};

const eventsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 24,
  marginTop: 32,
};

const eventCard: React.CSSProperties = {
  padding: 32,
  background: "#fff",
  border: "2px solid #d4af37",
  borderRadius: 12,
};

const eventHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 12,
};

const eventEmoji: React.CSSProperties = {
  fontSize: 32,
};

const eventTitle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  margin: 0,
};

const eventTime: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.7,
  marginBottom: 16,
};

const eventPrices: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const eventPrice: React.CSSProperties = {
  fontSize: 16,
  padding: "8px 12px",
  background: "#f8f9fa",
  borderRadius: 6,
};

const hotelBox: React.CSSProperties = {
  maxWidth: 700,
  margin: "0 auto",
  padding: 40,
  background: "#fff",
  border: "2px solid #0056b3",
  borderRadius: 12,
  textAlign: "center",
};

const hotelBoxTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 16,
  color: "#0056b3",
};

const hotelBoxText: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.8,
  marginBottom: 24,
};

const hotelFeatures: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 24,
};

const hotelFeature: React.CSSProperties = {
  padding: 12,
  background: "#e7f3ff",
  borderRadius: 6,
  fontSize: 15,
  fontWeight: 500,
};

const hotelContact: React.CSSProperties = {
  padding: 24,
  background: "#f8f9fa",
  borderRadius: 8,
  marginBottom: 16,
};

const ctaSection: React.CSSProperties = {
  padding: "100px 20px",
  textAlign: "center",
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  color: "#fff",
};

const ctaButtonLarge: React.CSSProperties = {
  padding: "20px 60px",
  fontSize: 20,
  fontWeight: 700,
  background: "#d4af37",
  color: "#1a1a2e",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  letterSpacing: 1,
  transition: "all 0.3s",
  boxShadow: "0 6px 20px rgba(212,175,55,0.4)",
};

const footer: React.CSSProperties = {
  padding: 32,
  textAlign: "center",
  background: "#1a1a2e",
  color: "#fff",
  fontSize: 14,
};
