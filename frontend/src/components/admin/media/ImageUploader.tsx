"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (image: string) => void;
  existingImage?: string | null;
};

export default function ImageUploader({
  onUpload,
  existingImage,
}: Props) {
  const [loading, setLoading] = useState(false);
  function fileToDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Failed to read file"));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function handleUpload(e: any) {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const imageData = await fileToDataUrl(file);

      const res = await fetch("/api/upload/cloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, fileName: file.name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const url = data.secure_url || data.url || data.asset?.url || data;
      onUpload(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const previewSrc = existingImage || undefined;

  return (
    <div className="space-y-4">
      <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100">
        Choose image
        <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
      </label>

      {loading && (
        <p className="text-sm text-gray-500">Uploading...</p>
      )}

      {previewSrc && (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <img src={previewSrc} className="w-full h-48 object-cover" />
        </div>
      )}
    </div>
  );
}