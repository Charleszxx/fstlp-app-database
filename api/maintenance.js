import { getDb } from '../lib/db.js';

export default async function maintenanceHandler(req, res) {
  const db = getDb();

  if (req.method === 'GET') {
    db.get(`SELECT value FROM settings WHERE key = 'maintenance'`, (err, row) => {
      if (err) return res.status(500).json({ error: 'Failed to read setting' });
      res.json({ enabled: row?.value === 'true' });
    });
  }

  else if (req.method === 'POST') {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean')
      return res.status(400).json({ error: 'enabled must be a boolean' });

    db.run(`UPDATE settings SET value = ? WHERE key = 'maintenance'`, [enabled.toString()], err => {
      if (err) return res.status(500).json({ error: 'Failed to update setting' });
      res.json({ success: true, enabled });
    });
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
