// api/send-otp.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const result = await query(`UPDATE users SET otp = $1, otp_verified = false WHERE email = $2 RETURNING id`, [otp, email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // TODO: Integrate email sending via service like SendGrid / Mailgun
    console.log(`Send this OTP to user via email: ${otp}`);

    return res.status(200).json({ success: true, message: 'OTP sent', otp }); // <-- Add `otp`
  } catch (err) {
    console.error('OTP send error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
