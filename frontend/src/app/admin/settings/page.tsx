import PageHeader from "@/components/admin/PageHeader";

export default function SettingsAdminPage() {
  return (
    <div className="space-y-8 p-4 sm:p-6">
      <PageHeader
        title="Settings"
        description="Configure admin dashboard and application settings"
      />

      <div className="max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
        <form className="space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700">Organization Name</label>
            <input
              type="text"
              defaultValue="Mthunzi Trust"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700">Backend API Endpoint</label>
            <input
              type="text"
              defaultValue="http://localhost:5000"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-700">Support Email</label>
            <input
              type="email"
              defaultValue="info@mthunzitrust.org"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm focus:border-green-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              className="rounded-lg bg-green-700 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition hover:bg-green-800"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
