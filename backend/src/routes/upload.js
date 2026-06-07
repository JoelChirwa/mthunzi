import { Router } from 'express';
import crypto from 'crypto';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

/**
 * POST /api/upload/cloudinary
 * Upload an image to Cloudinary
 * Expected body: { imageData: string (base64), fileName?: string }
 */
router.post('/cloudinary', authenticate, async (req, res) => {
  try {
    const { imageData, fileName } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'imageData is required' });
    }

    const cloudName = process.env.CLOUD_NAME;
    const apiKey = process.env.CLOUD_API_KEY;
    const apiSecret = process.env.CLOUD_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary configuration');
      return res.status(500).json({ error: 'Cloudinary is not configured' });
    }

    // Build form data for Cloudinary API
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = [
      `folder=mthunzi-team`,
      `timestamp=${timestamp}`,
      ...(fileName ? [`public_id=${fileName.replace(/\.[^/.]+$/, '')}`] : []),
    ];

    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign.sort().join('&') + apiSecret)
      .digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', imageData);
    formData.append('folder', 'mthunzi-team');
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);

    if (fileName) {
      formData.append('public_id', fileName.replace(/\.[^/.]+$/, ''));
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cloudinary upload error:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Cloudinary upload failed',
      });
    }

    // Return the full Cloudinary response so client can extract secure_url, etc.
    res.json(data);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
