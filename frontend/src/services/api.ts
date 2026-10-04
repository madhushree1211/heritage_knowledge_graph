import type { SearchResponse, Subgraph } from "../types";

const API_BASE_URL = "http://localhost:8000/api";

export async function search(query: string, lang: string = "en"): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, lang }),
  });
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  return response.json();
}

export async function getHeritageDetail(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/heritage/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch heritage details: ${response.statusText}`);
  }
  return response.json();
}

export async function getEntireGraph(): Promise<Subgraph> {
  const response = await fetch(`${API_BASE_URL}/graph`);
  if (!response.ok) {
    throw new Error(`Failed to fetch graph data: ${response.statusText}`);
  }
  return response.json();
}

export async function compareSites(siteIds: string[]): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ site_ids: siteIds }),
  });
  if (!response.ok) {
    throw new Error(`Comparison failed: ${response.statusText}`);
  }
  return response.json();
}

export async function executeCypher(cypher: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cypher }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Cypher execution failed: ${response.statusText}`);
  }
  return response.json();
}
