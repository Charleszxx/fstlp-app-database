// server.js
import express from 'express';
import cors from 'cors';
import { registerHandler } from './api/register.js';
import loginHandler from './api/login.js'; // ✅ IMPORT the login handler
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Add the route handler
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler); // ✅ Add this line

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
