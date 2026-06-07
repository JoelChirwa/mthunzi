import { Users, Heart, Globe, Lightbulb, Handshake } from "lucide-react";

const values = [
  {
    icon: Globe,
    title: "Afrocentric",
    description: "Centering African voices, wisdom, and solutions in climate action",
  },
  {
    icon: Users,
    title: "Youth-Led",
    description: "Empowering young people to lead and drive climate justice initiatives",
  },
  {
    icon: Heart,
    title: "Inclusive",
    description: "Creating space for diverse perspectives and lived experiences",
  },
  {
    icon: Lightbulb,
    title: "People-Centered",
    description: "Prioritizing the needs and wellbeing of communities we serve",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    description: "Working together across sectors and communities for greater impact",
  },
];

export default function CoreValues() {
  return (
    <section className="w-full bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-gray-600 text-lg">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="flex flex-col items-start">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-justify">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
