"use client";

import Link from "next/link";
import { Rajdhani, Inter } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// EVENTOS - Aquí agregas/editas los eventos fácilmente
const EVENTOS = [
  {
    slug: "zeta-grid-2",
    title: "Zeta's Grid 2.0",
    subtitle: "TrowBack WelcomeNewbie Show",
    date: "6 de marzo, 2026",
    time: "7:00 PM",
    location: "Bambalinas Música & Teatro",
    city: "Aguada, PR",
    priceFrom: 15,
    organization: "PHI SIGMA ALPHA · ZETA",
    category: "GREEK LIFE",
    image: "/eventos/zeta-grid-2.jpg", // Pon imagen en /public/eventos/
    featured: true,
  },
  // Agrega más eventos aquí
];

export default function Home() {
  return (
    <main className={inter.className} style={main}>
      {/* HEADER */}
      <header style={header}>
        <div style={headerContent}>
          <Link href="/" style={logo}>
            <div style={logoIcon}>🎫</div>
            <div>
              <div className={rajdhani.className} style={logoText}>TICKETEDY</div>
              <div style={logoSubtext}>Event Ticketing Platform</div>
            </div>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section style={hero}>
        <div style={heroContent}>
          <h1 className={rajdhani.className} style={heroTitle}>
            Your Ticket to <span style={heroAccent}>Unforgettable</span> Events
          </h1>
          <p style={heroSubtitle}>
            Discover and secure your spot at the hottest events in Puerto Rico
          </p>
        </div>
      </section>

      {/* EVENTOS */}
      <section style={eventsSection}>
        <div style={container}>
          <div style={sectionHeader}>
            <h2 className={rajdhani.className} style={sectionTitle}>
              UPCOMING EVENTS
            </h2>
            <div style={sectionLine}></div>
          </div>

          {EVENTOS.length === 0 ? (
            <div style={emptyState}>
              <div style={emptyIcon}>🎫</div>
              <p style={emptyText}>No events available at the moment</p>
              <p style={emptySubtext}>Check back soon for upcoming events!</p>
            </div>
          ) : (
            <div style={eventsGrid}>
              {EVENTOS.map((evento) => (
                <Link 
                  key={evento.slug} 
                  href={`/events/${evento.slug}`}
                  style={ticketCard}
                >
                  {/* Background Image */}
                  <div style={ticketImageBg}>
                    <div style={ticketImageOverlay}></div>
                  </div>

                  {/* Ticket perforations on left */}
                  <div style={ticketPerforations}>
                    {[...Array(12)].map((_, i) => (
                      <div key={i} style={perforation}></div>
                    ))}
                  </div>

                  {/* Main ticket content */}
                  <div style={ticketMain}>
                    {evento.featured && (
                      <div style={featuredBadge}>⭐ FEATURED</div>
                    )}
                    
                    <div style={ticketHeader}>
                      <div style={categoryTag}>{evento.category}</div>
                      <div style={ticketOrg}>{evento.organization}</div>
                    </div>

                    <h3 className={rajdhani.className} style={ticketTitle}>
                      {evento.title}
                    </h3>
                    
                    {evento.subtitle && (
                      <p style={ticketSubtitle}>{evento.subtitle}</p>
                    )}

                    <div style={ticketDetails}>
                      <div style={ticketDetail}>
                        <span style={ticketDetailIcon}>📅</span>
                        <div>
                          <div style={ticketDetailLabel}>DATE</div>
                          <div style={ticketDetailValue}>{evento.date}</div>
                        </div>
                      </div>

                      <div style={ticketDetail}>
                        <span style={ticketDetailIcon}>🕒</span>
                        <div>
                          <div style={ticketDetailLabel}>TIME</div>
                          <div style={ticketDetailValue}>{evento.time}</div>
                        </div>
                      </div>
                    </div>

                    <div style={ticketDetail}>
                      <span style={ticketDetailIcon}>📍</span>
                      <div>
                        <div style={ticketDetailLabel}>VENUE</div>
                        <div style={ticketDetailValue}>{evento.location}</div>
                        <div style={ticketDetailSub}>{evento.city}</div>
                      </div>
                    </div>

                    <div style={ticketFooter}>
                      <div>
                        <div style={priceLabel}>FROM</div>
                        <div className={rajdhani.className} style={priceValue}>
                          ${evento.priceFrom}
                        </div>
                      </div>
                      <div style={getTicketsBtn}>
                        GET TICKETS →
                      </div>
                    </div>
                  </div>

                  {/* Perforations on right */}
                  <div style={{...ticketPerforations, right: 0, left: 'auto'}}>
                    {[...Array(12)].map((_, i) => (
                      <div key={i} style={perforation}></div>
                    ))}
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
            <div style={footerBrand}>
              <div style={footerLogo}>
                <div style={logoIcon}>🎫</div>
                <div className={rajdhani.className} style={footerLogoText}>
                  TICKETEDY
                </div>
              </div>
              <p style={footerDesc}>
                Premium event ticketing platform serving Puerto Rico's vibrant event scene.
              </p>
            </div>

            <div style={footerLinks}>
              <div style={footerSection}>
                <h4 style={footerSectionTitle}>Platform</h4>
                <a href="/admin" style={footerLink}>Admin Portal</a>
              </div>

              <div style={footerSection}>
                <h4 style={footerSectionTitle}>Support</h4>
                <a href="mailto:info@ticketedy.com" style={footerLink}>Contact Us</a>
              </div>
            </div>
          </div>

          <div style={footerBottom}>
            <p style={footerCopy}>© 2026 Ticketedy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ==================== STYLES ==================== */

const main: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0a0a0a",
  color: "#e0e0e0",
};

const header: React.CSSProperties = {
  background: "rgba(15,15,15,0.95)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  padding: "16px 0",
  position: "sticky",
  top: 0,
  zIndex: 100,
  backdropFilter: "blur(10px)",
};

const headerContent: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const logo: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
  color: "inherit",
};

const logoIcon: React.CSSProperties = {
  fontSize: 28,
};

const logoText: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: 2,
  color: "#fff",
  margin: 0,
  lineHeight: 1,
};

const logoSubtext: React.CSSProperties = {
  fontSize: 10,
  color: "#888",
  letterSpacing: 1,
  textTransform: "uppercase" as const,
  marginTop: 2,
};

const hero: React.CSSProperties = {
  padding: "100px 24px 80px",
  textAlign: "center",
  background: "linear-gradient(180deg, rgba(139,92,246,0.08) 0%, rgba(10,10,10,0) 100%)",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const heroContent: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
};

const heroTitle: React.CSSProperties = {
  fontSize: 56,
  fontWeight: 700,
  margin: 0,
  marginBottom: 20,
  letterSpacing: -1,
  lineHeight: 1.1,
  color: "#fff",
};

const heroAccent: React.CSSProperties = {
  background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const heroSubtitle: React.CSSProperties = {
  fontSize: 18,
  color: "#999",
  margin: 0,
  fontWeight: 400,
};

const eventsSection: React.CSSProperties = {
  padding: "80px 24px",
  minHeight: "60vh",
};

const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

const sectionHeader: React.CSSProperties = {
  marginBottom: 48,
  position: "relative",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  letterSpacing: 2,
  color: "#fff",
  margin: 0,
  marginBottom: 16,
};

const sectionLine: React.CSSProperties = {
  width: 80,
  height: 3,
  background: "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
  borderRadius: 2,
};

const eventsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 32,
  maxWidth: 900,
  margin: "0 auto",
};

const ticketCard: React.CSSProperties = {
  position: "relative",
  background: "linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.95) 100%)",
  borderRadius: 16,
  overflow: "hidden",
  display: "flex",
  textDecoration: "none",
  color: "inherit",
  border: "1px solid rgba(255,255,255,0.08)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  minHeight: 280,
};

const ticketImageBg: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: "url('/eventos/zeta-grid-2.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: 0.15,
  zIndex: 0,
};

const ticketImageOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(90deg, rgba(10,10,10,0.95) 60%, rgba(10,10,10,0.7) 100%)",
};

const ticketPerforations: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: 20,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  background: "rgba(0,0,0,0.5)",
  zIndex: 1,
};

const perforation: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.1)",
};

