const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'UstaHisob <no-reply@ustahisob.uz>';

let transporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Xat yuboradi. Agar .env da SMTP sozlanmagan bo'lsa (hali xat xizmati ulanmagan
 * bosqichda), xatni jo'natish o'rniga server konsoliga yozadi — shunda tizim
 * baribir ishlab turadi, keyinchalik SMTP qo'shilganda kod o'zgarishsiz ishlayveradi.
 */
async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.log('--------------------------------------------------');
    console.log(`[MAILER — SMTP sozlanmagan, xat yuborilmadi] Kimga: ${to}`);
    console.log(`Mavzu: ${subject}`);
    console.log(text || html);
    console.log('--------------------------------------------------');
    return { dev: true };
  }
  return transporter.sendMail({ from: SMTP_FROM, to, subject, html, text });
}

module.exports = { sendMail };
