import nodemailer from 'nodemailer';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// In-memory rate limiter — protects warm instances; not globally consistent across serverless cold starts
const rateMap = new Map();

const isRateLimited = (ip) => {
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count += 1;
  rateMap.set(ip, entry);
  return entry.count > RATE_LIMIT;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const {
    device = 'N/A',
    issue = 'N/A',
    description = '',
    phone = '',
    email = '',
    attachments = []
  } = req.body || {};

  const phoneDigits = String(phone).replace(/\D/g, '');
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return res.status(400).json({ error: 'Invalid phone number.' });
  }
  if (!EMAIL_REGEX.test(String(email))) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (String(description).length > 2000) {
    return res.status(400).json({ error: 'Description too long (max 2000 characters).' });
  }
  if (!Array.isArray(attachments) || attachments.length > 3) {
    return res.status(400).json({ error: 'Maximum 3 attachments allowed.' });
  }
  for (const a of attachments) {
    if (!a?.data || typeof a.data !== 'string') {
      return res.status(400).json({ error: 'Invalid attachment.' });
    }
    // base64 length → approximate decoded byte size
    if (Math.floor(a.data.length * 3 / 4) > MAX_ATTACHMENT_BYTES) {
      return res.status(400).json({ error: 'Each attachment must be under 2MB.' });
    }
  }

  const message = [
    'New repair quote request:',
    `Device: ${device}`,
    `Issue: ${issue}`,
    `Description: ${String(description).slice(0, 2000)}`,
    `Phone: ${phone}`,
    `Email: ${email}`
  ].join('\n');

  const emailTo = process.env.EMAIL_TO;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;

  if (!emailTo || !emailUser || !emailPass || !emailHost) {
    return res.status(500).json({ error: 'Email environment variables missing.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    await transporter.sendMail({
      from: `"PSM IT Solutions" <${emailUser}>`,
      to: emailTo,
      subject: 'New repair quote request',
      text: message,
      attachments: attachments
        .filter((a) => a?.data)
        .map((a) => ({
          filename: a.name || 'photo.jpg',
          content: a.data,
          encoding: 'base64',
          contentType: a.type || 'image/jpeg'
        }))
    });
  } catch (error) {
    console.error('Email send failed', error);
    return res.status(500).json({ error: 'Failed to send email.' });
  }

  return res.status(200).json({ ok: true });
}
