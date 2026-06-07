import Image from "next/image";

export default function HowWeWork() {
  const areas = [
    {
      title: "Advocacy",
      image: "advocacy.webp",
    },
    {
      title: "Community-Driven Action",
      image: "/community.webp",
    },
    {
      title: "Capacity Building",
      image: "/capacity.jpg",
    },
    {
      title: "Empowerment",
      image: "/empowement.webp",
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-12 md:mb-16 text-center">
          We serve young people and vulnerable communities through:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {areas.map((area, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={area.image}
                  alt={area.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  loading={index < 2 ? "eager" : "lazy"}
                  priority={index < 2}
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-black text-center">
                {area.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
