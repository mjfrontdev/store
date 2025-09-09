# فروشگاه آنلاین مدرن 🛒

یک پروژه فروشگاه آنلاین کامل با Django REST Framework و React که شامل تمام ویژگی‌های مدرن یک فروشگاه اینترنتی است.

## ✨ ویژگی‌ها

### 🔧 بک‌اند (Django)
- **Django REST Framework** برای API
- **JWT Authentication** برای احراز هویت
- **مدل‌های کامل**: User، Product، Cart، Order
- **ادغام با FakeStore API** برای داده‌های محصولات
- **سیستم پرداخت** (پرداخت تستی)
- **پشتیبانی RTL** و زبان فارسی
- **کش Redis** برای بهبود عملکرد

### 🎨 فرانت‌اند (React)
- **React 18** با Hooks
- **Redux Toolkit** برای مدیریت حالت
- **Bootstrap 5** با پشتیبانی RTL
- **Framer Motion** برای انیمیشن‌های زیبا
- **React Icons** برای آیکون‌ها
- **طراحی ریسپانسیو** و مدرن

### 📱 صفحات اصلی
- **خانه**: لیست محصولات با فیلتر و جستجو
- **جزئیات محصول**: نمایش کامل محصول
- **سبد خرید**: مدیریت محصولات انتخابی
- **تسویه حساب**: فرآیند خرید و پرداخت
- **ورود/ثبت‌نام**: احراز هویت کاربران
- **داشبورد**: مدیریت سفارشات کاربر

## 🚀 راه‌اندازی پروژه

### پیش‌نیازها
- Python 3.8+
- Node.js 16+
- Redis (اختیاری)

### نصب و راه‌اندازی بک‌اند

```bash
# ورود به پوشه بک‌اند
cd backend

# ایجاد محیط مجازی
python -m venv venv

# فعال‌سازی محیط مجازی
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# نصب وابستگی‌ها
pip install -r requirements.txt

# اجرای مایگریشن‌ها
python manage.py makemigrations
python manage.py migrate

# ایجاد ابرکاربر
python manage.py createsuperuser

# اجرای سرور
python manage.py runserver
```

### نصب و راه‌اندازی فرانت‌اند

```bash
# ورود به پوشه فرانت‌اند
cd frontend

# نصب وابستگی‌ها
npm install

# اجرای پروژه
npm start
```

## 📁 ساختار پروژه

```
store/
├── backend/                 # بک‌اند Django
│   ├── store_backend/      # تنظیمات اصلی
│   ├── accounts/           # مدیریت کاربران
│   ├── products/           # مدیریت محصولات
│   ├── cart/              # سبد خرید
│   ├── orders/            # سفارشات
│   └── requirements.txt   # وابستگی‌های Python
├── frontend/              # فرانت‌اند React
│   ├── public/           # فایل‌های عمومی
│   ├── src/             # کد منبع
│   │   ├── components/  # کامپوننت‌ها
│   │   ├── pages/      # صفحات
│   │   ├── store/      # Redux store
│   │   └── App.js      # کامپوننت اصلی
│   └── package.json    # وابستگی‌های Node.js
└── README.md           # مستندات
```

## 🔧 تنظیمات

### متغیرهای محیطی

فایل `.env` را در پوشه `backend` ایجاد کنید:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
REDIS_URL=redis://127.0.0.1:6379/0
```

### تنظیمات پایگاه داده

پروژه به صورت پیش‌فرض از SQLite استفاده می‌کند. برای استفاده از PostgreSQL:

```python
# در settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'store_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 📚 API Endpoints

### احراز هویت
- `POST /api/auth/register/` - ثبت‌نام
- `POST /api/auth/login/` - ورود
- `POST /api/auth/logout/` - خروج
- `GET /api/auth/profile/` - پروفایل کاربر
- `PUT /api/auth/profile/update/` - به‌روزرسانی پروفایل

### محصولات
- `GET /api/products/` - لیست محصولات
- `GET /api/products/{id}/` - جزئیات محصول
- `GET /api/products/categories/` - دسته‌بندی‌ها
- `POST /api/products/sync/` - همگام‌سازی با FakeStore

### سبد خرید
- `GET /api/cart/` - مشاهده سبد خرید
- `POST /api/cart/add/` - افزودن به سبد
- `PUT /api/cart/items/{id}/update/` - به‌روزرسانی تعداد
- `DELETE /api/cart/items/{id}/remove/` - حذف از سبد
- `DELETE /api/cart/clear/` - خالی کردن سبد

### سفارشات
- `GET /api/orders/` - لیست سفارشات
- `GET /api/orders/{id}/` - جزئیات سفارش
- `POST /api/orders/create/` - ایجاد سفارش
- `POST /api/orders/{id}/payment/` - پردازش پرداخت

## 🎨 ویژگی‌های UI/UX

### انیمیشن‌ها
- **Framer Motion** برای انیمیشن‌های نرم
- **Hover Effects** روی کارت‌های محصولات
- **Loading States** برای بهبود تجربه کاربر
- **Smooth Transitions** بین صفحات

### طراحی ریسپانسیو
- **Mobile-First** طراحی
- **Bootstrap Grid** برای چیدمان
- **RTL Support** کامل
- **Dark/Light Mode** (قابل توسعه)

### تجربه کاربری
- **Real-time Updates** سبد خرید
- **Form Validation** کامل
- **Error Handling** مناسب
- **Loading States** در همه جا

## 🧪 تست‌ها

### اجرای تست‌های بک‌اند
```bash
cd backend
python manage.py test
```

### اجرای تست‌های فرانت‌اند
```bash
cd frontend
npm test
```

## 🚀 دپلوی

### Docker (اختیاری)

```dockerfile
# Dockerfile برای بک‌اند
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### Heroku
```bash
# نصب Heroku CLI
# ایجاد Procfile
echo "web: python manage.py runserver 0.0.0.0:$PORT" > Procfile

# دپلوی
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## 🔒 امنیت

- **JWT Tokens** برای احراز هویت
- **CORS** تنظیم شده
- **Input Validation** کامل
- **SQL Injection** محافظت شده
- **XSS Protection** فعال

## 📈 بهبود عملکرد

- **Redis Caching** برای محصولات
- **Database Indexing** مناسب
- **Image Optimization** (قابل توسعه)
- **CDN Support** (قابل توسعه)
- **Lazy Loading** برای تصاویر

## 🤝 مشارکت

1. Fork کنید
2. Branch جدید ایجاد کنید (`git checkout -b feature/AmazingFeature`)
3. تغییرات را commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Branch را push کنید (`git push origin feature/AmazingFeature`)
5. Pull Request ایجاد کنید

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## 📞 تماس

- **ایمیل**: info@store.com
- **تلفن**: +98 21 1234 5678
- **آدرس**: تهران، ایران

## 🙏 تشکر

از تمام کتابخانه‌ها و فریمورک‌های open source که در این پروژه استفاده شده‌اند، تشکر می‌کنیم.

---

**ساخته شده با ❤️ در ایران**
