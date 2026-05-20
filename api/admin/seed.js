import { list, put } from '@vercel/blob';
import { randomUUID } from 'crypto';

const PRODUCTS_KEY = 'spondon-admin/products.json';

const checkAuth = (req) => {
  const auth = String(req.headers['authorization'] || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  return !!process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
};

export default async function handler(req, res) {
  if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorised' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN is not configured' });
  }

  const { products: incoming } = req.body || {};
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return res.status(400).json({ error: 'products array required' });
  }

  try {
    // Read current blob state
    const { blobs } = await list({ prefix: PRODUCTS_KEY });
    const existing = blobs.length
      ? await (await fetch(`${blobs[0].url}?t=${Date.now()}`)).json()
      : { products: [] };

    // Skip duplicates by name + category
    const existingKeys = new Set(
      existing.products.map((p) => `${p.category}|${p.name.toLowerCase()}`)
    );

    const toAdd = incoming
      .filter((p) => p.category && p.name && Array.isArray(p.imgs) && p.imgs.length > 0)
      .filter((p) => !existingKeys.has(`${p.category}|${p.name.toLowerCase()}`))
      .map((p) => ({
        id: randomUUID(),
        category: String(p.category).slice(0, 50),
        name: String(p.name).slice(0, 200),
        imgs: p.imgs.slice(0, 5).map(String),
        archived: false,
        createdAt: new Date().toISOString(),
      }));

    existing.products.push(...toAdd);

    await put(PRODUCTS_KEY, JSON.stringify(existing), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      cacheControlMaxAge: 0,
    });

    return res.status(200).json({ imported: toAdd.length, skipped: incoming.length - toAdd.length });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
