import Link from "next/link";
import { EventItem } from "@/lib/events";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "#000",
        border: "1px solid rgba(0,255,255,0.35)",
        boxShadow: "0 0 25px rgba(0,255,255,0.15)",
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
        <h2 style={{ color: "#0ff", marginBottom: 6 }}>
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
              background: "#00ffff",
              color: "#000",
              fontWeight: 700,
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Ver evento
          </button>
        </Link>
      </div>
    </div>
  );
}
