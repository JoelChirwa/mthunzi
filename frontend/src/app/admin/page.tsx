import DashboardCards from "@/components/admin/DashboardCards";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Real-time stats and website analytics
        </p>
      </div>

      <DashboardCards />
    </div>
  );
}