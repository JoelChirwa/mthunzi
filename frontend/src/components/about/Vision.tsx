import { Eye } from "lucide-react";

export default function Vision() {
  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Icon */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Eye className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-gray-700 text-lg leading-relaxed text-justify">
              A climate-just future where communities and government have achieved a just 
              transition and green economy where youth are actively involved in shaping 
              sustainable change across the African continent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
