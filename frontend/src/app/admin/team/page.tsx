"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import TeamFormModal from "@/components/admin/team/TeamFormModal";
import TeamTable from "@/components/admin/team/TeamTable";
import ConfirmModal from "@/components/admin/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { buildApiUrl } from "@/lib/api";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  position: number;
  imageUrl: string;
};

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [pendingDeleteMember, setPendingDeleteMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMembers() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(buildApiUrl("/api/team"));
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load team members.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  async function handleSaved(member: { id?: string; name: string; role: string; position: number; imageUrl: string }) {
    await loadMembers();
    setMemberModalOpen(false);
    setSelectedMember(null);
  }

  function requestDeleteMember(id: string) {
    const member = members.find((item) => item.id === id);
    if (!member) return;
    setPendingDeleteMember(member);
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteMember) return;

    try {
      await fetch(buildApiUrl(`/api/team/${pendingDeleteMember.id}`), { method: "DELETE" });
      setPendingDeleteMember(null);
      await loadMembers();
    } catch (err) {
      console.error(err);
      setError("Could not delete team member.");
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <PageHeader
        title="Team Members"
        description="Full CRUD for your team profiles, including Cloudinary image upload."
        action={
          <Button
            onClick={() => {
              setSelectedMember(null);
              setMemberModalOpen(true);
            }}
          >
            Add Member
          </Button>
        }
      />

      <TeamFormModal
        open={memberModalOpen}
        onOpenChange={(open) => {
          setMemberModalOpen(open);
          if (!open) setSelectedMember(null);
        }}
        member={selectedMember}
        onSaved={handleSaved}
      />

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
          Loading team members...
        </div>
      ) : (
        <TeamTable
          members={members}
          onEdit={(member) => {
            setSelectedMember(member);
            setMemberModalOpen(true);
          }}
          onDelete={requestDeleteMember}
        />
      )}

      <ConfirmModal
        open={Boolean(pendingDeleteMember)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteMember(null);
        }}
        title="Delete team member"
        description={`Are you sure you want to delete ${pendingDeleteMember?.name ?? "this member"}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        loading={false}
        variant="danger"
      />
    </div>
  );
}
