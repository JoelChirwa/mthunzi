import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:5000';

export async function GET() {
  let backendOk = false;
  let backendStatus = null;
  let backendBody = null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/projects`, { cache: 'no-store' });
    backendStatus = res.status;
    backendBody = await res.text();
    backendOk = res.ok;
  } catch (err) {
    backendBody = String(err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ BACKEND_URL, backendOk, backendStatus, backendBody });
}
