import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import Blog from '../models/Blog.js';
import Project from '../models/Project.js';
import Partner from '../models/Partner.js';
import Donation from '../models/Donation.js';
import PageView from '../models/PageView.js';

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
      donationStats,
      totalPageViews,
      last30DayViews,
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'PUBLISHED' }),
      Blog.countDocuments({ status: 'DRAFT' }),
      Project.countDocuments(),
      Partner.countDocuments(),
      Partner.countDocuments({ status: 'active' }),
      Donation.aggregate([
        { $match: { status: 'COMPLETED' } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
      PageView.countDocuments(),
      PageView.countDocuments({
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    const donationResult = donationStats[0] || { count: 0, totalAmount: 0 };

    res.json({
      blogs: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
      },
      projects: { total: totalProjects },
      partners: { total: totalPartners, active: activePartners },
      donations: {
        count: donationResult.count,
        total: donationResult.totalAmount,
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
