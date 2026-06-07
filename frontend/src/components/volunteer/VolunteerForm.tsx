"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VolunteerFormData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  location: string;
  qualification: string;
  message: string;
}

export default function VolunteerForm() {
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    location: "",
    qualification: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your phone number");
      return false;
    }
    if (!formData.gender) {
      setErrorMessage("Please select your gender");
      return false;
    }
    if (!formData.location.trim()) {
      setErrorMessage("Please enter your location");
      return false;
    }
    if (!formData.qualification.trim()) {
      setErrorMessage("Please enter your highest qualification or skill");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        location: "",
        qualification: "",
        message: "",
      });

      // Reset success status after 7 seconds
      setTimeout(() => setStatus("idle"), 7000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to submit application. Please try again later.");
    }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-green-950/5 md:p-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full">
          Volunteer Registration
        </span>
        <h2 className="mt-5 text-3xl font-black text-gray-900 md:text-4xl tracking-tight leading-tight">
          Join the Mthunzi Team
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
          Fill out the details below to apply. Your submission will be recorded and our coordinator will reach out to you.
        </p>
      </div>

      {status === "success" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 animate-in fade-in duration-200">
          <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-600" />
          <div>
            <p className="font-bold text-green-800">Application Submitted!</p>
            <p className="text-sm text-green-700 mt-1">
              Thank you for applying. An email confirmation has been sent to you and our coordinator will review your profile.
            </p>
          </div>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 animate-in fade-in duration-200">
          <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" />
          <div>
            <p className="font-bold text-red-800">Form Error</p>
            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
              Full Name *
            </label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-blue-700 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
              Email Address *
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-blue-700 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
              Phone Number *
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-blue-700 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
              placeholder="+265 000 000 000"
            />
          </div>

          <div>
            <label htmlFor="gender" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
              Gender *
            </label>
            <Select
              value={formData.gender}
              onValueChange={(val) => handleSelectChange("gender", val)}
            >
              <SelectTrigger id="gender" className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-blue-700 focus-visible:border-transparent text-sm transition-all">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Other">Other / Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="location" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
              Location *
            </label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-blue-700 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
              placeholder="e.g. Lilongwe, Malawi"
            />
          </div>

          <div>
            <label htmlFor="qualification" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
              Qualifications / Key Skills *
            </label>
            <Input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-blue-700 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
              placeholder="e.g. Degree in Education / Social Work"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
            Why do you want to volunteer? (Optional)
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            maxLength={1000}
            className="w-full min-h-[140px] resize-none bg-gray-50 border-gray-200 px-4 py-3 focus-visible:ring-blue-700 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
            placeholder="Tell us about your motivation or any experiences you'd like to share..."
          />
          <p className="mt-2 text-right text-xs font-semibold text-gray-400">
            {formData.message.length}/1000 characters
          </p>
        </div>

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-extrabold uppercase tracking-widest text-xs shadow-md transition-all rounded-xl active:scale-[0.98]"
        >
          {status === "loading" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Submitting Application...
            </>
          ) : (
            <>
              <Send size={14} className="mr-1.5" />
              Apply Now
            </>
          )}
        </Button>

        <p className="text-center text-xs font-medium text-gray-400">
          * Required fields
        </p>
      </form>
    </div>
  );
}
