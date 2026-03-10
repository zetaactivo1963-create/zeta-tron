"use client";

import Link from "next/link";
import { Rajdhani } from "next/font/google";
import { useState } from "react";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function SigmaConvention98() {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  
  const hotelPhotos = [
    "/eventos/hotel-exterior.jpg",
    "/eventos/hotel-lobby.jpg", 
    "/eventos/hotel-pool.jpg",
    "/eventos/hotel-casino.jpg",
  ];

  return (
    <main className={rajdhani.className} style={main}>
      <style>{animationCSS}</style>
      
      {/* HEADER */}
      <header style={header}>
        <Link href="/" style={logoLink}>
          <span style={logoIcon}>🎫</span>
          <span style={logoText}>TICKETEDY</span>
        </Link>
      </header>

      {/* HERO */}
      <section style={hero}>
        <div style={badge98Container}>
          <img 
            src="/eventos/logo-98-convencion.png" 
            alt="98 Convención" 
            style={badge98Image}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('fallback-98');
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <div id="fallback-98" style={{...badge98Fallback, display: 'none'}}>98</div>
        </div>
        
        <h1 style={heroTitle}>CONVENCIÓN ANUAL</h1>
        <h2 style={heroSubtitle}>PHI SIGMA ALPHA</h2>
        
        <div style={heroInfo}>
          <div style={heroDate}>9, 10 y 11 de octubre de 2026</div>
          <div style={heroLocation}>Costa Bahía Convention Center & Casino</div>
          <div style={heroCity}>Guayanilla, Puerto Rico</div>
        </div>

        <Link href="/compra-convencion">
          <button style={ctaButton}>INSCRIBIRME AHORA</button>
        </Link>
      </section>

      {/* CARTA DEL PRESIDENTE */}
      <section style={section}>
        <div style={container}>
          <h2 style={sectionTitle}>Un Momento Histórico para Sigma</h2>
          
          <div style={presidentCard}>
            <p style={presidentText}>
              Nos acercamos a nuestro Centenario y reafirmamos el compromiso que asumieron nuestros fundadores en 1928: 
              formar hombres de carácter, liderazgo y servicio para Puerto Rico y el mundo.
            </p>
            
            <p style={presidentText}>
              Esta convención será un punto estratégico de encuentro donde trazaremos el rumbo hacia la conmemoración 
              de nuestros <strong>100 años de historia</strong>. Fortaleceremos lazos fraternales, evaluaremos proyectos 
              institucionales y delinearemos iniciativas para celebrar en grande el legado de casi un siglo de hermandad.
            </p>
            
            <div style={presidentSignature}>
              <div style={signatureLine}>
                <strong>José A. Soto Cintrón</strong>
                <span>Presidente CEC</span>
              </div>
              <div style={signatureLine}>
                <strong>Alberto Ramírez Wirshing</strong>
                <span>Presidente Comité Convención</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TARIFAS */}
      <section style={sectionDark}>
        <div style={container}>
          <h2 style={sectionTitle}>TARIFAS DE CONVENCIÓN</h2>
          
          <div style={priceNotice}>
            Precio Especial válido hasta el <strong>11 de abril de 2026</strong>
            <br />
            Precio Regular válido hasta el <strong>19 de septiembre de 2026</strong>
          </div>

          <div style={priceTableWrapper}>
            <table style={priceTable}>
              <thead>
                <tr>
                  <th style={priceTableHeader}>CATEGORÍA</th>
                  <th style={priceTableHeader}>ESPECIAL<br/>INDIVIDUAL</th>
                  <th style={priceTableHeader}>ESPECIAL<br/>PAREJA</th>
                  <th style={priceTableHeader}>REGULAR<br/>INDIVIDUAL</th>
                  <th style={priceTableHeader}>REGULAR<br/>PAREJA</th>
                </tr>
              </thead>
              <tbody>
                <tr style={priceTableRow}>
                  <td style={priceTableCellLabel}>Activo</td>
                  <td style={priceTableCell}>$200</td>
                  <td style={priceTableCell}>$350</td>
                  <td style={priceTableCell}>$225</td>
                  <td style={priceTableCell}>$450</td>
                </tr>
                <tr style={priceTableRow}>
                  <td style={priceTableCellLabel}>Militante</td>
                  <td style={priceTableCell}>$225</td>
                  <td style={priceTableCell}>$400</td>
                  <td style={priceTableCell}>$250</td>
                  <td style={priceTableCell}>$500</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={feeNote}>Más 3% cargo por servicio de procesamiento</p>
        </div>
      </section>

      {/* EVENTOS SOCIALES */}
      <section style={section}>
        <div style={container}>
          <h2 style={sectionTitle}>EVENTOS SOCIALES OPCIONALES</h2>
          <p style={sectionSubtitle}>Puedes comprar estos eventos sin inscribirte a la convención</p>
          
          <div style={eventsGrid}>
            <div style={eventCard}>
              <div style={eventHeader}>Gala</div>
              <div style={eventTime}>Viernes por la noche</div>
              <div style={eventPrices}>
                <div style={eventPriceRow}>
                  <span>Individual:</span>
                  <strong>$125</strong>
                </div>
                <div style={eventPriceRow}>
                  <span>Pareja:</span>
                  <strong>$190</strong>
                </div>
              </div>
            </div>

            <div style={eventCard}>
              <div style={eventHeader}>Cena</div>
              <div style={eventTime}>Sábado por la noche</div>
              <div style={eventPrices}>
                <div style={eventPriceRow}>
                  <span>Individual:</span>
                  <strong>$90</strong>
                </div>
                <div style={eventPriceRow}>
                  <span>Pareja:</span>
                  <strong>$175</strong>
                </div>
              </div>
            </div>

            <div style={eventCard}>
              <div style={eventHeader}>Brunch</div>
              <div style={eventTime}>Domingo por la mañana</div>
              <div style={eventPrices}>
                <div style={eventPriceRow}>
                  <span>Individual:</span>
                  <strong>$75</strong>
                </div>
                <div style={eventPriceRow}>
                  <span>Pareja:</span>
                  <strong>$140</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOSPEDAJE - HOTEL */}
      <section style={sectionDark}>
        <div style={container}>
          <h2 style={sectionTitle}>TARIFAS DE HOSPEDAJE</h2>
          <p style={hotelSubtitle}>Hotel Costa Bahía - Convention Center & Casino</p>
          
          {/* Galería de fotos */}
          <div style={photoGallery}>
            <div style={photoMain}>
              <img 
                src={hotelPhotos[currentPhoto]} 
                alt="Hotel Costa Bahía"
                style={photoMainImg}
                onError={(e) => {
                  e.currentTarget.src = '/eventos/hotel-placeholder.jpg';
                }}
              />
            </div>
            <div style={photoThumbs}>
              {hotelPhotos.map((photo, idx) => (
                <div 
                  key={idx}
                  style={{...photoThumb, border: currentPhoto === idx ? '3px solid #d4af37' : '3px solid transparent'}}
                  onClick={() => setCurrentPhoto(idx)}
                >
                  <img src={photo} alt={`Foto ${idx + 1}`} style={photoThumbImg} />
                </div>
              ))}
            </div>
          </div>

          {/* Info del hotel */}
          <div style={hotelInfoBox}>
            <h3 style={hotelTitle}>Tarifa Especial Grupal</h3>
            <p style={hotelRate}>
              Desde <strong style={{color: "#d4af37", fontSize: 32}}>$160.00</strong> por noche
              <br />
              <span style={{fontSize: 14, opacity: 0.7}}>Más 8% hotel fee + 11% impuesto gubernamental</span>
            </p>
            
            <div style={hotelFeaturesList}>
              <div style={hotelFeatureItem}>✓ Desayuno incluido</div>
              <div style={hotelFeatureItem}>✓ Piscina estilo laguna</div>
              <div style={hotelFeatureItem}>✓ Wi-Fi gratis</div>
              <div style={hotelFeatureItem}>✓ Estacionamiento</div>
            </div>

            <div style={hotelContact}>
              <p style={{margin: 0, fontWeight: 600, marginBottom: 8}}>Para reservar:</p>
              <p style={{margin: 0, fontSize: 20, fontWeight: 700, color: "#d4af37", marginBottom: 8}}>
                (787) 221-6835
              </p>
              <p style={{margin: 0, fontSize: 14}}>
                Código: <strong>FRATERNIDAD PHI SIGMA ALPHA</strong>
              </p>
            </div>
          </div>

          {/* Tabla de precios de habitaciones */}
          <h3 style={{...sectionTitle, fontSize: 24, marginTop: 48, marginBottom: 24}}>
            Tarifas por Habitación (2 noches)
          </h3>
          
          <div style={priceTableWrapper}>
            <table style={priceTable}>
              <thead>
                <tr>
                  <th style={priceTableHeader}>TIPO / OCUPACIÓN</th>
                  <th style={priceTableHeader}>TARIFA<br/>POR NOCHE</th>
                  <th style={priceTableHeader}>SUBTOTAL<br/>(2 NOCHES)</th>
                  <th style={priceTableHeader}>TOTAL CON<br/>IMPUESTOS</th>
                </tr>
              </thead>
              <tbody>
                <tr style={priceTableRow}>
                  <td style={priceTableCellLabel}>MT - Doble</td>
                  <td style={priceTableCell}>$160.00</td>
                  <td style={priceTableCell}>$320.00</td>
                  <td style={priceTableCell}>$383.62</td>
                </tr>
                <tr style={priceTableRow}>
                  <td style={priceTableCellLabel}>MT - Triple</td>
                  <td style={priceTableCell}>$180.00</td>
                  <td style={priceTableCell}>$360.00</td>
                  <td style={priceTableCell}>$431.57</td>
                </tr>
                <tr style={priceTableRow}>
                  <td style={priceTableCellLabel}>MT - Cuádruple</td>
                  <td style={priceTableCell}>$200.00</td>
                  <td style={priceTableCell}>$400.00</td>
                  <td style={priceTableCell}>$479.52</td>
                </tr>
                <tr style={priceTableRow}>
                  <td style={priceTableCellLabel}>JR Suite - Doble</td>
                  <td style={priceTableCell}>$180.00</td>
                  <td style={priceTableCell}>$360.00</td>
                  <td style={priceTableCell}>$431.57</td>
                </tr>
                <tr style={priceTableRow}>
                  <td style={priceTableCellLabel}>JR Suite - Triple</td>
                  <td style={priceTableCell}>$200.00</td>
                  <td style={priceTableCell}>$400.00</td>
                  <td style={priceTableCell}>$479.52</td>
                </tr>
                <tr style={priceTableRow}>
                  <td style={priceTableCellLabel}>Suite - Doble</td>
                  <td style={priceTableCell}>$200.00</td>
                  <td style={priceTableCell}>$400.00</td>
                  <td style={priceTableCell}>$479.52</td>
                </tr>
                <tr style={priceTableRow}>
                  <td style={priceTableCellLabel}>Suite - Triple</td>
                  <td style={priceTableCell}>$220.00</td>
                  <td style={priceTableCell}>$440.00</td>
                  <td style={priceTableCell}>$527.47</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={feeNote}>Persona adicional: $20.00 más impuestos por noche (máximo 4 personas por habitación)</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={ctaSection}>
        <h2 style={ctaTitle}>¿Listo para inscribirte?</h2>
        <p style={ctaText}>Asegura tu lugar en la 98ª Convención Anual</p>
        <Link href="/compra-convencion">
          <button style={ctaButtonLarge}>INSCRIBIRME AHORA</button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        <p style={{margin: 0, opacity: 0.6}}>
          © 2026 Ticketedy - Plataforma oficial de inscripciones
        </p>
      </footer>
    </main>
  );
}

