# UstaHisob — SaaS Backend (boshlang'ich versiya)

**Domen: ustahisob.uz** ✅ (sotib olingan)

Bu — mebel ustalari uchun moliya boshqaruvi dasturini **ko'p mijozli (multi-tenant) SaaS mahsulot**ga aylantirish uchun tayyorlangan boshlang'ich (MVP) backend. Login/parol, 14 kunlik bepul sinov, obuna boshqaruvi va har bir kompaniya uchun alohida-alohida ma'lumotlar saqlash allaqachon ishlayapti va sinovdan o'tgan.

## Nima ishlaydi (hoziroq)

- ✅ Ro'yxatdan o'tish / kirish (parollar bcrypt bilan shifrlanadi)
- ✅ Har bir kompaniya uchun 14 kunlik bepul sinov muddati avtomatik beriladi
- ✅ Har bir kompaniyaning ma'lumotlari bir-biridan **butunlay ajratilgan**
- ✅ Obuna muddati tugasa, ma'lumotlarga kirish avtomatik bloklanadi va to'lov ekrani chiqadi
- ✅ Oylik/yillik reja tanlash + "to'lov qildim" arizasi qoldirish
- ✅ Admin panel orqali to'lovni ko'zdan kechirish va bir tugma bilan tasdiqlash/rad etish (`/admin.html`, Payme/Click hali ulanmagan bosqichda)
- ✅ **Parolni unutish/tiklash** — email orqali xavfsiz, muddatli havola bilan (SMTP sozlanmagan bo'lsa, havola server logiga chiqadi — sinov uchun yetarli)
- ✅ Mavjud dashboard (buyurtmalar, xarajatlar, xodimlar, hisobot) o'zgarishsiz ishlayapti — faqat endi har bir mijoz o'z login orqali kiradi
- ✅ **Barcha soha ustalari uchun universal** — ro'yxatdan o'tishda soha tanlanadi (mebel, qurilish, elektrik, santexnik, bo'yoqchi, kafelchi va h.k.), ish/bo'lim ro'yxati shunga mos kengaytirilgan
- ✅ Har bir ishga/bo'limga **bir nechta usta** biriktirish mumkin — har biri o'z foizini mustaqil oladi
- ✅ Har bir kompaniyaning shartnomasida **o'z nomi** avtomatik chiqadi (dinamik, boshqa mijozlarnikiga aralashmaydi)
- ✅ **QR mahsulot pasporti** — har bir tayyor mahsulot uchun QR-kod yaratiladi; mijoz skanerlaganda rasm, material, narx va kafolatni ko'radi (login talab qilinmaydi)
- ✅ **UstaHisob Telegram boti** — saytga kirmasdan, botdan to'g'ridan-to'g'ri QR mahsulot yaratish, ro'yxatni ko'rish, obuna holatini tekshirish

## Nima hali yo'q (keyingi qadamlar)

- ⏳ Payme / Click / Uzum bilan **haqiqiy** to'lov integratsiyasi (webhook joylari tayyor, faqat merchant kalitlar kerak)
- ⏳ Parolni unutish / tiklash
- ⏳ Email orqali tasdiqlash
- ⏳ Production serverga joylashtirish (hosting)
- ⏳ Admin uchun alohida veb-panel (hozircha faqat API orqali, curl/Postman bilan)

---

## 1. Mahalliy kompyuterda ishga tushirish

```bash
cd exclusive-mebel-saas
npm install
cp .env.example .env      # keyin .env faylini oching va JWT_SECRET / ADMIN_KEY ni o'zgartiring
npm start
```

Brauzerda oching: **http://localhost:3000/register.html**

Ma'lumotlar `data.sqlite` faylida saqlanadi (loyiha papkasida avtomatik yaratiladi).

---

## 2. Loyihaning tuzilishi

```
exclusive-mebel-saas/
  src/
    server.js              # asosiy server
    db.js                  # SQLite jadvallari (companies, users, subscriptions...)
    auth.js                # JWT token yaratish/tekshirish
    subscriptionGate.js     # obuna faolligini tekshiruvchi middleware
    plans.js                # narxlar (oylik/yillik) — shu yerdan o'zgartiring
    routes/
      auth.js               # /api/auth/register, /login, /me
      subscription.js       # /api/subscription/* (reja tanlash, admin tasdiqlash, webhook joylari)
      storage.js            # /api/storage/:key — dashboard ma'lumotlarini saqlash/o'qish
  public/
    login.html
    register.html
    app.html                # sizning mavjud dashboardingiz (endi login talab qiladi)
```

---

## 3. Narxlarni o'zgartirish

`src/plans.js` faylini oching:

```js
const PLANS = {
  monthly: { label: 'Oylik', amount: 150000, days: 30 },
  yearly:  { label: 'Yillik', amount: 1500000, days: 365 },
};
```

---

## 4. To'lovni tasdiqlash — Admin panel (Payme/Click ulanmagunча)

Mijoz "Tanlash" tugmasini bosganda, so'rov `payment_requests` jadvaliga tushadi va obuna holati `pending_payment`ga o'tadi.

**Admin panelga kirish:** brauzerda `https://ustahisob.uz/admin.html` (yoki mahalliy sinovda `http://localhost:3000/admin.html`) oching va `.env` dagi `ADMIN_KEY` qiymatini kiriting.

Bu yerda:
- Kutilayotgan barcha to'lov so'rovlari — kompaniya, email, reja, summa, izoh, sana bilan
- Har biriga **"Tasdiqlash"** (obuna darhol faollashadi, muddat yangilanadi) yoki **"Rad etish"** tugmasi
- Pastda barcha ro'yxatdan o'tgan kompaniyalar va ularning joriy obuna holati (umumiy ko'rinish)

> Admin kalitni hech kimga bermang — u bilan istalgan kompaniyaning obunasi faollashtiriladi. Kalit brauzeringizning shu sessiyasida (`sessionStorage`) saqlanadi, boshqa qurilmadan kirganda qayta so'raladi.

Agar buyruq qatoridan foydalanishni xohlasangiz, API endpointlar ham ochiq qoladi (masalan skript avtomatlashtirish uchun):
```bash
curl http://localhost:3000/api/subscription/admin/requests -H "x-admin-key: SIZNING_ADMIN_KEY"
curl -X POST http://localhost:3000/api/subscription/admin/approve/SO_ROV_ID -H "x-admin-key: SIZNING_ADMIN_KEY"
```

---

## 5. Payme / Click / Uzum ulash (kelajakda)

Bu to'lov tizimlariga ulanish uchun avval kerak:

1. **Yuridik shaxs** (YaTT yoki MChJ) sifatida ro'yxatdan o'tgan bo'lishingiz
2. Shu biznes nomiga ochilgan **bank hisobi**
3. Har bir tizimning **merchant kabinetiga** ariza va tasdiqlanish:
   - Payme: https://business.payme.uz
   - Click: https://merchant.click.uz
   - Uzum Bank (Уzum Tezkor to'lov): https://business.uzumbank.uz

Kalitlarni olgach:
1. `.env` fayliga `PAYME_MERCHANT_ID`, `PAYME_SECRET_KEY` (va Click/Uzum uchun mos kalitlarni) qo'shing
2. `src/routes/subscription.js` faylidagi `webhook/payme`, `webhook/click`, `webhook/uzum` funksiyalarini har bir tizimning rasmiy hujjatiga (odatda JSON-RPC yoki HMAC-imzolangan so'rov) qarab to'ldiring
3. To'lov muvaffaqiyatli bo'lganda, xuddi `admin/approve` qilayotganidek `subscriptions` jadvalini yangilang — kod namunasi allaqachon o'sha faylda bor

Bu qism — eng texnik jihatdan puxta ishlanishi kerak bo'lgan joy, shuning uchun buni **Claude Code** bilan bosqichma-bosqich, har bir to'lov tizimini alohida sinab ko'rib qilishni tavsiya qilaman.

---

## 6. Production serverga joylashtirish (deploy)

**Domeningiz tayyor: `ustahisob.uz`** ✅

### ⚡ Eng tez yo'l: avtomatik skript (aHOST.uz yoki istalgan Ubuntu VPS)

Loyiha ichida `deploy.sh` skripti bor — u Node.js, Nginx, PM2, SSL sertifikatini va `.env` faylini **avtomatik** sozlaydi.

1. VPS sotib oling (Ubuntu 22.04), SSH orqali ulaning: `ssh root@SIZNING_IP`
2. `ustahisob.zip`ni serverga yuklang (FileZilla yoki `scp -r ustahisob root@IP:/root/`) va oching:
   ```bash
   cd /root/ustahisob
   ```
3. Skriptni ishga tushiring:
   ```bash
   chmod +x deploy.sh
   sudo ./deploy.sh
   ```
4. So'ralganda domen nomini (`ustahisob.uz`) va SSL uchun emailingizni kiriting — qolgan hammasini skript o'zi bajaradi: paketlarni o'rnatadi, xavfsiz `.env` yaratadi, serverni PM2 orqali ishga tushiradi, Nginx'ni sozlaydi, SSL sertifikat oladi.
5. Oxirida ekranga chiqqan **ADMIN_KEY**ni saqlab qo'ying — bu `/admin.html`ga kirish uchun kerak bo'ladi.

> **Eslatma:** Skript ishlashi uchun domeningiz (`ustahisob.uz`) DNS'da (A-yozuv orqali) shu VPS'ning IP-manziliga allaqachon yo'naltirilgan bo'lishi kerak — aks holda SSL bosqichi (certbot) xatolik beradi, lekin sayt baribir http:// orqali ishlayveradi; DNS tarqalgach `certbot --nginx -d ustahisob.uz` buyrug'ini qo'lda qayta ishga tushirasiz.

**Foydali buyruqlar:**
```bash
pm2 status              # jarayonlar holati
pm2 logs ustahisob       # asosiy server loglari
pm2 logs ustahisob-bot   # Telegram bot loglari (token qo'shilgan bo'lsa)
pm2 restart ustahisob    # qayta ishga tushirish (masalan yangi kod yuklagach)
```

---

### Boshqa variantlar

Eng oson variantlar:
- **Railway.app** yoki **Render.com** — GitHub reponi ulaysiz, avtomatik joylashtiradi (bepul reja bilan boshlash mumkin)
- O'zbekistonda mashhur VPS provayderlari (masalan Beget, TimeWeb) — `pm2` bilan `node src/server.js`ni doim ishlab turadigan qilib sozlash kerak

**Domenni ulash qadamlari:**
1. Serverni yuqoridagi variantlardan biriga joylashtiring — bu sizga bir texnik manzil beradi (masalan `ustahisob.up.railway.app` yoki VPS'ning IP-manzili)
2. `ustahisob.uz` domenini boshqarish panelida (uni qayerdan sotib olgan bo'lsangiz — masalan reg.ru, 101domain, yoki cctld.uz ro'yxatidagi registrator) DNS sozlamalariga o'ting
3. Agar Railway/Render bo'lsa: ular bergan **CNAME** yozuvini `ustahisob.uz` uchun qo'shing
4. Agar VPS bo'lsa: **A yozuvi** orqali domeningizni serveringizning IP-manziliga yo'naltiring
5. SSL sertifikat (https://) — Railway/Render buni avtomatik beradi; VPS'da bo'lsa bepul **Let's Encrypt** (`certbot`) orqali osongina o'rnatiladi

**Muhim:** production'da `.env` dagi `JWT_SECRET` va `ADMIN_KEY`ni albatta uzun, tasodifiy qiymatlarga almashtiring (agar `deploy.sh` ishlatgan bo'lsangiz, bu avtomatik bajariladi):
```bash
openssl rand -hex 32
```

---

## 7. QR mahsulot pasporti va Telegram bot

**Qanday ishlaydi:** Dashboard'dagi "QR mahsulotlar" bo'limida (yoki Telegram bot orqali) har bir tayyor mahsulot uchun nomi, narxi, materiallari va rasmlarini kiritasiz. Tizim avtomatik ravishda noyob kod (masalan `T0001`) va QR-kod yaratadi. Bu QR-kodni chop etib mahsulotga yopishtirasiz — mijoz uni skanerlaganda hech qanday ilova yoki login talab qilinmasdan, brauzerda ochiladigan sahifada rasm, narx, material va kafolat ma'lumotini ko'radi.

**Telegram botni sozlash:**

1. Telegramda **@BotFather** ga yozing, `/newbot` buyrug'i bilan yangi bot yarating (masalan nomi `UstaHisobBot`)
2. BotFather sizga token beradi (masalan `123456:ABC-DEF...`) — buni `.env` fayliga qo'shing:
   ```
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
   PUBLIC_BASE_URL=https://ustahisob.uz
   ```
3. Botni ishga tushiring (asosiy serverdan **alohida jarayon** sifatida):
   ```bash
   npm run bot
   ```
4. Production serverda botni doimiy ishlab turadigan qilish uchun PM2 bilan alohida qo'shing:
   ```bash
   pm2 start bot/bot.js --name ustahisob-bot
   pm2 save
   ```

**Botdagi buyruqlar:**
- `/login KOD` — dashboard'dan olingan 6 xonali kod bilan hisobni botga bog'lash
- `/yangi` — bosqichma-bosqich yangi QR mahsulot yaratish (nom → narx → material → rasm(lar) → `/tayyor`)
- `/royxat` — oxirgi 10 ta mahsulot va ularning havolalari
- `/holat` — obuna holatini tekshirish
- `/bekor` — joriy amalni bekor qilish

## 8. Parolni unutish / tiklash

Login sahifasida **"Parolni unutdingizmi?"** havolasi bor. Oqim:

1. Mijoz emailini kiritadi (`/forgot-password.html`)
2. Server 1 soat amal qiladigan noyob token yaratadi va xat yuboradi (yoki SMTP sozlanmagan bo'lsa, havolani server logiga yozadi)
3. Mijoz havolani bosadi (`/reset-password.html?token=...`), yangi parol kiritadi
4. Token bir marta ishlatiladi, muddati o'tsa yaroqsiz bo'ladi

**Email yuborishni yoqish uchun** `.env` fayliga SMTP ma'lumotlarini kiriting:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sizning-email@gmail.com
SMTP_PASS=ilova-paroli
SMTP_FROM=UstaHisob <no-reply@ustahisob.uz>
```
> Gmail uchun oddiy parol emas, **"ilova paroli" (App Password)** kerak bo'ladi (Google hisobingiz sozlamalaridan yaratiladi). Yoki Brevo, Mailgun kabi maxsus email xizmatlaridan foydalanish tavsiya etiladi — ular yetkazib berish sifatini yaxshiroq ta'minlaydi.

SMTP sozlanmaguncha ham tizim to'liq ishlayveradi — havola shunchaki server konsoliga (`pm2 logs ustahisob`) chiqadi, shu orqali qo'lda ham yuborishingiz yoki sinovdan o'tkazishingiz mumkin.

## 9. Claude Code bilan davom ettirish

Bu loyihani Claude Code'da ochib, quyidagilarni so'rashingiz mumkin:
- "Payme integratsiyasini `src/routes/subscription.js`ga qo'sh, merchant ID va secret key'im mana bu"
- "Admin uchun oddiy veb-panel qo'sh (to'lov so'rovlarini ko'rish va tasdiqlash tugmasi bilan)"
- "Buni Railway'ga joylashtirishda yordam ber"
- "Parolni unutish funksiyasini qo'sh"

Loyiha tuzilishi toza va kengaytirishga tayyor holda qurilgan.

## Vercel (faqat test uchun)
Vercel'da fayl tizimi doimiy emas: SQLite baza va rasmlar /tmp da turadi va vaqti-vaqti bilan o'chib ketadi. Faqat sinash uchun. Doimiy ishlash uchun Railway/Render (Volume) yoki VPS ishlating.
Env: JWT_SECRET, ADMIN_KEY, PUBLIC_BASE_URL.
