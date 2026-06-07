import { Router } from 'express';
import crypto from 'crypto';
import { authenticate } from '../middleware/authenticate.js';
import prisma from '../lib/prisma.js';

const router = Router();

function hashIp(ip) {
  return crypto.createHash('sha256').update(ip + 'mthunzi-salt').digest('hex').slice(0, 16);
}

// POST /api/analytics/track — record a page view
router.post('/track', async (req, res) => {
  try {
    const { path, device } = req.body;

    // Validate path input to prevent spam and ensure it looks like a relative route
    if (!path || typeof path !== 'string' || !path.startsWith('/') || path.length > 200) {
      return res.status(400).json({ error: 'Invalid tracking path' });
    }

    // Get real IP (handle proxies)
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.socket.remoteAddress ||
      '0.0.0.0';

    // Skip localhost/private IPs for geo lookup
    const isPrivate = /^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip);
    
    let country = null;
    let city = null;

    if (!isPrivate && ip !== '0.0.0.0') {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,status`, {
          signal: AbortSignal.timeout(2000),
        });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.status === 'success') {
            country = geo.country || null;
            city = geo.city || null;
          }
        }
      } catch {
        // Geo lookup failed — continue without it
      }
    }

    await prisma.pageView.create({
      data: {
        path: path || '/',
        country,
        city,
        ipHash: hashIp(ip),
        device: device || null,
      },
    });

    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    res.status(500).json({ error: 'Failed to track' });
  }
});

// GET /api/analytics/stats — admin only
router.get('/stats', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const [
      totalViews,
      last30Days,
      last7Days,
      countryBreakdown,
      topPages,
      dailyViews,
    ] = await Promise.all([
      // Total all-time views
      prisma.pageView.count(),

      // Last 30 days
      prisma.pageView.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // Last 7 days
      prisma.pageView.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),

      // Views by country
      prisma.pageView.groupBy({
        by: ['country'],
        _count: { country: true },
        where: { country: { not: null } },
        orderBy: { _count: { country: 'desc' } },
        take: 10,
      }),

      // Top pages
      prisma.pageView.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 5,
      }),

      // Daily views for last 30 days (raw query)
      prisma.$queryRaw`
        SELECT 
          DATE("createdAt") as date,
          COUNT(*) as count
        FROM "PageView"
        WHERE "createdAt" >= ${thirtyDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
    ]);

    res.json({
      totalViews,
      last30Days,
      last7Days,
      countries: countryBreakdown.map((c) => ({
        country: c.country,
        count: c._count.country,
      })),
      topPages: topPages.map((p) => ({
        path: p.path,
        count: p._count.path,
      })),
      dailyViews: dailyViews.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