/* ==================== STYLES ==================== */

const animationCSS = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const main: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0f1729",
  color: "#fff",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px 40px",
  background: "rgba(15,23,41,0.95)",
  borderBottom: "1px solid rgba(212,175,55,0.3)",
  backdropFilter: "blur(10px)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const logoLink: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
  color: "#fff",
};

const logoIcon: React.CSSProperties = {
  fontSize: 32,
};

const logoText: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: 2,
};

const hero: React.CSSProperties = {
  padding: "80px 20px",
  textAlign: "center",
  background: "linear-gradient(180deg, #0f1729 0%, #1a2847 100%)",
};

const badge98Container: React.CSSProperties = {
  marginBottom: 32,
  display: "flex",
  justifyContent: "center",
};

const badge98Image: React.CSSProperties = {
  maxWidth: 200,
  height: "auto",
};

const badge98Fallback: React.CSSProperties = {
  fontSize: 120,
  fontWeight: 700,
  background: "linear-gradient(135deg, #d4af37 0%, #f4e5a1 50%, #d4af37 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: 12,
};

const heroTitle: React.CSSProperties = {
  fontSize: 56,
  fontWeight: 700,
  margin: 0,
  marginBottom: 16,
  letterSpacing: 6,
  textTransform: "uppercase",
};

