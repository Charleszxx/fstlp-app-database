import { query } from '../lib/db.js';

export default async function getTasksHandler(req, res) {
  try {
    const result = await query(`SELECT id, description, assigned_to, created_by, created_at, status, link FROM tasks ORDER BY created_at DESC`);
    res.json({ success: true, tasks: result.rows });
  } catch (err) {
    console.error('Get Tasks Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch tasks.' });
  }
}
