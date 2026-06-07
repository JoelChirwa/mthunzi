import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import WhyUmbrellaOfHope from "@/components/home/WhyUmbrellaOfHope";
import OurPrograms from "@/components/home/OurPrograms";
import FromBlogs from "@/components/home/FromBlogs";
import CTASection from "@/components/home/CTASection";
import Partners from "@/components/home/Partners";
import Footer from "@/components/home/Footer";

// Force server-side rendering so Partners & Blogs always show live DB data
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <WhyUmbrellaOfHope />
      <OurPrograms />
      <FromBlogs />
      <CTASection />
      <Partners />
      <Footer />
    </>
  );
}