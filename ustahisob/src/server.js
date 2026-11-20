require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const storageRoutes = require('./routes/storage');
const qrItemsRoutes = require('./routes/qrItems');
const publicRoutes = require('./routes/public');
const telegramRoutes = require('./routes/telegram');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/qr-items', qrItemsRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/telegram', telegramRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.get('/', (req, res) => res.redirect('/login.html'));

// Vercel'da yuklangan rasmlar vaqtinchalik /tmp ichida
if (process.env.VERCEL) {
  app.use('/uploads', express.static('/tmp/uploads'));
}

// Static frontend (login, register, app)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Vercel uchun: app eksport qilinadi; oddiy serverda to'g'ridan-to'g'ri ishga tushadi
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`UstaHisob backend http://localhost:${PORT} portida ishga tushdi`);
  });
}
module.exports = app;
