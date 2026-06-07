import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: Mail,
      title: "Email Address",
      content: "info@mthunzitrust.org",
      link: "mailto:info@mthunzitrust.org",
      description: "Send us an email anytime, we respond within 24 hours.",
    },
    {
      icon: Phone,
      title: "Phone Number",
      content: "+265 996 654 088",
      link: "tel:+265996654088",
      description: "Available Monday to Friday, 8:00 AM - 5:00 PM.",
    },
    {
      icon: MapPin,
      title: "Our Headquarters",
      content: "Mthunzi Trust Office, Lilongwe, Malawi",
      link: null,
      description: "Located in the heart of Lilongwe's community support zone.",
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon - Fri: 8:00 AM - 5:00 PM",
      link: null,
      description: "Closed on weekends and national holidays.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-green-900/5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full">
          Contact Details
        </span>
        <h3 className="mt-4 text-2xl font-black text-gray-900 tracking-tight">Direct Information</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Feel free to reach out to us using the direct channels below.
        </p>

        <div className="mt-8 space-y-6">
          {contactDetails.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="group flex gap-4 transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700 group-hover:bg-green-700 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="mt-1 inline-block text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-gray-700">{item.content}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-8 shadow-lg shadow-green-900/5">
        <h4 className="text-sm font-bold text-gray-900 tracking-wide">Connect With Our Socials</h4>
        <p className="mt-1 text-xs text-gray-600">Stay updated with our latest field initiatives.</p>
        <div className="mt-4 flex gap-3">
          {[
            { name: "Facebook", icon: FaFacebook, href: "https://facebook.com/mthunzitrust" },
            { name: "LinkedIn", icon: FaLinkedin, href: "https://linkedin.com/company/mthunzitrust" },
          ].map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-700 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-md"
                aria-label={`Follow us on ${social.name}`}
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
