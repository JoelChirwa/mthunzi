import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function fetchBackendBlogs(query?: string) {
  try {
    const url = new URL(`${BACKEND_URL}/api/blogs`);
    if (query) url.search = query;
    
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[api/blogs] GET error:", error);
    }
    return [];
  }
}

// Note: this API route proxies backend blog data for the front-end.
// Do not return hardcoded placeholder blog items here.

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const blogs = await fetchBackendBlogs(searchParams.toString());
    
    // Return backend blogs as-is. Some backends use `status`, others use `publishedAt`/_id — don't filter here.
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("[api/blogs] GET error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const res = await fetch(`${BACKEND_URL}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data || { error: `Backend returned ${res.status}` }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api/blogs] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}