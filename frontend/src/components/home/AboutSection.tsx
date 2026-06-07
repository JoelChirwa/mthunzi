"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          let current = 0;
          const increment = end / 50; // Divide animation into 50 steps
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
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
  }, [end]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-black mb-2 text-center">
      {count}
      {suffix}
    </div>
  );
}

export default function AboutSection() {
  return (
    <section className="bg-gradient-to-r from-cyan-500 to-blue-600 py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              Who We Are
            </h2>
            <p className="text-base md:text-lg leading-relaxed opacity-95 mb-8 text-justify">
              Mthunzi Trust is a Malawian Youth-led non-profit organisation. Our work is in line with Sustainable Development Goals, Malawi Agenda 2030 and Malawi Vision 2063. We work with young people, people living with disabilities, schools, community & faith-based organisations, government and other stakeholders to build resilience and sustainable development.
            </p>
            
            {/* Impact Metrics */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <AnimatedCounter end={10000} suffix="+" />
                <div className="text-sm md:text-base font-semibold">Youth Empowered & Supported</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <AnimatedCounter end={20} suffix="+" />
                <div className="text-sm md:text-base font-semibold">Schools & Communities Reached</div>
              </div>
            </div>
            
            <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 uppercase text-sm tracking-wide">
              Do you want to be part of the change? Join us today!
            </button>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full">
            <Image
              src="/images/mthunzi.jpg"
              alt="Mthunzi Trust - Empowering Youth and Communities for Sustainable Development "
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
