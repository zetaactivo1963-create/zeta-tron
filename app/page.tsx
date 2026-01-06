"use client";

import Link from "next/link";
import EventCard from "@/components/EventCard";
import { EVENTS } from "@/lib/events";

export default function HomePage() {
  const featuredEvent = EVENTS[0]; // Evento destacado (HERO)

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #001a1a, #000)",
        padding: "48px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200 }}>
        {/* ===== TÍTULO ===== */}
        <h1
          style={{
            color: "#00ffff",
            textAlign: "center",
            marginBottom: 40,
            letterSpacing: 2,
            fontSize: 36,
          }}
        >
          Eventos disponibles
        </h1>

        {/* ===== HERO EVENTO DESTACADO ===== */}
        <Link
          href={`/events/${featuredEvent.slug}`}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              width: "100%",
              height: 320,
              borderRadius: 28,
              backgroundImage: `url(${featuredEvent.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 0 60px rgba(0,255,255,0.45)",
              marginBottom: 64,
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.88), rgba(0,0,0,0.25))",
                display: "flex",
                alignItems: "center",
                padding: 36,
              }}
            >
              <div style={{ maxWidth: 560 }}>
                <span
                  style={{
                    display: "inline-block",
                    marginBottom: 12,
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: "rgba(0,255,255,0.15)",
                    color: "#0ff",
                    fontSize: 12,
                    letterSpacing: 1.5,
                  }}
                >
                  EVENTO DESTACADO
                </span>

                <h2
                  style={{
                    color: "#0ff",
                    fontSize: 38,
                    marginBottom: 12,
                  }}
                >
                  {featuredEvent.title}
                </h2>

                <p style={{ opacity: 0.9, marginBottom: 6 }}>
                  📅 {featuredEvent.date} 
                </p>

                <p style={{ opacity: 0.9, marginBottom: 12 }}>
                  📍 {featuredEvent.location}
                </p>

                <p style={{ fontWeight: 700, marginBottom: 20 }}>
                  ${featuredEvent.price} · Open Bar
                </p>

                <div
                  style={{
                    display: "inline-block",
                    padding: "14px 34px",
                    background: "#0ff",
                    color: "#000",
                    borderRadius: 12,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  Comprar taquillas
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* ===== GRID DE EVENTOS ===== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 32,
            justifyItems: "center",
          }}
        >
          {EVENTS.slice(1).map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}
