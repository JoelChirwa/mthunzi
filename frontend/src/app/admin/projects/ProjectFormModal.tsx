"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import FormModal from "@/components/admin/modals/FormModal";
import { buildApiUrl } from "@/lib/api";

type Project = {
  title: string;
  location: string;
  description?: string;
  goal?: string;
  impact?: string[];
  image?: string;
  status?: string;
};

type ProjectFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

const emptyProject: Project = {
  title: "",
  location: "",
  description: "",
  goal: "",
  impact: [""],
  image: "",
  status: "ONGOING",
};

export default function ProjectFormModal({
  open,
  onOpenChange,
  onSaved,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<Project>(emptyProject);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return formData.image || "";
  }, [imageFile, formData.image]);

  useEffect(() => {
    if (!open) {
      setFormData(emptyProject);
      setImageFile(null);
      setError("");
      setSuccess("");
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function updateImpact(index: number, value: string) {
    const nextImpact = [...(formData.impact || [])];
    nextImpact[index] = value;
    setFormData({ ...formData, impact: nextImpact });
  }

  function addImpact() {
    setFormData({
      ...formData,
      impact: [...(formData.impact || []), ""],
    });
  }

  function removeImpact(index: number) {
    const nextImpact = (formData.impact || []).filter((_, idx) => idx !== index);
    setFormData({ ...formData, impact: nextImpact.length > 0 ? nextImpact : [""] });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = buildApiUrl("/api/projects");
      const formDataPayload = new FormData();
      formDataPayload.append("title", formData.title);
      formDataPayload.append("location", formData.location);
      formDataPayload.append("description", formData.description || "");
      formDataPayload.append("goal", formData.goal || "");
      formDataPayload.append("status", formData.status || "ONGOING");

      const impactItems = (formData.impact || []).filter((item) => item.trim() !== "");
      impactItems.forEach((item) => formDataPayload.append("impact[]", item));

      if (imageFile) {
        formDataPayload.append("image", imageFile);
      }

      const response = await fetch(url, {
        method: "POST",
        body: formDataPayload,
      });

      if (!response.ok) {
        throw new Error("Unable to save the project. Please try again.");
      }

      setSuccess("Project created successfully.");
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Project"
      description="Fill in the project details and save to add a new item."
      submitText="Create Project"
      onSubmit={handleSave}
      loading={saving}
    >
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Project title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Input
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          placeholder="Project goal"
          value={formData.goal}
          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
        />
        <div>
          <label htmlFor="project-status" className="mb-2 block text-sm font-semibold text-slate-700">
            Status
          </label>
          <select
            id="project-status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="project-image" className="mb-2 block text-sm font-semibold text-slate-700">
            Upload image
          </label>
          <input
            id="project-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700"
          />
        </div>
      </div>

      {previewUrl && (
        <div className="relative h-80 rounded-xl border border-gray-200 overflow-hidden">
          <Image src={previewUrl} alt="Project preview" fill className="object-cover" unoptimized />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="min-h-30 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter the project description"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Impact items</span>
          <button
            type="button"
            onClick={addImpact}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Add item
          </button>
        </div>

        <div className="space-y-3">
          {(formData.impact || []).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <Input
                className="flex-1"
                placeholder={`Impact item ${index + 1}`}
                value={item}
                onChange={(e) => updateImpact(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeImpact(index)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </FormModal>
  );
}
