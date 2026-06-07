import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import TeamMember from '../models/TeamMember.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ position: 1 });
    res.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, role, position, imageUrl } = req.body;

    const positionValue = Number(position) > 0 ? Number(position) : null;
    const lastMember = await TeamMember.findOne().sort({ position: -1 });
    const defaultPosition = lastMember ? lastMember.position + 1 : 1;

    const newMember = await TeamMember.create({
      name: name?.trim() || 'New Team Member',
      role: role?.trim() || 'Team Member',
      position: positionValue || defaultPosition,
      imageUrl: imageUrl || '/images/team-placeholder.jpg',
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { name, role, position, imageUrl } = req.body;

    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const updated = await TeamMember.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim() ?? member.name,
        role: role?.trim() ?? member.role,
        position: Number(position) > 0 ? Number(position) : member.position,
        imageUrl: imageUrl ?? member.imageUrl,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;
