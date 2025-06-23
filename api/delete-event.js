// api/delete-event.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing event ID' });
  }

  try {
    await query(`DELETE FROM events WHERE id = $1`, [id]);
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
}
