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

  await query(`
    CREATE TABLE IF NOT EXISTS announcements (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      startDate TIMESTAMPTZ NOT NULL,
      endDate TIMESTAMPTZ NOT NULL,
      createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      assigned_to INTEGER NOT NULL,
      created_by INTEGER NOT NULL,
      status TEXT DEFAULT 'Pending',
      deadline TIMESTAMP,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      details TEXT,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      participants INTEGER DEFAULT 0
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      scanned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, event_id)
    );
  `);
  
  await query(`
    -- Automatically increment event participants when a scan is successful
    CREATE OR REPLACE FUNCTION increment_participants()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE events SET participants = participants + 1 WHERE id = NEW.event_id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  
    DROP TRIGGER IF EXISTS trigger_increment_participants ON attendance;
  
    CREATE TRIGGER trigger_increment_participants
    AFTER INSERT ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION increment_participants();
  `);

}
