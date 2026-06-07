"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditPartner({ partner, onUpdated }: any) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: partner.name,
    website: partner.website || "",
    description: partner.description || "",
    status: partner.status,
  });

  async function handleUpdate() {
    await fetch(`/api/partners/${partner._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpen(false);
    onUpdated();
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Edit
      </Button>
    );
  }

  return (
    <div className="space-y-2 border p-3 rounded-lg">

      <Input
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <Input
        value={form.website}
        placeholder="Website"
        onChange={(e) =>
          setForm({ ...form, website: e.target.value })
        }
      />

      <Input
        value={form.description}
        placeholder="Description"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <Button onClick={handleUpdate}>
        Save
      </Button>

    </div>
  );
}