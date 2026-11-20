const db = require('./db');

// Reads the company's subscription, auto-flips status to 'expired' if the
// expiry date has passed, and blocks the request with 402 if not active.
function requireActiveSubscription(req, res, next) {
  const companyId = req.user.companyId;
  const sub = db.prepare('SELECT * FROM subscriptions WHERE company_id = ?').get(companyId);

  if (!sub) {
    return res.status(402).json({ error: 'Obuna topilmadi.', code: 'NO_SUBSCRIPTION' });
  }

  const now = new Date();
  const expires = new Date(sub.expires_at);

  if (sub.status === 'active' && now > expires) {
    db.prepare(`UPDATE subscriptions SET status = 'expired', updated_at = datetime('now') WHERE company_id = ?`)
      .run(companyId);
    sub.status = 'expired';
  }

  if (sub.status !== 'active') {
    return res.status(402).json({
      error: "Obuna muddati tugagan. Davom etish uchun to'lovni yangilang.",
      code: 'SUBSCRIPTION_INACTIVE',
      status: sub.status,
      expiresAt: sub.expires_at,
    });
  }

  req.subscription = sub;
  next();
}

module.exports = { requireActiveSubscription };
