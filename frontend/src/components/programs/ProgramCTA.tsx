import Link from "next/link";

export default function ProgramCTA({ programName }: { programName: string }) {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-gradient-to-r from-blue-600 to-green-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
          Get Involved in {programName}
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto text-justify">
          Join us in making a real difference. Whether you want to volunteer, donate, or partner with us,
          there are many ways to support our environmental conservation efforts.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/contact"
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-8 rounded-lg transition-all duration-300 uppercase text-sm tracking-wide"
          >
            Contact Us
          </Link>
          <Link
            href="/"
            className="bg-transparent hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg border-2 border-white transition-all duration-300 uppercase text-sm tracking-wide"
          >
            Learn About Other Programs
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🤝",
              title: "Volunteer",
              description: "Join our team and contribute your skills and passion.",
              href: "/contact",
            },
            {
              icon: "💰",
              title: "Donate",
              description: "Support our mission financially to maximize impact.",
              href: "/donate",
            },
            {
              icon: "🤲",
              title: "Partner",
              description: "Collaborate with us for greater environmental impact.",
              href: "/contact",
            },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="bg-white/10 hover:bg-white/20 rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-white/80 text-sm text-justify">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
