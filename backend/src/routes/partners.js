import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import prisma from '../lib/prisma.js';

const router = Router();

// GET all partners
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const partners = await prisma.partner.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// CREATE a partner (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, logo, website, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Partner name is required' });
    }

    const partner = await prisma.partner.create({
      data: {
        name: name.trim(),
        logo: logo || null,
        website: website || null,
        status: status || 'active',
      },
    });

    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

// GET a single partner by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await prisma.partner.findUnique({ where: { id } });

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: 'Failed to fetch partner' });
  }
});

// UPDATE a partner (admin only)
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, website, status } = req.body;

    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        logo: logo !== undefined ? logo : existing.logo,
        website: website !== undefined ? website : existing.website,
        status: status ?? existing.status,
      },
    });

    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

// DELETE a partner (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    await prisma.partner.delete({ where: { id } });
    res.json({ success: true, message: 'Partner deleted' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

export default router;
