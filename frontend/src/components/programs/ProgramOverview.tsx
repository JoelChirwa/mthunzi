export default function ProgramOverview({
  shortDescription,
  fullDescription,
}: {
  shortDescription: string;
  fullDescription: string;
}) {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-xl md:text-2xl font-black text-blue-600 mb-4">
              {shortDescription}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed text-justify">
              {fullDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: "🌱",
                title: "Sustainable",
                description:
                  "Building long-term solutions for environmental protection and conservation.",
              },
              {
                icon: "👥",
                title: "Community-Driven",
                description:
                  "Empowering local communities to be stewards of their own environment.",
              },
              {
                icon: "🌍",
                title: "Global Impact",
                description:
                  "Contributing to global climate goals and sustainable development.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200 text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700 text-sm text-justify">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
