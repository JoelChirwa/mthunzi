"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import ProjectFormModal from "./ProjectFormModal";
import ProjectTable from "./ProjectTable";
import { Button } from "@/components/ui/button";
import { buildApiUrl } from "@/lib/api";

type Project = {
  id: string;
  title: string;
  location: string;
  description?: string;
  goal?: string;
  impact?: string[];
  image?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  async function loadProjects() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(buildApiUrl("/api/projects"));
      if (!response.ok) {
        throw new Error("Unable to load projects");
      }
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load projects at this time.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="space-y-8 p-4 sm:p-6">
      <PageHeader
        title="Projects"
        description="Manage organization projects"
        action={
          <Button variant="outline" onClick={() => setShowCreateModal(true)}>
            Add Project
          </Button>
        }
      />

      <ProjectFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSaved={loadProjects}
      />

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
          Loading projects...
        </div>
      ) : (
        <ProjectTable projects={projects} onSaved={loadProjects} />
      )}
    </div>
  );
}
