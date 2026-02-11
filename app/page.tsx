import Link from "next/link";

export default function ZetaTron() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #331100, #000 70%)",
        color: "#ffe6e6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: 64,
          letterSpacing: 6,
          marginBottom: 12,
        }}
      >
        Capítulo Zeta
      </h1>

      <h2
        style={{
          fontSize: 36,
          opacity: 0.9,
          marginBottom: 8,
        }}
      >
        PHI SIGMA ALPHA
      </h2>

      <p
        style={{
          fontSize: 14,
          opacity: 0.7,
          letterSpacing: 2,
          marginBottom: 48,
        }}
      >
        TRON SHOW
      </p>

      {/* BOTÓN COMPRAR */}
      <Link href="/events/zeta-grid-2">
        <button
          style={{
            padding: "14px 40px",
            background: "#ff5722",
            border: "none",
            color: "#000",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2,
            cursor: "pointer",
            marginBottom: 28,
            borderRadius: 10,
            boxShadow: "0 0 20px rgba(255, 87, 34, 0.6)",
          }}
        >
          COMPRAR TAQUILLAS
        </button>
      </Link>

      {/* ACCESO DIRECTIVA */}
      <Link href="/admin">
        <span
          style={{
            fontSize: 12,
            opacity: 0.6,
            letterSpacing: 1.5,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Acceso Directiva
        </span>
      </Link>
    </main>
  );
}
