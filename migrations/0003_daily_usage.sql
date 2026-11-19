-- Migration 0003: Daily Chat Usage Budget Kill Switch
CREATE TABLE IF NOT EXISTS daily_usage (
  day TEXT PRIMARY KEY,
  chat_calls INTEGER NOT NULL DEFAULT 0
);
