// api/check-phone.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone number is required' });

  try {
    const result = await query(`SELECT email FROM users WHERE phone = $1`, [phone]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No account found with that phone number' });
    }

    const email = result.rows[0].email;
    return res.status(200).json({ success: true, email });
  } catch (err) {
    console.error('Check phone error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
