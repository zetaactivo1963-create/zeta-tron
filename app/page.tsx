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

// EVENTOS
const EVENTOS = [
  {
    slug: "zeta-grid-2",
    title: "Zeta's Grid 2.0",
    subtitle: "ThrowBack WelcomeNewbies Show",
    date: "Vie. 27 de febrero, 2026",
    time: "7:00 PM",
    location: "Bambalinas Música & Teatro",
    city: "Aguada, PR",
    priceFrom: 20,
    organization: "PHI SIGMA ALPHA · ZETA",
    category: "GREEK LIFE",
    image: "/eventos/zeta-grid-2.jpg",
    featured: true,
  },
];

export default function Home() {
  return (
    <>
      <style>{responsiveCSS}</style>
      <main className={inter.className} style={main}>
        {/* HEADER */}
        <header style={header}>
          <div style={headerContent}>
            <Link href="/" style={logo}>
              <div style={logoIcon}>🎫</div>
              <div>
                <div className={rajdhani.className} style={logoText}>TICKETEDY</div>
                <div style={logoSubtext}>Event Ticketing</div>
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
                <p style={emptyText}>No events available</p>
                <p style={emptySubtext}>Check back soon!</p>
              </div>
            ) : (
              <div style={eventsGrid}>
                {EVENTOS.map((evento) => (
                  <Link 
                    key={evento.slug} 
                    href={`/events/${evento.slug}`}
                    className="ticket-card"
                  >
                    {/* Background */}
                    <div className="ticket-bg"></div>

                    {/* Left perforations */}
                    <div className="ticket-perforations ticket-perforations-left">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="perforation"></div>
                      ))}
                    </div>

                    {/* Content */}
                    <div className="ticket-main">
                      {evento.featured && (
                        <div className="featured-badge">⭐ FEATURED</div>
                      )}
                      
                      <div className="ticket-header">
                        <div className="ticket-org">{evento.organization}</div>
                      </div>

                      <h3 className={`${rajdhani.className} ticket-title`}>
                        {evento.title}
                      </h3>
                      
                      {evento.subtitle && (
                        <p className="ticket-subtitle">{evento.subtitle}</p>
                      )}

                      <div className="ticket-details">
                        <div className="ticket-detail">
                          <span>📅</span>
                          <div>
                            <div className="detail-label">DATE</div>
                            <div className="detail-value">{evento.date}</div>
                          </div>
                        </div>

                        <div className="ticket-detail">
                          <span>🕒</span>
                          <div>
                            <div className="detail-label">TIME</div>
                            <div className="detail-value">{evento.time}</div>
                          </div>
                        </div>
                      </div>

                      <div className="ticket-detail">
                        <span>📍</span>
                        <div>
                          <div className="detail-label">VENUE</div>
                          <div className="detail-value">{evento.location}</div>
                          <div className="detail-sub">{evento.city}</div>
                        </div>
                      </div>

                      <div className="ticket-footer">
                        <div>
                          <div className="price-label">FROM</div>
                          <div className={`${rajdhani.className} price-value`}>
                            ${evento.priceFrom}
                          </div>
                        </div>
                        <div className="get-tickets-btn">
                          GET TICKETS →
                        </div>
                      </div>
                    </div>

                    {/* Right perforations */}
                    <div className="ticket-perforations ticket-perforations-right">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="perforation"></div>
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
                  <h4 style={footerSectionTitle}>Contact</h4>
                  <a href="mailto:djedypr@gmail.com" style={footerLink}>info@ticketedy.com</a>
                </div>
              </div>
            </div>

            <div style={footerBottom}>
              <p style={footerCopy}>© 2026 Ticketedy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

/* ==================== STYLES ==================== */

const responsiveCSS = `
  .ticket-card {
    position: relative;
    background: linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.95) 100%);
    borderRadius: 16px;
    overflow: hidden;
    display: flex;
    text-decoration: none;
    color: inherit;
    border: 1px solid rgba(255,255,255,0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    min-height: 280px;
  }

  .ticket-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(139,92,246,0.2);
  }

  .ticket-bg {
    position: absolute;
    inset: 0;
    background-image: url('/eventos/zeta-grid-2.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    z-index: 0;
  }

  .ticket-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(10,10,10,0.95) 60%, rgba(10,10,10,0.7) 100%);
  }

  .ticket-perforations {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background: rgba(0,0,0,0.5);
    z-index: 1;
  }

  .ticket-perforations-left { left: 0; }
  .ticket-perforations-right { right: 0; }

  .perforation {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0a0a0a;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .ticket-main {
    position: relative;
    z-index: 1;
    flex: 1;
    padding: 28px 44px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .featured-badge {
    position: absolute;
    top: 16px;
    right: 32px;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #000;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    z-index: 2;
  }

  .ticket-header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ticket-org {
    font-size: 11px;
    color: #888;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .ticket-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    color: #fff;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }

  .ticket-subtitle {
    font-size: 14px;
    color: #aaa;
    margin: 0;
    margin-top: -6px;
  }

  .ticket-details {
    display: flex;
    gap: 20px;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .ticket-detail {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  .ticket-detail span {
    font-size: 18px;
    margin-top: 2px;
  }

  .detail-label {
    font-size: 9px;
    color: #666;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .detail-value {
    font-size: 14px;
    color: #e0e0e0;
    font-weight: 600;
    line-height: 1.3;
  }

  .detail-sub {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }

  .ticket-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .price-label {
    font-size: 10px;
    color: #666;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .price-value {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .get-tickets-btn {
    padding: 12px 28px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    border-radius: 8px;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba(139,92,246,0.3);
  }

  /* MOBILE */
  @media (max-width: 640px) {
    .ticket-card {
      min-height: auto;
      flex-direction: column;
    }

    .ticket-perforations {
      display: none;
    }

    .ticket-main {
      padding: 24px 20px;
      gap: 12px;
    }

    .featured-badge {
      top: 16px;
      right: 16px;
      font-size: 9px;
      padding: 5px 10px;
    }

    .ticket-title {
      font-size: 22px;
    }

    .ticket-subtitle {
      font-size: 13px;
    }

    .ticket-details {
      gap: 16px;
    }

    .detail-value {
      font-size: 13px;
    }

    .price-value {
      font-size: 28px;
    }

    .get-tickets-btn {
      padding: 10px 20px;
      font-size: 12px;
    }
  }
`;

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
  padding: "80px 24px 60px",
  textAlign: "center",
  background: "linear-gradient(180deg, rgba(139,92,246,0.08) 0%, rgba(10,10,10,0) 100%)",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const heroContent: React.CSSProperties = {
  maxWidth: 800,
  margin: "0 auto",
};

const heroTitle: React.CSSProperties = {
  fontSize: 48,
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
  fontSize: 16,
  color: "#999",
  margin: 0,
  fontWeight: 400,
};

const eventsSection: React.CSSProperties = {
  padding: "60px 24px",
  minHeight: "50vh",
};

const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

const sectionHeader: React.CSSProperties = {
  marginBottom: 40,
  position: "relative",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 28,
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

const emptyState: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 24px",
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
  padding: "40px 24px 24px",
  marginTop: 60,
};

const footerContent: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr",
  gap: 40,
  marginBottom: 30,
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
  display: "flex",
  flexDirection: "column",
  gap: 12,
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
  paddingTop: 20,
  borderTop: "1px solid rgba(255,255,255,0.08)",
};

const footerCopy: React.CSSProperties = {
  fontSize: 12,
  color: "#555",
  margin: 0,
  textAlign: "center",
};
