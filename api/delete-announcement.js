// api/delete-announcement.js
import { query } from '../lib/db.js';

export default async function deleteAnnouncementHandler(req, res) {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await query(`DELETE FROM announcements WHERE id = $1`, [id]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
