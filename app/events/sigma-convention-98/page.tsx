"use client";

import Link from "next/link";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function SigmaConvention98() {
  return (
    <>
      <style>{globalCSS}</style>
      <main className={rajdhani.className} style={main}>
        {/* HERO IMAGE */}
        <div style={heroImage}>
          <div style={heroOverlay}>
            {/* HEADER */}
            <header style={header}>
              <Link href="/" style={homeLink}>
                <span style={homeArrow}>←</span>
                <span>Home</span>
              </Link>
              <Link href="/" style={logoLink}>
                <span style={logoIcon}>🎫</span>
                <span style={logoText}>TICKETEDY</span>
              </Link>
              <div style={{width: 80}}></div>
            </header>

            {/* CONTENT */}
            <div style={content}>
              <div style={badge98}>98</div>
              
              <h1 style={title}>CONVENCIÓN ANUAL</h1>
              <h2 style={subtitle}>PHI SIGMA ALPHA</h2>
              
              <div style={dateBox}>
                <div style={dateIcon}>📅</div>
                <div>
                  <div style={dateText}>9, 10 y 11 de octubre 2026</div>
                  <div style={locationText}>Costa Bahía Convention Center & Casino</div>
                  <div style={cityText}>Guayanilla, Puerto Rico</div>
                </div>
              </div>

              {/* INFO CARD */}
              <div style={infoCard}>
                <h3 style={infoTitle}>Incluye:</h3>
                <div style={infoList}>
                  <div style={infoItem}>✓ Acceso completo a la convención (3 días)</div>
                  <div style={infoItem}>✓ Materiales y documentación</div>
                  <div style={infoItem}>✓ Sesiones plenarias</div>
                  <div style={infoItem}>✓ Networking con hermanos de todos los capítulos</div>
                </div>

                <div style={divider}></div>

                <h3 style={infoTitle}>Eventos adicionales opcionales:</h3>
                <div style={eventsList}>
                  <div style={eventItem}>
                    <span style={eventName}>🌟 Gala - Viernes PM</span>
                    <span style={eventPrice}>$125 ind / $190 pareja</span>
                  </div>
                  <div style={eventItem}>
                    <span style={eventName}>🍽️ Cena - Sábado PM</span>
                    <span style={eventPrice}>$90 ind / $175 pareja</span>
                  </div>
                  <div style={eventItem}>
                    <span style={eventName}>🥐 Brunch - Domingo AM</span>
                    <span style={eventPrice}>$75 ind / $140 pareja</span>
                  </div>
                </div>
              </div>

              {/* PRICING */}
              <div style={pricingSection}>
                <h3 style={pricingTitle}>TARIFAS DE CONVENCIÓN</h3>
                
                <div style={priceNotice}>
                  💰 Precio Especial hasta 11 de abril - Precio Regular hasta 19 de septiembre
                </div>

                <div style={priceSimpleGrid}>
                  <div style={priceCard}>
                    <div style={priceCardTitle}>ACTIVO - Individual</div>
                    <div style={priceCardAmount}>$200 → $225</div>
                    <div style={priceCardLabel}>Especial → Regular</div>
                  </div>

                  <div style={priceCard}>
                    <div style={priceCardTitle}>ACTIVO - Pareja</div>
                    <div style={priceCardAmount}>$350 → $450</div>
                    <div style={priceCardLabel}>Especial → Regular</div>
                  </div>

                  <div style={priceCard}>
                    <div style={priceCardTitle}>MILITANTE - Individual</div>
                    <div style={priceCardAmount}>$225 → $250</div>
                    <div style={priceCardLabel}>Especial → Regular</div>
                  </div>

                  <div style={priceCard}>
                    <div style={priceCardTitle}>MILITANTE - Pareja</div>
                    <div style={priceCardAmount}>$400 → $500</div>
                    <div style={priceCardLabel}>Especial → Regular</div>
                  </div>
                </div>

                <div style={feeNotice}>
                  + 3% cargo por servicio
                </div>
              </div>

              {/* HOTEL INFO */}
              <div style={hotelSection}>
                <h3 style={hotelTitle}>🏨 HOTEL DE LA CONVENCIÓN</h3>
                <p style={hotelName}>Costa Bahía Beach Resort</p>
                <p style={hotelDetail}>Desde $160.00 por noche + impuestos (8% + 11%)</p>
                <p style={hotelDetail}>Incluye: Desayuno, Restaurant, Piscina, Internet, Self Parking</p>
                <p style={hotelDetail}>Persona adicional: $20.00 + impuestos por persona/noche</p>
                <p style={hotelDetail}>(Máximo 4 personas por habitación)</p>
                
                <div style={hotelNote}>
                  📞 Reservaciones: 787-221-6835
                  <br />
                  Código: FRATERNIDAD PHI SIGMA ALPHA
                </div>
              </div>

              {/* CTA */}
              <Link href="/compra-convencion">
                <button style={buyBtn}>Comprar inscripción</button>
              </Link>

              <Link href="/admin" style={adminLink}>
                Acceso directiva
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ==================== STYLES ==================== */

const globalCSS = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.9;
    }
  }
