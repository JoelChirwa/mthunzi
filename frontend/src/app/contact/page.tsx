import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactMap from "@/components/contact/ContactMap";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Contact Us | Mthunzi Trust",
  description: "Get in touch with Mthunzi Trust. We'd love to hear from you about partnerships, donations, or inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactHero />

      <section className="bg-gradient-to-b from-gray-50/80 via-white to-gray-50/80 px-8 py-16 md:px-16 lg:px-24 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24 border-t border-gray-50">
        <ContactMap />
      </section>

      <Footer />
    </main>
  );
}
