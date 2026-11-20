const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/public/item?b=SLUG&c=CODE  — mijoz QR skanerlaganda shu chaqiriladi, login talab qilinmaydi
router.get('/item', (req, res) => {
  const { b, c } = req.query;
  if (!b || !c) return res.status(400).json({ error: 'Notoʻgʻri havola' });

  const company = db.prepare('SELECT id, name, trade FROM companies WHERE slug = ?').get(b);
  if (!company) return res.status(404).json({ error: 'Kompaniya topilmadi' });

  const item = db.prepare('SELECT * FROM qr_items WHERE company_id = ? AND code = ?').get(company.id, c);
  if (!item) return res.status(404).json({ error: 'Mahsulot topilmadi' });

  res.json({
    company: { name: company.name, trade: company.trade },
    item: {
      code: item.code,
      name: item.name,
      materials: item.materials,
      price: item.price,
      warrantyMonths: item.warranty_months,
      photos: JSON.parse(item.photos || '[]'),
      status: item.status,
      createdAt: item.created_at,
    },
  });
});

module.exports = router;
