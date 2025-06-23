// api/update-task.js
import { query } from '../lib/db.js';

export default async function updateTaskHandler(req, res) {
  try {
    const { id, description, assigned_to, deadline } = req.body;

    if (!id || !description || !assigned_to) {
      return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }

    await query(
      `UPDATE tasks 
       SET description = $1, assigned_to = $2, deadline = $3 
       WHERE id = $4`,
      [description, assigned_to, deadline || null, id]
    );

    res.json({ success: true, message: 'Task updated successfully.' });
  } catch (err) {
    console.error('Update Task Error:', err);
    res.status(500).json({ success: false, error: 'Failed to update task.' });
  }
}
