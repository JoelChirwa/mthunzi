import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/Navbar";
import { Calendar, Tag, User, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author?: string;
  category?: string;
  createdAt?: string;
  status?: string;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

async function fetchBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blogs/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Dynamic OG metadata per blog ────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://mthunzitrust.org";
  const fallbackImage = `${siteUrl}/images/mthunzi-trust-logo.png`;

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "This blog post could not be found.",
    };
  }

  const ogImage = blog.image || fallbackImage;

  return {
    title: blog.title,
    description: blog.excerpt || `Read "${blog.title}" on Mthunzi Trust.`,
    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.excerpt || `Read "${blog.title}" on Mthunzi Trust.`,
      url: `${siteUrl}/blogs/${blog.slug}`,
      siteName: "Mthunzi Trust",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || `Read "${blog.title}" on Mthunzi Trust.`,
      images: [ogImage],
    },
  };
}

// ─── Markdown renderer ────────────────────────────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3 text-gray-900">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 text-gray-900">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-5 text-gray-900">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-6 list-disc mb-2 text-gray-700">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
    .replace(/\n/g, "<br />")
    .replace(/(<li[^>]*>[\s\S]*?<\/li>)/g, '<ul class="my-4">$1</ul>');
}

// ─── Page component ───────────────────────────────────────────────────────────
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  if (!blog) notFound();

  const formattedDate = blog.createdAt
    ? new Intl.DateTimeFormat("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(blog.createdAt))
    : "Latest update";

  const htmlContent = blog.content
    ? `<p class="mb-4 text-gray-700 leading-relaxed">${renderMarkdown(blog.content)}</p>`
    : "";

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-700 mt-[60px]">
        {blog.image && (
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover opacity-70"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end px-6 pb-12 md:px-16 md:pb-16">
          {blog.category && (
            <span className="inline-block mb-4 w-fit text-xs font-bold uppercase tracking-widest bg-green-500 text-white px-4 py-1.5 rounded-full">
              {blog.category}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 mt-6 text-gray-300 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </span>
            {blog.author && (
              <span className="flex items-center gap-1.5">
                <User size={14} />
                {blog.author}
              </span>
            )}
            {blog.category && (
              <span className="flex items-center gap-1.5">
                <Tag size={14} />
                {blog.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {blog.excerpt && (
          <p className="mb-10 text-xl leading-relaxed text-gray-700 italic border-l-4 border-green-600 pl-6 font-medium">
            {blog.excerpt}
          </p>
        )}

        <article
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Blogs</span>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
