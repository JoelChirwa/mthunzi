import { Target } from "lucide-react";

export default function Mission() {
  return (
    <section className="w-full bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Icon */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed text-justify">
              We act and advocate for Afrocentric climate justice by building a grassroots 
              climate justice movement in Africa where youth are equipped with Afrocentric 
              socio-environmental education to act, advocate and achieve climate justice in 
              their communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
