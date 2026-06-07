"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import FormModal from "../modals/FormModal";
import ImageUploader from "../media/ImageUploader";
import { CheckCircle, AlertCircle, Globe, Building2 } from "lucide-react";

type Partner = {
  id?: string;
  _id?: string;
  name: string;
  logo?: string | null;
  website?: string;
  status: string;
};

type PartnerFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner?: Partner | null;
  onSaved?: () => void;
};

export default function PartnerFormModal({
  open,
  onOpenChange,
  partner,
  onSaved,
}: PartnerFormModalProps) {
  const isEdit = !!(partner?.id || partner?._id);
  const partnerId = partner?.id || partner?._id;

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("active");
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Populate form when partner prop changes (edit mode)
  useEffect(() => {
    if (open) {
      if (partner) {
        setName(partner.name || "");
        setWebsite(partner.website || "");
        setStatus(partner.status || "active");
        setLogo(partner.logo ?? null);
      } else {
        setName("");
        setWebsite("");
        setStatus("active");
        setLogo(null);
      }
      setError(null);
      setSuccess(false);
    }
  }, [open, partner]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Partner name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const payload = {
        name: name.trim(),
        logo: logo || null,
        website: website.trim() || null,
        status,
      };

      const url = isEdit ? `/api/partners/${partnerId}` : `/api/partners`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save partner");

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        onSaved?.();
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save partner");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Partner" : "Add New Partner"}
      description={
        isEdit
          ? "Update partner information"
          : "Add a new organization or sponsor to your partners list"
      }
      submitText={isEdit ? "Save Changes" : "Add Partner"}
      onSubmit={handleSave}
      loading={loading}
    >
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
          <p>{isEdit ? "Partner updated successfully!" : "Partner added successfully!"}</p>
        </div>
      )}

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Partner Logo
        </label>
        <div className="flex items-start gap-4">
          {/* Preview circle */}
          <div className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
            {logo ? (
              <img src={logo} alt="Logo preview" className="w-full h-full object-contain p-1" />
            ) : (
              <Building2 size={28} className="text-gray-300" />
            )}
          </div>
          <div className="flex-1">
            <ImageUploader onUpload={(url) => setLogo(url)} existingImage={logo} />
            <p className="mt-2 text-xs text-gray-500">
              Upload your partner&apos;s logo. PNG or SVG with transparent background works best.
            </p>
            {logo && (
              <button
                type="button"
                onClick={() => setLogo(null)}
                className="mt-1 text-xs text-red-500 hover:text-red-700 transition"
              >
                Remove logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Partner Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Partner Name *
        </label>
        <Input
          placeholder="e.g. UNICEF Malawi, GIZ, etc."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          id="partner-name"
        />
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="https://partner.org"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={loading}
            className="pl-9"
            id="partner-website"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="flex gap-3">
          {["active", "inactive"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-lg border-2 text-sm font-semibold capitalize transition ${
                status === s
                  ? s === "active"
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-400 bg-gray-50 text-gray-700"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              {s === "active" ? "✓ Active" : "○ Inactive"}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-gray-500">
          Only active partners are shown on the home page.
        </p>
      </div>
    </FormModal>
  );
}
