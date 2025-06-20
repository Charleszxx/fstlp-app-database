// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { registerHandler } from './api/register.js';
import loginHandler from './api/login.js';
import verifyOtpHandler from './api/verify-otp.js';
import profileImageHandler from './api/profile-image.js';
import getUsersHandler from './api/users.js';
import deleteUserHandler from './api/delete-user.js';
import addAnnouncementHandler from './api/add-announcement.js';
import getAnnouncementsHandler from './api/get-announcements.js';
import { initDb } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.static('public'));

// Routes
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);
app.post('/api/verify-otp', verifyOtpHandler);
app.get('/api/profile-image/:id', profileImageHandler);
app.get('/api/users', getUsersHandler);
app.delete('/api/delete-user', deleteUserHandler);
app.post('/api/add-announcement', addAnnouncementHandler);
app.get('/api/announcements', getAnnouncementsHandler);


// Initialize DB & start
initDb().then(() => {
  console.log('✅ Database initialized');
  app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
}).catch(err => {
  console.error('DB init error', err);
  process.exit(1);
});
