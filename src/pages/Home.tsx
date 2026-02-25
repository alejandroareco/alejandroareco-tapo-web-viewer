import { useEffect, useState } from "react";
import { fetchCameras, fetchRecordings } from "../services/api";

export default function Home() {
  const [cameras, setCameras] = useState<string[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);

  // Load cameras on mount
  useEffect(() => {
    loadCameras();
  }, []);

  async function loadCameras() {
    try {
      const data = await fetchCameras();
      setCameras(data);

      if (data.length > 0) {
        setSelectedCamera(data[0]);
      }
    } catch (err) {
      console.error("Error loading cameras:", err);
    }
  }

  // When camera changes, reset state and load recordings
  useEffect(() => {
    if (!selectedCamera) return;

    setRecordings([]);
    setSelectedUrl(null);
    setNextToken(null);

    loadRecordings(selectedCamera);
  }, [selectedCamera]);

  async function loadRecordings(camera: string, token?: string) {
    try {
      const data = await fetchRecordings(camera, 10, token);

      if (!token) {
        setRecordings(data.items);

        if (data.items.length > 0) {
          setSelectedUrl(data.items[0].url);
        }
      } else {
        setRecordings(prev => [...prev, ...data.items]);
      }

      setNextToken(data.nextToken || null);
    } catch (err) {
      console.error("Error loading recordings:", err);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Camera</h2>

      <select
        value={selectedCamera || ""}
        onChange={e => setSelectedCamera(e.target.value)}
      >
        {cameras.map(cam => (
          <option key={cam} value={cam}>
            {cam}
          </option>
        ))}
      </select>

      <hr />

      {selectedUrl && (
        <video
          key={selectedUrl}
          src={selectedUrl}
          controls
          autoPlay
          muted
          width="800"
          style={{ marginBottom: "20px" }}
        />
      )}

      <h3>Recordings</h3>

      {recordings.map(rec => (
        <div key={rec.key} style={{ marginBottom: "10px" }}>
          <button onClick={() => setSelectedUrl(rec.url)}>
            Play
          </button>{" "}
          {new Date(rec.lastModified).toLocaleString()}
        </div>
      ))}

      {nextToken && selectedCamera && (
        <button onClick={() => loadRecordings(selectedCamera, nextToken)}>
          Load More
        </button>
      )}
    </div>
  );
}
