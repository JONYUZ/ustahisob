require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const QRCode = require('qrcode');
const db = require('../src/db');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error('XATOLIK: .env faylida TELEGRAM_BOT_TOKEN topilmadi.');
  process.exit(1);
}

const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
const UPLOAD_ROOT = path.join(__dirname, '..', 'public', 'uploads');

const bot = new TelegramBot(TOKEN, { polling: true });
console.log('UstaHisob Telegram bot ishga tushdi.');

// chatId -> { step, data } — /yangi bosqichma-bosqich suhbat holati (xotirada, oddiy)
const sessions = {};

function getCompanyByChat(chatId) {
  const row = db.prepare(
    `SELECT company_id FROM telegram_links WHERE chat_id = ? ORDER BY used_at DESC LIMIT 1`
  ).get(String(chatId));
  if (!row) return null;
  return db.prepare('SELECT * FROM companies WHERE id = ?').get(row.company_id);
}

function nextCode(companyId) {
  const row = db.prepare('SELECT COUNT(*) as c FROM qr_items WHERE company_id = ?').get(companyId);
  const n = (row.c || 0) + 1;
  return 'T' + String(10000 + n).slice(1);
}

function fmt(n) {
  return Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
}

// ---------- /start ----------
bot.onText(/^\/start/, (msg) => {
  const company = getCompanyByChat(msg.chat.id);
  if (company) {
    bot.sendMessage(msg.chat.id,
      `Salom! Siz "${company.name}" hisobiga bog'langansiz.\n\n` +
      `/yangi — yangi QR mahsulot yaratish\n` +
      `/royxat — oxirgi mahsulotlar ro'yxati\n` +
      `/holat — obuna holati\n` +
      `/bekor — joriy amalni bekor qilish`
    );
  } else {
    bot.sendMessage(msg.chat.id,
      `Assalomu alaykum! Bu — UstaHisob rasmiy boti.\n\n` +
      `Hisobingizni bog'lash uchun ustahisob.uz saytida "QR mahsulotlar" bo'limidan kod oling, so'ng shu yerga yuboring:\n\n` +
      `/login 123456`
    );
  }
});

// ---------- /login KOD ----------
bot.onText(/^\/login\s+(\d{6})/, (msg, match) => {
  const code = match[1];
  const link = db.prepare('SELECT * FROM telegram_links WHERE code = ?').get(code);
  if (!link) {
    bot.sendMessage(msg.chat.id, "Kod noto'g'ri yoki topilmadi. Saytdan qayta kod oling.");
    return;
  }
  const createdMs = new Date(link.created_at.replace(' ', 'T') + 'Z').getTime();
  if (Date.now() - createdMs > 10 * 60 * 1000) {
    bot.sendMessage(msg.chat.id, "Kod muddati tugagan (10 daqiqa). Saytdan qayta kod oling.");
    return;
  }
  db.prepare(`UPDATE telegram_links SET chat_id = ?, used_at = datetime('now') WHERE code = ?`)
    .run(String(msg.chat.id), code);
  const company = db.prepare('SELECT * FROM companies WHERE id = ?').get(link.company_id);
  bot.sendMessage(msg.chat.id, `✅ Bog'landi: ${company.name}\n\nEndi /yangi buyrug'i bilan QR mahsulot yaratishingiz mumkin.`);
});

// ---------- /holat ----------
bot.onText(/^\/holat/, (msg) => {
  const company = getCompanyByChat(msg.chat.id);
  if (!company) { bot.sendMessage(msg.chat.id, "Avval hisobingizni bog'lang: /login KOD"); return; }
  const sub = db.prepare('SELECT * FROM subscriptions WHERE company_id = ?').get(company.id);
  if (!sub) { bot.sendMessage(msg.chat.id, "Obuna topilmadi."); return; }
  const labels = { active: 'Faol ✅', trial: 'Sinov muddati 🎁', expired: 'Muddati tugagan ⚠️', pending_payment: "To'lov kutilmoqda ⏳" };
  bot.sendMessage(msg.chat.id, `Kompaniya: ${company.name}\nObuna: ${labels[sub.status] || sub.status}\nAmal qilish muddati: ${sub.expires_at}`);
});

// ---------- /royxat ----------
bot.onText(/^\/royxat/, (msg) => {
  const company = getCompanyByChat(msg.chat.id);
  if (!company) { bot.sendMessage(msg.chat.id, "Avval hisobingizni bog'lang: /login KOD"); return; }
  const items = db.prepare('SELECT * FROM qr_items WHERE company_id = ? ORDER BY created_at DESC LIMIT 10').all(company.id);
  if (items.length === 0) { bot.sendMessage(msg.chat.id, "Hali QR mahsulot yo'q. /yangi orqali birinchisini yarating."); return; }
  const lines = items.map(it =>
    `• *${it.name}* (${it.code}) — ${fmt(it.price)}\n${PUBLIC_BASE_URL}/item.html?b=${company.slug}&c=${it.code}`
  );
  bot.sendMessage(msg.chat.id, lines.join('\n\n'), { parse_mode: 'Markdown', disable_web_page_preview: true });
});

