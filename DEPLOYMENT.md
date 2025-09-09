# 🚀 Store Deployment Guide

این راهنما برای deploy کردن پروژه Store روی سرور است.

## 📋 پیش‌نیازها

- Docker و Docker Compose
- Git
- دسترسی به سرور (VPS یا Cloud)

## 🛠️ روش‌های Deploy

### 1. Deploy محلی (تست)

```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows PowerShell
.\deploy.ps1
```

### 2. Deploy روی VPS

#### مرحله 1: آماده‌سازی سرور

```bash
# نصب Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# نصب Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### مرحله 2: کلون کردن پروژه

```bash
git clone <your-repo-url>
cd store
```

#### مرحله 3: تنظیم Environment

```bash
cp env.prod.example .env.prod
nano .env.prod  # ویرایش تنظیمات
```

#### مرحله 4: Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

### 3. Deploy روی Cloud Platforms

#### Railway
1. اتصال GitHub repository
2. تنظیم environment variables
3. Deploy خودکار

#### Render
1. اتصال GitHub repository
2. انتخاب Docker
3. تنظیم environment variables

#### DigitalOcean App Platform
1. اتصال GitHub repository
2. انتخاب Docker Compose
3. تنظیم environment variables

## 🔧 تنظیمات مهم

### Environment Variables

```env
# Database
POSTGRES_PASSWORD=your_secure_password

# Django
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Frontend
REACT_APP_API_URL=https://yourdomain.com/api
```

### Domain و SSL

برای production:
1. تنظیم domain name
2. نصب SSL certificate (Let's Encrypt)
3. تنظیم reverse proxy (Nginx)

## 📊 مانیتورینگ

### Logs
```bash
# مشاهده logs
docker-compose -f docker-compose.prod.yml logs -f

# Logs مخصوص backend
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Health Check
```bash
# بررسی وضعیت سرویس‌ها
docker-compose -f docker-compose.prod.yml ps
```

## 🔄 Update کردن

```bash
# Pull آخرین تغییرات
git pull origin main

# Rebuild و restart
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🆘 Troubleshooting

### مشکلات رایج

1. **Port در حال استفاده**
   ```bash
   sudo lsof -i :80
   sudo kill -9 <PID>
   ```

2. **Database connection error**
   - بررسی PostgreSQL service
   - بررسی environment variables

3. **Frontend build error**
   - بررسی Node.js version
   - پاک کردن node_modules و rebuild

### Backup

```bash
# Backup database
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres store_db > backup.sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres store_db < backup.sql
```

## 📞 پشتیبانی

برای مشکلات بیشتر، لطفاً issue ایجاد کنید یا با تیم تماس بگیرید.
