// api/user-attendance.js
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName } = req.body;

  if (!fullName) return res.status(400).json({ error: 'Missing fullName' });

  try {
    const userResult = await query(`SELECT id FROM users WHERE fullName = $1`, [fullName]);
    if (!userResult.rows.length) return res.status(404).json({ error: 'User not found' });

    const userId = userResult.rows[0].id;

    const attendanceResult = await query(`
      SELECT events.id FROM attendance 
      JOIN events ON events.id = attendance.event_id 
      WHERE user_id = $1
    `, [userId]);
    
    const attendedEventIds = attendanceResult.rows.map(row => row.id);
    
    res.status(200).json({ success: true, attendedEventIds });


    res.status(200).json({ success: true, attendedEvents });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
