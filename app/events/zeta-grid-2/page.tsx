"use client";

import Link from "next/link";
import { Rajdhani } from "next/font/google";

/* ===== FONTS ===== */
const robotFont = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/* ===== COMPONENT ===== */
export default function ZetaGrid2() {
  return (
    <main
      className={robotFont.className}
      style={{
        ...main,
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {/* GLOBAL CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(255, 87, 34, 0.5), inset 0 0 20px rgba(255, 23, 68, 0.2);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 60px rgba(255, 87, 34, 0.8), inset 0 0 30px rgba(255, 23, 68, 0.3);
            transform: scale(1.02);
          }
        }
      `}</style>

      {/* VIDEO DE FONDO */}
      <video autoPlay loop muted playsInline style={videoBg}>
        <source src="/videos/bgg.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div style={overlay}>
        {/* BOTÓN HOME */}
        <Link href="/" style={homeBtn}>
          ← Home
        </Link>

        {/* CONTENIDO */}
        <div style={content}>
          <div style={titleWrapper}>
            <h1 style={title}>ZETA'S</h1>
            <h1 style={titleGrid}>GRID 2.0</h1>
          </div>
          <h2 style={subtitle}>TrowBack WelcomeNewbie Show</h2>
          <h3 style={org}>PHI SIGMA ALPHA · Capítulo Zeta</h3>

          {/* INFO EVENTO */}
          <div style={infoBox}>
            <p style={infoText}>📅 Viernes 6 de marzo 2026 · 7:00 PM</p>
            <p style={infoText}>📍 Bambalinas Música & Teatro</p>
            <p style={infoText}>Aguada, Puerto Rico</p>
          </div>

          {/* PRECIOS */}
          <div style={priceBox}>
            <div style={priceItem}>
              <span style={priceLabel}>All Newbie's</span>
              <span style={priceValue}>$15</span>
            </div>
            <div style={priceItem}>
              <span style={priceLabel}>Pre-venta</span>
              <span style={priceValue}>$20</span>
            </div>
            <div style={priceItem}>
              <span style={priceLabel}>Entrada</span>
              <span style={priceValue}>$25</span>
            </div>
          </div>

          {/* OPEN BAR */}
          <div style={openBarBox}>
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

/* ===================== STYLES ===================== */

const main = {
  minHeight: "100vh",
  background: "#000",
  position: "relative" as const,
  overflow: "hidden",
};

const videoBg = {
  position: "fixed" as const,
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  zIndex: 0,
};

const overlay = {
  position: "relative" as const,
  zIndex: 1,
  minHeight: "100vh",
  background: "radial-gradient(circle at top, rgba(255, 87, 34, 0.15), #000 70%)",
  color: "#ffe6e6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  padding: "20px",
};

const homeBtn = {
  position: "absolute" as const,
  top: 20,
  left: 20,
  color: "#ffffff",
  fontSize: 14,
  textDecoration: "none",
  opacity: 0.85,
};

const content = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
};

const titleWrapper = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  marginBottom: 8,
};

const title = {
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: 72,
  fontWeight: 700,
  letterSpacing: 12,
  textTransform: "uppercase" as const,
  color: "#ff1744",
  textShadow: "0 0 40px rgba(255, 23, 68, 0.8), 0 0 20px rgba(255, 23, 68, 0.5)",
  margin: 0,
  lineHeight: 0.9,
};

const titleGrid = {
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: 72,
  fontWeight: 700,
  letterSpacing: 12,
  textTransform: "uppercase" as const,
  color: "#ff1744",
  textShadow: "0 0 40px rgba(255, 23, 68, 0.8), 0 0 20px rgba(255, 23, 68, 0.5)",
  margin: 0,
  lineHeight: 0.9,
};

const subtitle = {
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: 36,
  fontWeight: 500,
  letterSpacing: 4,
  marginBottom: 8,
  color: "#ff5722",
  opacity: 0.95,
  textShadow: "0 0 25px rgba(255, 87, 34, 0.6)",
};

const org = {
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: 17,
  fontWeight: 400,
  letterSpacing: 3,
  opacity: 0.8,
  marginBottom: 40,
};

const infoBox = {
  marginBottom: 32,
  padding: "16px 24px",
  background: "rgba(0, 0, 0, 0.4)",
  borderRadius: 12,
  border: "1px solid rgba(255, 87, 34, 0.3)",
};

const infoText = {
  fontSize: 15,
  marginBottom: 6,
  letterSpacing: 1,
};

const priceBox = {
  display: "flex",
  gap: "20px",
  marginBottom: 36,
  flexWrap: "wrap" as const,
  justifyContent: "center",
};

const priceItem = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  padding: "12px 24px",
  background: "rgba(255, 23, 68, 0.15)",
  borderRadius: 10,
  border: "1px solid rgba(255, 87, 34, 0.4)",
  minWidth: 100,
};

const priceLabel = {
  fontSize: 12,
  opacity: 0.75,
  marginBottom: 4,
  letterSpacing: 1,
};

const priceValue = {
  fontSize: 24,
  fontWeight: 700,
  color: "#ff5722",
  textShadow: "0 0 15px rgba(255, 87, 34, 0.6)",
};

const openBarBox = {
  marginTop: 8,
  marginBottom: 32,
  padding: "14px 32px",
  background: "linear-gradient(135deg, rgba(255, 23, 68, 0.25), rgba(255, 87, 34, 0.25))",
  borderRadius: 12,
  border: "2px solid #ff5722",
  boxShadow: "0 0 40px rgba(255, 87, 34, 0.5), inset 0 0 20px rgba(255, 23, 68, 0.2)",
  animation: "pulse 2s ease-in-out infinite",
};

const openBarText = {
  fontFamily: "'Rajdhani', sans-serif",
  fontSize: 32,
  fontWeight: 700,
  letterSpacing: 6,
  color: "#fff",
  textTransform: "uppercase" as const,
  textShadow: "0 0 30px rgba(255, 87, 34, 0.9), 0 0 15px rgba(255, 23, 68, 0.7)",
};

const buyBtn = {
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

const adminLink = {
  fontSize: 12,
  color: "#ffccbc",
  textDecoration: "none",
  letterSpacing: 1,
  opacity: 0.75,
  borderBottom: "1px solid rgba(255, 204, 188, 0.4)",
  paddingBottom: 2,
};
