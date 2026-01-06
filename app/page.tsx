import EventCard from "@/components/EventCard";
import { EVENTS } from "@/lib/events";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #001a1a, #000)",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200 }}>
        {/* TÍTULO */}
        <h1
          style={{
            color: "#00ffff",
            textAlign: "center",
            marginBottom: 32,
            letterSpacing: 2,
          }}
        >
          Eventos disponibles
        </h1>

        {/* HERO */}
        <div
          style={{
            width: "100%",
            height: 280,
            borderRadius: 24,
            backgroundImage: "url('/zeta-tron.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 0 50px rgba(0,255,255,0.35)",
            marginBottom: 48,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85))",
              display: "flex",
              alignItems: "flex-end",
              padding: 28,
            }}
          >
            <div>
              <h2
                style={{
                  color: "#0ff",
                  fontSize: 34,
                  marginBottom: 6,
                  letterSpacing: 1,
                }}
              >
                Zeta Tron · Welcome to the Grid
              </h2>
              <p style={{ opacity: 0.85 }}>
                24 de enero 2026 · Bambalinas, Aguada
              </p>
            </div>
          </div>
        </div>

        {/* GRID DE EVENTOS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
