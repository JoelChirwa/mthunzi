import PageHeader from "@/components/admin/PageHeader";

type ReportMetric = {
  label: string;
  value: string;
  description: string;
};

const placeholderMetrics: ReportMetric[] = [
  {
    label: "Total Donations",
    value: "MWK 15,250,000",
    description: "Combined funding raised in past quarters",
  },
  {
    label: "Trees Planted",
    value: "10,250",
    description: "Reforestation metrics for Lilongwe and suburbs",
  },
  {
    label: "Active Projects",
    value: "6 Projects",
    description: "Ongoing environmental and community programmes",
  },
];

export default function ReportsAdminPage() {
  return (
    <div className="space-y-8 p-4 sm:p-6">
      <PageHeader
        title="Reports"
        description="Overview of organization impact and financial metrics"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {placeholderMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm"
          >
            <span className="text-xs sm:text-sm font-semibold text-gray-500">{metric.label}</span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-gray-900">{metric.value}</div>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
