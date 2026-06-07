"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteProject from "@/components/admin/projects/DeleteProject";
import EditProject from "./EditProject";

type Project = {
  id: string;
  title: string;
  location: string;
  description?: string;
  goal?: string;
  impact?: string[];
  image?: string;
};

type ProjectTableProps = {
  projects: Project[];
  onSaved?: () => void;
};

export default function ProjectTable({ projects, onSaved }: ProjectTableProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="px-3 sm:px-6">Title</TableHead>
            <TableHead className="px-3 sm:px-6">Location</TableHead>
            <TableHead className="hidden lg:table-cell px-3 sm:px-6">Goal</TableHead>
            <TableHead className="px-3 sm:px-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="text-xs sm:text-sm">
              <TableCell className="px-3 sm:px-6 py-4">{project.title}</TableCell>
              <TableCell className="px-3 sm:px-6 py-4">{project.location}</TableCell>
              <TableCell className="hidden lg:table-cell px-3 sm:px-6 py-4 text-sm text-slate-600">
                {project.goal}
              </TableCell>
              <TableCell className="px-3 sm:px-6 py-4 text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <EditProject project={project} onSaved={onSaved} />
                  <DeleteProject id={project.id} title={project.title} onDeleted={onSaved} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
