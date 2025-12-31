export default function Home() {
  return (
    <main style={main}>
      <div style={container}>
        <header style={header}>
          <h1 style={logo}>TICKETEDY</h1>
          <p style={subtitle}>Plataforma oficial de eventos</p>
        </header>

        {/* EVENTO */}
        <a href="/events/zeta-tron" style={eventCard}>
          <div>
            <h3 style={eventTitle}>SHOW DE NEOFITOS</h3>
            <p style={eventSub}>ZETA TRON · Capítulo Zeta ΦΣΑ</p>
            <p style={eventMeta}>
              Evento oficial · Acceso por taquilla · Open Bar
            </p>
          </div>

          <span style={cta}>VER EVENTO →</span>
        </a>

        <footer style={footer}>
          © {new Date().getFullYear()} Ticketedy
        </footer>
      </div>
    </main>
  );
}

/* ===== STYLES ===== */

const main = {
  minHeight: "100vh",
  background: "#000",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif",
};

const container = {
  width: "100%",
  maxWidth: 520,
  background: "linear-gradient(180deg, #0b0b0b, #050505)",
  borderRadius: 16,
  padding: 32,
  border: "1px solid #1f2937",
  boxShadow: "0 0 0 1px rgba(0,255,255,0.05)",
};

const header = {
  marginBottom: 36,
  textAlign: "center" as const,
};

const logo = {
  margin: 0,
  fontSize: 34,
  fontWeight: 800,
  color: "#e6ffff",
  letterSpacing: 2,
};

const subtitle = {
  marginTop: 8,
  fontSize: 14,
  color: "#9ca3af",
};

const eventCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 22,
  borderRadius: 14,
  background:
    "linear-gradient(135deg, rgba(0,255,255,0.08), rgba(0,0,0,0.8))",
  border: "1px solid rgba(0,255,255,0.25)",
  textDecoration: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const eventTitle = {
  margin: 0,
  fontSize: 20,
  fontWeight: 800,
  letterSpacing: 1.5,
  color: "#00ffff",
};

const eventSub = {
  marginTop: 6,
  fontSize: 13,
  letterSpacing: 1,
  color: "#cfffff",
};

const eventMeta = {
  marginTop: 6,
  fontSize: 13,
  color: "#9ca3af",
};

const cta = {
  fontSize: 14,
  fontWeight: 700,
  color: "#00ffff",
  letterSpacing: 1,
};

const footer = {
  marginTop: 44,
  textAlign: "center" as const,
  fontSize: 12,
  color: "#6b7280",
};
