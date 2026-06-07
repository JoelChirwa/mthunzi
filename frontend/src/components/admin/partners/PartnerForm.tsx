"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUploader from "../media/ImageUploader";

export default function PartnerForm() {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<any>(null);

  async function handleSubmit() {
    await fetch("/api/partners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        website,
        description,
        logo,
      }),
    });

    setName("");
    setWebsite("");
    setDescription("");
    setLogo(null);
  }

  return (
    <div className="space-y-4 border p-6 rounded-xl">

      <Input
        placeholder="Partner Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Website (optional)"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <p className="text-xs text-gray-500">
        Leave empty if partner has no website
      </p>

      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <ImageUploader
        onUpload={setLogo}
        existingImage={logo}
      />

      <Button onClick={handleSubmit}>
        Add Partner
      </Button>

    </div>
  );
}