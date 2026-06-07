import { Metadata } from "next";
import { DonationForm } from "@/components/donations/DonationForm";

export const metadata: Metadata = {
  title: "Donate | Mthunzi Trust",
  description: "Support Mthunzi Trust's mission by making a donation to fund our programs and initiatives in Malawi.",
};

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] w-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg">
            Make a Difference
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
            Your donation directly supports our life-changing programs
          </p>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <DonationForm />
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center">
            Your Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-green-600 mb-3">$25</div>
              <p className="font-semibold text-gray-900 mb-2">Educational Support</p>
              <p className="text-gray-600">Provides learning materials for a child for one month</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-black text-blue-600 mb-3">$50</div>
              <p className="font-semibold text-gray-900 mb-2">Health Initiative</p>
              <p className="text-gray-600">Supports medical screening and health education</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-black text-green-700 mb-3">$100</div>
              <p className="font-semibold text-gray-900 mb-2">Community Program</p>
              <p className="text-gray-600">Funds a complete community development project</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">Is my donation secure?</h3>
              <p className="text-gray-600">
                Yes, all donations are processed through Paychangu, a secure and trusted payment gateway. Your financial information is encrypted and never stored on our servers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept Airtel Money, TNM Mpamba, and Debit/Credit Cards (Visa, Mastercard, etc.) through our secure Paychangu integration.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">Will I receive a receipt?</h3>
              <p className="text-gray-600">
                Yes, a receipt will be sent to your email address immediately after your donation is processed successfully.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">Is my donation tax-deductible?</h3>
              <p className="text-gray-600">
                Please contact us at info@mthunzitrust.org for information about tax deductibility of your donation.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I donate in different currencies?</h3>
              <p className="text-gray-600">
                Yes, we support donations in USD and MWK (Malawian Kwacha). You can select your preferred currency during the donation process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
