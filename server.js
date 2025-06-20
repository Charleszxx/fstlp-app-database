// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

import { registerHandler } from './api/register.js';
import loginHandler from './api/login.js';
import verifyOtpHandler from './api/verify-otp.js';
import profileImageHandler from './api/profile-image.js';
import getUsersHandler from './api/users.js';
import deleteUserHandler from './api/delete-user.js';
import addAnnouncementHandler from './api/add-announcement.js';
import getAnnouncementsHandler from './api/get-announcements.js';
import getQuoteHandler from './api/get-quote.js';
import maintenanceHandler from './api/maintenance.js';
import { initDb } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const maintenanceFile = path.join(__dirname, 'maintenance.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// List of pages affected by maintenance mode
const protectedPages = [
  'apply.html',
  'dashboard.html',
  'index.html',
  'logout.html',
  'otp_verification.html',
  'register.html'
];

// Maintenance mode middleware for specific HTML files
app.use((req, res, next) => {
  let maintenanceStatus = false;
  try {
    const statusData = JSON.parse(fs.readFileSync(maintenanceFile, 'utf8'));
    maintenanceStatus = statusData.enabled;
  } catch {}
  
  if (maintenanceStatus) {
    const requestedFile = req.url.split('?')[0].split('/').pop();
    if (protectedPages.includes(requestedFile)) {
      return res.sendFile(path.join(__dirname, 'maintainance.html'));
    }
  }
  next();
});

// Serve static files (HTML, JS, CSS, etc.)
app.use(express.static(__dirname));

// API routes
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);
app.post('/api/verify-otp', verifyOtpHandler);
app.get('/api/profile-image/:id', profileImageHandler);
app.get('/api/users', getUsersHandler);
app.delete('/api/delete-user', deleteUserHandler);
app.post('/api/add-announcement', addAnnouncementHandler);
app.get('/api/announcements', getAnnouncementsHandler);
app.get('/api/quote', getQuoteHandler);
app.get('/api/maintenance', maintenanceHandler);
app.post('/api/maintenance', maintenanceHandler);

// GET maintenance status
app.get('/api/maintenance', (req, res) => {
  fs.readFile(maintenanceFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Cannot read maintenance status' });
    res.json(JSON.parse(data));
  });
});

// SET maintenance status
app.post('/api/maintenance', (req, res) => {
  const { enabled } = req.body;
  fs.writeFile(maintenanceFile, JSON.stringify({ enabled }), err => {
    if (err) return res.status(500).json({ error: 'Cannot update maintenance status' });
    res.json({ success: true });
  });
});

// Init DB and start server
initDb().then(() => {
  console.log('✅ Database initialized');
  app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
}).catch(err => {
  console.error('DB init error', err);
  process.exit(1);
});
