// api/login.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const result = await query(
      `SELECT id, fullName, email, address, phone, position
       FROM users WHERE email = $1 AND password = $2`,
      [email, password]
    );

    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    return res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
