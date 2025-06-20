// lib/db.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Only for platforms like Render with self-signed certs
  },
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    await client.query(`SET TIME ZONE 'Asia/Manila'`);
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullName TEXT,
      email TEXT UNIQUE,
      address TEXT,
      phone TEXT,
      position TEXT,
      password TEXT,
      profileImage BYTEA
    );
  `);
}
