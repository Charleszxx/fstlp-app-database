import { query } from '../lib/db.js';

export default async function addAnnouncementHandler(req, res) {
  const { text, startDate, endDate } = req.body;

  if (!text || !startDate || !endDate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    await query(
      `INSERT INTO announcements (text, startDate, endDate) VALUES ($1, $2, $3)`,
      [text, startDate, endDate]
    );
    res.status(200).json({ message: 'Announcement added successfully.' });
  } catch (err) {
    console.error('Error adding announcement:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
