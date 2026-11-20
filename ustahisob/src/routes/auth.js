const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuid } = require('uuid');
const db = require('../db');
const { signToken, requireAuth } = require('../auth');
const { TRIAL_DAYS, addDays } = require('../plans');
const { uniqueSlug } = require('../slugify');
const { sendMail } = require('../mailer');

const router = express.Router();
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---- Register: creates a company + owner user + 14-day trial subscription ----
router.post('/register', (req, res) => {
  const { companyName, email, password, trade } = req.body || {};

  if (!companyName || !companyName.trim()) {
    return res.status(400).json({ error: 'Kompaniya nomini kiriting.' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "To'g'ri email kiriting." });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Parol kamida 6 belgidan iborat bo'lishi kerak." });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Bu email allaqachon ro\'yxatdan o\'tgan.' });
  }

  const companyId = uuid();
  const userId = uuid();
  const subId = uuid();
  const passwordHash = bcrypt.hashSync(password, 10);

  const tx = db.transaction(() => {
    db.prepare('INSERT INTO companies (id, name, trade, slug) VALUES (?, ?, ?, ?)').run(companyId, companyName.trim(), trade || 'boshqa', uniqueSlug(db, companyName));
    db.prepare(
      'INSERT INTO users (id, company_id, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, companyId, email.toLowerCase(), passwordHash, 'owner');
    db.prepare(
      `INSERT INTO subscriptions (id, company_id, plan, status, started_at, expires_at)
       VALUES (?, ?, 'trial', 'active', datetime('now'), ?)`
    ).run(subId, companyId, addDays(new Date(), TRIAL_DAYS));
  });
  tx();

  const user = { id: userId, company_id: companyId, email: email.toLowerCase(), role: 'owner' };
  const token = signToken(user);
  res.json({
    token,
    user: { email: user.email, companyName: companyName.trim(), role: user.role },
    trialDays: TRIAL_DAYS,
  });
});

// ---- Login ----
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email va parolni kiriting.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Email yoki parol noto'g'ri." });
  }

  const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(user.company_id);
  const token = signToken(user);
  res.json({
    token,
    user: { email: user.email, companyName: company ? company.name : '', role: user.role },
  });
});

// ---- Current user + subscription info ----
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
  const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(req.user.companyId);
  const sub = db.prepare('SELECT * FROM subscriptions WHERE company_id = ?').get(req.user.companyId);

  if (sub && sub.status === 'active' && new Date(sub.expires_at) < new Date()) {
    db.prepare(`UPDATE subscriptions SET status = 'expired', updated_at = datetime('now') WHERE company_id = ?`)
      .run(req.user.companyId);
    sub.status = 'expired';
  }

  // legacy companies (created before slug existed) get one assigned lazily
  if (company && !company.slug) {
    const { uniqueSlug } = require('../slugify');
    const slug = uniqueSlug(db, company.name);
    db.prepare('UPDATE companies SET slug = ? WHERE id = ?').run(slug, company.id);
    company.slug = slug;
  }

  res.json({
    email: user.email,
    companyName: company ? company.name : '',
    companySlug: company ? company.slug : '',
    role: user.role,
    subscription: sub
      ? { plan: sub.plan, status: sub.status, expiresAt: sub.expires_at }
      : null,
  });
});

// ============================================================
// Parolni tiklash
// ============================================================

// ---- 1) Mijoz emailini kiritadi -> token yaratiladi, xat (yoki dev-log) yuboriladi ----
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  const generic = { ok: true, message: "Agar shu email ro'yxatdan o'tgan bo'lsa, parolni tiklash havolasi yuborildi." };

  if (!email || !isValidEmail(email)) return res.json(generic); // email enumeratsiyasining oldini olish uchun har doim generik javob

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) return res.json(generic);

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = addDays(new Date(), 0); // pastda soat bilan almashtiramiz
  const expires1h = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  db.prepare('INSERT INTO password_resets (token, user_id, expires_at) VALUES (?, ?, ?)')
    .run(token, user.id, expires1h);

  const resetUrl = `${PUBLIC_BASE_URL}/reset-password.html?token=${token}`;
  await sendMail({
    to: user.email,
    subject: "UstaHisob — parolni tiklash",
    text: `Parolingizni tiklash uchun havola (1 soat amal qiladi):\n${resetUrl}\n\nAgar buni siz so'ramagan bo'lsangiz, bu xatni e'tiborsiz qoldiring.`,
    html: `<p>Parolingizni tiklash uchun quyidagi havolani bosing (1 soat amal qiladi):</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Agar buni siz so'ramagan bo'lsangiz, bu xatni e'tiborsiz qoldiring.</p>`,
  });

  res.json(generic);
});

// ---- 2) Token haqiqiyligini tekshirish (reset sahifasi ochilganda) ----
router.get('/reset-password/:token', (req, res) => {
  const row = db.prepare('SELECT * FROM password_resets WHERE token = ?').get(req.params.token);
  if (!row || row.used_at || new Date(row.expires_at) < new Date()) {
    return res.status(400).json({ valid: false });
  }
  res.json({ valid: true });
});

// ---- 3) Yangi parolni saqlash ----
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Yangi parol kamida 6 belgidan iborat bo'lishi kerak." });
  }
  const row = db.prepare('SELECT * FROM password_resets WHERE token = ?').get(token);
  if (!row || row.used_at || new Date(row.expires_at) < new Date()) {
    return res.status(400).json({ error: "Havola muddati tugagan yoki noto'g'ri. Qaytadan so'rang." });
  }
  const passwordHash = bcrypt.hashSync(newPassword, 10);
  const tx = db.transaction(() => {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, row.user_id);
    db.prepare(`UPDATE password_resets SET used_at = datetime('now') WHERE token = ?`).run(token);
  });
  tx();
  res.json({ ok: true, message: "Parol muvaffaqiyatli o'zgartirildi. Endi kirishingiz mumkin." });
});

module.exports = router;
