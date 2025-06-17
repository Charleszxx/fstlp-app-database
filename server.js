// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { registerHandler } from './api/register.js';
import loginHandler from './api/login.js';
import { initDb } from './lib/db.js'; // ✅ Import initDb

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);

// Initialize database and start server
initDb()
  .then(() => {
    console.log('✅ Database initialized');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1); // Optional: exit if DB fails
  });
