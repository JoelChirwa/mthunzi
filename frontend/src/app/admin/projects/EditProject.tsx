"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildApiUrl } from "@/lib/api";

type Project = {
  id: string;
  title: string;
  location: string;
  description?: string;
  goal?: string;
  impact?: string[];
  image?: string;
  status?: string;
};

type EditProjectProps = {
  project: Project;
  onSaved?: () => void;
};

export default function EditProject({ project, onSaved }: EditProjectProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    location: project.location,
    description: project.description || "",
    goal: project.goal || "",
    impact: project.impact && project.impact.length > 0 ? project.impact : [""],
    image: project.image || "",
    status: project.status || "ONGOING",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(project.image || "");

  function handleDialogOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setFormData({
        title: project.title,
        location: project.location,
        description: project.description || "",
        goal: project.goal || "",
        impact: project.impact && project.impact.length > 0 ? project.impact : [""],
        image: project.image || "",
        status: project.status || "ONGOING",
      });
      setImageFile(null);
      setPreviewUrl(project.image || "");
    }
  }

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
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(formData.image || "");
    }
  }

  async function handleSubmit() {
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("location", formData.location);
    payload.append("description", formData.description || "");
    payload.append("goal", formData.goal || "");
    payload.append("status", formData.status || "ONGOING");

    (formData.impact || [])
      .filter((item) => item.trim() !== "")
      .forEach((item) => payload.append("impact[]", item));

    if (imageFile) {
      payload.append("image", imageFile);
    }

    try {
      await fetch(buildApiUrl(`/api/projects/${project.id}`), {
        method: "PATCH",
        body: payload,
      });

      router.refresh();
      onSaved?.();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project details and save your changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title"
            />
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Location"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="Goal"
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
              <label htmlFor={`project-image-${project.id}`} className="mb-2 block text-sm font-semibold text-slate-700">
                Upload image
              </label>
              <input
                id={`project-image-${project.id}`}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700"
              />
            </div>
          </div>

          {previewUrl && (
            <div className="relative h-80 rounded-xl border border-gray-200 overflow-hidden">
              <Image
                src={previewUrl}
                alt="Project preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-30 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Description"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Impact items</span>
              <Button type="button" variant="outline" onClick={addImpact}>
                Add item
              </Button>
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
                  <Button type="button" variant="ghost" onClick={() => removeImpact(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
