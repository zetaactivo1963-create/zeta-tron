import Link from "next/link";

<Link href={`/events/${featuredEvent.slug}`} style={{ textDecoration: "none" }}>
  <div
    style={{
      width: "100%",
      height: 300,
      borderRadius: 24,
      backgroundImage: `url(${featuredEvent.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      boxShadow: "0 0 50px rgba(0,255,255,0.4)",
      marginBottom: 56,
      position: "relative",
      cursor: "pointer",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2))",
        display: "flex",
        alignItems: "center",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <h2
          style={{
            color: "#0ff",
            fontSize: 36,
            marginBottom: 10,
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

        <p style={{ fontWeight: 700, marginBottom: 18 }}>
          ${featuredEvent.price} · Open Bar
        </p>

        <div
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "#0ff",
            color: "#000",
            borderRadius: 10,
            fontWeight: 700,
          }}
        >
          Comprar taquillas
        </div>
      </div>
    </div>
  </div>
</Link>
