"use client";

import Link from "next/link";
import EventCard from "@/components/EventCard";
import { EVENTS } from "@/lib/events";

export default function HomePage() {
  const featuredEvent = EVENTS[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #001a1a, #000)",
        padding: "48px 20px 80px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1300 }}>
        {/* ===== TÍTULO ===== */}
        <h1
          style={{
            color: "#00ffff",
            textAlign: "center",
            marginBottom: 48,
            letterSpacing: 2,
            fontSize: 38,
          }}
        >
          Eventos disponibles
        </h1>

        {/* ===== HERO BIEN HECHO ===== */}
        <Link
          href={`/events/${featuredEvent.slug}`}
          style={{ textDecoration: "none" }}
        >
          <section
            style={{
              position: "relative",
              height: 420,
              borderRadius: 32,
              overflow: "hidden",
              marginBottom: 80,
              boxShadow: "0 0 80px rgba(0,255,255,0.35)",
              cursor: "pointer",
            }}
          >
            {/* IMAGEN */}
            <img
              src={featuredEvent.image}
              alt={featuredEvent.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* DEGRADADO CONTROLADO */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.1) 100%)",
              }}
            />

            {/* CONTENIDO */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                padding: "0 64px",
              }}
            >
              <div style={{ maxWidth: 520 }}>
                <span
                  style={{
                    display: "inline-block",
                    marginBottom: 14,
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: "rgba(0,255,255,0.2)",
                    color: "#0ff",
                    fontSize: 12,
                    letterSpacing: 2,
                  }}
                >
                  EVENTO DESTACADO
                </span>

                <h2
                  style={{
                    color: "#000",
                    fontSize: 42,
                    lineHeight: 1.15,
                    marginBottom: 14,
                  }}
                >
                  {featuredEvent.title}
                </h2>

                <p style={{ opacity: 0.9, marginBottom: 6 }}>
                  📅 {featuredEvent.date} · {featuredEvent.time}
                </p>

                <p style={{ opacity: 0.9, marginBottom: 10 }}>
                  📍 {featuredEvent.location}
                </p>

                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    marginBottom: 26,
                  }}
                >
                  ${featuredEvent.price} · Open Bar
                </p>

                <div
                  style={{
                    display: "inline-block",
                    padding: "16px 38px",
                    background: "#0ff",
                    color: "#000",
                    borderRadius: 14,
                    fontWeight: 800,
                    letterSpacing: 1,
                    fontSize: 16,
                  }}
                >
                  Comprar taquillas
                </div>
              </div>
            </div>
          </section>
        </Link>

        {/* ===== GRID DE EVENTOS ===== */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 36,
            justifyItems: "center",
          }}
        >
          {EVENTS.slice(1).map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </section>
      </div>
    </main>
  );
}
