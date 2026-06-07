import Image from "next/image";

export default function CEOMessage() {
  return (
    <section className="w-full bg-gradient-to-br from-green-50 to-blue-50 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-16">
          Message from the Founder and CEO
        </h2>

        {/* Message Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left side - CEO Image and Info */}
          <div className="flex flex-col items-center lg:items-start flex-shrink-0 lg:w-56">
            <div className="w-56 h-56 rounded-full overflow-hidden shadow-2xl flex-shrink-0 border-4 border-green-600 mb-6">
              <Image
                src="/images/symon.jpg"
                alt="Founder & CEO of Mthunzi"
                width={224}
                height={224}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-gray-900">Symon Satiele</p>
              <p className="text-lg text-green-600 font-semibold">Founder and Chief Executive Officer</p>
            </div>
          </div>

          {/* Right side - Message with enhanced styling */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 border-l-4 border-green-600">
              <p className="text-gray-700 text-lg leading-relaxed mb-6 text-justify">
                Welcome to <span className="font-bold text-green-700 text-xl">Mthunzi Trust — The Umbrella of Hope.</span> Mthunzi Trust is a youth-led non-profit organization duly registered by the Government of Malawi through the Registrar General's Office under the Trustees Incorporation Act. We believe that empowered youth and resilient communities are the foundation of sustainable development. Through innovation, collaboration, and community-driven solutions, we are nurturing a generation of leaders capable of addressing today's challenges while building a more inclusive, prosperous and sustainable future. As you explore our work, we invite you to join us in advancing hope, empowering communities, and creating lasting impact for generations to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
