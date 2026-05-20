import { put } from '@vercel/blob';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

const checkAuth = (req) => {
  const auth = String(req.headers['authorization'] || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  return !!process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
};

export default async function handler(req, res) {
  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'Unauthorised' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, type, data } = req.body || {};
  if (!name || !type || !data) {
    return res.status(400).json({ error: 'name, type and data required' });
  }
  if (!ALLOWED_TYPES.includes(type)) {
    return res.status(400).json({ error: 'Only JPEG, PNG, WebP and HEIC images are allowed' });
  }

  try {
    const buffer = Buffer.from(data, 'base64');
    if (buffer.length > 4 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large after resize (max 4MB)' });
    }

    const safeName = String(name).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
    const blob = await put(`spondon-admin/images/${Date.now()}-${safeName}`, buffer, {
      access: 'public',
      contentType: type,
    });

    return res.status(200).json({ url: blob.url });
  } catch (e) {
    console.error('Upload failed', e);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
