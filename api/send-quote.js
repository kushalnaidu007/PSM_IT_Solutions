import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    device = 'N/A',
    brand = 'N/A',
    model = 'N/A',
    issue = 'N/A',
    description = 'N/A'
  } = req.body || {};

  const message = [
    'New repair quote request:',
    `Device: ${device}`,
    `Brand: ${brand}`,
    `Model: ${model}`,
    `Issue: ${issue}`,
    `Description: ${description}`
  ].join('\n');

  const emailTo = process.env.EMAIL_TO;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;
  const whatsappToken = process.env.WHATSAPP_TOKEN;
  const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID;
  const whatsappTo = process.env.WHATSAPP_TO;

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
      text: message
    });
  } catch (error) {
    console.error('Email send failed', error);
    return res.status(500).json({ error: 'Failed to send email.' });
  }

  // Send WhatsApp (optional)
  if (whatsappToken && whatsappPhoneId && whatsappTo) {
    try {
      const waRes = await fetch(`https://graph.facebook.com/v17.0/${whatsappPhoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: whatsappTo,
          type: 'text',
          text: { body: message }
        })
      });
      if (!waRes.ok) {
        const errText = await waRes.text();
        console.error('WhatsApp send failed', waRes.status, errText);
      }
    } catch (error) {
      console.error('WhatsApp send failed', error);
      // continue without failing the request
    }
  }

  return res.status(200).json({ ok: true });
}
