import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Recordings from "./pages/Recordings";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactAdmin from "./pages/ContactAdmin";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/contact-admin" element={<ContactAdmin />} />

      <Route
        path="/recordings"
        element={
          <ProtectedRoute>
            <Recordings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/recordings" />} />
    </Routes>
  );
}