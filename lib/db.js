// lib/db.js
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../users.db');

let db;

export function getDb() {
  if (!db) {
    db = new sqlite3.Database(dbPath);
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullName TEXT,
          email TEXT,
          address TEXT,
          phone TEXT,
          position TEXT,
          password TEXT,
          profileImage BLOB
        )
      `);
    });
  }
  return db;
}
