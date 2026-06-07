export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

function buildApiUrl(path: string) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

export { buildApiUrl };

async function fetchJson(path: string, options?: RequestInit) {
  try {
    const res = await fetch(buildApiUrl(path), {
      next: { revalidate: 60 },
      ...options,
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return [];
  }
}

export async function getProjects() {
  return fetchJson("/api/projects");
}

export async function getBlogs() {
  return fetchJson("/api/blogs");
}

export async function getPartners() {
  // No cache — always fetch the latest partners from the database
  return fetchJson("/api/partners", { cache: "no-store" });
}
