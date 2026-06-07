import { Router } from 'express';
import crypto from 'crypto';
import { authenticate } from '../middleware/authenticate.js';
import PageView from '../models/PageView.js';

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

    await PageView.create({
      path: path || '/',
      country,
      city,
      ipHash: hashIp(ip),
      device: device || null,
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
      PageView.countDocuments(),

      // Last 30 days
      PageView.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

      // Last 7 days
      PageView.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),

      // Views by country
      PageView.aggregate([
        { $match: { country: { $ne: null } } },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // Top pages
      PageView.aggregate([
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),

      // Daily views for last 30 days
      PageView.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
    ]);

    res.json({
      totalViews,
      last30Days,
      last7Days,
      countries: countryBreakdown.map((c) => ({
        country: c._id,
        count: c.count,
      })),
      topPages: topPages.map((p) => ({
        path: p._id,
        count: p.count,
      })),
      dailyViews: dailyViews.map((d) => ({
        date: d._id,
        count: Number(d.count),
      })),
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