const heroSubtitle: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 500,
  color: "#d4af37",
  margin: 0,
  marginBottom: 48,
  letterSpacing: 4,
};

const heroInfo: React.CSSProperties = {
  marginBottom: 48,
};

const heroDate: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 12,
  letterSpacing: 1,
};

const heroLocation: React.CSSProperties = {
  fontSize: 18,
  opacity: 0.9,
  marginBottom: 6,
};

const heroCity: React.CSSProperties = {
  fontSize: 16,
  opacity: 0.8,
};

const ctaButton: React.CSSProperties = {
  padding: "20px 60px",
  fontSize: 18,
  fontWeight: 700,
  background: "#d4af37",
  color: "#0f1729",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  letterSpacing: 2,
  textTransform: "uppercase",
  boxShadow: "0 6px 24px rgba(212,175,55,0.4)",
  transition: "all 0.3s",
  animation: "pulse 2s infinite",
};

const section: React.CSSProperties = {
  padding: "80px 20px",
  background: "#0f1729",
};

const sectionDark: React.CSSProperties = {
  padding: "80px 20px",
  background: "#1a2847",
};

const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 40,
  fontWeight: 700,
  textAlign: "center",
  marginBottom: 24,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "#d4af37",
};

const sectionSubtitle: React.CSSProperties = {
  fontSize: 16,
  textAlign: "center",
  marginBottom: 48,
  opacity: 0.8,
};

