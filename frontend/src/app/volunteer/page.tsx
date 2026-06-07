import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/home/Footer";
import VolunteerForm from "@/components/volunteer/VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer Application | Mthunzi Trust",
  description:
    "Apply to become a volunteer at Mthunzi Trust and make an impact in community education, climate justice, and development across Malawi.",
};

export default function VolunteerPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative h-80 md:h-[400px] w-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center mt-[60px]">
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <div className="text-center text-white z-10 px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg tracking-tight">
            Volunteer With Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-md leading-relaxed">
            Your time, passion, and skills can empower youth and build resilient communities across Malawi.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="bg-gradient-to-r from-yellow-700 to-yellow-800 px-4 py-16 sm:px-6 md:px-12 lg:px-24 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
            
            {/* Info Panel */}
            <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
              <div className="bg-white/10 border border-white/30 rounded-3xl p-8 space-y-4">
                <h3 className="text-xl font-extrabold text-white">Why Volunteer?</h3>
                <ul className="space-y-3 text-sm text-white/90 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-yellow-200">✔</span>
                    <span>Make a direct difference in rural communities.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-yellow-200">✔</span>
                    <span>Gain hands-on experience in development programs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-yellow-200">✔</span>
                    <span>Connect with passionate local and international leaders.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 border border-white/30 rounded-3xl p-8 space-y-4">
                <h3 className="text-xl font-extrabold text-white">Areas of Support</h3>
                <p className="text-sm text-white/80 leading-relaxed font-medium">
                  We look for volunteers who can support:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Community-led Action", "Climate Adaptation Advocacy", "Education Championship", "Youth-led Environmental Solutions", "SRHR Advocacy & Awareness", "Tree Planting", "Coordination of Events"].map((tag) => (
                    <span key={tag} className="text-xs bg-white/20 text-white border border-white/40 rounded-full px-3 py-1 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <VolunteerForm />
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
