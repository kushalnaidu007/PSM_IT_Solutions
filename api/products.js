import { list } from '@vercel/blob';

const PRODUCTS_KEY = 'spondon-admin/products.json';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list({ prefix: PRODUCTS_KEY });
    if (!blobs.length) {
      return res.status(200).json({});
    }

    const response = await fetch(`${blobs[0].url}?t=${Date.now()}`);
    const data = await response.json();

    const publicProducts = {};
    for (const product of (data.products || [])) {
      if (product.archived) continue;
      if (!publicProducts[product.category]) {
        publicProducts[product.category] = [];
      }
      publicProducts[product.category].push({ name: product.name, imgs: product.imgs });
    }

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    return res.status(200).json(publicProducts);
  } catch (e) {
    console.error('Failed to load products', e);
    return res.status(500).json({ error: 'Failed to load products' });
  }
}
