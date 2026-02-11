"use client";

import Link from "next/link";
import { Orbitron } from "next/font/google";

/* ===== FONT TRON ===== */
const tronFont = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/* ===== COMPONENT ===== */
export default function ZetaGrid2() {
  return (
    <main
      className={tronFont.className}
      style={{
        ...main,
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
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
          <h1 style={title}>Zeta'sGrid 2.0</h1>
          <h2 style={subtitle}>TrowBack WelcomeNewbi Show</h2>
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
              <span style={priceLabel}>All Newbi's</span>
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

const title = {
  fontFamily: "'Orbitron', sans-serif",
  fontSize: 56,
  letterSpacing: 6,
  textTransform: "uppercase" as const,
  color: "#ff1744",
  textShadow: "0 0 30px rgba(255, 23, 68, 0.7)",
  marginBottom: 12,
};

const subtitle = {
  fontFamily: "'Orbitron', sans-serif",
  fontSize: 32,
  letterSpacing: 3,
  marginBottom: 8,
  color: "#ff5722",
  opacity: 0.95,
  textShadow: "0 0 20px rgba(255, 87, 34, 0.5)",
};

const org = {
  fontSize: 16,
  letterSpacing: 2,
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
