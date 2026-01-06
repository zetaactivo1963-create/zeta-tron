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
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
        }}
      >


        
        <h1
          style={{
            color: "#00ffff",
            textAlign: "center",
            marginBottom: 40,
            letterSpacing: 2,
          }}
        >
          Eventos disponibles
        </h1>

        {/* HERO */}
<div
  style={{
    width: "100%",
    maxWidth: 1100,
    height: 260,
    borderRadius: 20,
    backgroundImage: "url('/zeta-tron.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 0 40px rgba(0,255,255,0.35)",
    marginBottom: 40,
    position: "relative",
  }}
>
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.9))",
      borderRadius: 20,
      display: "flex",
      alignItems: "flex-end",
      padding: 24,
      color: "#0ff",
      fontSize: 28,
      fontWeight: 700,
    }}
  >
    Zeta Tron · Welcome to the Grid
  </div>
</div>


        {/* GRID DE EVENTOS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
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
