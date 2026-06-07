import Image from "next/image";

export default function WhyUmbrellaOfHope() {
  return (
    <section className="w-full bg-[#8dba55] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
              Why The Umbrella of Hope
            </h2>
            
            <p className="text-white text-lg leading-relaxed text-justify">
              We believe that hope is most powerful when it is backed by action, opportunity, and support. Like an umbrella that provides protection and shelter, Mthunzi Trust creates pathways for vulnerable youth and communities to overcome challenges and build resilient futures.
            </p>
            
            <p className="text-white text-lg leading-relaxed text-justify">
              Through strategic partnerships and community-driven initiatives, we serve as a catalyst for sustainable change, ensuring that no one is left behind in the journey toward development and prosperity.
            </p>
            
            <button className="bg-white text-[#8dba55] font-extrabold py-4 px-10 text-sm md:text-base transition-colors uppercase tracking-[0.15em] rounded-sm shadow-md hover:bg-gray-100">
              Get Involved
            </button>
          </div>

          {/* Right Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/about.jpeg"
                alt="About Mthunzi Trust"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
