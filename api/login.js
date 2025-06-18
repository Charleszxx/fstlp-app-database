// api/login.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  const { email, password } = req.body || {};
  console.log('🔐 Login attempt:', { email, password });

  if (!email || !password) {
    console.warn('🚨 Missing email or password');
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await query(
      `SELECT id, fullName, email, address, phone, position, password
       FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    console.log('📦 DB query result:', result.rows);

    const user = result.rows[0];
    if (!user) {
      console.warn('❌ No user found for email:', normalizedEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('🕵️ Stored password:', user.password);
    console.log('🕵️ Supplied password:', password);

    if (user.password !== password) {
      console.warn('❌ Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove password before sending response
    delete user.password;

    return res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}
