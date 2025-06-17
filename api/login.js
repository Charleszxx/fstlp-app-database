import { getDb } from '../../lib/db.js';

export default async function handler(req, res) {
  const db = getDb();

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    // Parse body manually
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const bodyString = Buffer.concat(buffers).toString();
    const { email, password } = JSON.parse(bodyString);

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    db.get(
      `SELECT * FROM users WHERE email = ? AND password = ?`,
      [email, password],
      (err, user) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ message: 'Internal error' });
        }

        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        delete user.password;
        delete user.profileImage;

        return res.status(200).json({ message: 'Login successful', user });
      }
    );
  } catch (error) {
    console.error('Body parse error:', error);
    return res.status(500).json({ message: 'Invalid JSON body' });
  }
}
