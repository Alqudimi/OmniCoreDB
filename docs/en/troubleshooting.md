Explore and repair errors - Omni Core DB Manager
================================================

Stabilization problems
----------------------

### Problem: Error stabilizing Node modules

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Scanning of temporary storage memory**== sync, corrected by elderman == @elder\_man

```
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

1. **Use the correct version of Node.js**== sync, corrected by elderman == @elder\_man

```
node --version  # يجب أن يكون 20.x أو أحدث
```

1. **Legacy-peer-deps**== sync, corrected by elderman == @elder\_man

```
npm install --legacy-peer-deps
```

### Problem: Error stabilizing Python packages

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
error: externally-managed-environment
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Use uv instead of pip**== sync, corrected by elderman == @elder\_man

```
uv sync
```

1. **Creation of a virtual environment**== sync, corrected by elderman == @elder\_man

```
python -m venv venv
source venv/bin/activate  # على macOS/Linux
venv\Scripts\activate     # على Windows
pip install -r requirements.txt
```

### Problem: uv does not exist

**The solution.**== sync, corrected by elderman == @elder\_man

```
# على macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# على Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex

# التحقق
uv --version
```

Communication problems
----------------------

### Problem: Loss of contact with PostgreSQL

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Connection refused: localhost:5432
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Make sure to run PostgreSQL**== sync, corrected by elderman == @elder\_man

```
# على macOS
brew services list

# على Linux
systemctl status postgresql

# على Windows
services.msc  # ابحث عن postgresql
```

1. **Check the port.**== sync, corrected by elderman == @elder\_man

```
netstat -an | grep 5432
```

1. **Check the pg\_hba.conf settings**== sync, corrected by elderman == @elder\_man

```
# افتح /etc/postgresql/[version]/main/pg_hba.conf
# تأكد من وجود هذا السطر:
host    all             all             127.0.0.1/32            md5
```

### Problem: failure to contact MySQL

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Access denied for user 'root'@'localhost'
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Reset password**== sync, corrected by elderman == @elder\_man

```
-- في mysql shell
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
```

1. **Check the user and the powers.**== sync, corrected by elderman == @elder\_man

```
SELECT user, host FROM mysql.user;
SHOW GRANTS FOR 'root'@'localhost';
```

### Problem: SQLite - Permission denied

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Error: EACCES: permission denied, open 'database.db'
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Check the authority.**== sync, corrected by elderman == @elder\_man

```
ls -la database.db
chmod 666 database.db
```

1. **Check the folder.**== sync, corrected by elderman == @elder\_man

```
ls -la .
chmod 755 .
```

Operating problems
------------------

### Problem: Port 5,000 in use

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Find the operation and shut it down.**== sync, corrected by elderman == @elder\_man

```
# على macOS/Linux
lsof -ti:5000 | xargs kill -9

# على Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

1. **Use another port**(vite modification.config.ts):

```
server: {
  port: 3000,  // غيّر إلى منفذ آخر
}
```

### Problem: The back server isn't responding.

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Failed to fetch: http://localhost:8000/api/connections
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Check the server's running.**== sync, corrected by elderman == @elder\_man

```
ps aux | grep python  # على macOS/Linux
tasklist | findstr python  # على Windows
```

1. **Reboot the server.**== sync, corrected by elderman == @elder\_man

```
# أوقف العملية الحالية (Ctrl+C)
# ثم
uv run python server_py/main.py
```

1. **Check logs**== sync, corrected by elderman == @elder\_man

```
# شاهد الأخطاء في الطرفية
```

Information problems
--------------------

### Problem: Syntax Error in SQL

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
SQL Error: syntax error at or near "SELECT"
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Check the building of the sentence.**== sync, corrected by elderman == @elder\_man

```
-- خطأ
SELECT * FROM users WHERE age > 25  -- ناقص فاصلة منقوطة أحياناً

-- صحيح
SELECT * FROM users WHERE age > 25;
```

1. **Check the names of the tables and columns.**== sync, corrected by elderman == @elder\_man

```
-- إذا كان الاسم محجوز أو يحتوي على مسافات
SELECT * FROM "table name" WHERE "column name" = 'value';
```

1. **Use EXPLAIN for inspection**== sync, corrected by elderman == @elder\_man

```
EXPLAIN SELECT * FROM users WHERE age > 25;
```

### Problem is, it's too slow to ask.

**Symptoms.**:: Information takes more than 10 seconds. Application freezes during implementation

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Add LIMIT**== sync, corrected by elderman == @elder\_man

```
SELECT * FROM large_table LIMIT 100;
```

1. **Create Index**== sync, corrected by elderman == @elder\_man

```
CREATE INDEX idx_column ON table_name(column_name);
```

1. **Use WHERE to filter**== sync, corrected by elderman == @elder\_man

```
-- بدلاً من
SELECT * FROM orders;

-- استخدم
SELECT * FROM orders WHERE created_at > '2024-01-01';
```

Data problems
-------------

### Problem: Foreign Key Constraint Failure

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
FOREIGN KEY constraint failed
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Make sure there's a reference value.**== sync, corrected by elderman == @elder\_man

```
-- تحقق من وجود customer_id
SELECT * FROM customers WHERE id = 123;

-- ثم أدخل
INSERT INTO orders (customer_id, ...) VALUES (123, ...);
```

1. **Disable the entry temporarily.**(Beware!):

