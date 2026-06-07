import PageHeader from "@/components/admin/PageHeader";

type Donation = {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
};

const placeholderDonations: Donation[] = [
  {
    id: "1",
    donorName: "John Doe",
    email: "john@example.com",
    amount: 15000,
    currency: "MWK",
    status: "SUCCESSFUL",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    donorName: "Jane Smith",
    email: "jane@example.com",
    amount: 50,
    currency: "USD",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
];

export default function DonationsAdminPage() {
  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <PageHeader
        title="Donations"
        description="View and manage organization donations"
      />

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Donor</th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {placeholderDonations.map((donation) => (
              <tr key={donation.id}>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">{donation.donorName || "Anonymous"}</td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{donation.email}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-mono">
                  {donation.currency} {donation.amount.toLocaleString()}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                    donation.status === "SUCCESSFUL" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {donation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
