import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  const resolvedParams = await params;
  const project = {
    _id: resolvedParams.id,
    title: body.title,
    location: body.location,
    description: body.description,
  };
  return NextResponse.json(project);
}