`;

const main: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0a0a14",
  fontFamily: "'Rajdhani', sans-serif",
};

const heroImage: React.CSSProperties = {
  minHeight: "100vh",
  backgroundImage: "url('/eventos/convencion-98-hero.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
};

const heroOverlay: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, rgba(10,10,20,0.92) 0%, rgba(25,25,60,0.88) 100%)",
  display: "flex",
  flexDirection: "column",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  background: "rgba(0,0,0,0.3)",
  backdropFilter: "blur(8px)",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const homeLink: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#d4af37",
  fontSize: 15,
  textDecoration: "none",
  opacity: 0.9,
  fontWeight: 500,
  transition: "all 0.2s",
};

const homeArrow: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
};

const logoLink: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  textDecoration: "none",
  color: "#fff",
};

const logoIcon: React.CSSProperties = {
  fontSize: 24,
};

const logoText: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: 2,
  color: "#fff",
};

const content: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  padding: "40px 20px",
  textAlign: "center",
  color: "#fff",
};

const badge98: React.CSSProperties = {
  fontSize: 80,
  fontWeight: 700,
  background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 50%, #d4af37 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  letterSpacing: 8,
  marginBottom: 16,
  textShadow: "0 0 40px rgba(212,175,55,0.5)",
};

const title: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 700,
  letterSpacing: 6,
  color: "#fff",
  margin: 0,
  marginBottom: 8,
  textTransform: "uppercase",
};

const subtitle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 500,
  letterSpacing: 4,
  color: "#d4af37",
  margin: 0,
  marginBottom: 32,
};

const dateBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "20px 32px",
  background: "rgba(0,0,0,0.4)",
  borderRadius: 12,
  border: "1px solid rgba(212,175,55,0.3)",
  marginBottom: 32,
  maxWidth: 600,
};

const dateIcon: React.CSSProperties = {
  fontSize: 32,
};

const dateText: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  letterSpacing: 1,
  marginBottom: 4,
  textAlign: "left",
};

const locationText: React.CSSProperties = {
  fontSize: 16,
  opacity: 0.9,
  textAlign: "left",
};

const cityText: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.8,
  marginTop: 2,
  textAlign: "left",
};

const infoCard: React.CSSProperties = {
  background: "rgba(0,0,0,0.5)",
  padding: "28px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.15)",
  marginBottom: 32,
  maxWidth: 700,
  width: "100%",
  textAlign: "left",
};

const infoTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 16,
  color: "#d4af37",
  letterSpacing: 1,
};

const infoList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const infoItem: React.CSSProperties = {
  fontSize: 15,
  opacity: 0.95,
  paddingLeft: 8,
};

const divider: React.CSSProperties = {
  height: 1,
  background: "rgba(255,255,255,0.2)",
  margin: "24px 0",
};

const eventsList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const eventItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  background: "rgba(212,175,55,0.1)",
  borderRadius: 8,
  border: "1px solid rgba(212,175,55,0.2)",
};

const eventName: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
};

const eventPrice: React.CSSProperties = {
  fontSize: 14,
  color: "#d4af37",
  fontWeight: 700,
};

const pricingSection: React.CSSProperties = {
  background: "rgba(0,0,0,0.6)",
  padding: "32px",
  borderRadius: 12,
  border: "1px solid rgba(212,175,55,0.3)",
  marginBottom: 32,
  maxWidth: 900,
  width: "100%",
};

const pricingTitle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: 2,
  marginBottom: 24,
  color: "#d4af37",
  textAlign: "center",
};

const priceNotice: React.CSSProperties = {
  textAlign: "center",
  fontSize: 14,
  padding: "12px",
  background: "rgba(212,175,55,0.15)",
  borderRadius: 8,
  marginBottom: 24,
  border: "1px solid rgba(212,175,55,0.3)",
};

const priceSimpleGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginBottom: 16,
};

const priceCard: React.CSSProperties = {
  background: "rgba(212,175,55,0.1)",
  padding: "20px",
  borderRadius: 10,
  border: "1px solid rgba(212,175,55,0.3)",
  textAlign: "center",
};

const priceCardTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 12,
  opacity: 0.9,
};

const priceCardAmount: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#d4af37",
  marginBottom: 8,
};

const priceCardLabel: React.CSSProperties = {
  fontSize: 11,
  opacity: 0.7,
  textTransform: "uppercase",
  letterSpacing: 1,
};

const hotelSection: React.CSSProperties = {
  background: "rgba(0,0,0,0.5)",
  padding: "28px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.15)",
  marginBottom: 32,
  maxWidth: 700,
  width: "100%",
};

const hotelTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 16,
  color: "#d4af37",
  letterSpacing: 1,
  textAlign: "center",
};

const hotelName: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 12,
  textAlign: "center",
};

const hotelDetail: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.9,
  marginBottom: 8,
  textAlign: "center",
};

const hotelNote: React.CSSProperties = {
  marginTop: 16,
  padding: "12px",
  background: "rgba(212,175,55,0.1)",
  borderRadius: 8,
  fontSize: 13,
  textAlign: "center",
  border: "1px solid rgba(212,175,55,0.2)",
};

const feeNotice: React.CSSProperties = {
  textAlign: "center",
  fontSize: 13,
  opacity: 0.8,
  fontStyle: "italic",
  marginTop: 16,
};

const buyBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 50%, #d4af37 100%)",
  color: "#000",
  padding: "18px 64px",
  fontSize: 18,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  marginBottom: 20,
  fontWeight: 700,
  letterSpacing: 2,
  boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
  transition: "all 0.3s ease",
  textTransform: "uppercase",
};

const adminLink: React.CSSProperties = {
  fontSize: 13,
  color: "#d4af37",
  textDecoration: "none",
  letterSpacing: 0.5,
  opacity: 0.75,
  borderBottom: "1px solid rgba(212,175,55,0.3)",
  paddingBottom: 2,
};
