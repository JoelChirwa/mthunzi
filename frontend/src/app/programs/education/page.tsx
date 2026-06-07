import Footer from "@/components/home/Footer";
import ProgramCTA from "@/components/programs/ProgramCTA";
import ProgramHero from "@/components/programs/ProgramHero";
import ProgramOverview from "@/components/programs/ProgramOverview";
import ProgramObjectives from "@/components/programs/ProgramObjectives";
import ProgramImpact from "@/components/programs/ProgramImpact";

export const metadata = {
  title: "Education Support | Mthunzi Trust",
  description:
    "Education support programs that improve literacy, school access, and future opportunities for youth in Malawi.",
};

const objectives = [
  {
    title: "Learning Materials",
    description:
      "Provide books, school supplies, and training resources to learners and educators.",
  },
  {
    title: "Teacher Support",
    description:
      "Strengthen teaching capacity through training, mentorship, and classroom support.",
  },
  {
    title: "Youth Skills",
    description:
      "Deliver life skills and vocational training that create pathways to work and independence.",
  },
  {
    title: "School Access",
    description:
      "Support enrolment, attendance, and inclusive learning for children in underserved communities.",
  },
];

const impact = {
  trees: "18,000+",
  treesLabel: "Learners Supported",
  communities: "75+",
  communitiesLabel: "Schools Reached",
  youth: "5,200+",
  youthLabel: "Training Participants",
  carbon: "40,000+",
  carbonLabel: "Learning Hours",
};

export default function EducationSupportPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ProgramHero
        title="Education Support"
        subtitle="Improving access to learning, skills, and opportunities for young people in Malawi.
        "
        image="/images/edu.jfif"
      />
      <ProgramOverview
        shortDescription="Building brighter futures through education."
        fullDescription="Our Education Support program focuses on literacy, teacher development, life skills training, and school access to help youth thrive academically and professionally."
      />
      <ProgramObjectives objectives={objectives} />
      <ProgramImpact impact={impact} />
      <ProgramCTA programName="Education Support" />
      <Footer />
    </main>
  );
}
