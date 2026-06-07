"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Newspaper,
  Users,
  FileText,
  Settings,
  Handshake,
} from "lucide-react";

const links = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Projects", href: "/admin/projects", icon: FolderOpen, exact: false },
  { title: "Blogs", href: "/admin/blogs", icon: Newspaper, exact: false },
  { title: "Partners", href: "/admin/partners", icon: Handshake, exact: false },
  { title: "Team", href: "/admin/team", icon: Users, exact: false },
  { title: "Reports", href: "/admin/reports", icon: FileText, exact: false },
  { title: "Settings", href: "/admin/settings", icon: Settings, exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-b md:border-b-0 md:border-r bg-white p-4 sm:p-6 md:min-h-screen hidden md:flex md:flex-col">
      {/* Logo / Brand */}
      <div className="mb-8">
        <h1 className="font-black text-lg text-gray-900">Mthunzi Admin</h1>
        <p className="text-xs text-gray-400 mt-0.5">Content Management</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-green-700 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-gray-500"} />
              {link.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-green-700 transition-colors"
        >
          ← View public site
        </Link>
      </div>
    </aside>
  );
}