import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Get Involved | Mthunzi Trust",
  description: "Join Mthunzi Trust and make a real difference. Explore ways to volunteer, partner, donate, or become a member.",
};

const actions = [
  {
    title: "Partner with us",
    href: "/contact",
    description:
      "Work together on programs and community development projects with a trusted local partner.",
    color: "bg-green-700 hover:bg-green-800",
  },
  {
    title: "Volunteer",
    href: "/volunteer",
    description:
      "Offer your time, skills, or experience to support our youth, health, and environmental programs.",
    color: "bg-blue-700 hover:bg-blue-800",
  },
  {
    title: "Become a member",
    href: "/contact",
    description:
      "Join our community and stay connected to events, learning, and advocacy opportunities.",
    color: "bg-purple-700 hover:bg-purple-800",
  },
  {
    title: "Donate",
    href: "/donate",
    description:
      "Provide financial support to expand our impact and sustain essential programs across Malawi.",
    color: "bg-red-700 hover:bg-red-800",
  },
];

export default function GetInvolvedPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative h-80 md:h-96 w-full bg-linear-to-r from-green-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg">
            Get Involved
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
            Multiple ways to support our mission and create positive change.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            {actions.map((action) => (
              <div key={action.title} className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900">{action.title}</h2>
                <p className="mt-4 text-gray-600 leading-relaxed">{action.description}</p>
                <Link
                  href={action.href}
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-white transition ${action.color}`}
                >
                  {action.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-gray-100">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">Partner with us</p>
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
              Amplify impact through partnership.
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Partnering with Mthunzi Trust gives organizations a trusted route to deliver real outcomes for youth, communities, and ecosystems across Malawi.
            </p>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-green-700 px-8 py-4 text-sm font-bold uppercase tracking-[0.3em] text-white transition hover:bg-green-800"
            >
              Learn about partnerships
            </Link>
          </div>
          <div className="rounded-3xl bg-linear-to-br from-green-100 to-green-200 p-10 text-center shadow-sm">
            <div className="text-5xl font-black text-green-700">🤝</div>
            <p className="mt-4 text-lg font-semibold text-gray-900">Collaborate on programs, funding, training, and storytelling.</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
          <div className="rounded-3xl bg-linear-to-br from-blue-100 to-blue-200 p-10 text-center shadow-sm">
            <div className="text-5xl font-black text-blue-700">🌍</div>
            <p className="mt-4 text-lg font-semibold text-gray-900">Volunteer directly with communities and program teams.</p>
          </div>
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Volunteer now</p>
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
              Your time helps us deliver more education and health services.
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              From event facilitation to mentorship, volunteers support the work that changes lives every day.
            </p>
            <Link
              href="/volunteer"
              className="inline-flex rounded-full bg-blue-700 px-8 py-4 text-sm font-bold uppercase tracking-[0.3em] text-white transition hover:bg-blue-800"
            >
              Sign up to volunteer
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-linear-to-r from-blue-600 to-green-600 py-16 md:py-24 px-6 md:px-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to make a difference?</h2>
          <p className="text-lg text-white/90 mb-8">
            Choose the path that fits your skills, passions, and support style — and help us build stronger communities.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-700 transition hover:bg-gray-100"
          >
            Start here
          </Link>
        </div>
      </section>
    </main>
  );
}
