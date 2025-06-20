import fs from 'fs';
import path from 'path';

const maintenanceFile = path.resolve('maintenance.json');

export default function maintenanceHandler(req, res) {
  if (req.method === 'GET') {
    try {
      const statusData = JSON.parse(fs.readFileSync(maintenanceFile, 'utf8'));
      return res.json({ enabled: statusData.enabled });
    } catch (err) {
      return res.json({ enabled: false });
    }
  }

  if (req.method === 'POST') {
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled must be a boolean' });
    }

    fs.writeFile(maintenanceFile, JSON.stringify({ enabled }), err => {
      if (err) return res.status(500).json({ error: 'Cannot update maintenance status' });
      return res.json({ success: true });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
