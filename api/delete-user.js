// api/delete-user.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight response
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Missing user ID' });
      }

      const result = await query('DELETE FROM users WHERE id = $1', [id]);

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
