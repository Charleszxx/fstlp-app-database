// routes/register.js
import { query } from '../lib/db.js';
import fetch from 'node-fetch'; // Uncomment if you want to enable real SMS sending later

export async function registerHandler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  let body = req.body;
  if (!body || Object.keys(body).length === 0) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    try {
      body = JSON.parse(Buffer.concat(chunks).toString());
    } catch {
      return res.status(400).json({ message: 'Invalid JSON format' });
    }
  }

  const { fullName, email, address, phone, position, password, profileImage } = body;
  if (!fullName || !email || !password || !profileImage) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // 1️⃣ Check if email already exists
  const checkResult = await query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );
  if (checkResult.rowCount > 0) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // 2️⃣ Process image and generate OTP
  const base64Data = profileImage.split(',')[1];
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Log the OTP for testing
  //console.log(`Generated OTP for ${phone}: ${otp}`);

  // If you want to enable SMS sending later, uncomment:
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
  }

  // 3️⃣ Insert user record including the OTP
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
    message: 'User registered — OTP logged',
    id: insertResult.rows[0].id,
    otp // feel free to remove this in production
  });
}
