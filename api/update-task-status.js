import { query } from '../lib/db.js';

export default async function updateTaskStatusHandler(req, res) {
  try {
    const { id, status } = req.body;
    if (!id || !status) return res.status(400).json({ error: "Missing ID or status." });

    await query(`UPDATE tasks SET status = $1 WHERE id = $2`, [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Update Task Status:', err);
    res.status(500).json({ error: 'Server error.' });
  }
}
