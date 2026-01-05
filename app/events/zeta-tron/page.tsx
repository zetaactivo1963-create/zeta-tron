"use client";

import Link from "next/link";
import { Orbitron } from "next/font/google";

/* ===== FONT TRON ===== */
const tronFont = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/* ===== COMPONENT ===== */
export default function ZetaTron() {
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
          ⌂ Home
        </Link>

        {/* CONTENIDO */}
        <div style={content}>
          <h1 style={title}>Zeta's "Welcome to the Grid"</h1>
          <h2 style={chapter}>Show de Neófitos</h2>
          <h3 style={org}>PHI SIGMA ALPHA</h3>

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
  background: "radial-gradient(circle at top, rgba(0,255,255,0.15), #000 70%)",
  color: "#e6ffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
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
  fontSize: 52,
  letterSpacing: 6,
  textTransform: "uppercase" as const,
  color: "#ff5a1f",
  textShadow: "0 0 22px rgba(0,255,255,0.6)",
  marginBottom: 16,
};

const chapter = {
  fontFamily: "'Orbitron', sans-serif",
  fontSize: 38,
  letterSpacing: 4,
  marginBottom: 6,
  color: "#00ffff",
  opacity: 0.95,
};

const org = {
  fontSize: 18,
  letterSpacing: 2,
  opacity: 0.85,
  marginBottom: 36,
};

const buyBtn = {
  background: "#00ffff",
  color: "#000",
  padding: "14px 36px",
  fontSize: 16,
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  marginBottom: 22,
};

const adminLink = {
  fontSize: 13,
  color: "#7ffcff",
  textDecoration: "none",
  letterSpacing: 1,
  opacity: 0.85,
  borderBottom: "1px solid rgba(127,252,255,0.4)",
  paddingBottom: 2,
};
