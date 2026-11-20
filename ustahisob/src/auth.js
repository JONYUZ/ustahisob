const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-CHANGE-THIS-IN-PRODUCTION';
const JWT_EXPIRES_IN = '30d';

function signToken(user) {
  return jwt.sign(
    { userId: user.id, companyId: user.company_id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Tizimga kirilmagan. Iltimos, qayta login qiling." });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { userId, companyId, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sessiya muddati tugagan. Qayta login qiling." });
  }
}

module.exports = { signToken, requireAuth, JWT_SECRET };
