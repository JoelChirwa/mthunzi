"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "ABOUT US", href: "/about" },
    { label: "PROJECTS", href: "/projects" },
    { label: "PROGRAMS", href: "/programs" },
    { label: "BLOGS", href: "/blogs" },
    { label: "CONTACT", href: "/contact" },
  ];

  const isDarkText = isScrolled || isOpen || isHome;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? "bg-white/90 backdrop-blur-md shadow-md py-3 border-b border-gray-100"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative w-12 h-12 border-2 border-black rounded-full p-1 flex items-center justify-center bg-white shadow-sm">
              <Image
                src="/images/mthunzi-trust-logo.png"
                alt="Mthunzi Trust Logo"
                fill
                sizes="44px"
                className="object-contain p-1"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black tracking-widest">
                <span className={isDarkText ? "text-green-700" : "text-white"}>
                  MTHUNZI
                </span>
                <span className="text-orange-500 ml-1">TRUST</span>
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs font-black tracking-widest transition-colors ${
                  isDarkText
                    ? "text-gray-800 hover:text-green-700"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/donate"
              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-6 py-3 rounded transition-all duration-200 uppercase text-xs tracking-wider shadow-md hover:shadow-lg active:scale-95"
            >
              Donate
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded transition-colors ${
              isDarkText
                ? "text-black hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-2.5 px-3 text-sm font-bold text-gray-800 hover:bg-green-50 hover:text-green-800 rounded transition"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
