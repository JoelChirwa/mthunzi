import { getBlogs } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

type Blog = {
  id?: string;
  _id?: string;
  title: string;
  excerpt?: string;
  category?: string;
  image?: string;
  publishedAt?: string;
  createdAt?: string;
  slug?: string | { current?: string };
  status?: string;
};

export default async function FromBlogs() {
  const allBlogs = await getBlogs();
  const blogList = Array.isArray(allBlogs) ? allBlogs : [];

  // Filter to only published blogs for the public home page
  const publishedBlogs = blogList
    .filter((blog: Blog) => {
      if (blog.status) return blog.status === "PUBLISHED";
      if (blog.publishedAt) return true;
      return false;
    })
    .slice(0, 3); // Show at most 3 on home page

  if (publishedBlogs.length === 0) {
    return null; // Don't render section if no published blogs
  }

  return (
    <section
      className="w-full py-16 md:py-24"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #e0f7e4 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-12 md:mb-16 text-center">
          From Our Blog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedBlogs.map((blog: Blog) => {
            const slug =
              blog.slug
                ? typeof blog.slug === "string"
                  ? blog.slug
                  : blog.slug?.current || ""
                : "";
            return (
              <Link
                key={blog.id || blog._id || slug}
                href={`/blogs/${slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative h-48 w-full bg-green-100">
                  {blog.image ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="eager"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                      <span className="text-green-500 text-5xl font-black opacity-30">MT</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {blog.category && (
                    <span className="inline-block mb-3 text-xs font-bold uppercase tracking-wide bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                  )}
                  <h3 className="text-lg md:text-xl font-bold text-black line-clamp-2 group-hover:text-green-700 transition-colors">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/blogs"
            className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 uppercase text-sm tracking-wide"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}
