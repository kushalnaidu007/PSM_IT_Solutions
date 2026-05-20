import { list, put } from '@vercel/blob';
import { randomUUID } from 'crypto';

const PRODUCTS_KEY = 'spondon-admin/products.json';

const checkAuth = (req) => {
  const auth = String(req.headers['authorization'] || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  return !!process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
};

const readProducts = async () => {
  const { blobs } = await list({ prefix: PRODUCTS_KEY });
  if (!blobs.length) return { products: [] };
  const res = await fetch(`${blobs[0].url}?t=${Date.now()}`);
  return res.json();
};

const writeProducts = async (data) => {
  await put(PRODUCTS_KEY, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
  });
};

export default async function handler(req, res) {
  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  try {
    if (req.method === 'GET') {
      const data = await readProducts();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { category, name, imgs } = req.body || {};
      if (!category || !name || !Array.isArray(imgs) || imgs.length < 1) {
        return res.status(400).json({ error: 'category, name and at least one image required' });
      }
      const data = await readProducts();
      const product = {
        id: randomUUID(),
        category: String(category).slice(0, 50),
        name: String(name).slice(0, 200),
        imgs: imgs.slice(0, 5).map((u) => String(u)),
        archived: false,
        createdAt: new Date().toISOString(),
      };
      data.products.push(product);
      await writeProducts(data);
      return res.status(201).json(product);
    }

    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const allowed = ['name', 'category', 'imgs', 'archived'];
      const safe = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
      const data = await readProducts();
      const idx = data.products.findIndex((p) => p.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Product not found' });
      data.products[idx] = { ...data.products[idx], ...safe };
      await writeProducts(data);
      return res.status(200).json(data.products[idx]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id required' });
      const data = await readProducts();
      const idx = data.products.findIndex((p) => p.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Product not found' });
      data.products.splice(idx, 1);
      await writeProducts(data);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('Admin products error', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
