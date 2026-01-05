import { EVENTS } from "@/lib/events";
import EventCard from "@/components/EventCard";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #001a1a, #000)",
        padding: 24,
      }}
    >
      <h1
        style={{
          color: "#00ffff",
          fontSize: 36,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        TicketEDY
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {EVENTS.filter((e) => e.status === "active").map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </main>
  );
}
