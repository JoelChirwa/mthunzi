"use client";

import { useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import BlogEditor from "@/components/admin/blogs/BlogEditor";
import BlogsTable from "@/components/admin/blogs/BlogsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BlogsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Blogs"
          description="Create and manage blog content"
        />
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-green-700 hover:bg-green-800 gap-2"
        >
          <Plus size={18} />
          New Blog Post
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">All Blog Posts</h2>
        <BlogsTable key={refreshKey} />
      </div>

      {/* Create Modal */}
      <BlogEditor
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        blog={null}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}