"use client";

import Link from "next/link";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function ZetaGrid2() {
  return (
    <>
      <style>{globalCSS}</style>
      <main className={rajdhani.className} style={main}>
        {/* VIDEO */}
        <video autoPlay loop muted playsInline style={videoBg}>
          <source src="/videos/bgg.mp4" type="video/mp4" />
        </video>

        {/* OVERLAY */}
        <div style={overlay}>
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
            <div style={titleWrapper}>
              <h1 style={title}>ZETA'S</h1>
              <h1 style={titleGrid}>GRID 2.0</h1>
            </div>
            
            <h2 style={subtitle}>TrowBack WelcomeNewbie Show</h2>
            <h3 style={org}>PHI SIGMA ALPHA · Capítulo Zeta</h3>

            {/* INFO */}
            <div style={infoCard}>
              <div style={infoRow}>
                <span style={infoIcon}>📅</span>
                <span style={infoText}>Viernes 27 de febrero 2026 · 7:00 PM</span>
              </div>
              <div style={infoRow}>
                <span style={infoIcon}>📍</span>
                <div>
                  <div style={infoText}>Bambalinas Música & Teatro</div>
                  <div style={infoSubtext}>Aguada, Puerto Rico</div>
                </div>
              </div>
            </div>

            {/* NOTICE */}
            <div style={noticeBox}>
              <p style={noticeText}>Evento solo para Fraternos ΦΣΑ y damas</p>
            </div>

            {/* PRECIOS */}
            <div style={pricesCard}>
              <div style={priceItem}>
                <div style={priceInfo}>
                  <div style={priceLabel}>All Newbie's</div>
                  <div style={priceDesc}>Precio especial para nuevos</div>
                </div>
                <div style={priceAmount}>$15</div>
              </div>
              
              <div style={priceDivider}></div>
              
              <div style={priceItem}>
                <div style={priceInfo}>
                  <div style={priceLabel}>Pre-venta</div>
                  <div style={priceDesc}>Compra anticipada</div>
                </div>
                <div style={priceAmount}>$20</div>
              </div>
              
              <div style={priceDivider}></div>
              
              <div style={priceItem}>
                <div style={priceInfo}>
                  <div style={priceLabel}>Entrada</div>
                  <div style={priceDesc}>Precio en puerta</div>
                </div>
                <div style={priceAmount}>$25</div>
              </div>
            </div>

            {/* OPEN BAR */}
            <div style={openBarBanner}>
              <div style={openBarGlow}></div>
              <span style={openBarText}>🍹 After Party OPEN BAR Incluido 🍹</span>
            </div>

            {/* CTA */}
            <Link href="/compra">
              <button style={buyBtn}>Comprar taquillas</button>
            </Link>

            <Link href="/admin" style={adminLink}>
              Acceso directiva
            </Link>
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
      transform: scale(1);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.02);
    }
  }
  
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(255,87,34,0.4), inset 0 0 20px rgba(255,87,34,0.1);
    }
    50% {
      box-shadow: 0 0 40px rgba(255,87,34,0.7), inset 0 0 30px rgba(255,87,34,0.2);
    }
  }
