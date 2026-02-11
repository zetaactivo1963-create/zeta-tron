"use client";

import Link from "next/link";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// EVENTOS - Aquí agregas/editas los eventos fácilmente
const EVENTOS = [
  {
    slug: "zeta-grid-2",
    title: "Zeta's Grid 2.0",
    subtitle: "TrowBack WelcomeNewbie Show",
    date: "Viernes 6 de marzo 2026",
    time: "7:00 PM",
    location: "Bambalinas Música & Teatro",
    city: "Aguada, PR",
    priceFrom: 15,
    image: "/eventos/zeta-grid-2.jpg", // Pon tus imágenes en /public/eventos/
    organization: "Phi Sigma Alpha - Capítulo Zeta",
    featured: true,
  },
  // Agrega más eventos aquí:
  // {
  //   slug: "otro-evento",
  //   title: "Nombre del Evento",
  //   ...
  // },
];

export default function Home() {
  return (
    <main className={rajdhani.className} style={main}>
      {/* HEADER */}
      <header style={header}>
        <div style={headerContent}>
          <Link href="/" style={logo}>
            <h1 style={logoText}>TICKETEDY</h1>
            <p style={logoSubtext}>Eventos & Ticketing</p>
          </Link>
          
          <nav style={nav}>
            <Link href="/admin" style={navLink}>
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={hero}>
        <div style={heroContent}>
          <h2 style={heroTitle}>
            Descubre los mejores eventos
          </h2>
          <p style={heroSubtitle}>
            Compra tus boletos de forma fácil y segura
          </p>
        </div>
      </section>

      {/* EVENTOS GRID */}
      <section style={eventsSection}>
        <div style={container}>
          {EVENTOS.length === 0 ? (
            <div style={emptyState}>
              <p style={emptyText}>No hay eventos disponibles en este momento.</p>
              <p style={emptySubtext}>¡Vuelve pronto para ver próximos eventos!</p>
            </div>
          ) : (
            <div style={eventsGrid}>
              {EVENTOS.map((evento) => (
                <Link 
                  key={evento.slug} 
                  href={`/eventos/${evento.slug}`}
                  style={eventCard}
                >
                  {/* Imagen del evento */}
                  <div style={eventImage}>
                    {evento.featured && (
                      <div style={featuredBadge}>
                        ⭐ Destacado
                      </div>
                    )}
                    <div style={eventImagePlaceholder}>
                      📅
                    </div>
                  </div>

                  {/* Contenido */}
                  <div style={eventContent}>
                    <div style={eventOrg}>{evento.organization}</div>
                    
                    <h3 style={eventTitle}>{evento.title}</h3>
                    
                    {evento.subtitle && (
                      <p style={eventSubtitle}>{evento.subtitle}</p>
                    )}

                    <div style={eventDetails}>
                      <div style={eventDetail}>
                        <span style={eventIcon}>📅</span>
                        <span>{evento.date}</span>
                      </div>
                      <div style={eventDetail}>
                        <span style={eventIcon}>🕒</span>
                        <span>{evento.time}</span>
                      </div>
                      <div style={eventDetail}>
                        <span style={eventIcon}>📍</span>
                        <span>{evento.location}, {evento.city}</span>
                      </div>
                    </div>

                    <div style={eventFooter}>
                      <div style={eventPrice}>
                        Desde <strong>${evento.priceFrom}</strong>
                      </div>
                      <div style={eventButton}>
                        Ver detalles →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        <div style={container}>
          <div style={footerContent}>
            <div style={footerSection}>
              <h4 style={footerTitle}>TICKETEDY</h4>
              <p style={footerText}>
                Plataforma de venta de boletos para eventos en Puerto Rico
              </p>
            </div>
            
            <div style={footerSection}>
              <h4 style={footerTitle}>Contacto</h4>
              <p style={footerText}>
                Email: info@ticketedy.com
              </p>
            </div>
            
            <div style={footerSection}>
              <h4 style={footerTitle}>Enlaces</h4>
              <Link href="/admin" style={footerLink}>
                Acceso Admin
              </Link>
            </div>
          </div>
          
          <div style={footerBottom}>
            <p style={footerCopy}>
              © 2026 Ticketedy. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ==================== STYLES ==================== */

const main: React.CSSProperties = {
  minHeight: "100vh",
  background: "#fafafa",
  color: "#1a1a1a",
};

const header: React.CSSProperties = {
  background: "#fff",
  borderBottom: "1px solid #e0e0e0",
  padding: "20px 0",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const headerContent: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logo: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const logoText: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  margin: 0,
  letterSpacing: 1,
  color: "#2563eb",
};

const logoSubtext: React.CSSProperties = {
  fontSize: 12,
  margin: 0,
  marginTop: 2,
  color: "#666",
  fontWeight: 500,
};

const nav: React.CSSProperties = {
  display: "flex",
  gap: 24,
  alignItems: "center",
};

const navLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#666",
  fontSize: 15,
  fontWeight: 500,
  transition: "color 0.2s",
};

const hero: React.CSSProperties = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "80px 24px",
  textAlign: "center",
  color: "#fff",
};

const heroContent: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
};

const heroTitle: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 700,
  margin: 0,
  marginBottom: 16,
  letterSpacing: 0.5,
};

const heroSubtitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 400,
  margin: 0,
  opacity: 0.95,
};

const eventsSection: React.CSSProperties = {
  padding: "60px 24px",
  minHeight: "60vh",
};

const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

const eventsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 32,
};

const eventCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  textDecoration: "none",
  color: "inherit",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
};

