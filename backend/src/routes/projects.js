import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate } from '../middleware/authenticate.js';
import Project from '../models/Project.js';

const router = Router();
const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

const useCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

async function uploadToCloudinary(filePath) {
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    folder: 'projects',
  });
  return uploadResult.secure_url;
}

async function cleanupLocalFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch {
    // ignore cleanup failures
  }
}

async function getProjectImageUrl(file) {
  if (!file) {
    return undefined;
  }

  if (useCloudinary) {
    try {
      return await uploadToCloudinary(file.path);
    } finally {
      await cleanupLocalFile(file.path);
    }
  }

  return `${process.env.BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:5000'}/uploads/${file.filename}`;
}

function normalizeImpact(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && item.trim() !== '');
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === 'string' && item.trim() !== '');
      }
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');
    }
  }

  return [];
}

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects.' });
  }
});

router.post('/', authenticate, upload.single('image'), async (req, res) => {
  const { title, location, description, goal, impact, status } = req.body;

  try {
    const image = req.file ? await getProjectImageUrl(req.file) : '/images/hero.jpg';
    const newProject = await Project.create({
      title: title?.trim() || 'Untitled Project',
      location: location?.trim() || 'Unknown location',
      description: description || null,
      goal: goal || null,
      impact: normalizeImpact(impact),
      image,
      status: status?.trim() || 'ONGOING',
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Project creation failed:', error);
    res.status(500).json({ message: 'Failed to create project.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    res.status(500).json({ message: 'Failed to fetch project.' });
  }
});

router.patch('/:id', authenticate, upload.single('image'), async (req, res) => {
  const { title, location, description, goal, impact, status } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const image = req.file ? await getProjectImageUrl(req.file) : project.image;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim() ?? project.title,
        location: location?.trim() ?? project.location,
        description: description ?? project.description,
        goal: goal ?? project.goal,
        impact: normalizeImpact(impact).length ? normalizeImpact(impact) : project.impact,
        image,
        status: status?.trim() ?? project.status,
      },
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    console.error('Project update failed:', error);
    res.status(500).json({ message: 'Failed to update project.' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const existingProject = await Project.findById(req.params.id);

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Project deletion failed:', error);
    res.status(500).json({ message: 'Failed to delete project.' });
  }
});

export default router;
