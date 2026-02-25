import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Tapo Viewer</h2>

        <nav>
          {user ? (
            <>
              <Link to="/" style={{ marginRight: "1rem" }}>
                Home
              </Link>
              <Link to="/recordings" style={{ marginRight: "1rem" }}>
                Recordings
              </Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}

export default Layout;
