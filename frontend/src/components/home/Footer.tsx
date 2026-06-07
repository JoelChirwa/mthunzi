import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Mthunzi Trust</h3>
            <p className="text-gray-400 text-sm">
              A youth-led, nonprofit organisation dedicated to empowering young people and communities in Malawi through community-driven action, advocacy, empowerment and social impact programs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-400 hover:text-white transition">
                  Our Programmes
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-400 hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h3 className="text-lg font-bold mb-4">Programmes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/programs/education" className="text-gray-400 hover:text-white transition">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/programs/environment" className="text-gray-400 hover:text-white transition">
                  Environmental Conservation
                </Link>
              </li>
              <li>
                <Link href="/programs/youth" className="text-gray-400 hover:text-white transition">
                  Youth Empowerment
                </Link>
              </li>
              <li>
                <Link href="/programs/community" className="text-gray-400 hover:text-white transition">
                  Community Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Lilongwe, Malawi</li>
              <li>info@mthunzitrust.org</li>
              <li>+265 123 456 789</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mthunzi Trust. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
