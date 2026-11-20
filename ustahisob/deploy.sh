#!/usr/bin/env bash
# ============================================================
# UstaHisob — bitta skript bilan VPS'ga joylashtirish
# ============================================================
# Ishlatish: ustahisob.zip'ni serverga yuklab, ochib (unzip), shu papka
# ichida turib quyidagini bajaring:
#   chmod +x deploy.sh
#   sudo ./deploy.sh
#
# Skript sizdan domen nomi va (SSL uchun) emailingizni so'raydi,
# qolgan hamma narsani (Node.js, PM2, Nginx, SSL, .env) o'zi sozlaydi.
# ============================================================

set -e

echo "============================================"
echo " UstaHisob — VPS'ga joylashtirish"
echo "============================================"

if [ "$EUID" -ne 0 ]; then
  echo "Iltimos, skriptni sudo bilan ishga tushiring: sudo ./deploy.sh"
  exit 1
fi

read -p "Domen nomingiz (masalan ustahisob.uz): " DOMAIN
read -p "SSL sertifikati uchun email manzilingiz: " CERT_EMAIL
read -p "Bu domen www. bilan ham ishlatiladimi? (ha/yoq) [yoq]: " USE_WWW
USE_WWW=${USE_WWW:-yoq}

APP_DIR=$(pwd)
echo ""
echo "-> Loyiha papkasi: $APP_DIR"
echo "-> Domen: $DOMAIN"
echo ""

# ---------- 1. Tizim paketlarini yangilash ----------
echo "==> 1/7  Tizim paketlari yangilanmoqda..."
apt update -y && apt upgrade -y

# ---------- 2. Node.js o'rnatish (agar hali yo'q bo'lsa) ----------
if ! command -v node &> /dev/null; then
  echo "==> 2/7  Node.js 20 o'rnatilmoqda..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
else
  echo "==> 2/7  Node.js allaqachon o'rnatilgan ($(node -v)), o'tkazib yuborildi."
fi

# ---------- 3. Nginx va PM2 ----------
echo "==> 3/7  Nginx va PM2 o'rnatilmoqda..."
apt install -y nginx
npm install -g pm2

# ---------- 4. .env faylini yaratish (agar hali yo'q bo'lsa) ----------
if [ ! -f "$APP_DIR/.env" ]; then
  echo "==> 4/7  .env fayli yaratilmoqda, xavfsiz kalitlar generatsiya qilinmoqda..."
  JWT_SECRET=$(openssl rand -hex 32)
  ADMIN_KEY=$(openssl rand -hex 24)
  cat > "$APP_DIR/.env" <<EOF
PORT=3000
JWT_SECRET=$JWT_SECRET
ADMIN_KEY=$ADMIN_KEY
PUBLIC_BASE_URL=https://$DOMAIN
TELEGRAM_BOT_TOKEN=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=UstaHisob <no-reply@$DOMAIN>
EOF
  echo ""
  echo "   >>> ADMIN_KEY (admin.html uchun saqlab qo'ying): $ADMIN_KEY"
  echo ""
else
  echo "==> 4/7  .env fayli allaqachon mavjud, o'zgartirilmadi."
fi

# ---------- 5. npm paketlarini o'rnatish ----------
echo "==> 5/7  Loyiha paketlari o'rnatilmoqda (npm install)..."
cd "$APP_DIR"
npm install --omit=dev

# ---------- 6. PM2 bilan ishga tushirish ----------
echo "==> 6/7  Server PM2 orqali ishga tushirilmoqda..."
pm2 delete ustahisob 2>/dev/null || true
pm2 start "$APP_DIR/src/server.js" --name ustahisob
pm2 save
pm2 startup systemd -u root --hp /root > /tmp/pm2_startup_cmd.txt 2>&1 || true
STARTUP_CMD=$(grep -o 'systemctl.*' /tmp/pm2_startup_cmd.txt || true)
if [ -n "$STARTUP_CMD" ]; then
  eval "$STARTUP_CMD" || true
fi

if [ -f "$APP_DIR/.env" ] && grep -q "TELEGRAM_BOT_TOKEN=." "$APP_DIR/.env"; then
  pm2 delete ustahisob-bot 2>/dev/null || true
  pm2 start "$APP_DIR/bot/bot.js" --name ustahisob-bot
  pm2 save
fi

# ---------- 7. Nginx + SSL ----------
echo "==> 7/7  Nginx va SSL sozlanmoqda..."

if [ "$USE_WWW" = "ha" ]; then
  SERVER_NAMES="$DOMAIN www.$DOMAIN"
  CERT_DOMAINS="-d $DOMAIN -d www.$DOMAIN"
else
  SERVER_NAMES="$DOMAIN"
  CERT_DOMAINS="-d $DOMAIN"
fi

cat > /etc/nginx/sites-available/ustahisob <<EOF
server {
    listen 80;
    server_name $SERVER_NAMES;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        client_max_body_size 20M;
    }
}
EOF

ln -sf /etc/nginx/sites-available/ustahisob /etc/nginx/sites-enabled/ustahisob
nginx -t && systemctl restart nginx

apt install -y certbot python3-certbot-nginx
certbot --nginx $CERT_DOMAINS --non-interactive --agree-tos -m "$CERT_EMAIL" --redirect || \
  echo "!!! SSL o'rnatilmadi — domen DNS'i hali serverga to'liq yo'nalmagan bo'lishi mumkin. DNS tarqalgach qo'lda qayta urinib ko'ring: certbot --nginx $CERT_DOMAINS"

echo ""
echo "============================================"
echo " Tayyor! "
echo " Sayt: https://$DOMAIN"
echo " Admin panel: https://$DOMAIN/admin.html"
echo " Jarayon holati: pm2 status"
echo " Loglar: pm2 logs ustahisob"
echo "============================================"
