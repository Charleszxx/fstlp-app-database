// api/reset-password.js
import { query } from '../lib/db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await query(
      `UPDATE users SET password = $1, otp = NULL, otp_verified = false WHERE email = $2 AND otp_verified = true RETURNING id`,
      [hashedPassword, email]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid or unverified email' });
    }

    return res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
