import { Button } from "@/components/ui/button";

export default function WhatWeStandFor() {
  return (
    <section className="w-full bg-gradient-to-br from-lime-100 to-green-100 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="flex justify-center">
            <img
              src="/images/edu.jfif"
              alt="Climate action in progress"
              className="rounded-lg shadow-lg w-full max-w-md object-cover"
            />
          </div>

          {/* Right side - Content */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
              What we stand for
            </h2>

            <div className="space-y-8">
              {/* Our Vision */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our vision</h3>
                <p className="text-gray-700 text-lg leading-relaxed text-justify">
                  A climate-just future where communities and government have achieved a just 
                  transition and green economy where youth are actively involved.
                </p>
              </div>

              {/* Our Mission */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our mission</h3>
                <p className="text-gray-700 text-lg leading-relaxed text-justify">
                  We act and advocate for Afrocentric climate justice by building a grassroots 
                  climate justice movement in Africa where youth are equipped with Afrocentric 
                  socio-environmental education to act, advocate and achieve climate justice in 
                  their communities.
                </p>
              </div>

              {/* Our Values */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our values</h3>
                <p className="text-gray-700 text-lg leading-relaxed text-justify">
                  Afrocentric, youth-led, inclusive, people-centered, collaboration
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 text-lg rounded"
                >
                  JOIN THE MOVEMENT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
