"use client";

import { useState } from "react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { EVENTS } from "@/lib/events";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const featuredEvent = EVENTS[0];

  const filteredEvents = EVENTS.slice(1).filter((event) =>
    `${event.title} ${event.location} ${event.date}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
            color: "#ffffff",
            textAlign: "center",
            marginBottom: 24,
            letterSpacing: 2,
            fontSize: 38,
          }}
        >
          Eventos disponibles
        </h1>

        {/* ===== BUSCADOR ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          <input
            type="text"
            placeholder="Buscar evento, lugar o fecha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 420,
              padding: "14px 18px",
              borderRadius: 14,
              background: "#000",
              color: "#fff",
              border: "1px solid rgba(0,255,255,0.5)",
              outline: "none",
              fontSize: 15,
              letterSpacing: 0.5,
            }}
          />
        </div>

        {/* ===== HERO ===== */}
        <Link
          href={`/events/${featuredEvent.slug}`}
          style={{
            textDecoration: "none",
            color: "#ffffff",
            display: "block",
          }}
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
            <img
              src={featuredEvent.image}
              alt={featuredEvent.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.15) 100%)",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                padding: "0 64px",
                color: "#ffffff",
              }}
            >
              <div style={{ maxWidth: 520 }}>
                <span
                  style={{
                    display: "inline-block",
                    marginBottom: 14,
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: "rgba(0,255,255,0.25)",
                    fontSize: 12,
                    letterSpacing: 2,
                  }}
                >
                  EVENTO DESTACADO
                </span>

                <h2
                  style={{
                    fontSize: 42,
                    lineHeight: 1.15,
                    marginBottom: 14,
                  }}
                >
                  {featuredEvent.title}
                </h2>

                <p style={{ marginBottom: 6 }}>
                  📅 {featuredEvent.date}
                </p>

                <p style={{ marginBottom: 10 }}>
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

        {/* ===== GRID ===== */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 36,
            justifyItems: "center",
          }}
        >
          {filteredEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </section>
      </div>
    </main>
  );
}