const hotelSubtitle: React.CSSProperties = {
  fontSize: 18,
  textAlign: "center",
  marginBottom: 48,
  opacity: 0.9,
  fontWeight: 500,
};

const presidentCard: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
  padding: 48,
  background: "rgba(26,40,71,0.6)",
  border: "2px solid rgba(212,175,55,0.3)",
  borderRadius: 12,
  backdropFilter: "blur(10px)",
};

const presidentText: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.8,
  marginBottom: 24,
  opacity: 0.95,
};

const presidentSignature: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 32,
  marginTop: 48,
  paddingTop: 32,
  borderTop: "1px solid rgba(212,175,55,0.3)",
};

const signatureLine: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  textAlign: "center",
  fontSize: 14,
};

const priceNotice: React.CSSProperties = {
  textAlign: "center",
  padding: 20,
  background: "rgba(212,175,55,0.15)",
  border: "1px solid #d4af37",
  borderRadius: 8,
  marginBottom: 40,
  fontSize: 16,
  lineHeight: 1.8,
  maxWidth: 700,
  margin: "0 auto 40px",
};

const priceTableWrapper: React.CSSProperties = {
  overflowX: "auto",
  borderRadius: 12,
  border: "2px solid rgba(212,175,55,0.3)",
};

const priceTable: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  background: "rgba(15,23,41,0.8)",
};

const priceTableHeader: React.CSSProperties = {
  padding: 20,
  background: "#d4af37",
  color: "#0f1729",
  fontWeight: 700,
  fontSize: 13,
  textAlign: "center",
  letterSpacing: 1,
  textTransform: "uppercase",
  borderRight: "1px solid rgba(15,23,41,0.2)",
};

