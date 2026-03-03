import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRecordings } from "../services/api";
import "./Recordings.css";

type Recording = {
  key: string;
  size: number;
  lastModified: string;
  url: string;
};

export default function Recordings() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [camera, setCamera] = useState("cam-03");
  const [items, setItems] = useState<Recording[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    nav("/login", { replace: true });
  };

  const load = async (reset = false) => {
    setLoading(true);

    const data = await fetchRecordings(
      camera,
      5,
      reset ? undefined : nextToken || undefined,
    );

    if (reset) {
      setItems(data.items);
    } else {
      setItems((prev) => [...prev, ...data.items]);
    }

    setNextToken(data.nextToken || null);
    setLoading(false);
  };

  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setHasSearched(true);
    await load(true);
  };

  const [allDay, setAllDay] = useState(true);

  useEffect(() => {
    // al cambiar cámara, no auto-cargamos.
    // esperamos a que el usuario toque "Buscar"
    setItems([]);
    setSelectedUrl(null);
    setNextToken(null);
    setHasSearched(false);
  }, [camera]);

  return (
    <div className="page">
      <header className="header">
        <div className="container headerInner">
          <div className="brand">
            <div className="logo">📹</div>
            <div>
              <div className="title">Sistema de Vigilancia</div>
              <div className="subtitle">Reproductor de Grabaciones</div>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="container">
        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <h3>Filtros de Búsqueda</h3>

            <div className="field">
              <label>Cámara</label>
              <select>
                <option>01</option>
                <option>02</option>
                <option>03</option>
              </select>
            </div>

            <div className="field">
              <label>Fecha</label>
              <input type="date" />
            </div>

            <div className="field">
              <label>Horario (24 hs)</label>
              <input type="time" disabled={allDay} />
            </div>

            <div className="allDayRow">
              <label className="allDay">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                />
                Traer todo el día
              </label>
            </div>

            <button className="primary-btn" onClick={handleSearch}>
              Buscar Grabación
            </button>

            <div className="timeline">
              {!hasSearched ? (
                <div className="empty">
                  Elegí cámara/fecha/hora y tocá <b>Buscar Grabación</b>.
                </div>
              ) : items.length === 0 ? (
                <div className="empty">
                  No hay grabaciones para esos filtros.
                </div>
              ) : (
                items.map((rec) => (
                  <div
                    key={rec.key}
                    onClick={() => setSelectedUrl(rec.url)}
                    className={`timeline-item ${
                      selectedUrl === rec.url ? "active" : ""
                    }`}
                  >
                    <div>{new Date(rec.lastModified).toLocaleString()}</div>
                    <div className="size">
                      {(rec.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* PLAYER */}
          <section className="player">
            <div className="player-header">
              <h3>Reproducción - Cámara 01</h3>
              <button className="download-btn">Descargar Video</button>
            </div>

            <div className="player-box">
              {selectedUrl ? (
                <video src={selectedUrl} controls autoPlay />
              ) : (
                <div className="placeholder">Seleccioná una grabación</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
