import { query } from '../lib/db.js';

export default async function getAnnouncementsHandler(req, res) {
  try {
    const result = await query(`SELECT * FROM announcements ORDER BY createdAt DESC`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
