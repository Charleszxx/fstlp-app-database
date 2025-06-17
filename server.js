// server.js
import express from 'express';
import cors from 'cors';
import { registerHandler } from './api/register.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/register', registerHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
