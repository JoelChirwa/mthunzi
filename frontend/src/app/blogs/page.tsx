import Footer from "@/components/home/Footer";
import Navbar from "@/components/Navbar";
import { getBlogs } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

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

const DESKTOP_BLOGS_PER_PAGE = 6;
const MOBILE_BLOGS_PER_PAGE = 3;

export const metadata = {
  title: "Blogs | Mthunzi Trust",
  description:
    "Read updates, stories, and insights from Mthunzi Trust's community programs.",
};

function formatDate(date?: string) {
  if (!date) {
    return "Latest update";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getBlogSlug(blog: Blog): string {
  if (blog.slug) {
    return typeof blog.slug === "string" ? blog.slug : (blog.slug.current || "");
  }
  return "";
}

function getPageHref(page: number) {
  return page === 1 ? "/blogs" : `/blogs?page=${page}`;
}

function getCurrentPage(requestedPage: number, totalPages: number) {
  return Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.min(Math.floor(requestedPage), totalPages)
    : 1;
}

function getPaginatedBlogs(
  blogs: Blog[],
  currentPage: number,
  blogsPerPage: number
) {
  const startIndex = (currentPage - 1) * blogsPerPage;
  return blogs.slice(startIndex, startIndex + blogsPerPage);
}

function BlogCard({ blog }: { blog: Blog }) {
  const slug = getBlogSlug(blog);

  return (
    <Link href={`/blogs/${slug}`}>
      <article className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shadow-md transition hover:-translate-y-1 hover:shadow-xl cursor-pointer h-full">
        <div className="relative h-56 w-full bg-green-100">
          {blog.image && (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          )}
          {!blog.image && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
              <span className="text-green-600 text-4xl font-black opacity-30">MT</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide">
            <span className="rounded bg-green-100 px-3 py-1 text-green-800">
              {blog.category || "News"}
            </span>
          </div>
          <h3 className="text-xl font-extrabold leading-snug text-black">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="mt-4 line-clamp-4 text-sm leading-7 text-gray-700">
              {blog.excerpt}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <nav
      className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row"
      aria-label="Blog pagination"
    >
      <p className="text-sm font-semibold text-gray-600">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto">
        {currentPage > 1 ? (
          <Link
            href={getPageHref(currentPage - 1)}
            className="rounded bg-green-700 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-green-800"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded bg-gray-100 px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-400">
            Previous
          </span>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;

            return (
              <Link
                key={page}
                href={getPageHref(page)}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-11 w-11 items-center justify-center rounded text-sm font-bold transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800"
                }`}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {currentPage < totalPages ? (
          <Link
            href={getPageHref(currentPage + 1)}
            className="rounded bg-green-700 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-green-800"
          >
            Next
          </Link>
        ) : (
          <span className="rounded bg-gray-100 px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-400">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const allBlogs: Blog[] = await getBlogs();

  // Only show published blogs on the public page
  const blogList = Array.isArray(allBlogs)
    ? allBlogs.filter((b) => {
        // Support both status field and publishedAt field
        if (b.status) return b.status === "PUBLISHED";
        if (b.publishedAt) return true;
        return false;
      })
    : [];

  const params = await searchParams;
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = Number(pageParam || "1");
  const desktopTotalPages = Math.max(1, Math.ceil(blogList.length / DESKTOP_BLOGS_PER_PAGE));
  const mobileTotalPages = Math.max(
    1,
    Math.ceil(blogList.length / MOBILE_BLOGS_PER_PAGE)
  );
  const desktopCurrentPage = getCurrentPage(requestedPage, desktopTotalPages);
  const mobileCurrentPage = getCurrentPage(requestedPage, mobileTotalPages);
  const desktopBlogs = getPaginatedBlogs(
    blogList,
    desktopCurrentPage,
    DESKTOP_BLOGS_PER_PAGE
  );
  const mobileBlogs = getPaginatedBlogs(
    blogList,
    mobileCurrentPage,
    MOBILE_BLOGS_PER_PAGE
  );

  return (
    <main>
      <Navbar />
      <section className="w-full bg-gradient-to-r from-green-600 to-green-700 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            Blogs
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xl leading-relaxed text-white sm:text-2xl">
            Read updates, stories, and insights from our work in education,
            climate justice, conservation, and community development.
          </p>
        </div>
      </section>

      <section className="w-full bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          {blogList.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No blog posts published yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:hidden">
                {mobileBlogs.map((blog) => (
                  <BlogCard key={blog.id || blog._id} blog={blog} />
                ))}
              </div>

              <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
                {desktopBlogs.map((blog) => (
                  <BlogCard key={blog.id || blog._id} blog={blog} />
                ))}
              </div>

              <div className="md:hidden">
                <Pagination
                  currentPage={mobileCurrentPage}
                  totalPages={mobileTotalPages}
                />
              </div>

              <div className="hidden md:block">
                <Pagination
                  currentPage={desktopCurrentPage}
                  totalPages={desktopTotalPages}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
