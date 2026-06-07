import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/analytics/stats`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      totalViews: 0,
      last30Days: 0,
      last7Days: 0,
      countries: [],
      topPages: [],
      dailyViews: [],
    });
  }
}
