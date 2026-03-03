import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { status } = useAuth();

  if (status === "loading") {
    return <div style={{ padding: 24, color: "white" }}>Loading...</div>;
  }

  if (status !== "authed") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
