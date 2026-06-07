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

interface FormData {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    inquiryType: "general",
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

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      inquiryType: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please enter your message");
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "general",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again later.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-green-900/5 md:p-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          Send a message
        </span>
        <h2 className="mt-4 text-3xl font-black text-gray-900 md:text-4xl tracking-tight">
          Let&apos;s start a conversation
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
          Share a few details and we will respond as soon as possible during
          business hours.
        </p>
      </div>

      {status === "success" && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
          <div>
            <p className="font-bold text-green-800">Message sent successfully</p>
            <p className="text-sm text-green-700">
              Thank you for contacting us. We&apos;ll get back to you shortly.
            </p>
          </div>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 animate-in fade-in zoom-in-95 duration-200">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <div>
            <p className="font-bold text-red-800">Validation Error</p>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
              Full Name *
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-green-600 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
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
              className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-green-600 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
              Phone Number
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-green-600 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
              placeholder="+265 000 000 000"
            />
          </div>

          <div>
            <label htmlFor="inquiryType" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
              Inquiry Type
            </label>
            <Select
              value={formData.inquiryType}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="inquiryType" className="w-full h-12 bg-gray-50 border-gray-200 px-4 focus-visible:ring-green-600 focus-visible:border-transparent text-sm transition-all">
                <SelectValue placeholder="Select inquiry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="donation">Donation</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            maxLength={1000}
            className="w-full min-h-[140px] resize-none bg-gray-50 border-gray-200 px-4 py-3 focus-visible:ring-green-600 focus-visible:border-transparent text-sm transition-all placeholder:text-gray-400"
            placeholder="Tell us more about your inquiry..."
          />
          <p className="mt-2 text-right text-xs font-semibold text-gray-400">
            {formData.message.length}/1000 characters
          </p>
        </div>

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-extrabold uppercase tracking-widest text-xs shadow-md transition-all rounded-lg active:scale-[0.98]"
        >
          {status === "loading" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending...
            </>
          ) : (
            <>
              <Send size={14} className="mr-1.5" />
              Send Message
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
