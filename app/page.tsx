import EventCard from "@/components/EventCard";
import { EVENTS } from "@/lib/events";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #001a1a, #000 70%)",
        padding: "40px 20px 80px",
        display: "flex",
        justifyContent: "center",
        color: "#e6ffff",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200 }}>

        {/* ===== HERO ===== */}
        <div
          style={{
            width: "100%",
            height: 320,
            borderRadius: 24,
            backgroundImage: "url('/zeta-tron.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            boxShadow: "0 0 60px rgba(0,255,255,0.35)",
            marginBottom: 60,
            overflow: "hidden",
          }}
        >
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.25))",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 40,
            }}
          >
            <span
              style={{
                color: "#00ffff",
                fontSize: 12,
                letterSpacing: 2,
                marginBottom: 10,
                opacity: 0.8,
              }}
            >
              EVENTO DESTACADO
            </span>

            <h1
              style={{
                fontSize: 40,
                color: "#00ffff",
                marginBottom: 12,
              }}
            >
              Zeta Tron – Welcome to the Grid
            </h1>

            <p style={{ marginBottom: 6, color: "#ffffff" }}>
              📅 24 de enero 2026 · 7:00 PM
            </p>

            <p style={{ marginBottom: 6, color: "#ffffff" }}>
              📍 Bambalinas · Aguada
            </p>

            <p
              style={{
                marginBottom: 20,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              $25 · Open Bar
            </p>

            <a href="/events/zeta-tron">
              <button
                style={{
                  padding: "14px 36px",
                  background: "#00ffff",
                  color: "#000",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                Comprar taquillas
              </button>
            </a>
          </div>
        </div>

        {/* ===== TÍTULO ===== */}
        <h2
          style={{
            textAlign: "center",
            color: "#00ffff",
            letterSpacing: 2,
            marginBottom: 40,
          }}
        >
          Eventos disponibles
        </h2>

        {/* ===== GRID EVENTOS ===== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
            justifyItems: "center",
          }}
        >
          {EVENTS.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}
