// api/update-event.js
import { query } from '../lib/db.js';

export default async function updateEventHandler(req, res) {
  try {
    const { id, name, details, start_date, end_date } = req.body;

    if (!id || !name || !start_date || !end_date) {
      return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }

    await query(
      `UPDATE events 
       SET name = $1, details = $2, start_date = $3, end_date = $4 
       WHERE id = $5`,
      [name, details || null, start_date, end_date, id]
    );

    res.json({ success: true, message: 'Event updated successfully.' });
  } catch (err) {
    console.error('Update Event Error:', err);
    res.status(500).json({ success: false, error: 'Failed to update event.' });
  }
}
