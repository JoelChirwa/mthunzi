import Footer from "@/components/home/Footer";
import ProgramCTA from "@/components/programs/ProgramCTA";
import ProgramHero from "@/components/programs/ProgramHero";
import ProgramOverview from "@/components/programs/ProgramOverview";
import ProgramObjectives from "@/components/programs/ProgramObjectives";
import ProgramImpact from "@/components/programs/ProgramImpact";

export const metadata = {
  title: "Sexual and Reproductive Health Rights | Mthunzi Trust",
  description:
    "SRHR programs that provide youth and communities with reproductive health education, services, and support.",
};

const objectives = [
  {
    title: "Comprehensive Education",
    description:
      "Deliver accurate, youth-friendly sexual and reproductive health information.",
  },
  {
    title: "Health Services",
    description:
      "Support access to essential reproductive health services and counseling.",
  },
  {
    title: "Community Outreach",
    description:
      "Engage parents, schools, and leaders in healthy, supportive conversations.",
  },
  {
    title: "Youth Empowerment",
    description:
      "Build confidence and decision-making skills for young people.",
  },
];

const impact = {
  trees: "9,800+",
  treesLabel: "Young People Reached",
  communities: "65+",
  communitiesLabel: "Health Sessions Delivered",
  youth: "3,100+",
  youthLabel: "Counseling Contacts",
  carbon: "27,000+",
  carbonLabel: "Hours of Education",
};

export default function SRHRPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ProgramHero
        title="Sexual and Reproductive Health Rights"
        subtitle="Providing youth and communities with the knowledge and services needed to make informed health decisions."
        image="/images/hero.jpg"
      />
      <ProgramOverview
        shortDescription="Supporting health, rights and informed choices."
        fullDescription="Our SRHR program provides education, services, and community outreach to improve reproductive health outcomes and support young people in Malawi."
      />
      <ProgramObjectives objectives={objectives} />
      <ProgramImpact impact={impact} />
      <ProgramCTA programName="Sexual and Reproductive Health Rights" />
      <Footer />
    </main>
  );
}
