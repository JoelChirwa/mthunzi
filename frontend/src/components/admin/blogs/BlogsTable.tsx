"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal";
import BlogEditor, { BlogData } from "./BlogEditor";

type Blog = {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string | null;
  category?: string;
  author?: string;
  status?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function BlogsTable() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlogForDelete, setSelectedBlogForDelete] = useState<Blog | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBlogForEdit, setSelectedBlogForEdit] = useState<BlogData | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!selectedBlogForDelete) return;

    try {
      const blogId = selectedBlogForDelete.id || selectedBlogForDelete._id;
      setDeletingId(blogId || "");
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      setBlogs(blogs.filter((blog) => (blog.id || blog._id) !== blogId));
      setDeleteModalOpen(false);
      setSelectedBlogForDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id: string, currentStatus: string) {
    try {
      setUpdatingId(id);
      const newStatus = currentStatus === "DRAFT" ? "PUBLISHED" : "DRAFT";
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update blog status");
      const updatedBlog = await res.json();
      setBlogs(blogs.map((blog) => ((blog.id || blog._id) === id ? updatedBlog : blog)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update blog");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleEditClick(blog: Blog) {
    const blogId = blog.id || blog._id || "";
    setSelectedBlogForEdit({
      id: blogId,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      author: blog.author,
      status: blog.status,
      slug: blog.slug,
    });
    setEditModalOpen(true);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="mt-2 text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Title
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Category
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Created
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No blog posts yet. Create one to get started!
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id || blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-900 truncate">
                        {blog.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {blog.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {blog.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        blog.status === "PUBLISHED" || blog.publishedAt
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.status || (blog.publishedAt ? "PUBLISHED" : "DRAFT")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(blog.createdAt || blog.publishedAt || new Date().toISOString())}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(blog.id || blog._id || "", blog.status || "DRAFT")
                        }
                        disabled={updatingId === (blog.id || blog._id)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition disabled:opacity-50"
                        title={(blog.status || "DRAFT") === "DRAFT" ? "Publish" : "Unpublish"}
                      >
                        {(blog.status || "DRAFT") === "DRAFT" ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditClick(blog)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBlogForDelete(blog);
                          setDeleteModalOpen(true);
                        }}
                        disabled={deletingId === (blog.id || blog._id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded transition disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${selectedBlogForDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        loading={deletingId !== null}
        variant="danger"
      />

      {/* Edit Blog Modal */}
      <BlogEditor
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) setSelectedBlogForEdit(null);
        }}
        blog={selectedBlogForEdit}
        onSuccess={() => {
          fetchBlogs();
        }}
      />
    </div>
  );
}
