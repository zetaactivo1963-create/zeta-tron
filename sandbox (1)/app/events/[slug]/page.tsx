export default function ZetaTron() {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at top, #0ff2, #000 70%)",
          color: "#e6ffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
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
          TRON Show
        </p>
  
        {/* Botón principal */}
        <button
          style={{
            padding: "14px 40px",
            background: "#0ff",
            border: "none",
            color: "#000",
            fontSize: 16,
            letterSpacing: 2,
            cursor: "pointer",
            marginBottom: 28,
          }}
        >
          COMPRAR TAQUILLAS
        </button>
  
        {/* Acceso directiva */}
        <a
          href="/admin"
          style={{
            fontSize: 12,
            opacity: 0.6,
            letterSpacing: 1.5,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Acceso Directiva
        </a>
      </main>
    );
  }
  
  