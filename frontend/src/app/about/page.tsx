import AboutHero from "@/components/about/AboutHero";
import CEOMessage from "@/components/about/CEOMessage";
import WhatWeStandFor from "@/components/about/WhatWeStand4";
import Team from "@/components/about/Team";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "About Us | Mthunzi",
  description: "Learn about Mthunzi's mission, vision, and values in building a grassroots climate justice movement in Africa.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <CEOMessage />
      <WhatWeStandFor />
      <Team />
      <Footer />
    </main>
  );
}
