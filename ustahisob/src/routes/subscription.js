const express = require('express');
const { v4: uuid } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../auth');
const { PLANS, addDays } = require('../plans');

const router = express.Router();
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-me-admin-key';

// ---- Plan narxlarini frontendga berish ----
router.get('/plans', (req, res) => {
  res.json({ plans: PLANS });
});

// ---- Joriy obuna holati ----
router.get('/', requireAuth, (req, res) => {
  const sub = db.prepare('SELECT * FROM subscriptions WHERE company_id = ?').get(req.user.companyId);
  res.json({ subscription: sub || null });
});

// ---- Mijoz reja tanlaydi va "to'lov qildim" deb ariza qoldiradi (qo'lda tasdiqlash oqimi) ----
// Payme/Click/Uzum merchant hisoblari tayyor bo'lgach, shu endpoint o'rniga
// ularning checkout linkiga yo'naltirish va webhook orqali avtomatik tasdiqlash qo'shiladi.
router.post('/request-payment', requireAuth, (req, res) => {
  const { plan, note } = req.body || {};
  if (!PLANS[plan]) {
    return res.status(400).json({ error: "Noto'g'ri reja tanlandi." });
  }

  const id = uuid();
  db.prepare(
    `INSERT INTO payment_requests (id, company_id, plan, amount, provider, status, note)
     VALUES (?, ?, ?, ?, 'manual', 'pending', ?)`
  ).run(id, req.user.companyId, plan, PLANS[plan].amount, note || '');

  db.prepare(
    `UPDATE subscriptions SET status = 'pending_payment', plan = ?, updated_at = datetime('now')
     WHERE company_id = ?`
  ).run(plan, req.user.companyId);

  res.json({
    ok: true,
    message: "Arizangiz qabul qilindi. To'lov tasdiqlangach obunangiz faollashadi.",
    requestId: id,
  });
});

// ---- ADMIN: kutilayotgan to'lov so'rovlarini ko'rish ----
router.get('/admin/requests', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(403).json({ error: 'Ruxsat yo\'q.' });
  const rows = db.prepare(`
    SELECT pr.*, c.name as company_name, u.email as user_email
    FROM payment_requests pr
    JOIN companies c ON c.id = pr.company_id
    LEFT JOIN users u ON u.company_id = c.id
    WHERE pr.status = 'pending'
    ORDER BY pr.created_at DESC
  `).all();
  res.json({ requests: rows });
});

// ---- ADMIN: to'lovni tasdiqlash -> obunani faollashtirish ----
router.post('/admin/approve/:requestId', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(403).json({ error: 'Ruxsat yo\'q.' });

  const request = db.prepare('SELECT * FROM payment_requests WHERE id = ?').get(req.params.requestId);
  if (!request) return res.status(404).json({ error: 'So\'rov topilmadi.' });

  const planInfo = PLANS[request.plan];
  const newExpiry = addDays(new Date(), planInfo.days);

  const tx = db.transaction(() => {
    db.prepare(`UPDATE payment_requests SET status='approved', reviewed_at=datetime('now') WHERE id=?`)
      .run(request.id);
    db.prepare(
      `UPDATE subscriptions SET status='active', plan=?, started_at=datetime('now'),
       expires_at=?, payment_provider='manual', payment_ref=?, updated_at=datetime('now')
       WHERE company_id=?`
    ).run(request.plan, newExpiry, request.id, request.company_id);
  });
  tx();

  res.json({ ok: true, message: 'Obuna faollashtirildi.', expiresAt: newExpiry });
});

// ---- ADMIN: to'lovni rad etish ----
router.post('/admin/reject/:requestId', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(403).json({ error: 'Ruxsat yo\'q.' });

  const request = db.prepare('SELECT * FROM payment_requests WHERE id = ?').get(req.params.requestId);
  if (!request) return res.status(404).json({ error: 'So\'rov topilmadi.' });

  db.prepare(`UPDATE payment_requests SET status='rejected', reviewed_at=datetime('now') WHERE id=?`)
    .run(request.id);
  // obunani "expired" holatiga qaytaramiz — mijoz qayta urinib ko'rishi mumkin
  db.prepare(`UPDATE subscriptions SET status='expired', updated_at=datetime('now') WHERE company_id=?`)
    .run(request.company_id);

  res.json({ ok: true, message: 'So\'rov rad etildi.' });
});

// ---- ADMIN: barcha kompaniyalar va obuna holatlari (umumiy ko'rinish) ----
router.get('/admin/companies', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(403).json({ error: 'Ruxsat yo\'q.' });
  const rows = db.prepare(`
    SELECT c.id, c.name, c.trade, c.slug, c.created_at,
           u.email as user_email,
           s.plan, s.status as sub_status, s.expires_at
    FROM companies c
    LEFT JOIN users u ON u.company_id = c.id
    LEFT JOIN subscriptions s ON s.company_id = c.id
    ORDER BY c.created_at DESC
  `).all();
  res.json({ companies: rows });
});

// ---- PAYME / CLICK / UZUM webhook stublari ----
// Merchant hisob va API kalitlar olingach, shu joyga har bir provayderning
// rasmiy webhook protokoli (masalan Payme uchun JSON-RPC) ulanadi:
// 1) to'lovni tekshirish (CheckPerformTransaction)
// 2) tranzaksiyani yaratish (CreateTransaction)
// 3) tasdiqlash (PerformTransaction) -> shu yerda subscriptions jadvali yangilanadi
router.post('/webhook/payme', (req, res) => {
  res.status(501).json({ error: 'Payme integratsiyasi hali ulanmagan. Merchant kalitlarni .env ga qo\'shing.' });
});
router.post('/webhook/click', (req, res) => {
  res.status(501).json({ error: 'Click integratsiyasi hali ulanmagan. Merchant kalitlarni .env ga qo\'shing.' });
});
router.post('/webhook/uzum', (req, res) => {
  res.status(501).json({ error: 'Uzum integratsiyasi hali ulanmagan. Merchant kalitlarni .env ga qo\'shing.' });
});

module.exports = router;
