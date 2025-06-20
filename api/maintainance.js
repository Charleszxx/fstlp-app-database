// api/maintenance.js
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve('.env');
dotenv.config({ path: envPath });

// Read current .env content
function readEnv() {
  return fs.readFileSync(envPath, 'utf-8');
}

// Write updated content to .env
function writeEnv(content) {
  fs.writeFileSync(envPath, content, 'utf-8');
}

// Express-style handler
export default function maintenanceHandler(req, res) {
  if (req.method === 'GET') {
    const isEnabled = process.env.MAINTENANCE_MODE === 'true';
    return res.json({ enabled: isEnabled });
  }

  if (req.method === 'POST') {
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled must be a boolean' });
    }

    const envContent = readEnv();
    const updated = envContent.replace(/MAINTENANCE_MODE=(true|false)/, `MAINTENANCE_MODE=${enabled}`);

    writeEnv(updated);

    // Update in-memory value too
    process.env.MAINTENANCE_MODE = String(enabled);

    return res.json({ success: true, enabled });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
