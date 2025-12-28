import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    device = 'N/A',
    series = 'N/A',
    model = 'N/A',
    issue = 'N/A',
    description = 'N/A',
    phone = 'N/A',
    email = 'N/A',
    attachments = []
  } = req.body || {};

  const message = [
    'New repair quote request:',
    `Device: ${device}`,
    `Series: ${series}`,
    `Model: ${model}`,
    `Issue: ${issue}`,
    `Description: ${description}`,
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

  // Send email
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
      attachments: Array.isArray(attachments)
        ? attachments
            .filter((a) => a?.data)
            .map((a) => ({
              filename: a.name || 'photo.jpg',
              content: a.data,
              encoding: 'base64',
              contentType: a.type || 'image/jpeg'
            }))
        : []
    });
  } catch (error) {
    console.error('Email send failed', error);
    return res.status(500).json({ error: 'Failed to send email.' });
  }

  return res.status(200).json({ ok: true });
}
