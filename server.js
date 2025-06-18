// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { registerHandler } from './api/register.js';
import loginHandler from './api/login.js';
import verifyOtpHandler from './api/verify-otp.js';
import profileImageHandler from './api/profile-image.js'; // ✅ Add this
import { initDb } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 🌟 Add these before routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);
app.post('/api/verify-otp', verifyOtpHandler);
app.get('/api/profile-image/:id', profileImageHandler);

// Initialize DB & start
initDb().then(() => {
  console.log('✅ Database initialized');
  app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
}).catch(err => {
  console.error('DB init error', err);
  process.exit(1);
});
