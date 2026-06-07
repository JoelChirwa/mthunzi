import Footer from "@/components/home/Footer";
import ProgramCTA from "@/components/programs/ProgramCTA";
import ProgramHero from "@/components/programs/ProgramHero";
import ProgramOverview from "@/components/programs/ProgramOverview";
import ProgramObjectives from "@/components/programs/ProgramObjectives";
import ProgramImpact from "@/components/programs/ProgramImpact";

export const metadata = {
  title: "Environmental Conservation | Mthunzi Trust",
  description:
    "Environmental conservation programs that protect ecosystems and support sustainable livelihoods in Malawi.",
};

const objectives = [
  {
    title: "Ecosystem Restoration",
    description:
      "Restore forests, wetlands, and natural habitats through community-driven action.",
  },
  {
    title: "Sustainable Livelihoods",
    description:
      "Support communities with eco-friendly income opportunities that protect the environment.",
  },
  {
    title: "Waste Management",
    description:
      "Promote waste reduction, recycling, and clean community practices.",
  },
  {
    title: "Climate Resilience",
    description:
      "Build adaptive capacity to withstand environmental change and protect local resources.",
  },
];

const impact = {
  trees: "12,000+",
  treesLabel: "Trees Planted",
  communities: "90+",
  communitiesLabel: "Communities Supported",
  youth: "4,200+",
  youthLabel: "Youth Engaged",
  carbon: "8,600+",
  carbonLabel: "Tonnes CO2 Impacted",
};

export default function EnvironmentalConservationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ProgramHero
        title="Environmental Conservation"
        subtitle="Protecting ecosystems and strengthening community resilience through conservation initiatives."
        image="/images/env.jpg"
      />
      <ProgramOverview
        shortDescription="Protecting nature, sustaining communities."
        fullDescription="Our Environmental Conservation program empowers communities to preserve forests, reduce waste, and build environmentally sustainable livelihoods that benefit people and planet."
      />
      <ProgramObjectives objectives={objectives} />
      <ProgramImpact impact={impact} />
      <ProgramCTA programName="Environmental Conservation" />
      <Footer />
    </main>
  );
}
