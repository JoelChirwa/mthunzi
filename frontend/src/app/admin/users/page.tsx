import { auth } from "@/auth";

export default async function UsersPage(){

const session = await auth();

if (!session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-sm">Only administrators may access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Admin User Management</h1>
      <p className="text-xs sm:text-sm text-gray-500">Manage user roles and access from here.</p>
    </div>
  );
}

