// routes/register.js
import { query } from '../lib/db.js';
//import fetch from 'node-fetch';

export async function registerHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    let body = req.body;
    if (!body || Object.keys(body).length === 0) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString();
      try {
        body = JSON.parse(raw);
      } catch {
        return res.status(400).json({ message: 'Invalid JSON format' });
      }
    }

    const { fullName, email, address, phone, position, password, profileImage } = body;
    if (!fullName || !email || !password || !profileImage) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ⚠️ Check email *before* sending OTP or inserting
    const { rowCount } = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (rowCount > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Convert profile image and generate OTP
    const base64Data = profileImage.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 👇 Just log OTP instead of sending SMS
    console.log(`Generated OTP for ${phone}: ${otp}`);

    /* Send the OTP
    const smsRes = await fetch(
      `https://sms.iprogtech.com/api/v1/sms_messages?api_token=${process.env.SMS_API_TOKEN}&sms_provider=1`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone,
          message: `Your OTP is: ${otp}`
        })
      }
    );
    if (!smsRes.ok) {
      console.error('SMS send failed:', await smsRes.text());
      return res.status(500).json({ message: 'Failed to send OTP' });
    }*/

    // Insert the user record
    const insertResult = await query(
      `
        INSERT INTO users
          (fullName, email, address, phone, position, password, profileImage, otp, otp_verified)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, false)
        RETURNING id
      `,
      [fullName, email, address, phone, position, password, imageBuffer, otp]
    );

    return res.status(200).json({
      message: 'User registered — OTP sent',
      id: insertResult.rows[0].id,
      otp // you can omit this in prod
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ message: 'A server error occurred', error: err.message });
  }
}