const ticketMain: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  flex: 1,
  padding: "28px 32px 28px 44px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const featuredBadge: React.CSSProperties = {
  position: "absolute",
  top: 20,
  right: 40,
  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
  color: "#000",
  padding: "6px 14px",
  borderRadius: 20,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1,
  zIndex: 2,
};

const ticketHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const categoryTag: React.CSSProperties = {
  background: "rgba(139,92,246,0.25)",
  border: "1px solid rgba(139,92,246,0.4)",
  color: "#c4b5fd",
  padding: "4px 10px",
  borderRadius: 4,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1,
};

const ticketOrg: React.CSSProperties = {
  fontSize: 11,
  color: "#888",
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: "uppercase" as const,
};

const ticketTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  margin: 0,
  color: "#fff",
  letterSpacing: 0.5,
  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
};

const ticketSubtitle: React.CSSProperties = {
  fontSize: 14,
  color: "#aaa",
  margin: 0,
  marginTop: -6,
};

const ticketDetails: React.CSSProperties = {
  display: "flex",
  gap: 24,
  marginTop: 4,
  flexWrap: "wrap",
};

const ticketDetail: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
};

const ticketDetailIcon: React.CSSProperties = {
  fontSize: 18,
  marginTop: 2,
};

const ticketDetailLabel: React.CSSProperties = {
  fontSize: 9,
  color: "#666",
  fontWeight: 700,
  letterSpacing: 1,
  marginBottom: 4,
  textTransform: "uppercase" as const,
};

