// api/verify-otp.js
import { query } from '../lib/db.js';

export default async function verifyOtpHandler(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Missing email or OTP' });
  }

  try {
    const result = await query(
      `UPDATE users SET otp_verified = true WHERE email = $1 AND otp = $2 RETURNING id`,
      [email, otp]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid OTP or email' });
    }

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
