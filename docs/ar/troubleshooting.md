# استكشاف الأخطاء وإصلاحها - Omni Core DB Manager

## مشاكل التثبيت

### المشكلة: خطأ في تثبيت Node modules

**الأعراض**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**الحلول**:

1. **مسح ذاكرة التخزين المؤقت**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **استخدام الإصدار الصحيح من Node.js**:
```bash
node --version  # يجب أن يكون 20.x أو أحدث
```

3. **تثبيت بعلم legacy-peer-deps**:
```bash
npm install --legacy-peer-deps
```

### المشكلة: خطأ في تثبيت Python packages

**الأعراض**:
```
error: externally-managed-environment
```

**الحلول**:

1. **استخدام uv بدلاً من pip**:
```bash
uv sync
```

2. **إنشاء بيئة افتراضية**:
```bash
python -m venv venv
source venv/bin/activate  # على macOS/Linux
venv\Scripts\activate     # على Windows
pip install -r requirements.txt
```

### المشكلة: uv غير موجود

**الحل**:
```bash
# على macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# على Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex

# التحقق
uv --version
```

## مشاكل الاتصال

### المشكلة: فشل الاتصال بـ PostgreSQL

**الأعراض**:
```
Connection refused: localhost:5432
```

**الحلول**:

1. **تأكد من تشغيل PostgreSQL**:
```bash
# على macOS
brew services list

# على Linux
systemctl status postgresql

# على Windows
services.msc  # ابحث عن postgresql
```

2. **تحقق من المنفذ**:
```bash
netstat -an | grep 5432
```

3. **تحقق من إعدادات pg_hba.conf**:
```
# افتح /etc/postgresql/[version]/main/pg_hba.conf
# تأكد من وجود هذا السطر:
host    all             all             127.0.0.1/32            md5
```

### المشكلة: فشل الاتصال بـ MySQL

**الأعراض**:
```
Access denied for user 'root'@'localhost'
```

**الحلول**:

1. **إعادة تعيين كلمة المرور**:
```sql
-- في mysql shell
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
```

2. **تحقق من المستخدم والصلاحيات**:
```sql
SELECT user, host FROM mysql.user;
SHOW GRANTS FOR 'root'@'localhost';
```

### المشكلة: SQLite - Permission denied

**الأعراض**:
```
Error: EACCES: permission denied, open 'database.db'
```

**الحلول**:

1. **تحقق من الصلاحيات**:
```bash
ls -la database.db
chmod 666 database.db
```

2. **تحقق من المجلد**:
```bash
ls -la .
chmod 755 .
```

## مشاكل التشغيل

### المشكلة: المنفذ 5000 قيد الاستخدام

**الأعراض**:
```
Error: listen EADDRINUSE: address already in use :::5000
```

**الحلول**:

1. **العثور على العملية واغلاقها**:
```bash
# على macOS/Linux
lsof -ti:5000 | xargs kill -9

# على Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

2. **استخدام منفذ آخر** (تعديل vite.config.ts):
```typescript
server: {
  port: 3000,  // غيّر إلى منفذ آخر
}
```

### المشكلة: الخادم الخلفي لا يستجيب

**الأعراض**:
```
Failed to fetch: http://localhost:8000/api/connections
```

**الحلول**:

1. **تحقق من تشغيل الخادم**:
```bash
ps aux | grep python  # على macOS/Linux
tasklist | findstr python  # على Windows
```

2. **أعد تشغيل الخادم**:
```bash
# أوقف العملية الحالية (Ctrl+C)
# ثم
uv run python server_py/main.py
```

3. **تحقق من السجلات (logs)**:
```bash
# شاهد الأخطاء في الطرفية
```

## مشاكل الاستعلامات

### المشكلة: Syntax Error في SQL

**الأعراض**:
```
SQL Error: syntax error at or near "SELECT"
```

**الحلول**:

1. **تحقق من بناء الجملة**:
```sql
-- خطأ
SELECT * FROM users WHERE age > 25  -- ناقص فاصلة منقوطة أحياناً

