"use client";

import { useEffect, useRef, useState } from "react";

interface ProgramImpact {
  trees: string;
  treesLabel: string;
  communities: string;
  communitiesLabel: string;
  youth: string;
  youthLabel: string;
  carbon: string;
  carbonLabel: string;
}

function StatCounter({ value, label }: { value: string; label: string }) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          // Extract number from string (e.g., "50,000+" -> 50000)
          const numStr = value.replace(/[^0-9]/g, "");
          const num = parseInt(numStr) || 0;
          
          let current = 0;
          const increment = num / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(
                Math.floor(current).toLocaleString() + 
                (value.includes("+") ? "+" : "")
              );
            }
          }, 30);

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-green-600 mb-2">
        {displayValue}
      </div>
      <p className="text-gray-700 font-semibold">{label}</p>
    </div>
  );
}

export default function ProgramImpact({ impact }: { impact: ProgramImpact }) {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4">
            Our Impact
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-justify">
            Measurable results from our environmental conservation efforts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 border border-green-200">
            <StatCounter value={impact.trees} label={impact.treesLabel} />
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8 border border-blue-200">
            <StatCounter value={impact.communities} label={impact.communitiesLabel} />
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200">
            <StatCounter value={impact.youth} label={impact.youthLabel} />
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-8 border border-orange-200">
            <StatCounter value={impact.carbon} label={impact.carbonLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
