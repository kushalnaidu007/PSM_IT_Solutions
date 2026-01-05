export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return res.status(500).json({ error: 'Google Places API env vars missing.' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: 'Failed to fetch reviews', detail: text });
    }
    const data = await response.json();
    const reviews = (data.result?.reviews || []).map((r) => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      relativeTime: r.relative_time_description,
      profilePhoto: r.profile_photo_url,
      time: r.time
    }));
    res.status(200).json({ name: data.result?.name, rating: data.result?.rating, total: data.result?.user_ratings_total, reviews });
  } catch (error) {
    console.error('Reviews fetch failed', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}
