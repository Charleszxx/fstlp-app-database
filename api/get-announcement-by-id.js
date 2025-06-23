// api/get-announcement-by-id.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing announcement ID' });
  }

  try {
    const result = await query('SELECT * FROM announcements WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Get announcement by ID error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
