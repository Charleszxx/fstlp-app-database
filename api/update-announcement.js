// api/update-announcement.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id, text, startDate, endDate } = req.body;

  if (!id || !text || !startDate || !endDate) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  try {
    await query(
      `UPDATE announcements 
       SET text = $1, startDate = $2, endDate = $3 
       WHERE id = $4`,
      [text, startDate, endDate, id]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Update announcement error:', err);
    res.status(500).json({ success: false, error: 'Failed to update announcement.' });
  }
}
