interface Objective {
  title: string;
  description: string;
}

export default function ProgramObjectives({
  objectives,
}: {
  objectives: Objective[];
}) {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12" style={{
      background: "linear-gradient(135deg, #f0fdf4 0%, #e0f7e4 100%)",
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4">
            Our Objectives
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-justify">
            Key focus areas and goals of our Environmental Conservation program.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                    <span className="text-2xl font-bold text-green-600">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {objective.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {objective.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
