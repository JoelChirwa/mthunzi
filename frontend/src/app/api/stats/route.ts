import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/stats`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      blogs: { total: 0, published: 0, draft: 0 },
      projects: { total: 0 },
      partners: { total: 0, active: 0 },
      donations: { count: 0, total: 0 },
      analytics: { totalViews: 0, last30Days: 0 },
    });
  }
}
