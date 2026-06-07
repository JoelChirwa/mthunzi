export type TeamMember = {
  id: string;
  name: string;
  role: string;
  position: number;
  imageUrl: string;
};

const teamMembers: TeamMember[] = [];

export function getTeamMembers() {
  return teamMembers;
}

export function getTeamMember(id: string) {
  return teamMembers.find((member) => member.id === id) || null;
}

export function addTeamMember(member: TeamMember) {
  if (!Number.isInteger(member.position) || member.position <= 0) {
    member.position = teamMembers.length + 1;
  }

  teamMembers.push(member);
  return member;
}

export function updateTeamMember(id: string, updates: Partial<TeamMember>) {
  const member = getTeamMember(id);
  if (!member) return null;

  Object.assign(member, {
    name: updates.name ?? member.name,
    role: updates.role ?? member.role,
    position: updates.position ?? member.position,
    imageUrl: updates.imageUrl ?? member.imageUrl,
  });

  return member;
}

export function deleteTeamMember(id: string) {
  const index = teamMembers.findIndex((member) => member.id === id);
  if (index === -1) return false;

  teamMembers.splice(index, 1);
  return true;
}

export function createTeamMemberId() {
  return Math.random().toString(36).substring(2, 11);
}
