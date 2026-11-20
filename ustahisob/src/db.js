const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || (process.env.VERCEL ? '/tmp/data.sqlite' : path.join(__dirname, '..', 'data.sqlite'));
const db = new Database(DB_PATH);

db.pragma(process.env.VERCEL ? 'journal_mode = DELETE' : 'journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    trade TEXT NOT NULL DEFAULT 'boshqa',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL REFERENCES companies(id),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'owner',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL UNIQUE REFERENCES companies(id),
    plan TEXT NOT NULL DEFAULT 'trial',        -- 'trial' | 'monthly' | 'yearly'
    status TEXT NOT NULL DEFAULT 'active',      -- 'active' | 'expired' | 'pending_payment' | 'canceled'
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    payment_provider TEXT,                      -- 'payme' | 'click' | 'uzum' | 'manual'
    payment_ref TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS payment_requests (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL REFERENCES companies(id),
    plan TEXT NOT NULL,                         -- 'monthly' | 'yearly'
    amount INTEGER NOT NULL,
    provider TEXT NOT NULL DEFAULT 'manual',
    status TEXT NOT NULL DEFAULT 'pending',      -- 'pending' | 'approved' | 'rejected'
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    reviewed_at TEXT
  );

  -- Generic per-company key/value storage.
  -- Mirrors the same shape the front-end already uses (window.storage),
  -- so the existing dashboard code needs minimal changes to talk to this API.
  CREATE TABLE IF NOT EXISTS company_storage (
    company_id TEXT NOT NULL REFERENCES companies(id),
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (company_id, key)
  );

  -- Mijoz uchun QR-orqali ochiladigan mahsulot "pasporti" (DetalQR'dan ilhomlangan yengil versiya)
  CREATE TABLE IF NOT EXISTS qr_items (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL REFERENCES companies(id),
    code TEXT NOT NULL,                 -- masalan T00102, kompaniya ichida noyob
    name TEXT NOT NULL,
    materials TEXT,                     -- erkin matn: ishlatilgan materiallar
    price INTEGER DEFAULT 0,
    warranty_months INTEGER DEFAULT 12,
    photos TEXT NOT NULL DEFAULT '[]',  -- JSON array: ["/uploads/xxx.jpg", ...]
    status TEXT NOT NULL DEFAULT 'tayyor', -- 'jarayonda' | 'tayyor' | 'topshirilgan'
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(company_id, code)
  );

  -- Telegram bot -> UstaHisob kompaniya hisobini bog'lash uchun bir martalik kod
  CREATE TABLE IF NOT EXISTS telegram_links (
    code TEXT PRIMARY KEY,              -- 6 xonali bog'lash kodi
    company_id TEXT NOT NULL REFERENCES companies(id),
    chat_id TEXT,                       -- bog'langach Telegram chat_id shu yerga yoziladi
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    used_at TEXT
  );

  -- Parolni tiklash uchun bir martalik, muddatli tokenlar
  CREATE TABLE IF NOT EXISTS password_resets (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    used_at TEXT
  );
`);

// Defensive migration: add `trade` column if this DB was created before it existed.
try {
  db.exec(`ALTER TABLE companies ADD COLUMN trade TEXT NOT NULL DEFAULT 'boshqa'`);
} catch (e) {
  // column already exists — fine
}
// Defensive migration: add `slug` column (URL-friendly public identifier) for the QR public pages.
try {
  db.exec(`ALTER TABLE companies ADD COLUMN slug TEXT`);
} catch (e) {
  // column already exists — fine
}

module.exports = db;
