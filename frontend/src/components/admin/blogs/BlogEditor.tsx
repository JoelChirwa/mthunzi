"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormModal from "../modals/FormModal";
import ImageUploader from "../media/ImageUploader";
import RichTextEditor from "./RichTextEditor";

type FormData = {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  status: string;
};

const CATEGORIES = [
  "News",
  "Education",
  "Environment",
  "Community",
  "Climate Justice",
  "SRHR",
  "Stories",
];

export type BlogData = {
  id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string | null;
  category?: string;
  author?: string;
  status?: string;
  slug?: string;
};

type BlogEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  /** When provided, editor operates in edit mode */
  blog?: BlogData | null;
};

export default function BlogEditor({
  open,
  onOpenChange,
  onSuccess,
  blog,
}: BlogEditorProps) {
  const isEditMode = Boolean(blog?.id);

  const { register, handleSubmit, reset, setValue } = useForm<FormData>({
    defaultValues: {
      category: "News",
      status: "DRAFT",
    },
  });

  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // When blog prop changes (edit mode), populate the form
  useEffect(() => {
    if (blog) {
      setValue("title", blog.title || "");
      setValue("excerpt", blog.excerpt || "");
      setValue("category", blog.category || "News");
      setValue("author", blog.author || "");
      setValue("status", blog.status || "DRAFT");
      setContent(blog.content || "");
      setImage(blog.image ?? null);
    } else {
      reset({ category: "News", status: "DRAFT", title: "", excerpt: "", author: "" });
      setContent("");
      setImage(null);
    }
  }, [blog, open]);

  async function onSubmit(data: FormData) {
    if (!data.title.trim()) {
      setError("Blog title is required");
      return;
    }

    if (!content.trim()) {
      setError("Blog content is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const payload = {
        ...data,
        content,
        image,
      };

      let res: Response;

      if (isEditMode && blog?.id) {
        // Edit mode — PATCH existing blog
        res = await fetch(`/api/blogs/${blog.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create mode — POST new blog
        res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, status: data.status || "DRAFT" }),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || (isEditMode ? "Failed to update blog post" : "Failed to create blog post"));
      }

      setSuccess(true);
      if (!isEditMode) {
        reset({ category: "News", status: "DRAFT", title: "", excerpt: "", author: "" });
        setContent("");
        setImage(null);
      }

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        onSuccess?.();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditMode
          ? "Failed to update blog post"
          : "Failed to create blog post"
      );
    } finally {
      setLoading(false);
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(event);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
      description={
        isEditMode
          ? "Update the details of this blog post"
          : "Add a new blog post to share with your audience"
      }
      submitText={isEditMode ? "Save Changes" : "Create Blog"}
      onSubmit={handleFormSubmit}
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
          <p>{isEditMode ? "Blog post updated successfully!" : "Blog post created successfully!"}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Blog Title *
        </label>
        <Input
          placeholder="Enter blog post title"
          {...register("title", { required: true })}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author
        </label>
        <Input
          placeholder="Author name (optional)"
          {...register("author")}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            {...register("category")}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            {...register("status")}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-700 focus:border-green-700 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <Textarea
          placeholder="Brief summary of the blog post (optional)"
          {...register("excerpt")}
          disabled={loading}
          rows={2}
          className="text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image
        </label>
        <ImageUploader
          onUpload={(img) => setImage(img)}
          existingImage={image}
        />
      </div>
    </FormModal>
  );
}