import { query } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName, eventName } = req.body;

  if (!fullName || !eventName) {
    return res.status(400).json({ error: 'Missing fullName or eventName' });
  }

  try {
    const userResult = await query(`SELECT id FROM users WHERE fullName = $1`, [fullName]);
    const eventResult = await query(`SELECT id FROM events WHERE name = $1`, [eventName]);

    if (!userResult.rows.length || !eventResult.rows.length) {
      return res.status(404).json({ error: 'User or Event not found' });
    }

    const userId = userResult.rows[0].id;
    const eventId = eventResult.rows[0].id;

    await query(`
      INSERT INTO attendance (user_id, event_id) 
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [userId, eventId]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