const ticketDetailValue: React.CSSProperties = {
  fontSize: 14,
  color: "#e0e0e0",
  fontWeight: 600,
  lineHeight: 1.3,
};

const ticketDetailSub: React.CSSProperties = {
  fontSize: 12,
  color: "#999",
  marginTop: 2,
};

const ticketFooter: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "auto",
  paddingTop: 16,
  borderTop: "1px solid rgba(255,255,255,0.1)",
};

const priceLabel: React.CSSProperties = {
  fontSize: 10,
  color: "#666",
  fontWeight: 700,
  letterSpacing: 1,
  marginBottom: 4,
};

const priceValue: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const getTicketsBtn: React.CSSProperties = {
  padding: "12px 28px",
  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  borderRadius: 8,
  letterSpacing: 0.5,
  transition: "all 0.2s",
  boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
};

const emptyState: React.CSSProperties = {
  textAlign: "center",
  padding: "80px 24px",
};

const emptyIcon: React.CSSProperties = {
  fontSize: 64,
  marginBottom: 24,
  opacity: 0.3,
};

const emptyText: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: "#999",
  margin: 0,
  marginBottom: 8,
};

const emptySubtext: React.CSSProperties = {
  fontSize: 14,
  color: "#666",
  margin: 0,
};

const footer: React.CSSProperties = {
  background: "rgba(15,15,15,0.8)",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  padding: "60px 24px 24px",
  marginTop: 80,
};

const footerContent: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr",
  gap: 60,
  marginBottom: 40,
  maxWidth: 900,
};

const footerBrand: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const footerLogo: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const footerLogoText: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: 2,
  color: "#fff",
};

const footerDesc: React.CSSProperties = {
  fontSize: 14,
  color: "#666",
  margin: 0,
  lineHeight: 1.6,
  maxWidth: 400,
};

const footerLinks: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 32,
};

const footerSection: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const footerSectionTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1,
  color: "#999",
  margin: 0,
  marginBottom: 8,
  textTransform: "uppercase" as const,
};

const footerLink: React.CSSProperties = {
  fontSize: 14,
  color: "#666",
  textDecoration: "none",
  transition: "color 0.2s",
};

const footerBottom: React.CSSProperties = {
  paddingTop: 24,
  borderTop: "1px solid rgba(255,255,255,0.08)",
};

const footerCopy: React.CSSProperties = {
  fontSize: 12,
  color: "#555",
  margin: 0,
  textAlign: "center",
};
