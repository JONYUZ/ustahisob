const express = require('express');
const db = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();
const BOT_INTERNAL_KEY = process.env.BOT_INTERNAL_KEY || 'change-me-bot-key';

function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 xonali
}

// ---- Dashboard'dan chaqiriladi: bog'lash kodini yaratadi ----
router.post('/link-code', requireAuth, (req, res) => {
  const code = genCode();
  db.prepare('INSERT INTO telegram_links (code, company_id) VALUES (?, ?)').run(code, req.user.companyId);
  res.json({ code });
});

// ---- Bog'langan Telegram hisob holati ----
router.get('/link-status', requireAuth, (req, res) => {
  const row = db.prepare(`
    SELECT * FROM telegram_links WHERE company_id = ? AND chat_id IS NOT NULL
    ORDER BY used_at DESC LIMIT 1
  `).get(req.user.companyId);
  res.json({ linked: !!row });
});

// ---- Bot serveridan chaqiriladi (ichki kalit bilan): kodni tasdiqlaydi ----
router.post('/confirm', (req, res) => {
  if (req.headers['x-bot-key'] !== BOT_INTERNAL_KEY) return res.status(403).json({ error: 'ruxsat yoq' });
  const { code, chatId } = req.body || {};
  const link = db.prepare('SELECT * FROM telegram_links WHERE code = ?').get(code);
  if (!link) return res.status(404).json({ error: "Kod noto'g'ri yoki eskirgan" });
  db.prepare(`UPDATE telegram_links SET chat_id = ?, used_at = datetime('now') WHERE code = ?`).run(String(chatId), code);
  const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(link.company_id);
  res.json({ ok: true, companyId: link.company_id, companyName: company.name });
});

// ---- Bot: chat_id bo'yicha qaysi kompaniyaga bog'langanini topish ----
router.get('/company-by-chat/:chatId', (req, res) => {
  if (req.headers['x-bot-key'] !== BOT_INTERNAL_KEY) return res.status(403).json({ error: 'ruxsat yoq' });
  const row = db.prepare(`SELECT company_id FROM telegram_links WHERE chat_id = ? ORDER BY used_at DESC LIMIT 1`).get(String(req.params.chatId));
  if (!row) return res.status(404).json({ error: 'not linked' });
  const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(row.company_id);
  res.json({ companyId: company.id, companyName: company.name, slug: company.slug });
});

module.exports = router;
