Omni Core DB Manager
====================

Basic requirements
------------------

Before commencing the installation of Omni Core DB Manager, make sure that the following requirements are met:

### System requirements

* **Operating system**Windows, macOS, or Linux
* **Memory**:: 4 GB RAM minimum (preferably 8 GB)
* **Area**500 MB Free space on disk

### Software requirements

#### 1. Node.js

* **Release**20.x or more recent
* **Loading**== sync, corrected by elderman == @elder\_man<https://nodejs.org>

For confirmation check:

```
node --version
npm --version
```

#### 2. Python

* **Release**3.11 or more recent
* **Loading**== sync, corrected by elderman == @elder\_man<https://www.python.org>

For confirmation check:

```
python --version
# أو
python3 --version
```

#### 3. uv (Python Package Manager)

* **Description**Quick Python package management tool
* **Installing**== sync, corrected by elderman == @elder\_man

```
# على macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# على Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex
```

For confirmation check:

```
uv --version
```

Stabilization steps
-------------------

### Mode 1: From Warehouse (recommended)

#### Step 1: Reproduction of the warehouse

```
git clone https://github.com/Alqudimi/OmniCoreDB.git
cd OmniCoreDB
```

#### Step 2: Stabilization of Node.js

```
npm install
```

This will install all the packages required for Frontend.

#### Step 3: installation of Python dependencies

```
uv sync
```

This will create a virtual environment - installation of all Python dependencies required for the server (Backend)

### Method 2: using requirements.txt

If you prefer to use traditional pip:

```
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

Verification of installation
----------------------------

### 1. Backend test

```
# تشغيل خادم Python
uv run python server_py/main.py
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 2. Frontend test

In another terminal window:

```
npm run dev
```

You should see:

```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5000/
```

### 3. Opening of the application

Open the Web Browser and move on to:

```
http://localhost:5000
```

If you see the face of Omni Core DB Manager, you've been successfully installed!

Database installation (optional)
--------------------------------

To use different databases, you may need to install:

### PostgreSQL

* **Windows/macos**== sync, corrected by elderman == @elder\_man<https://www.postgresql.org/download/>
* **Ubuntu/Debian**== sync, corrected by elderman == @elder\_man`sudo apt-get install postgresql`
* **RHEL/CentOS**== sync, corrected by elderman == @elder\_man`sudo yum install postgresql-server`

### MySQL

* **Windows/macos**== sync, corrected by elderman == @elder\_man<https://dev.mysql.com/downloads/>
* **Ubuntu/Debian**== sync, corrected by elderman == @elder\_man`sudo apt-get install mysql-server`
* **RHEL/CentOS**== sync, corrected by elderman == @elder\_man`sudo yum install mysql-server`

### SQLite

SQLite is integrated with Python and does not need separate installation.

Construction for production
---------------------------

To build the application for production:

```
# بناء الواجهة الأمامية
npm run build

# تشغيل الخادم في وضع الإنتاج
npm run start
```

The application will be operated on port 5,000.

Explore stabilization problems
------------------------------

### Problem: Error stabilizing Node modules

**The solution.**== sync, corrected by elderman == @elder\_man

```
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

### Problem: Error stabilizing Python packages

**The solution.**== sync, corrected by elderman == @elder\_man

```
# إعادة المزامنة
uv sync --reinstall
```

### Problem: Port 5,000 or 8,000 in use

**The solution.**== sync, corrected by elderman == @elder\_man

```
# العثور على العملية واغلاقها
# على macOS/Linux
lsof -ti:5000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# على Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Problem: Problems in terms of authority

**The solution.**== sync, corrected by elderman == @elder\_man

```
# على macOS/Linux، استخدم sudo فقط عند الضرورة
sudo chown -R $USER:$USER .
```

Next steps
----------

After successful installation: 1. Check[دليل البدء السريع](./quick-start.md)2. Read[دليل المستخدم](./user-guide.md)Explore 3.[الميزات المتقدمة](./advanced-features.md)

Support
-------

If you encounter any problems during installation:[استكشاف الأخطاء](./troubleshooting.md)- Back up.[الأسئلة الشائعة](./faq.md)- Contact us on: eng7mi@gmail.com

---

**Developer**:: Abdul Aziz Al-Ogidi  
**© 2024 - Old Tech**