# دليل التثبيت - Omni Core DB Manager

## المتطلبات الأساسية

قبل البدء في تثبيت Omni Core DB Manager، تأكد من توفر المتطلبات التالية:

### متطلبات النظام
- **نظام التشغيل**: Windows, macOS, أو Linux
- **الذاكرة**: 4 GB RAM كحد أدنى (يُفضل 8 GB)
- **المساحة**: 500 MB مساحة حرة على القرص

### متطلبات البرمجيات

#### 1. Node.js
- **الإصدار**: 20.x أو أحدث
- **التحميل**: [https://nodejs.org](https://nodejs.org)

للتحقق من التثبيت:
```bash
node --version
npm --version
```

#### 2. Python
- **الإصدار**: 3.11 أو أحدث
- **التحميل**: [https://www.python.org](https://www.python.org)

للتحقق من التثبيت:
```bash
python --version
# أو
python3 --version
```

#### 3. uv (مدير حزم Python)
- **الوصف**: أداة سريعة لإدارة حزم Python
- **التثبيت**:

```bash
# على macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# على Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex
```

للتحقق من التثبيت:
```bash
uv --version
```

## خطوات التثبيت

### الطريقة 1: من المستودع (موصى به)

#### الخطوة 1: استنساخ المستودع

```bash
git clone https://github.com/Alqudimi/OmniCoreDB.git
cd OmniCoreDB
```

#### الخطوة 2: تثبيت تبعيات Node.js

```bash
npm install
```

هذا الأمر سيقوم بتثبيت جميع الحزم المطلوبة للواجهة الأمامية (Frontend).

#### الخطوة 3: تثبيت تبعيات Python

```bash
uv sync
```

هذا الأمر سيقوم بـ:
- إنشاء بيئة افتراضية (virtual environment)
- تثبيت جميع تبعيات Python المطلوبة للخادم (Backend)

### الطريقة 2: باستخدام requirements.txt

إذا كنت تفضل استخدام pip التقليدي:

```bash
# إنشاء بيئة افتراضية
python -m venv venv

# تفعيل البيئة الافتراضية
# على Windows
venv\Scripts\activate
# على macOS/Linux
source venv/bin/activate

# تثبيت التبعيات
pip install -r requirements.txt
```

## التحقق من التثبيت

### 1. اختبار الخادم الخلفي (Backend)

```bash
# تشغيل خادم Python
uv run python server_py/main.py
```

يجب أن ترى:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 2. اختبار الواجهة الأمامية (Frontend)

في نافذة طرفية أخرى:

```bash
npm run dev
```

يجب أن ترى:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5000/
```

### 3. فتح التطبيق

افتح متصفح الويب وانتقل إلى:
```
http://localhost:5000
```

إذا رأيت واجهة Omni Core DB Manager، فقد تم التثبيت بنجاح! 🎉

## تثبيت قواعد البيانات (اختياري)

لاستخدام قواعد بيانات مختلفة، قد تحتاج إلى تثبيت:

### PostgreSQL
- **Windows/macOS**: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- **Ubuntu/Debian**: `sudo apt-get install postgresql`
- **RHEL/CentOS**: `sudo yum install postgresql-server`

### MySQL
- **Windows/macOS**: [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)
- **Ubuntu/Debian**: `sudo apt-get install mysql-server`
- **RHEL/CentOS**: `sudo yum install mysql-server`

### SQLite
SQLite مدمج مع Python ولا يحتاج إلى تثبيت منفصل.

## البناء للإنتاج

لبناء التطبيق للإنتاج:

```bash
# بناء الواجهة الأمامية
npm run build

# تشغيل الخادم في وضع الإنتاج
npm run start
```

سيتم تشغيل التطبيق على المنفذ 5000.

## استكشاف مشاكل التثبيت

### المشكلة: خطأ في تثبيت Node modules

**الحل**:
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

### المشكلة: خطأ في تثبيت Python packages

**الحل**:
```bash
# إعادة المزامنة
uv sync --reinstall
```

### المشكلة: المنفذ 5000 أو 8000 قيد الاستخدام

**الحل**:
```bash
# العثور على العملية واغلاقها
# على macOS/Linux
lsof -ti:5000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# على Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### المشكلة: مشاكل في الصلاحيات

**الحل**:
```bash
# على macOS/Linux، استخدم sudo فقط عند الضرورة
sudo chown -R $USER:$USER .
```

## الخطوات التالية

بعد إتمام التثبيت بنجاح:
1. راجع [دليل البدء السريع](./quick-start.md)
2. اقرأ [دليل المستخدم](./user-guide.md)
3. استكشف [الميزات المتقدمة](./advanced-features.md)

## الدعم

إذا واجهت أي مشاكل أثناء التثبيت:
- تحقق من [استكشاف الأخطاء](./troubleshooting.md)
- راجع [الأسئلة الشائعة](./faq.md)
- تواصل معنا على: eng7mi@gmail.com

---

**المطور**: عبدالعزيز القديمي  
**جميع الحقوق محفوظة © 2024 - تقنية القديمي**
