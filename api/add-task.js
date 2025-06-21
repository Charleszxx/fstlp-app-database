// api/add-task.js
import { query } from '../lib/db.js';

export default async function addTaskHandler(req, res) {
  try {
    const { description, assignedTo, createdBy } = req.body;

    if (!description || !assignedTo || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    await query(`
      INSERT INTO tasks (description, assigned_to, created_by, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    `, [description, assignedTo, createdBy]);

    res.status(200).json({ success: true, message: 'Task added successfully.' });
  } catch (err) {
    console.error('Add Task Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
