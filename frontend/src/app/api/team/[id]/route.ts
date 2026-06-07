import { NextResponse } from "next/server";
import { deleteTeamMember, getTeamMember, updateTeamMember } from "@/app/api/team/store";

type TeamMemberUpdate = {
  name?: string;
  role?: string;
  position?: number;
  imageUrl?: string;
};

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const member = getTeamMember(resolvedParams.id);

  if (!member) {
    return NextResponse.json({ message: "Team member not found" }, { status: 404 });
  }

  return NextResponse.json(member);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const body = (await req.json()) as TeamMemberUpdate;
  const updated = updateTeamMember(resolvedParams.id, body);

  if (!updated) {
    return NextResponse.json({ message: "Team member not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const deleted = deleteTeamMember(resolvedParams.id);

  if (!deleted) {
    return NextResponse.json({ message: "Team member not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
