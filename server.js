// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb, query } from './lib/db.js';

import registerHandler from './api/register.js';
import loginHandler from './api/login.js';
import verifyOtpHandler from './api/verify-otp.js';
import profileImageHandler from './api/profile-image.js';
import getUsersHandler from './api/users.js';
import deleteUserHandler from './api/delete-user.js';
import addAnnouncementHandler from './api/add-announcement.js';
import getAnnouncementsHandler from './api/get-announcements.js';
import getQuoteHandler from './api/get-quote.js';
import maintenanceHandler from './api/maintenance.js';
import addTaskHandler from './api/add-task.js';
import updateTaskStatusHandler from './api/update-task-status.js';
import submitTaskHandler from './api/submit-task.js';
import getTasksHandler from './api/get-tasks.js';
import addEventHandler from './api/add-event.js';
import getEventsHandler from './api/events.js';
import markAttendanceHandler from './api/mark-attendance.js';
import userAttendanceHandler from './api/user-attendance.js';
import deleteTaskHandler from './api/delete-task.js';
import deleteEventHandler from './api/delete-event.js';
import editTaskHandler from './api/update-task.js';
import editEventHandler from './api/update-event.js';
import editAnnouncementHandler from './api/update-announcement.js';
import getEventById from './api/get-event-by-id.js';
import getAnnouncementById from './api/get-announcement-by-id.js';
import deleteAnnouncementById from './api/delete-announcement.js';
import sendOtpHandler from './api/send-otp.js';
import resetPasswordHandler from './api/reset-password.js';
import checkPhoneHandler from './api/check-phone.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve all static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Pages affected by maintenance mode
const protectedPages = [
  'apply.html',
  'dashboard.html',
  'index.html',
  'logout.html',
  'otp_verification.html',
  'register.html'
];

// Maintenance middleware
app.use(async (req, res, next) => {
  try {
    const requestedFile = req.url.split('?')[0].split('/').pop();
    if (!protectedPages.includes(requestedFile)) return next();

    const result = await query(`SELECT value FROM settings WHERE key = $1`, ['maintenance']);
    const maintenanceEnabled = result.rows[0]?.value === 'true';

    if (maintenanceEnabled) {
      return res.sendFile(path.join(__dirname, 'public', 'maintainance.html'));
    }
    next();
  } catch (err) {
    console.error('Maintenance middleware error:', err);
    next();
  }
});

// Explicit root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
app.all('/api/maintenance', maintenanceHandler);
app.post('/api/add-task', addTaskHandler);
app.post('/api/update-task-status', updateTaskStatusHandler);
app.post('/api/submit-task', submitTaskHandler);
app.get('/api/tasks', getTasksHandler);
app.post('/api/add-events', addEventHandler);
app.get('/api/events', getEventsHandler);
app.post('/api/mark-attendance', markAttendanceHandler);
app.post('/api/user-attendance', userAttendanceHandler);
app.delete('/api/delete-task', deleteTaskHandler);
app.delete('/api/delete-event', deleteEventHandler);
app.post('/api/update-task', editTaskHandler);
app.post('/api/update-event', editEventHandler);
app.post('/api/update-announcement', editAnnouncementHandler);
app.get('/api/events/:id', getEventById);
app.get('/api/announcement', getAnnouncementById);
app.delete('/api/delete-announcement', deleteAnnouncementById);
app.post('/api/send-otp', sendOtpHandler);
app.post('/api/reset-password', resetPasswordHandler);
app.post('/api/check-phone', checkPhoneHandler);

// Start server after DB init
initDb()
  .then(() => {
    console.log('✅ Database initialized');
    app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB init error', err);
    process.exit(1);
  });
