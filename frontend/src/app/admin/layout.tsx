import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import AuthProvider from "@/components/providers/SessionProvider";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    redirect("/login");
  }

  return (
    <AuthProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="max-w-full">{children}</div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}