import { query } from '../lib/db.js';

export default async function submitTaskHandler(req, res) {
  try {
    const { id, link } = req.body;
    if (!id || !link) return res.status(400).json({ error: "Missing ID or link." });

    await query(`UPDATE tasks SET status = 'Completed', link = $1 WHERE id = $2`, [link, id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Submit Task Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
}
