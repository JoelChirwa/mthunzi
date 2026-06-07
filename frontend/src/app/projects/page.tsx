import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/home/Footer";
import { getProjects } from "@/lib/api";

export const metadata = {
  title: "Our Projects | Mthunzi Trust",
  description:
    "Explore Mthunzi Trust's community projects — past and present initiatives empowering youth, protecting the environment, and building resilient communities across Malawi.",
};

type Project = {
  id: string;
  title: string;
  slug?: string | { current?: string };
  description?: string;
  location?: string;
  goal?: string;
  impact?: string[];
  image?: string;
  status?: string;
};

const placeholderProjects: Project[] = [
  {
    id: "1",
    title: "Lilongwe Urban Tree Planting",
    description:
      "A large-scale urban reforestation initiative in Lilongwe, planting indigenous trees across schools, public spaces, and community gardens. The project engages local youth groups as custodians, providing hands-on environmental stewardship training while combating urban heat and air pollution.",
    location: "Lilongwe, Malawi",
    goal: "To combat urban heat, reduce air pollution, and foster environmental stewardship among the youth in Lilongwe.",
    impact: [
      "10,000+ indigenous trees planted across schools and public sites",
      "25 community-managed green zones established",
      "150 youth trained as environmental custodians",
    ],
    image: "/images/env.jpg",
  },
  {
    id: "2",
    title: "Youth Climate Leadership Academy",
    description:
      "An intensive leadership and advocacy programme training young Malawians to become climate champions. Participants learn about climate science, policy advocacy, public speaking, and community mobilisation — equipping them to lead climate action in their own communities.",
    location: "Blantyre, Malawi",
    goal: "To build a network of youth advocates capable of representing Malawi in global dialogues and spearheading local action.",
    impact: [
      "800+ youth climate leaders certified",
      "12 district-level youth action clubs established",
      "3 policy proposals submitted to national environmental committees",
    ],
    image: "/images/climate.jpg",
  },
  {
    id: "3",
    title: "Rural Schools Education Support",
    description:
      "Providing comprehensive education support to under-resourced rural schools, including learning materials, teacher development workshops, and scholarship programmes for vulnerable students.",
    location: "Nkhotakota, Malawi",
    goal: "To improve literacy levels and infrastructural capacity in under-served educational centers.",
    impact: [
      "1,200+ students supplied with essential learning materials",
      "15 primary schools equipped with updated learning kits",
      "45 teachers trained in active, child-centered teaching methods",
    ],
    image: "/images/edu.jfif",
  },
  {
    id: "4",
    title: "Community SRHR Outreach",
    description:
      "Delivering sexual and reproductive health and rights education across rural communities, with a focus on adolescents and young women. Through peer-led workshops, mobile health clinics, and community dialogues, the project breaks stigma and ensures young people have access to accurate health services.",
    location: "Mangochi, Malawi",
    goal: "To reduce adolescent pregnancy rates and increase awareness of sexual and reproductive health rights.",
    impact: [
      "3,500+ youth reached with interactive health education workshops",
      "5 mobile health clinics deployed in high-need rural areas",
      "20 peer educators certified and actively leading discussions",
    ],
    image: "/images/hero.jpg",
  },
  {
    id: "5",
    title: "Mthunzi Community Garden Network",
    description:
      "Establishing community gardens in peri-urban areas to improve food security and livelihoods. Each garden serves as a hub for nutrition education, sustainable agriculture training, and income generation.",
    location: "Zomba, Malawi",
    goal: "To address food insecurity and foster sustainable livelihood skills through neighborhood farming.",
    impact: [
      "15 community gardens established and operational",
      "400+ families directly supported with fresh, nutritious produce",
      "30 hands-on workshops conducted on organic permaculture",
    ],
    image: "/images/about.jpeg",
  },
  {
    id: "6",
    title: "Clean Water & Waste Management Initiative",
    description:
      "Improving access to clean water and promoting responsible waste management in underserved communities. The project installs water purification stations, conducts waste sorting education, and trains local committees to sustain environmental health.",
    location: "Salima, Malawi",
    goal: "To decrease waterborne illnesses and build long-term waste disposal infrastructure.",
    impact: [
      "6 community boreholes completely rehabilitated",
      "2,000+ residents gained direct access to safe, clean drinking water",
      "2 clean-up campaigns launched in commercial centers",
    ],
    image: "/images/mthunzi.jpg",
  },
];

/* ─── Status badge colours ─── */
function StatusBadge({ status }: { status: string }) {
  const colours: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-800",
    ongoing: "bg-amber-100 text-amber-800",
    upcoming: "bg-sky-100 text-sky-800",
  };
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
        colours[status] ?? colours.ongoing
      }`}
    >
      {status}
    </span>
  );
}

/* ─── Single project card (alternating layout) ─── */
function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const normalizedStatus = project.status?.toString().toLowerCase() || 'ongoing';
  const isLocalImage = project.image
    ? project.image.startsWith('http://localhost') ||
      project.image.startsWith('http://127.0.0.1') ||
      project.image.startsWith('http://[::1]')
    : false;
  
  const isBackendUpload = project.image
    ? project.image.startsWith(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}`) ||
      project.image.startsWith('/uploads')
    : false;
  const useNextImage = Boolean(project.image) && !isLocalImage && !isBackendUpload;
  const imgSrc = project.image
    ? // if relative uploads path, prefix backend URL so browser requests backend directly
      project.image.startsWith('/uploads')
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${project.image}`
      : project.image
    : undefined;
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-2xl ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      {/* Image */}
      <div className="relative h-72 w-full shrink-0 overflow-hidden lg:h-auto lg:w-1/2">
        {project.image ? (
          useNextImage ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <img
              src={imgSrc}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-200 to-green-400">
            <span className="text-5xl">🌱</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
      </div>

      {/* Details */}
      <div className="flex w-full flex-col justify-center gap-4 p-8 lg:w-1/2 lg:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={normalizedStatus} />
          {project.location && (
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {project.location}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-extrabold leading-tight text-gray-900 lg:text-3xl">
          {project.title}
        </h3>

        {project.goal && (
          <p className="text-sm text-green-700 font-medium leading-relaxed">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded mr-2">Goal</span>
            {project.goal}
          </p>
        )}

        {project.description && (
          <p className="text-base leading-7 text-gray-600 text-justify">
            {project.description}
          </p>
        )}

        {project.impact && project.impact.length > 0 && (
          <div className="mt-2 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Impact & Outcomes</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
              {project.impact.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}


/* ─── Page ─── */
export default async function ProjectsPage() {
  const projects: Project[] = await getProjects();

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 py-28 sm:py-36">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-12">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            Making a Difference
          </span>
          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Our Projects
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            From reforestation and climate advocacy to education and health,
            discover the initiatives driving lasting change across Malawi.
          </p>
        </div>
      </section>

      {/* ── Projects list ── */}
      <section className="w-full bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl space-y-12 px-6 md:px-12">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-700">
              <p className="text-lg font-semibold">No projects are available yet.</p>
              <p className="mt-2 text-sm text-slate-500">
                Projects are loaded from the backend database once they are created.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            Want to Support a Project?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            Whether through volunteering, partnerships, or donations — your
            support helps us expand our impact and reach more communities.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/get-involved"
              className="rounded bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-orange-600"
            >
              Get Involved
            </Link>
            <Link
              href="/contact"
              className="rounded border-2 border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:border-white hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
