-- Migration 0001: Initial Schema for Portfolio Analytics and Chatbot
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  source TEXT DEFAULT 'direct',
  medium TEXT,
  campaign TEXT,
  landing_page TEXT
);

CREATE TABLE IF NOT EXISTS events (
  event_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  page TEXT,
  project_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  chat_session_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_messages (
  message_id TEXT PRIMARY KEY,
  chat_session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  latency_ms INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(chat_session_id) ON DELETE CASCADE
);
