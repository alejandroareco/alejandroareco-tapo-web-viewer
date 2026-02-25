import { useEffect, useState } from "react";
import { fetchRecordings } from "../services/api";

type Recording = {
  key: string;
  size: number;
  lastModified: string;
  url: string;
};

export default function Recordings() {
  const [camera, setCamera] = useState("cam-03");
  const [items, setItems] = useState<Recording[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async (reset = false) => {
    setLoading(true);

    const data = await fetchRecordings(
      camera,
      5,
      reset ? undefined : nextToken || undefined
    );

    if (reset) {
      setItems(data.items);
    } else {
      setItems((prev) => [...prev, ...data.items]);
    }

    setNextToken(data.nextToken || null);
    setLoading(false);
  };

  useEffect(() => {
    load(true);
  }, [camera]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recordings</h2>

      <select
        value={camera}
        onChange={(e) => setCamera(e.target.value)}
      >
        <option value="cam-01">cam-01</option>
        <option value="cam-02">cam-02</option>
        <option value="cam-03">cam-03</option>
      </select>

      {selectedUrl && (
        <div style={{ margin: "20px 0" }}>
          <video
            src={selectedUrl}
            controls
            width="100%"
          />
        </div>
      )}

      <ul>
        {items.map((rec) => (
          <li key={rec.key}>
            <button onClick={() => setSelectedUrl(rec.url)}>
              Play
            </button>{" "}
            {new Date(rec.lastModified).toLocaleString()} —{" "}
            {(rec.size / 1024 / 1024).toFixed(2)} MB
          </li>
        ))}
      </ul>

      {nextToken && (
        <button onClick={() => load()}>
          Load More
        </button>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
}
