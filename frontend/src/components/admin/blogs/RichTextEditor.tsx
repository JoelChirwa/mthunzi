"use client";

import { useState, useEffect } from "react";
import { Bold, Italic, List, Heading2 } from "lucide-react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [content, setContent] = useState(value || "");

  useEffect(() => {
    setContent(value || "");
  }, [value]);

  function handleChange(text: string) {
    setContent(text);
    onChange(text);
  }

  function insertFormatting(before: string, after: string = "") {
    const textarea = document.querySelector(
      'textarea[placeholder*="Write your blog"]'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    handleChange(newContent);
    textarea.focus();
  }

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white">
      <div className="flex gap-2 border-b pb-3">
        <button
          type="button"
          onClick={() => insertFormatting("**", "**")}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("*", "*")}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("## ", "\n")}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Heading"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("- ", "\n")}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="List"
        >
          <List size={18} />
        </button>
      </div>

      <textarea
        className="w-full h-64 border p-3 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
        placeholder="Write your blog content here (supports Markdown formatting)"
        value={content}
        onChange={(e) => handleChange(e.target.value)}
      />

      <p className="text-xs text-gray-500">
        Supports Markdown formatting: **bold**, *italic*, ## headings, - lists
      </p>
    </div>
  );
}