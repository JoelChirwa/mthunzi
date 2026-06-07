"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import FormModal from "@/components/admin/modals/FormModal";
import { buildApiUrl } from "@/lib/api";

type TeamMember = {
  id?: string;
  name: string;
  role: string;
  position: number;
  imageUrl: string;
};

type TeamFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMember | null;
  onSaved: (member: TeamMember) => void;
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function TeamFormModal({
  open,
  onOpenChange,
  member,
  onSaved,
}: TeamFormModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [position, setPosition] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setRole("");
      setPosition("");
      setImageUrl("");
      setImageFile(null);
      setError("");
      return;
    }

    setName(member?.name ?? "");
    setRole(member?.role ?? "");
    setPosition(member?.position ? String(member.position) : "");
    setImageUrl(member?.imageUrl ?? "");
    setImageFile(null);
    setError("");
  }, [open, member]);

  useEffect(() => {
    return () => {
      if (imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  async function uploadImage(file: File) {
    const imageData = await fileToDataUrl(file);
    const response = await fetch("/api/upload/cloudinary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageData,
        fileName: file.name,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Cloudinary upload failed");
    }
    return data.secure_url as string;
  }

  async function handleSave() {
    if (!name.trim() || !role.trim()) {
      setError("Name and role are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: name.trim(),
        role: role.trim(),
        position: position.trim() ? Number(position) : 0,
        imageUrl: finalImageUrl || "/images/team-placeholder.jpg",
      };

      const url = member ? `/api/team/${member.id}` : "/api/team";
      const method = member ? "PATCH" : "POST";

      const response = await fetch(buildApiUrl(url), {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not save team member.");
      }

      onOpenChange(false);
      onSaved(data as TeamMember);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save team member.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={member ? "Edit Team Member" : "Add Team Member"}
      description={member ? "Update the team member profile." : "Create a new member profile."}
      submitText={member ? "Update Member" : "Add Member"}
      onSubmit={handleSave}
      loading={loading}
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Position (leave blank to append last)"
          type="number"
          min={1}
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          disabled={loading}
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Profile image</label>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-3xl bg-slate-100 text-slate-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M21 11.5V16a5 5 0 0 1-5 5H8a4 4 0 0 1-4-4V7a3 3 0 0 1 3-3h6" />
                    <path d="M13 11.5V4.5a3 3 0 0 0-6 0v10a3 3 0 0 0 6 0V9" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Upload a profile photo</p>
                  <p className="text-sm text-slate-500">PNG, JPG, or GIF up to 5MB.</p>
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100">
                Choose file
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setImageFile(file);
                    if (file) {
                      setImageUrl(URL.createObjectURL(file));
                    }
                  }}
                  disabled={loading}
                />
              </label>
            </div>
            {imageFile && (
              <p className="mt-3 text-sm text-slate-600">Selected file: {imageFile.name}</p>
            )}
          </div>
        </div>
      </div>

      {imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-gray-200">
          <img src={imageUrl} alt="Team profile preview" className="h-48 w-full object-cover" />
        </div>
      )}
    </FormModal>
  );
}
