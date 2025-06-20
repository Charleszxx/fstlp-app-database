import { query } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query(`SELECT value FROM settings WHERE key = $1`, ['maintenance']);
      const value = result.rows[0]?.value === 'true';
      res.json({ enabled: value });
    } catch (err) {
      console.error('Error fetching maintenance status:', err);
      res.status(500).json({ error: 'Failed to fetch maintenance status' });
    }
  }

  else if (req.method === 'POST') {
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled must be a boolean' });
    }

    try {
      await query(`UPDATE settings SET value = $1 WHERE key = $2`, [enabled.toString(), 'maintenance']);
      res.json({ success: true, enabled });
    } catch (err) {
      co
