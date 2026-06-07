import { getPartners } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

type Partner = {
  id?: string;
  _id?: string;
  name: string;
  logo?: string | null;
  website?: string | null;
  status?: string;
};

export default async function Partners() {
  const allPartners = await getPartners();
  const partnerList = Array.isArray(allPartners) ? allPartners : [];

  // Only show active partners on the public home page
  const activePartners = partnerList.filter(
    (p: Partner) => !p.status || p.status === "active"
  );

  if (activePartners.length === 0) return null;

  // Triplicate for seamless infinite marquee
  const displayPartners = [
    ...activePartners,
    ...activePartners,
    ...activePartners,
  ];

  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4">
          Our Partners
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          We value the trust and collaboration of our partners, whose support
          strengthens our mission to empower youth and build resilient communities
          across Malawi.
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-0">
          {displayPartners.map((partner: Partner, index: number) => {
            const key = `${partner.id || partner._id}-${index}`;
            const card = (
              <div className="shrink-0 mx-8 flex flex-col items-center group">
                <div className="relative w-32 h-20 md:w-40 md:h-24 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-shadow">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      sizes="(max-width: 768px) 128px, 160px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-400 text-center leading-tight">
                      {partner.name}
                    </span>
                  )}
                </div>
              </div>
            );

            return partner.website ? (
              <Link
                key={key}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                {card}
              </Link>
            ) : (
              <div key={key}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
