import { Lightbulb, Eye, Heart } from "lucide-react";

export default function WhatWeStandFor() {
  return (
    <section className="w-full bg-gradient-to-r from-yellow-700 to-yellow-800 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-4 border-white rounded-lg p-8 sm:p-12 space-y-12">
          
          {/* Mission */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-white text-base sm:text-lg leading-relaxed text-justify">
                To empower youth and communities through education, entrepreneurship, environmental sustainability, and sexual and reproductive health rights (SRHR), fostering holistic and sustainable development in Malawi.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-white text-base sm:text-lg leading-relaxed text-justify">
                A thriving Malawi where empowered youth lead in sustainable development, economic growth, and environmental protection, achieving healthier, educated, and resilient communities.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Core Values</h3>
              <ul className="text-white text-base sm:text-lg space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">•</span>
                  <span>Integrity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">•</span>
                  <span>Accountability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">•</span>
                  <span>Transparency</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">•</span>
                  <span>Innovation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">•</span>
                  <span>Collaboration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">•</span>
                  <span>Inclusivity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1">•</span>
                  <span>Empowerment</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
