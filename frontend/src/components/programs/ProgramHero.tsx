import Image from "next/image";

interface ProgramHeroProps {
  title: string;
  subtitle: string;
  image: string;
}

export default function ProgramHero({
  title,
  subtitle,
  image,
}: ProgramHeroProps) {
  return (
    <section className="relative h-96 md:h-[500px] w-full overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto text-justify">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
