"use client";

import { useEffect, useState } from "react";
import { Edit2, Trash2, Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PartnerFormModal from "./PartnerFormModal";
import ConfirmModal from "../modals/ConfirmModal";

type Partner = {
  id: string;
  name: string;
  logo?: string | null;
  website?: string | null;
  status: string;
  createdAt?: string;
};

export default function PartnersTable() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchPartners() {
    try {
      setLoading(true);
      const res = await fetch("/api/partners");
      if (!res.ok) throw new Error("Failed to fetch partners");
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch partners");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPartners();
  }, []);

  async function handleDeleteConfirm() {
    if (!selectedPartner) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/partners/${selectedPartner.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete partner");
      setPartners(partners.filter((p) => p.id !== selectedPartner.id));
      setDeleteModalOpen(false);
      setSelectedPartner(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete partner");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
          <p className="mt-3 text-gray-600 text-sm">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {partners.length} partner{partners.length !== 1 ? "s" : ""} total
        </p>
        <Button
          onClick={() => {
            setSelectedPartner(null);
            setCreateModalOpen(true);
          }}
          className="bg-green-700 hover:bg-green-800 gap-2"
        >
          <Plus size={16} />
          Add Partner
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Logo</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Website</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {partners.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Globe size={22} />
                    </div>
                    <p className="font-medium text-gray-600">No partners yet</p>
                    <p className="text-sm">Click "Add Partner" to add your first partner.</p>
                  </div>
                </td>
              </tr>
            ) : (
              partners.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {p.logo ? (
                        <img
                          src={p.logo}
                          alt={p.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Globe size={18} className="text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4">
                    {p.website ? (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition"
                      >
                        <Globe size={13} />
                        Visit site
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        p.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedPartner(p);
                          setEditModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPartner(p);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <PartnerFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        partner={null}
        onSaved={() => {
          setCreateModalOpen(false);
          fetchPartners();
        }}
      />

      {/* Edit Modal */}
      <PartnerFormModal
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) setSelectedPartner(null);
        }}
        partner={selectedPartner}
        onSaved={() => {
          setEditModalOpen(false);
          setSelectedPartner(null);
          fetchPartners();
        }}
      />

      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Partner"
        description={`Are you sure you want to delete "${selectedPartner?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}