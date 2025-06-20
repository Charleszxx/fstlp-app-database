import { query } from '../lib/db.js';

export default async function getAnnouncementsHandler(req, res) {
  try {
    // Delete expired announcements
    await query(`DELETE FROM announcements WHERE endDate <= NOW()`);

    // Fetch only active announcements
    const result = await query(`
      SELECT * FROM announcements 
      WHERE startDate <= NOW() AT TIME ZONE 'Asia/Manila' 
        AND endDate > NOW() AT TIME ZONE 'Asia/Manila'
      ORDER BY createdAt DESC
    `);


    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
