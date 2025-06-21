import { query } from '../lib/db.js';

export default async function getTasksHandler(req, res) {
  try {
    const result = await query(`
      SELECT 
        t.id, 
        t.description, 
        t.assigned_to, 
        t.created_by, 
        creator.fullname AS created_by_name,
        assignee.fullname AS assigned_to_name,
        t.created_at, 
        t.status, 
        t.link
      FROM tasks t
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      ORDER BY t.created_at DESC
    `);

    res.json({ success: true, tasks: result.rows });
  } catch (err) {
    console.error('Get Tasks Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch tasks.' });
  }
}
