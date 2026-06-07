import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-700 to-green-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Join Our Mission
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto text-justify">
            Together, we can create lasting change in our communities. 
            Partner with us or get involved today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-green-700 hover:bg-gray-100 font-bold px-8 py-4"
            >
              <Link href="/partner">
                Partner With Us
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4"
            >
              <Link href="/get-involved">
                Get Involved
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
