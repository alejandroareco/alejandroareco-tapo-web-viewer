import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login, status } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si ya está autenticado, volá a recordings
  if (status === "authed") {
    nav("/recordings", { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      nav("/recordings", { replace: true });
    } catch (err: any) {
      const raw = `${err?.name || ""} ${err?.message || ""}`.toLowerCase();

      if (
        raw.includes("usernotfound") ||
        raw.includes("notauthorized") ||
        raw.includes("usernotconfirmed") ||
        raw.includes("password") ||
        raw.includes("invalid") ||
        raw.includes("unauthorized")
      ) {
        nav("/contact-admin", { replace: true });
        return;
      }

      setError("No se pudo iniciar sesión. Intentá de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: 360, padding: 24 }}>
        <h2>Login</h2>

        <input
          type="email"
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />

        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />

        {error && <div style={{ color: "salmon" }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Ingresando..." : "Login"}
        </button>
      </form>
    </div>
  );
}