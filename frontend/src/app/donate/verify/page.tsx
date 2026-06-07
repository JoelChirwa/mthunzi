import { Metadata } from "next";
import { Suspense } from "react";
import { VerificationPage } from "@/components/donations/VerificationPage";

export const metadata: Metadata = {
  title: "Verify Donation | Mthunzi Trust",
  description: "Verifying your donation to Mthunzi Trust",
};

export default function DonateVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-600">Loading verification...</p>
        </div>
      }
    >
      <VerificationPage />
    </Suspense>
  );
}
