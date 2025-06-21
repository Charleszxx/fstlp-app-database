import { query } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { eventName, eventDetails, eventStart, eventEnd } = req.body;

  if (!eventName || !eventStart || !eventEnd) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await query(
      `INSERT INTO events (name, details, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING id`,
      [eventName, eventDetails, eventStart, eventEnd]
    );

    res.status(201).json({
      message: 'Event added successfully',
      eventId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event', error: error.message });
  }
}
