import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/authenticate.js';
import prisma from '../lib/prisma.js';

const router = Router();

// Normalize blog object shapes coming from different backends
function normalizeBlog(b) {
  if (!b) return b;
  const blog = Object.assign({}, b);
  // some servers/datastores use _id
  if (blog._id && !blog.id) {
    blog.id = String(blog._id);
    delete blog._id;
  }
  // ensure publishedAt or createdAt consistency
  if (!blog.publishedAt && blog.createdAt) {
    blog.publishedAt = blog.createdAt;
  }
  return blog;
}

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET all blogs (published only by default; drafts allowed for authenticated users)
router.get('/', async (req, res) => {
  try {
    const { status, category, limit, offset } = req.query;
    const where = {};

    // Try to extract user from authorization header if present
    let isAuthenticated = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        if (decoded && decoded.id) {
          isAuthenticated = true;
        }
      } catch (err) {
        // Invalid token is ignored, request proceeds as unauthenticated
      }
    }

    if (isAuthenticated) {
      if (status) where.status = status;
    } else {
      // Unauthenticated users can only see PUBLISHED blogs
      where.status = 'PUBLISHED';
    }

    if (category) where.category = category;

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
    });

    res.json(blogs.map(normalizeBlog));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// CREATE a new blog (admin/editor only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, excerpt, content, image, category, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let slug = req.body.slug || generateSlug(title);

    // Ensure slug is unique
    let existingBlog = await prisma.blog.findUnique({ where: { slug } });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content: content || '',
        image: image || null,
        author: null,
        category: category || 'News',
        status: status || 'DRAFT',
      },
    });

    res.status(201).json(normalizeBlog(blog));
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// GET a single blog by slug or ID
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let blog = await prisma.blog.findUnique({
      where: { slug: idOrSlug },
    });

    if (!blog) {
      blog = await prisma.blog.findUnique({
        where: { id: idOrSlug },
      });
    }

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(normalizeBlog(blog));
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// UPDATE a blog (admin/editor only)
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, image, category, status, slug } = req.body;

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    let newSlug = slug || blog.slug;
    if (title && title !== blog.title) {
      newSlug = slug || generateSlug(title);
      const existingBlog = await prisma.blog.findUnique({
        where: { slug: newSlug },
      });
      if (existingBlog && existingBlog.id !== id) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: title ?? blog.title,
        slug: newSlug,
        excerpt: excerpt ?? blog.excerpt,
        content: content ?? blog.content,
        image: image ?? blog.image,
        category: category ?? blog.category,
        status: status ?? blog.status,
      },
    });

    res.json(normalizeBlog(updatedBlog));
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// DELETE a blog (admin/editor only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    await prisma.blog.delete({ where: { id } });

    res.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

export default router;
