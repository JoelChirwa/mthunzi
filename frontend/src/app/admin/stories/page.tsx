import PageHeader from "@/components/admin/PageHeader";

type Story = {
  id: string;
  title: string;
  author: string;
  status: string;
  createdAt: string;
};

const placeholderStories: Story[] = [
  {
    id: "1",
    title: "How Tree Planting Transformed Our Community",
    author: "Grace Banda",
    status: "APPROVED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Empowering Girls in STEM Education",
    author: "Tariro Chanza",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
];

export default function StoriesAdminPage() {
  return (
    <div className="space-y-8 p-4 sm:p-6">
      <PageHeader
        title="Stories"
        description="Manage community impact stories and testimonials"
      />

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Story Title</th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {placeholderStories.map((story) => (
              <tr key={story.id}>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">{story.title}</td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{story.author}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                    story.status === "APPROVED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {story.status}
                  </span>
                </td>
                <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {new Date(story.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
