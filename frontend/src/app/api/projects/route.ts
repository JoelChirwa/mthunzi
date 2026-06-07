import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function fetchBackendProjects() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/projects`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[api/projects] GET error:", error);
    }
    return [];
  }
}

const placeholderProjects = [
  {
    _id: "1",
    title: "Lilongwe Urban Tree Planting",
    location: "Lilongwe, Malawi",
    description:
      "A large-scale urban reforestation initiative in Lilongwe, planting indigenous trees across schools, public spaces, and community gardens.",
    image: "/images/env.jpg",
    goal: "To combat urban heat and restore green spaces through community-driven tree planting.",
    impact: [
      "10,000+ indigenous trees planted",
      "25 community-managed green zones established",
      "150 youth trained as environmental custodians",
    ],
  },
  {
    _id: "2",
    title: "Youth Climate Leadership Academy",
    location: "Blantyre, Malawi",
    description:
      "An academy training young climate leaders in advocacy, policy, and community mobilization.",
    image: "/images/climate.jpg",
    goal: "To build a generation of youth leaders driving climate action across Malawi.",
    impact: [
      "800+ youth certified as climate champions",
      "12 district-level youth action clubs established",
      "3 policy proposals submitted to national committees",
    ],
  },
];

export async function GET() {
  const projects = await fetchBackendProjects();
  return NextResponse.json(projects.length ? projects : placeholderProjects);
}

export async function POST(req: Request) {
  const body = await req.json();
  const project = {
    _id: Math.random().toString(36).substring(2, 11),
    _type: "project",
    title: body.title || "Untitled Project",
    location: body.location || "Unknown location",
    description: body.description || "",
    image: body.image || "/images/hero.jpg",
    goal: body.goal || "",
    impact: Array.isArray(body.impact) ? body.impact : [],
  };
  return NextResponse.json(project, { status: 201 });
}