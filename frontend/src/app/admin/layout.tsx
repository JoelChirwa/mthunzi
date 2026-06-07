"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "ADMIN" && user.role !== "EDITOR") {
        router.push("/login");
        return;
      }
      setAuthorized(true);
    } catch (e) {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 animate-pulse">Checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}