`;

const main: React.CSSProperties = {
  minHeight: "100vh",
  background: "#000",
  position: "relative",
  overflow: "hidden",
  fontFamily: "'Rajdhani', sans-serif",
};

const videoBg: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: 0,
};

const overlay: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  minHeight: "100vh",
  background: "radial-gradient(circle at top, rgba(255, 87, 34, 0.12), #000 70%)",
  display: "flex",
  flexDirection: "column",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  background: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(8px)",
  borderBottom: "1px solid rgba(255,87,34,0.2)",
};

const homeLink: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#ffccbc",
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
  color: "#ffe6e6",
};

const titleWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: 12,
};

const title: React.CSSProperties = {
  fontSize: 64,
  fontWeight: 700,
  letterSpacing: 10,
  textTransform: "uppercase",
  color: "#ff1744",
  textShadow: "0 0 30px rgba(255, 23, 68, 0.8), 0 0 15px rgba(255, 23, 68, 0.5)",
  margin: 0,
  lineHeight: 0.9,
};

const titleGrid: React.CSSProperties = {
  fontSize: 64,
  fontWeight: 700,
  letterSpacing: 10,
  textTransform: "uppercase",
  color: "#ff1744",
  textShadow: "0 0 30px rgba(255, 23, 68, 0.8), 0 0 15px rgba(255, 23, 68, 0.5)",
  margin: 0,
  lineHeight: 0.9,
};

const subtitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 500,
  letterSpacing: 3,
  marginBottom: 8,
  color: "#ff5722",
  opacity: 0.95,
  textShadow: "0 0 20px rgba(255, 87, 34, 0.6)",
};

const org: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 400,
  letterSpacing: 2,
  opacity: 0.8,
  marginBottom: 32,
};

const infoCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: "20px 28px",
  background: "rgba(0, 0, 0, 0.5)",
  borderRadius: 12,
  border: "1px solid rgba(255, 87, 34, 0.3)",
  marginBottom: 20,
  maxWidth: 500,
  width: "100%",
};

const infoRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  textAlign: "left",
};

const infoIcon: React.CSSProperties = {
  fontSize: 20,
  flexShrink: 0,
};

const infoText: React.CSSProperties = {
  fontSize: 15,
  letterSpacing: 0.5,
  fontWeight: 500,
};

const infoSubtext: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.8,
  marginTop: 2,
};

const noticeBox: React.CSSProperties = {
  padding: "12px 20px",
  background: "rgba(255,87,34,0.1)",
  border: "1px solid rgba(255,87,34,0.3)",
  borderRadius: 8,
  marginBottom: 24,
  maxWidth: 500,
  width: "100%",
};

const noticeText: React.CSSProperties = {
  fontSize: 13,
  margin: 0,
  letterSpacing: 0.5,
  opacity: 0.9,
};

const pricesCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "24px",
  background: "rgba(0,0,0,0.6)",
  borderRadius: 12,
  border: "1px solid rgba(255,87,34,0.3)",
  marginBottom: 24,
  maxWidth: 500,
  width: "100%",
  backdropFilter: "blur(10px)",
};

const priceItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
};

const priceInfo: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 4,
};

const priceLabel: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: 0.5,
  color: "#ffe6e6",
};

const priceDesc: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.7,
  letterSpacing: 0.5,
};

const priceAmount: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: "#ff5722",
  textShadow: "0 0 15px rgba(255, 87, 34, 0.6)",
  letterSpacing: 1,
};

const priceDivider: React.CSSProperties = {
  height: 1,
  background: "rgba(255,87,34,0.2)",
  margin: "4px 0",
};

const openBarBanner: React.CSSProperties = {
  position: "relative",
  padding: "16px 32px",
  background: "rgba(255,87,34,0.15)",
  borderRadius: 12,
  border: "2px solid rgba(255,87,34,0.4)",
  marginBottom: 32,
  maxWidth: 500,
  width: "100%",
  overflow: "hidden",
  animation: "glow 2s ease-in-out infinite",
};

const openBarGlow: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(circle, rgba(255,87,34,0.3) 0%, transparent 70%)",
  animation: "pulse 3s ease-in-out infinite",
};

const openBarText: React.CSSProperties = {
  position: "relative",
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: 2,
  color: "#fff",
  textShadow: "0 0 20px rgba(255, 87, 34, 0.9)",
  display: "block",
};

const buyBtn: React.CSSProperties = {
  background: "#ff5722",
  color: "#000",
  padding: "16px 56px",
  fontSize: 18,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  marginBottom: 20,
  fontWeight: 700,
  letterSpacing: 2,
  boxShadow: "0 0 30px rgba(255, 87, 34, 0.6)",
  transition: "all 0.3s ease",
  textTransform: "uppercase",
};

const adminLink: React.CSSProperties = {
  fontSize: 13,
  color: "#ffccbc",
  textDecoration: "none",
  letterSpacing: 0.5,
  opacity: 0.75,
  borderBottom: "1px solid rgba(255, 204, 188, 0.3)",
  paddingBottom: 2,
};
