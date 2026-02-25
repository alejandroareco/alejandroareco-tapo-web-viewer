import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = import.meta.env.VITE_API_BASE;

async function getAuthHeader() {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchCameras() {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE}/cameras`, {
    headers,
  });

  if (!res.ok) throw new Error("Failed to fetch cameras");

  return res.json();
}

export async function fetchRecordings(
  camera: string,
  limit = 10,
  nextToken?: string
) {
  const headers = await getAuthHeader();

  let url = `${API_BASE}/cameras/${camera}/recordings?limit=${limit}`;

  if (nextToken) {
    url += `&nextToken=${encodeURIComponent(nextToken)}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error("Failed to fetch recordings");

  return res.json();
}
