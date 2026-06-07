"use client";

import { Button } from "@/components/ui/button";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  position: number;
  imageUrl: string;
};

type TeamTableProps = {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
};

export default function TeamTable({ members, onEdit, onDelete }: TeamTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full divide-y divide-gray-200 text-sm sm:text-base">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Member</th>
            <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
            <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Position</th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {members.map((member) => (
            <tr key={member.id}>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 overflow-hidden rounded-full border border-gray-200 bg-slate-100 flex-shrink-0">
                    <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{member.name}</p>
                    <p className="sm:hidden text-xs text-slate-600 truncate">{member.role}</p>
                  </div>
                </div>
              </td>
              <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-600">{member.role}</td>
              <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-600">{member.position}</td>
              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1 sm:gap-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => onEdit(member)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="text-xs" onClick={() => onDelete(member.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {members.length === 0 && (
            <tr>
              <td colSpan={4} className="px-3 sm:px-6 py-6 sm:py-10 text-center text-xs sm:text-sm text-slate-500">
                No team members found. Use the button above to add your first member.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
