import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
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
  // 🧩 USERS TABLE
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      address TEXT,
      phone TEXT UNIQUE,
      position TEXT,
      password TEXT NOT NULL,
      profileImage BYTEA,
      otp VARCHAR(6),
      otp_verified BOOLEAN DEFAULT false,
      role TEXT DEFAULT 'visitor',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 📢 ANNOUNCEMENTS TABLE
  await query(`
    CREATE TABLE IF NOT EXISTS announcements (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      startDate TIMESTAMPTZ NOT NULL,
      endDate TIMESTAMPTZ NOT NULL,
      createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ⚙️ SETTINGS TABLE
  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // ✅ TASKS TABLE
  await query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status TEXT DEFAULT 'Pending',
      deadline TIMESTAMPTZ,
      link TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 🎉 EVENTS TABLE
  await query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      details TEXT,
      start_date TIMESTAMPTZ NOT NULL,
      end_date TIMESTAMPTZ NOT NULL,
      participants INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 🕓 ATTENDANCE TABLE
  await query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      scanned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, event_id)
    );
  `);

  // 🔁 TRIGGER TO AUTO-INCREMENT PARTICIPANTS ON ATTENDANCE
  await query(`
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

  console.log("✅ Database initialized and all tables verified");
}
