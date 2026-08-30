# 🏛️ سامانه هوش مصنوعی و اتوماسیون بیمه جم (Bimeh Jam AI Platform)

سامانه جامع تحلیل هوشمند لید، اتوماسیون پاسخگویی به مشتریان گفتینو، استعلام آنلاین انواع بیمه‌نامه‌ها (شخص ثالث، بدنه، درمان، مسئولیت، آتش‌سوزی و...) و پایگاه دانش تخصصی بیمه با پشته مدرن Full-Stack (React 19 + TypeScript + Express + Prisma SQLite + Docker).

---

## 📋 فهرست مطالب
1. [معرفی و ویژگی‌های کلیدی](#-ویژگیهای-کلیدی)
2. [پشته فناوری (Tech Stack)](#-پشته-فناوری-tech-stack)
3. [پیش‌نیازهای نصب روی سرور Ubuntu 22.04](#-پیشنیازهای-نصب-روی-سرور-ubuntu-2204)
4. [راهنمای استقرار با Docker Compose (پیشنهادی و سریع)](#-راهنمای-استقرار-با-docker-compose-سریعترین-روش)
5. [تنظیم متغیرهای محیطی (Environment Variables)](#-تنظیم-متغیرهای-محیطی-environment-variables)
6. [نحوه تنظیم وب‌هوک در پنل گفتینو (Goftino Webhook)](#-تنظیم-وبهوک-در-گفتینو)
7. [راهنمای اجرای محلی (Local Development)](#-اجرای-محلی-local-development)
8. [بکاپ‌گیری و بازیابی پایگاه داده (Backup & Restore)](#-بکاپگیری-و-بازیابی-پایگاه-داده)
9. [تنظیم Nginx Reverse Proxy و SSL رایگان (دامنه رسمی)](#-تنظیم-nginx-و-ssl-رایگان-با-certbot)
10. [دستورات کاربردی مدیریت و مانیتورینگ](#-دستورات-کاربردی-مدیریت-کانتینر)

---

## ✨ ویژگی‌های کلیدی
- 🤖 **هوش مصنوعی چند لایه (Multi-Tier AI):** پشتیبانی از مدل‌های Google Gemini 2.5 و OpenAI GPT-4o به همراه موتور قانون‌محور فال‌بک آفلاین.
- ⚡ **یکپارچگی بلادرنگ با گفتینو (Goftino Integration):** وب‌هوک دریافت خودکار پیام‌های مشتری، تحلیل احساسات، ارزیابی امتیاز لید (Lead Scoring) و ارسال آنی پاسخ هوشمند.
- 📊 **داشبورد مدیریتی و KPI:** رصد زنده مکالمات، عملکرد کارشناسان، نرخ تبدیل سرنخ‌های داغ (Hot Leads) و آمار تفکیکی کانال‌ها.
- 🧠 **پایگاه دانش هوشمند بیمه‌ای (Knowledge Base):** تدوین شرایط، استثنائات، سوالات متداول و فرم‌های فرمول‌بندی استعلام قیمت.
- 🔒 **احراز هویت مبتنی بر JWT و رمزنگاری bcrypt:** سطوح دسترسی مدیر و کارشناس فروش.
- 📦 **کانتینریزه و بهینه:** Multi-stage Build برای حجم فوق‌العاده کم ایمیج داکر (<150MB) و مصرف بسیار پایین رم (<100MB).

---

## 🛠️ پشته فناوری (Tech Stack)
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion (Animations), Lucide React
- **Backend:** Node.js 20 LTS, Express.js 4, RESTful Architecture
- **Database & ORM:** SQLite 3 + Prisma ORM 6 (تراکنش‌های سریع، بدون نیاز به سرور دیتابیس سنگین مجزا)
- **AI Engine:** `@google/genai` (Gemini SDK), `openai` SDK
- **Containerization:** Docker Multi-stage Build + Docker Compose

---

## 🖥️ پیش‌نیازهای نصب روی سرور Ubuntu 22.04

وارد SSH سرور ابونتو خود شوید و پکیج‌های پایه و داکر را نصب کنید:

```bash
# 1. به‌روزرسانی مخازن لینوکس
sudo apt update && sudo apt upgrade -y

# 2. نصب ابزارهای پایه
sudo apt install -y curl git ufw

# 3. نصب خودکار و رسمی Docker و Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 4. فعال‌سازی دسترسی بدون sudo برای کاربر فعلی (اختیاری)
sudo usermod -aG docker $USER
newgrp docker

# 5. بررسی نصب موفق داکر
docker --version
docker compose version
```

---

## 🚀 راهنمای استقرار با Docker Compose (سریع‌ترین روش)

### مرحله ۱: انتقال سورس پروژه به سرور
پروژه را داخل سرور در مسیر دلخواه (مثلاً `/var/www/bimehjam`) قرار دهید:
```bash
mkdir -p /var/www/bimehjam
cd /var/www/bimehjam
# فایل‌های پروژه را کپی کرده یا با Git Clone دریافت کنید
```

### مرحله ۲: ساخت فایل تنظیمات `.env`
از فایل نمونه `.env.example` یک کپی بگیرید:
```bash
cp .env.example .env
nano .env
```
مقادیر کلیدهای خود (مانند `GEMINI_API_KEY` و `GOFTINO_API_KEY`) را ذخیره نمایید (`Ctrl+O` سپس `Enter` و `Ctrl+X`).

### مرحله ۳: اجرای کانتینر در پس‌زمینه
تنها با اجرای یک دستور، کل فرآیند Build فرانت‌اند، ساخت باینری سرور، راه‌اندازی دیتابیس SQLite و اعمال Seed اولیه به صورت اتوماتیک انجام می‌شود:

```bash
docker compose up -d --build
```

### مرحله ۴: بررسی وضعیت سرویس
```bash
# مشاهده لاگ‌های اجرای کانتینر
docker compose logs -f

# مشاهده وضعیت سلامت (Health Status)
docker compose ps
```

اکنون سامانه شما روی پورت `3000` سرور در دسترس است:
`http://SERVER_IP:3000`

---

## 🔑 اطلاعات ورود پیش‌فرض (Default Admin Credentials)
در اولین راه‌اندازی، حساب مدیر سیستم به صورت خودکار ایجاد می‌شود:
- **ایمیل:** `admin@bimehjam.ir`
- **کلمه عبور:** `12345678`

*(می‌توانید پس از اولین ورود، در بخش تنظیمات یا دیتابیس رمز خود را تغییر دهید)*

---

## ⚙️ تنظیم متغیرهای محیطی (Environment Variables)

| نام متغیر | نوع | توضیحات |
|---|---|---|
| `PORT` | عددی (پیش‌فرض: 3000) | پورتی که اپلیکیشن به آن متصل می‌شود |
| `NODE_ENV` | متنی (`production`) | حالت اجرای نود جی‌اس |
| `DATABASE_URL` | متنی | مسیر اتصال به فایل دیتابیس (مانند `file:/app/prisma/dev.db`) |
| `JWT_SECRET` | متنی (امن) | کلید رمزنگاری نشست‌ها و توکن‌های ورود کاربران |
| `GEMINI_API_KEY` | متنی | کلید API سرویس Google Gemini AI |
| `OPENAI_API_KEY` | متنی (اختیاری) | کلید API سرویس OpenAI در صورت تمایل به استفاده از GPT-4o |
| `GOFTINO_API_KEY` | متنی | کلید API چت آنلاین گفتینو جهت ارسال خودکار پاسخ‌ها |
| `GOFTINO_OPERATOR_ID`| متنی (اختیاری) | شناسه اپراتور هوش مصنوعی تعریف شده در گفتینو |

---

## 💬 تنظیم وب‌هوک در گفتینو

برای دریافت خودکار پیام‌های مشتریان سایت و ارسال پاسخ هوشمند:
1. وارد پنل مدیریت گفتینو شوید: [https://goftino.com](https://goftino.com)
2. به بخش **تنظیمات** > **توسعه‌دهندگان و API** > **وب‌هوک‌ها (Webhooks)** بروید.
3. در فیلد آدرس وب‌هوک (Webhook URL)، آدرس سرور خود را با مسیر زیر وارد کنید:
   ```text
   https://your-domain.com/api/goftino/webhook
   ```
   یا (در صورت استفاده از IP بدون SSL در فاز آزمایشی):
   ```text
   http://SERVER_IP:3000/api/goftino/webhook
   ```
4. رویدادهای مورد نیاز (مانند `new_message` و `chat_created`) را تیک بزنید و دکمه ذخیره را فشار دهید.
5. سامانه بلافاصله هر پیام ورودی را پردازش کرده و پاسخ به همراه تحلیل روانشناختی را ثبت می‌نماید.

---

## 💻 اجرای محلی (Local Development)

در صورتی که می‌خواهید پروژه را مستقیماً بدون داکر روی کامپیوتر یا سیستم توسعه تست کنید:

```bash
# 1. نصب پکیج‌ها
npm install

# 2. آماده‌سازی دیتابیس SQLite لوکال
npx prisma generate
npx prisma db push
npx tsx server/db/seed.ts

# 3. اجرای همزمان فرانت‌اند و بک‌اند
npm run dev
```
سپس مرورگر خود را باز کرده و به آدرس `http://localhost:3000` بروید.

---

## 💾 بکاپ‌گیری و بازیابی پایگاه داده

تمام داده‌ها (کاربران، مکالمات، سرنخ‌ها، تحلیل‌ها و تنظیمات پایگاه دانش) درون یک Named Volume با نام `bimehjam_data` ذخیره می‌شوند.

### تهیه فایل پشتیبان (Backup):
```bash
# ایجاد پوشه بکاپ روی سرور
mkdir -p ~/bimehjam_backups

# استخراج فایل دیتابیس با حفظ ساختار
docker cp bimehjam-platform:/app/prisma/dev.db ~/bimehjam_backups/dev_backup_$(date +%Y%m%d_%H%M%S).db

echo "بکاپ با موفقیت در پوشه ~/bimehjam_backups ذخیره شد."
```

### بازیابی فایل پشتیبان (Restore):
```bash
# 1. متوقف کردن موقت کانتینر
docker compose stop

# 2. کپی فایل بکاپ به جای دیتابیس فعلی
docker cp /path/to/your/backup_file.db bimehjam-platform:/app/prisma/dev.db

# 3. روشن کردن مجدد کانتینر
docker compose start
```

---

## 🌐 تنظیم Nginx و SSL رایگان با Certbot

برای راه‌اندازی دامنه اختصاصی (مانند `panel.yourcompany.ir`) و دریافت گواهینامه امنیتی HTTPS:

```bash
# 1. نصب وب‌سرور Nginx و Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# 2. ایجاد کانفیگ Nginx
sudo nano /etc/nginx/sites-available/bimehjam.conf
```

محتوای زیر را داخل فایل قرار دهید (دامنه خود را جایگزین کنید):
```nginx
server {
    listen 80;
    server_name panel.yourcompany.ir;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 3. فعال‌سازی کانفیگ و ری‌استارت Nginx
sudo ln -s /etc/nginx/sites-available/bimehjam.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 4. دریافت خودکار SSL رایگان Let's Encrypt
sudo certbot --nginx -d panel.yourcompany.ir
```

---

## 🔧 دستورات کاربردی مدیریت کانتینر

| عملیات | دستور |
|---|---|
| اجرای سرویس در پس‌زمینه | `docker compose up -d` |
| ری‌بیلد و آپدیت کدها | `docker compose up -d --build` |
| مشاهده لاگ‌های زنده | `docker compose logs -f` |
| خاموش کردن کانتینر | `docker compose down` |
| ری‌استارت کانتینر | `docker compose restart` |
| ورود به شل کانتینر | `docker exec -it bimehjam-platform sh` |
| اجرای دستی دستورات Prisma در کانتینر | `docker exec -it bimehjam-platform npx prisma studio` |
| مشاهده مصرف منابع (CPU/RAM) | `docker stats bimehjam-platform` |

---

## 🛡️ عیب‌یابی (Troubleshooting)

- **خطای Port In Use:** اگر پورت 3000 توسط سرویس دیگری اشغال است، در فایل `.env` مقدار `PORT=3001` را قرار داده و مجدد `docker compose up -d` را اجرا کنید.
- **بررسی سلامت وب‌هوک:** دستور `curl http://localhost:3000/api/webhook/health` باید پاسخ `{"status":"ok"}` برگرداند.
- **اطمینان از دسترسی به اینترنت:** در صورت بروز مشکل در اتصال به API هوش مصنوعی، مطمئن شوید سرور شما به دامنه‌های `generativelanguage.googleapis.com` یا `api.openai.com` دسترسی دارد.

---
**توسعه داده شده برای سامانه هوشمند بیمه جم** | پایدار، ایمن و آماده تولید (Production-Ready)
