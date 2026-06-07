import Footer from "@/components/home/Footer";
import ProgramCTA from "@/components/programs/ProgramCTA";
import ProgramHero from "@/components/programs/ProgramHero";
import ProgramOverview from "@/components/programs/ProgramOverview";
import ProgramObjectives from "@/components/programs/ProgramObjectives";
import ProgramImpact from "@/components/programs/ProgramImpact";

export const metadata = {
  title: "Climate Justice Advocacy | Mthunzi Trust",
  description:
    "Climate justice advocacy programs that empower youth and communities to shape policy and demand equitable solutions.",
};

const objectives = [
  {
    title: "Youth Leadership",
    description:
      "Develop youth-led advocacy skills to participate confidently in climate decision-making processes.",
  },
  {
    title: "Community Engagement",
    description:
      "Mobilize local communities around climate resilience, rights, and policy awareness.",
  },
  {
    title: "Policy Influence",
    description:
      "Build partnerships and campaigns that elevate community priorities in climate policy forums.",
  },
  {
    title: "Sustainable Action",
    description:
      "Support activities that connect climate justice advocacy with practical, long-term outcomes.",
  },
];

const impact = {
  trees: "25,000+",
  treesLabel: "Youth Engaged",
  communities: "120+",
  communitiesLabel: "Communities Reached",
  youth: "3,500+",
  youthLabel: "Advocates Trained",
  carbon: "15,000+",
  carbonLabel: "Advocacy Actions",
};

export default function ClimateJusticePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ProgramHero
        title="Climate Justice Advocacy"
        subtitle="Empowering young people and communities to shape climate policy and demand fair, inclusive solutions."
        image="/images/climate.jpg"
      />
      <ProgramOverview
        shortDescription="Justice, resilience, and youth-led climate action."
        fullDescription="Our Climate Justice Advocacy program supports young leaders and community groups to engage in climate policy, demand climate equity, and pursue sustainable adaptation solutions across Malawi."
      />
      <ProgramObjectives objectives={objectives} />
      <ProgramImpact impact={impact} />
      <ProgramCTA programName="Climate Justice Advocacy" />
      <Footer />
    </main>
  );
}
