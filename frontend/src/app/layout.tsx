import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import AuthProvider from "@/components/providers/SessionProvider";
import Analytics from "@/components/Analytics";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mthunzitrust.org";
const logoUrl = `${siteUrl}/images/mthunzi-trust-logo.png`;

export const metadata: Metadata = {
  title: {
    default: "Mthunzi Trust",
    template: "%s | Mthunzi Trust",
  },
  description:
    "Empowering communities through education, climate justice, and sustainable development across Malawi.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Mthunzi Trust",
    title: "Mthunzi Trust — Empowering Communities in Malawi",
    description:
      "Empowering communities through education, climate justice, and sustainable development across Malawi.",
    url: siteUrl,
    images: [
      {
        url: logoUrl,
        width: 1200,
        height: 630,
        alt: "Mthunzi Trust Logo",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mthunzi Trust — Empowering Communities in Malawi",
    description:
      "Empowering communities through education, climate justice, and sustainable development across Malawi.",
    images: [logoUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Mthunzi Trust",
        "description": "Empowering communities through education, climate justice, and sustainable development across Malawi.",
        "publisher": {
          "@id": `${siteUrl}/#organization`
        }
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Mthunzi Trust",
        "url": siteUrl,
        "logo": logoUrl
      },
      {
        "@type": "ItemList",
        "name": "Main Navigation",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "About Us",
            "url": `${siteUrl}/about`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Projects",
            "url": `${siteUrl}/projects`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Blogs",
            "url": `${siteUrl}/blogs`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Contact Us",
            "url": `${siteUrl}/contact`
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Get Involved",
            "url": `${siteUrl}/get-involved`
          }
        ]
      }
    ]
  };

  return (
    <html
      lang="en"
      className={cn("h-full antialiased", sourceSans.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}

