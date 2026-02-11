import Link from "next/link";
import { EventItem } from "@/lib/events";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "#000",
        border: "1px solid rgba(255, 87, 34, 0.4)",
        boxShadow: "0 0 25px rgba(255, 23, 68, 0.2)",
        maxWidth: 420,
        width: "100%",
      }}
    >
      <img
        src={event.image}
        alt={event.title}
        style={{
          width: "100%",
          height: 220,
          objectFit: "cover",
        }}
      />

      <div style={{ padding: 16 }}>
        <h2 style={{ color: "#ff5722", marginBottom: 6 }}>
          {event.title}
        </h2>

        <p style={{ opacity: 0.85, marginBottom: 6 }}>
          📅 {event.date}
        </p>

        <p style={{ opacity: 0.85, marginBottom: 12 }}>
          📍 {event.location}
        </p>

        <p style={{ fontWeight: 700, marginBottom: 14 }}>
          ${event.price} · Cash Bar
        </p>

        <Link href={`/events/${event.slug}`}>
          <button
            style={{
              width: "100%",
              padding: 12,
              background: "#ff5722",
              color: "#000",
              fontWeight: 700,
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(255, 87, 34, 0.4)",
            }}
          >
            Ver evento
          </button>
        </Link>
      </div>
    </div>
  );
}
