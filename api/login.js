// api/login.js
import { query } from '../lib/db.js';
import bcrypt from 'bcrypt'; // ✅ added

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  const { email, password } = req.body || {};
  console.log('🔐 Login attempt:', { email });

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await query(
      `SELECT id, fullname AS "fullName", email, address, phone, position, password
       FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password); // ✅ compare hash
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    delete user.password; // remove before sending
    return res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
