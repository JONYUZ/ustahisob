const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const { v4: uuid } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../auth');
const { requireActiveSubscription } = require('../subscriptionGate');

const router = express.Router();

// ---------- photo upload setup ----------
const UPLOAD_ROOT = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '..', '..', 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(UPLOAD_ROOT, req.user.companyId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, uuid() + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB har bir rasm
  fileFilter: (req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) return cb(new Error("Faqat rasm fayllari qabul qilinadi"));
    cb(null, true);
  },
});

router.use(requireAuth);
router.use(requireActiveSubscription);

function nextCode(companyId) {
  const row = db.prepare('SELECT COUNT(*) as c FROM qr_items WHERE company_id = ?').get(companyId);
  const n = (row.c || 0) + 1;
  return 'T' + String(10000 + n).slice(1); // T0001, T0002 ...
}

function baseUrl(req) {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
}

// ---- rasm yuklash ----
router.post('/upload', upload.array('photos', 6), (req, res) => {
  const files = (req.files || []).map(f => `/uploads/${req.user.companyId}/${f.filename}`);
  res.json({ photos: files });
});

// ---- yangi QR mahsulot yaratish ----
router.post('/', async (req, res) => {
  const { name, materials, price, warrantyMonths, photos, status } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'Mahsulot nomini kiriting.' });

  const id = uuid();
  const code = nextCode(req.user.companyId);
  db.prepare(`
    INSERT INTO qr_items (id, company_id, code, name, materials, price, warranty_months, photos, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, req.user.companyId, code, name.trim(), materials || '',
    Number(price) || 0, Number(warrantyMonths) || 12,
    JSON.stringify(photos || []), status || 'tayyor'
  );

  const company = db.prepare('SELECT slug FROM companies WHERE id = ?').get(req.user.companyId);
  const publicUrl = `${baseUrl(req)}/item.html?b=${company.slug}&c=${code}`;
  const qrDataUrl = await QRCode.toDataURL(publicUrl, { margin: 1, width: 400 });

  res.json({ id, code, publicUrl, qrDataUrl });
});

// ---- kompaniyaning barcha QR mahsulotlari ----
router.get('/', async (req, res) => {
  const rows = db.prepare('SELECT * FROM qr_items WHERE company_id = ? ORDER BY created_at DESC').all(req.user.companyId);
  const company = db.prepare('SELECT slug FROM companies WHERE id = ?').get(req.user.companyId);
  const items = rows.map(r => ({
    ...r,
    photos: JSON.parse(r.photos || '[]'),
    publicUrl: `${baseUrl(req)}/item.html?b=${company.slug}&c=${r.code}`,
  }));
  res.json({ items });
});

// ---- bitta mahsulot uchun QR-kod rasmi (qayta olish) ----
router.get('/:id/qrcode', async (req, res) => {
  const item = db.prepare('SELECT * FROM qr_items WHERE id = ? AND company_id = ?').get(req.params.id, req.user.companyId);
  if (!item) return res.status(404).json({ error: 'Topilmadi' });
  const company = db.prepare('SELECT slug FROM companies WHERE id = ?').get(req.user.companyId);
  const publicUrl = `${baseUrl(req)}/item.html?b=${company.slug}&c=${item.code}`;
  const qrDataUrl = await QRCode.toDataURL(publicUrl, { margin: 1, width: 400 });
  res.json({ publicUrl, qrDataUrl });
});

// ---- yangilash (holat, narx va h.k.) ----
router.put('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM qr_items WHERE id = ? AND company_id = ?').get(req.params.id, req.user.companyId);
  if (!item) return res.status(404).json({ error: 'Topilmadi' });
  const { name, materials, price, warrantyMonths, photos, status } = req.body || {};
  db.prepare(`
    UPDATE qr_items SET name=?, materials=?, price=?, warranty_months=?, photos=?, status=? WHERE id=?
  `).run(
    name ?? item.name, materials ?? item.materials, Number(price ?? item.price) || 0,
    Number(warrantyMonths ?? item.warranty_months) || 12,
    photos ? JSON.stringify(photos) : item.photos, status ?? item.status, item.id
  );
  res.json({ ok: true });
});

// ---- o'chirish ----
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM qr_items WHERE id = ? AND company_id = ?').run(req.params.id, req.user.companyId);
  res.json({ ok: true });
});

module.exports = router;
