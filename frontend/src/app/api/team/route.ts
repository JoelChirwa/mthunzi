import { NextResponse } from "next/server";
import { addTeamMember, createTeamMemberId, getTeamMembers } from "@/app/api/team/store";

type TeamMemberRequest = {
  name?: string;
  role?: string;
  position?: number;
  imageUrl?: string;
};

export async function GET() {
  return NextResponse.json(getTeamMembers());
}

export async function POST(req: Request) {
  const body = (await req.json()) as TeamMemberRequest;

  const newMember = addTeamMember({
    id: createTeamMemberId(),
    name: body.name?.trim() || "New Team Member",
    role: body.role?.trim() || "Team Member",
    position: body.position ?? 0,
    imageUrl: body.imageUrl || "/images/team-placeholder.jpg",
  });

  return NextResponse.json(newMember, { status: 201 });
}
