import Link from "next/link";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Programs | Mthunzi Trust",
  description:
    "Explore Mthunzi Trust's programs focused on climate justice, education, health, and environmental conservation.",
};

const programs = [
  {
    title: "Environmental Conservation",
    description:
      "Tree planting, forest restoration, and community awareness campaigns that protect Malawi's natural resources.",
    href: "/programs/environmental-conservation",
  },
  {
    title: "Climate Justice Advocacy",
    description:
      "Empowering youth and communities to participate in climate policy, advocacy, and resilience-building initiatives.",
    href: "/programs/climate-justice",
  },
  {
    title: "Education Support",
    description:
      "Improving literacy, life skills, and school access through targeted youth and community education programs.",
    href: "/programs/education",
  },
  {
    title: "Sexual and Reproductive Health Rights",
    description:
      "Delivering critical SRHR education, services, and outreach to young people and families.",
    href: "/programs/srhr",
  },
];

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-linear-to-br from-green-700 via-emerald-600 to-sky-700 py-24 text-white">
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/90">
            Programmes at a glance
          </p>
          <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">
            Our Programs
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90 sm:text-xl">
            Discover how Mthunzi Trust supports sustainable change through education, health, climate, and conservation work across Malawi.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-green-700 transition hover:bg-gray-100"
            >
              Contact Us
            </Link>
            <Link
              href="/donate"
              className="rounded-full border border-white/60 bg-white/10 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:bg-white/20"
            >
              Support the work
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Program pathways</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 leading-relaxed">
              Each area is designed to build skills, strengthen communities, and deliver measurable impact for youth and families.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {programs.map((program) => (
              <Link
                key={program.title}
                href={program.href}
                className="group block overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-green-500 to-teal-400" />
                <h3 className="text-2xl font-extrabold text-gray-900">{program.title}</h3>
                <p className="mt-4 text-gray-600 leading-relaxed">{program.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-green-700">
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-600 to-sky-600 py-20 px-6 md:px-12 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Ready to support meaningful change?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Explore how your support can help young people, families, and communities thrive in Malawi.
          </p>
          <Link
            href="/donate"
            className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-green-700 transition hover:bg-gray-100"
          >
            Donate today
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