-- صحيح
SELECT * FROM users WHERE age > 25;
```

2. **تحقق من أسماء الجداول والأعمدة**:
```sql
-- إذا كان الاسم محجوز أو يحتوي على مسافات
SELECT * FROM "table name" WHERE "column name" = 'value';
```

3. **استخدم EXPLAIN للفحص**:
```sql
EXPLAIN SELECT * FROM users WHERE age > 25;
```

### المشكلة: استعلام بطيء جداً

**الأعراض**:
- الاستعلام يستغرق أكثر من 10 ثوانٍ
- التطبيق يتجمد أثناء التنفيذ

**الحلول**:

1. **أضف LIMIT**:
```sql
SELECT * FROM large_table LIMIT 100;
```

2. **أنشئ فهرس**:
```sql
CREATE INDEX idx_column ON table_name(column_name);
```

3. **استخدم WHERE للتصفية**:
```sql
-- بدلاً من
SELECT * FROM orders;

-- استخدم
SELECT * FROM orders WHERE created_at > '2024-01-01';
```

## مشاكل البيانات

### المشكلة: Foreign Key Constraint Failed

**الأعراض**:
```
FOREIGN KEY constraint failed
```

**الحلول**:

1. **تأكد من وجود القيمة المرجعية**:
```sql
-- تحقق من وجود customer_id
SELECT * FROM customers WHERE id = 123;

-- ثم أدخل
INSERT INTO orders (customer_id, ...) VALUES (123, ...);
```

2. **قم بتعطيل القيد مؤقتاً** (حذر!):
```sql
-- PostgreSQL
SET CONSTRAINTS ALL DEFERRED;

-- MySQL
SET FOREIGN_KEY_CHECKS=0;
-- قم بالعملية
SET FOREIGN_KEY_CHECKS=1;

