import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mthunzitrust.org";

  // Base public pages
  const routes = [
    "",
    "/about",
    "/projects",
    "/blogs",
    "/contact",
    "/get-involved",
    "/donate",
    "/programs",
    "/volunteer",
  ];

  const sitemapEntries = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" || route === "/blogs") ? "daily" as const : "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch blogs dynamically to include in sitemap if needed
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${BACKEND_URL}/api/blogs`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const blogs = await res.json();
      if (Array.isArray(blogs)) {
        const publishedBlogs = blogs.filter((b: any) => b.status === "PUBLISHED");
        publishedBlogs.forEach((blog: any) => {
          sitemapEntries.push({
            url: `${siteUrl}/blogs/${blog.slug}`,
            lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          });
        });
      }
    }
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
  }

  return sitemapEntries;
}
