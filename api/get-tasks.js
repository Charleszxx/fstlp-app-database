import { query } from '../lib/db.js';

export default async function getTasksHandler(req, res) {
  try {
    const result = await query(`
      SELECT 
        tasks.id, 
        tasks.description, 
        tasks.assigned_to, 
        tasks.created_by, 
        users.fullname AS created_by_name,
        tasks.created_at, 
        tasks.status, 
        tasks.link
      FROM tasks
      LEFT JOIN users ON tasks.created_by = users.id
      ORDER BY tasks.created_at DESC
    `);

    res.json({ success: true, tasks: result.rows });
  } catch (err) {
    console.error('Get Tasks Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch tasks.' });
  }
}
