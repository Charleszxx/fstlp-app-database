// api/get-event-by-id.js
import { query } from '../lib/db.js';

export default async function getEventById(req, res) {
  const eventId = req.params?.id || req.query?.id;

  if (!eventId) {
    return res.status(400).json({ success: false, error: 'Event ID is required' });
  }

  try {
    const result = await query('SELECT * FROM events WHERE id = $1', [eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