const priceTableRow: React.CSSProperties = {
  borderBottom: "1px solid rgba(212,175,55,0.2)",
};

const priceTableCellLabel: React.CSSProperties = {
  padding: 20,
  fontWeight: 700,
  fontSize: 16,
  textAlign: "left",
  paddingLeft: 32,
  borderRight: "1px solid rgba(212,175,55,0.2)",
};

const priceTableCell: React.CSSProperties = {
  padding: 20,
  textAlign: "center",
  fontSize: 18,
  fontWeight: 600,
  color: "#d4af37",
  borderRight: "1px solid rgba(212,175,55,0.2)",
};

const feeNote: React.CSSProperties = {
  textAlign: "center",
  marginTop: 24,
  fontSize: 14,
  fontStyle: "italic",
  opacity: 0.7,
};

const eventsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 32,
  marginTop: 48,
};

const eventCard: React.CSSProperties = {
  padding: 32,
  background: "rgba(26,40,71,0.6)",
  border: "2px solid #d4af37",
  borderRadius: 12,
  transition: "all 0.3s",
};

const eventHeader: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 12,
  color: "#d4af37",
  textAlign: "center",
};

const eventTime: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.7,
  marginBottom: 24,
  textAlign: "center",
};

const eventPrices: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const eventPriceRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 16px",
  background: "rgba(212,175,55,0.1)",
  borderRadius: 6,
  fontSize: 16,
};

const photoGallery: React.CSSProperties = {
  marginBottom: 48,
};

const photoMain: React.CSSProperties = {
  width: "100%",
  height: 500,
  borderRadius: 12,
  overflow: "hidden",
  marginBottom: 16,
  border: "3px solid #d4af37",
};

const photoMainImg: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const photoThumbs: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 12,
};

const photoThumb: React.CSSProperties = {
  height: 120,
  borderRadius: 8,
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.3s",
};

const photoThumbImg: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const hotelInfoBox: React.CSSProperties = {
  maxWidth: 800,
  margin: "48px auto",
  padding: 40,
  background: "rgba(15,23,41,0.8)",
  border: "2px solid #d4af37",
  borderRadius: 12,
  textAlign: "center",
};

const hotelTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 20,
  color: "#d4af37",
  letterSpacing: 1,
};

const hotelRate: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.8,
  marginBottom: 32,
};

const hotelFeaturesList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginBottom: 32,
  maxWidth: 500,
  margin: "0 auto 32px",
};

const hotelFeatureItem: React.CSSProperties = {
  padding: 14,
  background: "rgba(212,175,55,0.1)",
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 500,
  border: "1px solid rgba(212,175,55,0.3)",
  textAlign: "left",
};

const hotelContact: React.CSSProperties = {
  padding: 32,
  background: "rgba(212,175,55,0.1)",
  borderRadius: 8,
  border: "2px solid #d4af37",
};

const ctaSection: React.CSSProperties = {
  padding: "120px 20px",
  textAlign: "center",
  background: "linear-gradient(180deg, #1a2847 0%, #0f1729 100%)",
};

const ctaTitle: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 700,
  marginBottom: 16,
  letterSpacing: 2,
};

const ctaText: React.CSSProperties = {
  fontSize: 20,
  marginBottom: 48,
  opacity: 0.9,
};

const ctaButtonLarge: React.CSSProperties = {
  padding: "24px 80px",
  fontSize: 22,
  fontWeight: 700,
  background: "#d4af37",
  color: "#0f1729",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  letterSpacing: 2,
  textTransform: "uppercase",
  boxShadow: "0 8px 32px rgba(212,175,55,0.5)",
  transition: "all 0.3s",
  animation: "pulse 2s infinite",
};

const footer: React.CSSProperties = {
  padding: 40,
  textAlign: "center",
  background: "#0a0f1c",
  borderTop: "1px solid rgba(212,175,55,0.3)",
  fontSize: 14,
};