// ---------- /bekor ----------
bot.onText(/^\/bekor/, (msg) => {
  if (sessions[msg.chat.id]) {
    delete sessions[msg.chat.id];
    bot.sendMessage(msg.chat.id, "Bekor qilindi.");
  } else {
    bot.sendMessage(msg.chat.id, "Bekor qilinadigan amal yo'q.");
  }
});

// ---------- /yangi — bosqichma-bosqich QR mahsulot yaratish ----------
bot.onText(/^\/yangi/, (msg) => {
  const company = getCompanyByChat(msg.chat.id);
  if (!company) { bot.sendMessage(msg.chat.id, "Avval hisobingizni bog'lang: /login KOD"); return; }
  sessions[msg.chat.id] = { step: 'name', data: { companyId: company.id, companySlug: company.slug, photos: [] } };
  bot.sendMessage(msg.chat.id, "Mahsulot nomini yozing (masalan: Oshxona garniturasi):");
});

// ---------- /tayyor — rasm yuborish bosqichini yakunlash ----------
bot.onText(/^\/tayyor/, async (msg) => {
  const chatId = msg.chat.id;
  const session = sessions[chatId];
  if (!session || session.step !== 'photo') return;

  const code = nextCode(session.data.companyId);
  const id = uuid();
  db.prepare(`
    INSERT INTO qr_items (id, company_id, code, name, materials, price, warranty_months, photos, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'tayyor')
  `).run(id, session.data.companyId, code, session.data.name, session.data.materials, session.data.price, 12, JSON.stringify(session.data.photos));

  const publicUrl = `${PUBLIC_BASE_URL}/item.html?b=${session.data.companySlug}&c=${code}`;
  const qrBuf = await QRCode.toBuffer(publicUrl, { margin: 1, width: 400 });
  delete sessions[chatId];

  await bot.sendPhoto(chatId, qrBuf, {
    caption: `✅ Yaratildi!\n\n${session.data.name}\nKod: ${code}\nNarxi: ${fmt(session.data.price)}\n\n${publicUrl}\n\nBu QR-kodni chop etib mahsulotga yopishtiring.`,
  });
});

// ---------- oddiy xabarlar: joriy suhbat bosqichiga qarab ishlov beriladi ----------
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const session = sessions[chatId];
  if (!session) return;
  if (msg.text && msg.text.startsWith('/')) return; // buyruqlar yuqorida alohida ishlov olinadi

  if (session.step === 'name') {
    session.data.name = (msg.text || '').trim();
    if (!session.data.name) { bot.sendMessage(chatId, "Iltimos, matn ko'rinishida nom yuboring."); return; }
    session.step = 'price';
    bot.sendMessage(chatId, "Narxini kiriting (so'mda, faqat raqam, masalan 8000000):");
    return;
  }

  if (session.step === 'price') {
    const price = Number((msg.text || '').replace(/\D/g, ''));
    session.data.price = price || 0;
    session.step = 'materials';
    bot.sendMessage(chatId, "Materiallarni yozing (masalan: AGT panel 16mm, kromka 2mm, Blum furnitura):");
    return;
  }

  if (session.step === 'materials') {
    session.data.materials = (msg.text || '').trim();
    session.step = 'photo';
    bot.sendMessage(chatId, "Endi mahsulot rasm(lar)ini yuboring. Tugatgach /tayyor deb yozing.");
    return;
  }

  if (session.step === 'photo') {
    if (msg.photo && msg.photo.length) {
      try {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const url = await bot.getFileLink(fileId);
        const dir = path.join(UPLOAD_ROOT, session.data.companyId);
        fs.mkdirSync(dir, { recursive: true });
        const filename = uuid() + '.jpg';
        const resp = await fetch(url);
        const buf = Buffer.from(await resp.arrayBuffer());
        fs.writeFileSync(path.join(dir, filename), buf);
        session.data.photos.push(`/uploads/${session.data.companyId}/${filename}`);
        bot.sendMessage(chatId, `📷 Rasm qo'shildi (${session.data.photos.length} ta). Yana yuborishingiz yoki /tayyor deyishingiz mumkin.`);
      } catch (e) {
        bot.sendMessage(chatId, "Rasmni saqlashda xatolik yuz berdi, qaytadan urinib ko'ring.");
      }
    } else {
      bot.sendMessage(chatId, "Rasm yuboring yoki /tayyor deb yozing.");
    }
  }
});

bot.on('polling_error', (err) => console.error('Polling xatolik:', err.message));