```
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

### Problem: Duplicate Entry

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Duplicate entry 'ahmed@example.com' for key 'email'
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Use INSERT OR IGNORE**(SQLite):

```
INSERT OR IGNORE INTO users (email, name) VALUES ('ahmed@example.com', 'أحمد');
```

1. **Use on CONFLICT**(PostgreSQL):

```
INSERT INTO users (email, name) 
VALUES ('ahmed@example.com', 'أحمد')
ON CONFLICT (email) DO UPDATE SET name = 'أحمد';
```

1. **Use INSERT... ON DUPLICATE KEY UPDATE**(MySQL):

```
INSERT INTO users (email, name) 
VALUES ('ahmed@example.com', 'أحمد')
ON DUPLICATE KEY UPDATE name = 'أحمد';
```

### Problem: Data Too Long

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Data too long for column 'description' at row 1
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Modify Column Type**== sync, corrected by elderman == @elder\_man

```
ALTER TABLE products MODIFY description TEXT;
```

1. **Shorten data before input**== sync, corrected by elderman == @elder\_man

```
const shortDescription = description.substring(0, 255);
```

Performance problems
--------------------

### Problem is, the application is too slow.

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Check the catalogues.**== sync, corrected by elderman == @elder\_man

```
-- عرض الفهارس
SHOW INDEX FROM table_name;  -- MySQL
\d table_name                -- PostgreSQL
```

1. **Watch the slow information.**== sync, corrected by elderman == @elder\_man
2. Open "Performance" ¶ "Slow Queries"
3. Check the information that takes more than a second.
4. **Analyze the big tables.**== sync, corrected by elderman == @elder\_man

```
ANALYZE TABLE table_name;  -- MySQL
ANALYZE table_name;        -- PostgreSQL
```

### Problem: High consumption of memory

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Reduce the number of classes offered**== sync, corrected by elderman == @elder\_man
2. Change Rows per page from 100 to 25
3. **Close Unused Communications**== sync, corrected by elderman == @elder\_man
4. Separate from inactive databases
5. **Reboot the app.**== sync, corrected by elderman == @elder\_man

```
# أوقف التطبيق (Ctrl+C)
npm run dev
```

Export-import problems
----------------------

### Problem: Data export failure

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Export failed: Memory limit exceeded
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Export batches.**== sync, corrected by elderman == @elder\_man

```
-- بدلاً من تصدير الجدول كاملاً
SELECT * FROM large_table WHERE id BETWEEN 1 AND 10000;
-- ثم
SELECT * FROM large_table WHERE id BETWEEN 10001 AND 20000;
```

1. **Use Streaming Option**(if any)

### Problem: Error importing CSV

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Parse error: Unexpected delimiter
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Make sure it's the right break.**== sync, corrected by elderman == @elder\_man
2. Try: comma (,)
3. Try: semicolon (;)
4. Try: tab (\t)
5. **Check the encoding.**== sync, corrected by elderman == @elder\_man
6. It has to be UTF-8.
7. **Make sure the columns match.**== sync, corrected by elderman == @elder\_man

```
name,email,age
أحمد,ahmed@example.com,30
```

Facing problems
---------------

### Problem: blank/white page

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Open Developer Console**(F12):

```
# ابحث عن أخطاء JavaScript
```

1. **Wipe Temporary Memory**== sync, corrected by elderman == @elder\_man
2. Ctrl+Shift+R (Windows/Linux)
3. Cmd+Shift+R (macos)
4. **Check the Console for errors.**== sync, corrected by elderman == @elder\_man

```
// ابحث عن أخطاء مثل:
Failed to load module
CORS error
```

### Problem: Updates don't show.

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Reload Page**(Hard Refrish):
2. Ctrl+F5 (Windows/Linux)
3. Cmd+Shift+R (macos)
4. **Wipe Local Storage**== sync, corrected by elderman == @elder\_man

```
// في Console
localStorage.clear();
location.reload();
```

Other problems
--------------

### Problem: Backup failed.

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Check the disk space.**== sync, corrected by elderman == @elder\_man

```
df -h  # على macOS/Linux
```

1. **Use a smaller formula.**== sync, corrected by elderman == @elder\_man
2. Try JSON instead of SQL

### Problem: Cannot delete table

**Symptoms.**== sync, corrected by elderman == @elder\_man

```
Cannot drop table: referenced by foreign key
```

**Solutions**== sync, corrected by elderman == @elder\_man

1. **Remove the handcuffs first.**== sync, corrected by elderman == @elder\_man

```
ALTER TABLE orders DROP FOREIGN KEY fk_customer;
-- ثم
DROP TABLE customers;
```

1. **Use CASCADE**== sync, corrected by elderman == @elder\_man

```
DROP TABLE customers CASCADE;
```

Access to assistance
--------------------

If the problem is not solved:

1. **Check logs.**== sync, corrected by elderman == @elder\_man

```
# سجلات الخادم
tail -f server.log

# سجلات المتصفح
# افتح Developer Tools → Console
```

1. **Report the problem.**== sync, corrected by elderman == @elder\_man
2. GitHub Issues:<https://github.com/Alqudimi/OmniCoreDB/issues>
3. Mail: eng7mi@gmail.com
4. **Provide the following information:**== sync, corrected by elderman == @elder\_man
5. Operating system
6. Issue Node.js and Python
7. The whole message of error.
8. Steps to re-produce the problem

---

**Developer**:: Abdul Aziz Al-Ogidi  
**E-mail**: ing7mi@gmail.com, alqudemitechnology@gmail.com  
**GitHub**== sync, corrected by elderman == @elder\_man[@Alqudimi](https://github.com/Alqudimi)  
**© 2024 - Old Tech**