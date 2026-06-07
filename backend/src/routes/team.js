import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const members = await prisma.teamMember.findMany({
    orderBy: { position: 'asc' },
  });

  res.json(members);
});

router.post('/', authenticate, async (req, res) => {
  const { name, role, position, imageUrl } = req.body;

  const positionValue = Number(position) > 0 ? Number(position) : null;
  const lastMember = await prisma.teamMember.findFirst({
    orderBy: { position: 'desc' },
  });
  const defaultPosition = lastMember ? lastMember.position + 1 : 1;

  const newMember = await prisma.teamMember.create({
    data: {
      name: name?.trim() || 'New Team Member',
      role: role?.trim() || 'Team Member',
      position: positionValue || defaultPosition,
      imageUrl: imageUrl || '/images/team-placeholder.jpg',
    },
  });

  res.status(201).json(newMember);
});

router.get('/:id', async (req, res) => {
  const member = await prisma.teamMember.findUnique({
    where: { id: req.params.id },
  });

  if (!member) {
    return res.status(404).json({ message: 'Team member not found' });
  }

  res.json(member);
});

router.patch('/:id', authenticate, async (req, res) => {
  const { name, role, position, imageUrl } = req.body;

  const member = await prisma.teamMember.findUnique({
    where: { id: req.params.id },
  });

  if (!member) {
    return res.status(404).json({ message: 'Team member not found' });
  }

  const updated = await prisma.teamMember.update({
    where: { id: req.params.id },
    data: {
      name: name?.trim() ?? member.name,
      role: role?.trim() ?? member.role,
      position: Number(position) > 0 ? Number(position) : member.position,
      imageUrl: imageUrl ?? member.imageUrl,
    },
  });

  res.json(updated);
});

router.delete('/:id', authenticate, async (req, res) => {
  const member = await prisma.teamMember.findUnique({
    where: { id: req.params.id },
  });

  if (!member) {
    return res.status(404).json({ message: 'Team member not found' });
  }

  await prisma.teamMember.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Team member deleted' });
});

export default router;
