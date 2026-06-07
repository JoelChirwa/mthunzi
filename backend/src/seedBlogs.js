import mongoose from "mongoose";
import connectDB from "./lib/db.js";
import Blog from "./models/Blog.js";

const blogs = [
  {
    title: "Empowering Youth through Education",
    slug: "empowering-youth-through-education",
    excerpt: "Discover how our education programs are transforming lives and creating opportunities for the next generation.",
    content: "Education is the most powerful weapon which you can use to change the world. Our programs focus on providing quality education and vocational training to underprivileged youth, ensuring they have the skills needed to thrive in the modern economy.",
    image: "/images/edu.jfif",
    author: "Mthunzi Trust",
    category: "Education",
    status: "PUBLISHED",
  },
  {
    title: "Climate Action in Rural Communities",
    slug: "climate-action-rural-communities",
    excerpt: "Our latest initiatives to combat climate change and promote sustainable agriculture in rural areas.",
    content: "Climate change affects us all, but rural communities are often the hardest hit. We are working with local farmers to implement sustainable agricultural practices, plant trees, and build resilience against the changing climate.",
    image: "/images/climate.jpg",
    author: "Mthunzi Trust",
    category: "Environment",
    status: "PUBLISHED",
  },
  {
    title: "Improving Maternal Health in Remote Areas",
    slug: "improving-maternal-health",
    excerpt: "Addressing healthcare challenges and improving maternal health outcomes in underserved regions.",
    content: "Access to healthcare is a fundamental human right. Our maternal health programs provide essential services and education to expectant mothers in remote areas, significantly reducing mortality rates and improving overall community health.",
    image: "/images/hero.jpg",
    author: "Mthunzi Trust",
    category: "Health",
    status: "PUBLISHED",
  },
];

async function seedBlogs() {
  try {
    await connectDB();
    console.log("Connected to database for seeding...");

    for (const blog of blogs) {
      const existingBlog = await Blog.findOne({ slug: blog.slug });
      if (!existingBlog) {
        await Blog.create(blog);
        console.log(`Seeded blog: ${blog.title}`);
      } else {
        console.log(`Blog already exists: ${blog.title}`);
      }
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }
}

seedBlogs();
