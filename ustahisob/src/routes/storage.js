const express = require('express');
const db = require('../db');
const { requireAuth } = require('../auth');
const { requireActiveSubscription } = require('../subscriptionGate');

const router = express.Router();

router.use(requireAuth);
router.use(requireActiveSubscription);

// GET /api/storage/:key
router.get('/:key', (req, res) => {
  const row = db.prepare(
    'SELECT value FROM company_storage WHERE company_id = ? AND key = ?'
  ).get(req.user.companyId, req.params.key);

  if (!row) return res.status(404).json({ error: 'not found' });
  res.json({ key: req.params.key, value: row.value });
});

// POST /api/storage/:key   body: { value: "<json string>" }
router.post('/:key', (req, res) => {
  const { value } = req.body || {};
  if (typeof value !== 'string') {
    return res.status(400).json({ error: 'value string bo\'lishi kerak (JSON.stringify qilingan holda).' });
  }
  db.prepare(`
    INSERT INTO company_storage (company_id, key, value, updated_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(company_id, key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
  `).run(req.user.companyId, req.params.key, value);

  res.json({ key: req.params.key, value, ok: true });
});

// GET /api/storage?prefix=mb_
router.get('/', (req, res) => {
  const prefix = req.query.prefix || '';
  const rows = db.prepare(
    'SELECT key FROM company_storage WHERE company_id = ? AND key LIKE ?'
  ).all(req.user.companyId, prefix + '%');
  res.json({ keys: rows.map(r => r.key) });
});

module.exports = router;
