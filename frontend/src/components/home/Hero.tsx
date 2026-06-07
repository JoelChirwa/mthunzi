"use client";

import Image from "next/image";
import Link from "next/link";

/* Small decorative spark / asterisk SVG */
function Spark({ className, delay = "0s" }: { className?: string; delay?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        animation: `float 3s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <path
        d="M14 0 L16 12 L28 14 L16 16 L14 28 L12 16 L0 14 L12 12 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes parallax {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-parallax {
          animation: parallax 4s ease-in-out infinite;
        }
      `}</style>
      <section
        className="w-full relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 40% 50%, #d4e8a0 0%, #b6d87a 35%, #a3ca6a 60%, #8dba55 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-20 sm:pt-24 md:pt-32 py-12 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1 animate-fadeInUp text-center sm:text-left">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-5xl xl:text-6xl font-black text-black leading-relaxed tracking-tighter text-center sm:text-left drop-shadow-lg">
                Welcom to Mthunzi Trust, The Umbrella Of Hope
              </p>

              <Link
                href="/get-involved"
                className="inline-block bg-[#e8643a] hover:bg-[#d4562e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e8643a] text-white font-extrabold py-3 sm:py-4 px-6 sm:px-10 text-xs sm:text-sm md:text-base uppercase tracking-[0.15em] rounded-sm shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ease-out text-center"
              >
                Get Involved
              </Link>
            </div>

            {/* Divider on Mobile */}
            <div className="lg:hidden h-px bg-black/20 w-full my-2" />

            {/* Right Image Section */}
            <div className="relative flex items-center justify-center order-1 lg:order-2 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              {/* Spark top-right */}
              <Spark
                className="absolute -top-2 right-4 text-black w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7"
                delay="0s"
              />

              {/* Circular Image with Parallax */}
              <div className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[340px] lg:h-[340px] xl:w-[400px] xl:h-[400px] rounded-full overflow-hidden border-[4px] sm:border-[5px] lg:border-[6px] border-white/60 shadow-xl flex-shrink-0 animate-parallax">
                <Image
                  src="/images/hero.jpg"
                  alt="Youth climate activists holding protest signs"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                  loading="eager"
                />
              </div>

              {/* Spark bottom-right */}
              <Spark
                className="absolute bottom-4 right-2 text-black w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8"
                delay="0.5s"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
