import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:5000";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const res = await fetch(`${BACKEND_URL}/api/blogs/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }
      throw new Error(`Backend returned ${res.status}`);
    }

    const blog = await res.json();
    return NextResponse.json(blog);
  } catch (error) {
    console.error("[api/blogs/[id]] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/blogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }
      throw new Error(`Backend returned ${res.status}`);
    }

    const blog = await res.json();
    return NextResponse.json(blog);
  } catch (error) {
    console.error("[api/blogs/[id]] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const res = await fetch(`${BACKEND_URL}/api/blogs/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Blog post not found" },
          { status: 404 }
        );
      }
      throw new Error(`Backend returned ${res.status}`);
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/blogs/[id]] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
