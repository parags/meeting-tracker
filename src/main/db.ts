import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { mkdirSync } from 'fs'

let db: Database.Database | null = null

export function getDB(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.')
  }
  return db
}

export function initDB(): void {
  const userDataPath = app.getPath('userData')
  const dbDir = join(userDataPath, 'relay')
  
  mkdirSync(dbDir, { recursive: true })
  
  const dbPath = join(dbDir, 'relay.db')
  db = new Database(dbPath)

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  createTables(db)
  console.log(`[DB] Initialized at: ${dbPath}`)
}

function createTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      zoom_user_id TEXT,
      role TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zoom_meeting_id TEXT UNIQUE,
      title TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      duration_minutes INTEGER,
      transcript TEXT,
      summary TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS action_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meeting_id INTEGER REFERENCES meetings(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      assignee_id INTEGER REFERENCES people(id),
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS decisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meeting_id INTEGER REFERENCES meetings(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      context TEXT,
      decided_by INTEGER REFERENCES people(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS open_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meeting_id INTEGER REFERENCES meetings(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      context TEXT,
      asked_by INTEGER REFERENCES people(id),
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Indexes for common queries
    CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON meetings(start_time DESC);
    CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);
    CREATE INDEX IF NOT EXISTS idx_action_items_meeting ON action_items(meeting_id);
    CREATE INDEX IF NOT EXISTS idx_decisions_meeting ON decisions(meeting_id);
    CREATE INDEX IF NOT EXISTS idx_open_questions_meeting ON open_questions(meeting_id);
    CREATE INDEX IF NOT EXISTS idx_open_questions_status ON open_questions(status);
  `)
}