-- SQLite
PRAGMA foreign_keys=OFF;
-- قم بالعملية
PRAGMA foreign_keys=ON;
```

### المشكلة: Duplicate Entry

**الأعراض**:
```
Duplicate entry 'ahmed@example.com' for key 'email'
```

**الحلول**:

1. **استخدم INSERT OR IGNORE** (SQLite):
```sql
INSERT OR IGNORE INTO users (email, name) VALUES ('ahmed@example.com', 'أحمد');
```

2. **استخدم ON CONFLICT** (PostgreSQL):
```sql
INSERT INTO users (email, name) 
VALUES ('ahmed@example.com', 'أحمد')
ON CONFLICT (email) DO UPDATE SET name = 'أحمد';
```

3. **استخدم INSERT ... ON DUPLICATE KEY UPDATE** (MySQL):
```sql
INSERT INTO users (email, name) 
VALUES ('ahmed@example.com', 'أحمد')
ON DUPLICATE KEY UPDATE name = 'أحمد';
```

### المشكلة: Data Too Long

**الأعراض**:
```
Data too long for column 'description' at row 1
```

**الحلول**:

1. **عدّل نوع العمود**:
```sql
ALTER TABLE products MODIFY description TEXT;
```

2. **قصّر البيانات قبل الإدخال**:
```javascript
const shortDescription = description.substring(0, 255);
```

## مشاكل الأداء

### المشكلة: التطبيق بطيء جداً

**الحلول**:

1. **تحقق من الفهارس**:
```sql
-- عرض الفهارس
SHOW INDEX FROM table_name;  -- MySQL
\d table_name                -- PostgreSQL
```

2. **راقب الاستعلامات البطيئة**:
- افتح "Performance" → "Slow Queries"
- راجع الاستعلامات التي تستغرق أكثر من ثانية

3. **حلل الجداول الكبيرة**:
```sql
ANALYZE TABLE table_name;  -- MySQL
ANALYZE table_name;        -- PostgreSQL
```

### المشكلة: استهلاك عالي للذاكرة

**الحلول**:

1. **قلّل عدد الصفوف المعروضة**:
- غيّر Rows per page من 100 إلى 25

2. **أغلق الاتصالات غير المستخدمة**:
- افصل من قواعد البيانات غير النشطة

3. **أعد تشغيل التطبيق**:
```bash
# أوقف التطبيق (Ctrl+C)
npm run dev
```

## مشاكل التصدير والاستيراد

### المشكلة: فشل تصدير البيانات

**الأعراض**:
```
Export failed: Memory limit exceeded
```

**الحلول**:

1. **صدّر على دفعات**:
```sql
-- بدلاً من تصدير الجدول كاملاً
SELECT * FROM large_table WHERE id BETWEEN 1 AND 10000;
-- ثم
SELECT * FROM large_table WHERE id BETWEEN 10001 AND 20000;
```

2. **استخدم خيار Streaming** (إن وُجد)

### المشكلة: خطأ في استيراد CSV

**الأعراض**:
```
Parse error: Unexpected delimiter
```

**الحلول**:

1. **تأكد من الفاصل الصحيح**:
- جرّب: comma (,)
- جرّب: semicolon (;)
- جرّب: tab (\t)

2. **تحقق من الترميز**:
- يجب أن يكون UTF-8

3. **تأكد من تطابق الأعمدة**:
```csv
name,email,age
أحمد,ahmed@example.com,30
```

## مشاكل الواجهة

### المشكلة: الصفحة فارغة/بيضاء

**الحلول**:

1. **افتح Developer Console** (F12):
```
# ابحث عن أخطاء JavaScript
```

2. **امسح الذاكرة المؤقتة**:
- Ctrl+Shift+R (Windows/Linux)
- Cmd+Shift+R (macOS)

3. **تحقق من الـ Console للأخطاء**:
```javascript
// ابحث عن أخطاء مثل:
Failed to load module
CORS error
```

### المشكلة: التحديثات لا تظهر

**الحلول**:

1. **أعد تحميل الصفحة** (Hard Refresh):
- Ctrl+F5 (Windows/Linux)
- Cmd+Shift+R (macOS)

2. **امسح Local Storage**:
```javascript
// في Console
localStorage.clear();
location.reload();
```

## مشاكل أخرى

### المشكلة: النسخ الاحتياطي فاشل

**الحلول**:

1. **تحقق من مساحة القرص**:
```bash
df -h  # على macOS/Linux
```

2. **استخدم صيغة أصغر**:
- جرّب JSON بدلاً من SQL

### المشكلة: لا يمكن حذف جدول

**الأعراض**:
```
Cannot drop table: referenced by foreign key
```

**الحلول**:

1. **احذف القيود أولاً**:
```sql
ALTER TABLE orders DROP FOREIGN KEY fk_customer;
-- ثم
DROP TABLE customers;
```

2. **استخدم CASCADE**:
```sql
DROP TABLE customers CASCADE;
```

## الحصول على المساعدة

إذا لم تحل المشكلة:

1. **تحقق من السجلات (Logs)**:
```bash
# سجلات الخادم
tail -f server.log

# سجلات المتصفح
# افتح Developer Tools → Console
```

2. **أبلغ عن المشكلة**:
- GitHub Issues: [https://github.com/Alqudimi/OmniCoreDB/issues](https://github.com/Alqudimi/OmniCoreDB/issues)
- البريد: eng7mi@gmail.com

3. **قدّم المعلومات التالية**:
- نظام التشغيل
- إصدار Node.js وPython
- رسالة الخطأ الكاملة
- الخطوات لإعادة إنتاج المشكلة

---

**المطور**: عبدالعزيز القديمي  
**البريد الإلكتروني**: eng7mi@gmail.com, alqudimitechnology@gmail.com  
**GitHub**: [@Alqudimi](https://github.com/Alqudimi)  
**جميع الحقوق محفوظة © 2024 - تقنية القديمي**