const eventImage: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 200,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const featuredBadge: React.CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  background: "#fbbf24",
  color: "#000",
  padding: "6px 12px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 700,
};

const eventImagePlaceholder: React.CSSProperties = {
  fontSize: 64,
  opacity: 0.3,
};

const eventContent: React.CSSProperties = {
  padding: 24,
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const eventOrg: React.CSSProperties = {
  fontSize: 12,
  color: "#666",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 1,
  marginBottom: 8,
};

const eventTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  margin: 0,
  marginBottom: 6,
  color: "#1a1a1a",
};

const eventSubtitle: React.CSSProperties = {
  fontSize: 14,
  color: "#666",
  margin: 0,
  marginBottom: 16,
};

const eventDetails: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  marginBottom: 20,
  flex: 1,
};

const eventDetail: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  color: "#444",
};

const eventIcon: React.CSSProperties = {
  fontSize: 16,
};

const eventFooter: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: 16,
  borderTop: "1px solid #e0e0e0",
};

const eventPrice: React.CSSProperties = {
  fontSize: 16,
  color: "#2563eb",
  fontWeight: 600,
};

const eventButton: React.CSSProperties = {
  fontSize: 14,
  color: "#2563eb",
  fontWeight: 600,
};

const emptyState: React.CSSProperties = {
  textAlign: "center",
  padding: "80px 24px",
};

const emptyText: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  color: "#666",
  margin: 0,
  marginBottom: 12,
};

const emptySubtext: React.CSSProperties = {
  fontSize: 16,
  color: "#999",
  margin: 0,
};

const footer: React.CSSProperties = {
  background: "#1a1a1a",
  color: "#fff",
  padding: "60px 24px 24px",
  marginTop: 80,
};

const footerContent: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 40,
  marginBottom: 40,
};

const footerSection: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const footerTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  marginBottom: 8,
  letterSpacing: 1,
};

const footerText: React.CSSProperties = {
  fontSize: 14,
  color: "#999",
  margin: 0,
  lineHeight: 1.6,
};

const footerLink: React.CSSProperties = {
  fontSize: 14,
  color: "#999",
  textDecoration: "none",
  transition: "color 0.2s",
};

const footerBottom: React.CSSProperties = {
  paddingTop: 24,
  borderTop: "1px solid #333",
  textAlign: "center",
};

const footerCopy: React.CSSProperties = {
  fontSize: 13,
  color: "#666",
  margin: 0,
};
