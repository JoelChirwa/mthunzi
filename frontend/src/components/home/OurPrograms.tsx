import Image from "next/image";
import Link from "next/link";

export default function OurPrograms() {
  const programs = [
    {
      title: "Environmental Conservation",
      description: "Tree planting, forest restoration, and waste management awareness to protect our planet.",
      image: "/images/env.jpg",
      href: "/programs/environmental-conservation",
    },
    {
      title: "Climate Justice Advocacy",
      description: "Engaging youth and local communities to participate in climate change spaces and policy discussions.",
      image: "/images/climate.jpg",
      href: "/programs/climate-justice",
    },
    {
      title: "Education",
      description: "Comprehensive education support and skills development programs for youth in rural and underserved communities.",
      image: "/images/edu.jfif",
      href: "/programs/education",
    },
    {
      title: "SRHR",
      description: "Empowering young people with knowledge on sexual and reproductive health rights.",
      image: "/images/hero.jpg",
      href: "/programs/srhr",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24" style={{
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    }}>
      <div className="max-w-7xl mx-auto px-12 md:px-24 lg:px-32 xl:px-48">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-12 md:mb-16 text-center">
          Our Programmes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {programs.map((program, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <div className="p-6 space-y-4 flex flex-col min-h-[200px]">
                <h3 className="text-xl md:text-2xl font-bold text-black text-center">
                  {program.title}
                </h3>
                <p className="text-gray-700 text-center grow text-justify">
                  {program.description}
                </p>
                <Link
                  href={program.href}
                  className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-extrabold py-4 px-8 text-sm md:text-base transition-colors uppercase tracking-[0.15em] rounded-sm shadow-md w-full text-center"
                >
                  Find Out More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
