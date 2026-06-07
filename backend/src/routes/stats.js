import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/stats — aggregate counts for admin dashboard (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalProjects,
      totalPartners,
      activePartners,
      totalDonations,
      totalPageViews,
      last30DayViews,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      prisma.blog.count({ where: { status: 'DRAFT' } }),
      prisma.project.count(),
      prisma.partner.count(),
      prisma.partner.count({ where: { status: 'active' } }),
      prisma.donation.aggregate({
        _count: { id: true },
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
      prisma.pageView.count(),
      prisma.pageView.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    res.json({
      blogs: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
      },
      projects: { total: totalProjects },
      partners: { total: totalPartners, active: activePartners },
      donations: {
        count: totalDonations._count.id,
        total: totalDonations._sum.amount || 0,
      },
      analytics: {
        totalViews: totalPageViews,
        last30Days: last30DayViews,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
