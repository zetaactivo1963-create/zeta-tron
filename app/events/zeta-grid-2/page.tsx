"use client";

import Link from "next/link";
import { Rajdhani } from "next/font/google";

const robotFont = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function ZetaGrid2() {
  return (
    <main className={robotFont.className} style={main}>
      <style>{globalCSS}</style>

      {/* VIDEO */}
      <video autoPlay loop muted playsInline style={videoBg}>
        <source src="/videos/bgg.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div style={overlay}>
        {/* HEADER */}
        <Link href="/" style={homeBtn}>
          <span style={homeArrow}>←</span>
          <span>Home</span>
        </Link>

        {/* CONTENT */}
        <div style={content}>
          <div style={titleWrapper}>
            <h1 style={title}>ZETA'S</h1>
            <h1 style={titleGrid}>GRID 2.0</h1>
          </div>
          <h2 style={subtitle}>TrowBack WelcomeNewbie Show</h2>
          <h3 style={org}>PHI SIGMA ALPHA · Capítulo Zeta</h3>

          {/* INFO */}
          <div style={infoBox}>
            <p style={infoText}>📅 Viernes 6 de marzo 2026 · 7:00 PM</p>
            <p style={infoText}>📍 Bambalinas Música & Teatro</p>
            <p style={infoText}>Aguada, Puerto Rico</p>
          </div>

          {/* PRECIOS (sin botón) */}
          <div style={pricesSection}>
            <div style={pricesList}>
              <div style={priceRow}>
                <span style={priceLabel}>All Newbie's</span>
                <span style={priceValue}>$15</span>
              </div>
              <div style={priceRow}>
                <span style={priceLabel}>Pre-venta</span>
                <span style={priceValue}>$20</span>
              </div>
              <div style={priceRow}>
                <span style={priceLabel}>Entrada</span>
                <span style={priceValue}>$25</span>
              </div>
            </div>
          </div>

          {/* OPEN BAR (sin botón) */}
          <div style={openBarSection}>
            <span style={openBarText}>🍹 OPEN BAR 🍹</span>
          </div>

          <Link href="/compra">
            <button style={buyBtn}>Comprar taquillas</button>
          </Link>

          <Link href="/admin" style={adminLink}>
            Acceso directiva
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ==================== STYLES ==================== */

const globalCSS = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
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
  background: "radial-gradient(circle at top, rgba(255, 87, 34, 0.15), #000 70%)",
  color: "#ffe6e6",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "20px",
};

const homeBtn: React.CSSProperties = {
  position: "absolute",
  top: 20,
  left: 20,
  color: "#ffccbc",
  fontSize: 15,
  textDecoration: "none",
  opacity: 0.9,
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontWeight: 500,
  transition: "all 0.2s",
};

const homeArrow: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
};

const content: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: 700,
};

const titleWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: 8,
};

const title: React.CSSProperties = {
  fontSize: 72,
  fontWeight: 700,
  letterSpacing: 12,
  textTransform: "uppercase",
  color: "#ff1744",
  textShadow: "0 0 40px rgba(255, 23, 68, 0.8), 0 0 20px rgba(255, 23, 68, 0.5)",
  margin: 0,
  lineHeight: 0.9,
};

const titleGrid: React.CSSProperties = {
  fontSize: 72,
  fontWeight: 700,
  letterSpacing: 12,
  textTransform: "uppercase",
  color: "#ff1744",
  textShadow: "0 0 40px rgba(255, 23, 68, 0.8), 0 0 20px rgba(255, 23, 68, 0.5)",
  margin: 0,
  lineHeight: 0.9,
};

const subtitle: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 500,
  letterSpacing: 4,
  marginBottom: 8,
  color: "#ff5722",
  opacity: 0.95,
  textShadow: "0 0 25px rgba(255, 87, 34, 0.6)",
};

const org: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 400,
  letterSpacing: 3,
  opacity: 0.8,
  marginBottom: 40,
};

const infoBox: React.CSSProperties = {
  marginBottom: 32,
  padding: "16px 24px",
  background: "rgba(0, 0, 0, 0.4)",
  borderRadius: 12,
  border: "1px solid rgba(255, 87, 34, 0.3)",
};

const infoText: React.CSSProperties = {
  fontSize: 15,
  marginBottom: 6,
  letterSpacing: 1,
};

const pricesSection: React.CSSProperties = {
  marginBottom: 24,
  width: "100%",
  maxWidth: 500,
};

const pricesList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: "20px",
  background: "rgba(0,0,0,0.3)",
  borderRadius: 12,
  border: "1px solid rgba(255,87,34,0.2)",
};

const priceRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
};

const priceLabel: React.CSSProperties = {
  fontSize: 16,
  opacity: 0.9,
  letterSpacing: 1,
  color: "#ffccbc",
};

const priceValue: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: "#ff5722",
  textShadow: "0 0 15px rgba(255, 87, 34, 0.6)",
};

const openBarSection: React.CSSProperties = {
  marginBottom: 36,
  padding: "12px 28px",
  background: "rgba(255,87,34,0.1)",
  borderRadius: 8,
  border: "1px solid rgba(255,87,34,0.3)",
};

const openBarText: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: 4,
  color: "#fff",
  textShadow: "0 0 20px rgba(255, 87, 34, 0.7)",
  animation: "pulse 2s ease-in-out infinite",
};

const buyBtn: React.CSSProperties = {
  background: "#ff5722",
  color: "#000",
  padding: "16px 48px",
  fontSize: 18,
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  marginBottom: 24,
  fontWeight: 700,
  letterSpacing: 2,
  boxShadow: "0 0 30px rgba(255, 87, 34, 0.6)",
  transition: "all 0.3s ease",
};

const adminLink: React.CSSProperties = {
  fontSize: 12,
  color: "#ffccbc",
  textDecoration: "none",
  letterSpacing: 1,
  opacity: 0.75,
  borderBottom: "1px solid rgba(255, 204, 188, 0.4)",
  paddingBottom: 2,
};
