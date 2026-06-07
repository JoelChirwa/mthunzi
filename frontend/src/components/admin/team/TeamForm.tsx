"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildApiUrl } from "@/lib/api";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  position: number;
  imageUrl: string;
};

type TeamFormProps = {
  member?: TeamMember | null;
  onSaved: (member: TeamMember) => void;
  onCancel?: () => void;
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

export default function TeamForm({ member, onSaved, onCancel }: TeamFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [position, setPosition] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setName(member?.name ?? "");
    setRole(member?.role ?? "");
    setPosition(member?.position ? String(member.position) : "");
    setImageUrl(member?.imageUrl ?? "");
    setImageFile(null);
    setError("");
    setSuccess("");
  }, [member]);

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

  async function handleSubmit() {
    if (!name.trim() || !role.trim()) {
      setError("Name and role are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const positionValue = position.trim() ? Number(position) : 0;
      const payload = {
        name: name.trim(),
        role: role.trim(),
        position: positionValue > 0 ? positionValue : 0,
        imageUrl: finalImageUrl || "/images/team-placeholder.jpg",
      };

      const url = member ? `/api/team/${member.id}` : "/api/team";
      const apiUrl = buildApiUrl(url);
      const method = member ? "PATCH" : "POST";

      const response = await fetch(apiUrl, {
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

      onSaved(data as TeamMember);
      setSuccess(member ? "Team member updated." : "Team member added.");
      if (!member) {
        setName("");
        setRole("");
        setPosition("");
        setImageUrl("");
        setImageFile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save team member.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {member ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <p className="text-sm text-gray-500">
            Manage staff profile details.
          </p>
        </div>
        {member && onCancel && (
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel Edit
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Input
          placeholder="Position (leave blank to append last)"
          type="number"
          min={1}
          value={position}
          onChange={(e) => setPosition(e.target.value)}
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

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {member && onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : member ? "Update Member" : "Add Member"}
        </Button>
      </div>
    </div>
  );
}
