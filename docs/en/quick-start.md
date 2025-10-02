Quick Start Guide - Omni Core DB Manager
========================================

This manual will help you start with Omni Core DB Manager in a few minutes.

Step 1: Stabilization
---------------------

### Basic requirements

* Node.js 20+
* Python 3.11+
* uv (Python Package Manager)

### Quick installation

```
# استنساخ المستودع
git clone https://github.com/Alqudimi/OmniCoreDB.git
cd OmniCoreDB

# تثبيت التبعيات
npm install
uv sync

# تشغيل التطبيق
npm run dev
```

Open Browser on:`http://localhost:5000`

Step 2: Establish the first database connection
-----------------------------------------------

### SQLite connection (easiest to start)

1. Click on the button.**"+ New Connection"**In the upper right corner.
2. Select database type:**SQLite**
3. Enter information:
4. **Contact name**: My First Database
5. **File Path**: test.db
6. Click on**"Create Connection"**

A new SQLite file will be created automatically!

### PostgreSQL connection

1. Click on**"+ New Connection"**
2. Choose:**PostgreSQL**
3. Enter information:
4. **Contact name**: PostgreSQL Local
5. **Host**: localhost
6. **Port**5432
7. **Username**: postgres
8. **The password.**: [Trustword]
9. **Database name**: mydatabase
10. Click on**"Create Connection"**

### MySQL connection

1. Click on**"+ New Connection"**
2. Choose:**MySQL**
3. Enter information:
4. **Contact name**MySQL Local
5. **Host**: localhost
6. **Port**:: 3306
7. **Username**: root
8. **The password.**: [Trustword]
9. **Database name**: mydatabase
10. Click on**"Create Connection"**

Step 3: Create a new schedule
-----------------------------

1. From the side list, choose the connection you created.
2. Click on icon.**"+"**Besides "Tables."
3. Enter the name of the table:`users`
4. Add columns:

| Column name | Type | Restrictions |
| --- | --- | --- |
| id | INTERGER | Primary Key, Auto Increment |
| Name | TEXT | Not Null |
| email | TEXT | Unique, Not Null |
| Created\_at | TIMESTAMP | Default: CURRENT\_TIMESTAMP |

1. Click on**"Create Table"**

Step 4: Add data
----------------

### Method 1: manual input

1. Pick a table.`users`From the list.
2. Click on**"+ Insert Row"**
3. Enter data:
4. Ahmed Mohammed
5. email: ahmed@example.com
6. Click on**"Insert"**

### Method 2: Group entry (Bulk Insert)

1. Click on**"Actions"**¶**"Bulk Operations"**
2. Choose.**"Bulk Insert"**
3. Enter the data in JSON:

```
[
  {"name": "سارة علي", "email": "sarah@example.com"},
  {"name": "محمد خالد", "email": "mohamed@example.com"},
  {"name": "فاطمة حسن", "email": "fatima@example.com"}
]
```

1. Click on**"Insert Rows"**

Step 5: Implementation of the SQL query
---------------------------------------

1. Click on the button.**"SQL Query"**In the toolbar.
2. Write down your query:

```
SELECT * FROM users WHERE name LIKE '%محمد%';
```

1. Click on**"Execute."**Or press.`Ctrl+Enter`

You'll see the results straight below the editor!

Step 6: Export of data
----------------------

1. Choose the schedule you want to export.
2. Click on**Export.**
3. Select formula:
4. **JSON**:: For application
5. **CSV**For use in Excel
6. **SQL**:: For backup or transfer
7. Click on**"Download."**

Step 7: Import data
-------------------

1. Select the target schedule
2. Click on**Import**
3. Select file type (JSON or CSV)
4. Paste the data or upload the file.
5. Click on**Import**

Useful fast advantage.
----------------------

### Data search

The search box used the top of the table to search all columns.

### (Sorting)

Click on the top of any column to sequence the data upwards or downwards.

### Browsing (Pagination)

Use page buttons below the table to move between pages.

### Rapid liberalization

Click twice on any cell for immediate editing (if the advantage is activated).

### Information log

Click on**"Actions"**¶**"Query History"**To present all your previous inquiries.

### Save Information

After conducting an inquiry, click on**"Save Query"**To save it for later use.

Allocation of interface
-----------------------

### Change of appearance (Theme)

1. Click on icon.**Colors**At the top of the ribbon.
2. Pick out of seven different manifestations:
3. Ocean Breeze (ocean breeze)
4. Sunset Passion (the passion of sunset)
5. Forest Calm (forest calm)
6. Royal Purple (royal purple)
7. Cyber Blue
8. Warm Automn
9. Midnight Dream.

### The switch between dark and feather.

Click on icon.**Sun/ Moon**To switch between: -**Light position**- To work in a bright environment.**Dark situation.**:: To reduce eye stress

### Activate/stop sound effects

Click on icon.**Sound**To activate or stop interactive sound effects.

Freshman tips.
--------------

### Advice 1: Start with SQLite

If you're a rookie, start with SQLite because you don't need a separate server, easy to prepare, perfect for learning and experience.

### Advice 2: Use automatic discovery

When you create a connection, you can leave the "type" field empty and the system will automatically discover the type of database!

### Advice 3: Keep your repeated inquiries

If you use SQL frequently, save it using the "Saved Queries" feature for ease of access.

### Advice 4: Use backup

Before making major changes, create a backup: 1. Click on**"Actions"**¶**"Backup & Restore"**2. Select Tables 3. Click on**"Create Backup."**

### Advice 5: Watch the performance

Use**"Performance Monitoring"**To monitor: - Slow information - use of catalogues - communication statistics

Next steps
----------

Now that I've learned the basics:

1. :: Read[دليل المستخدم الكامل](./user-guide.md)To find out more advantages.
2. ♪ Explore ♪[الميزات المتقدمة](./advanced-features.md)
3. ♪ Go back ♪[الأمثلة العملية](./examples.md)
4. Check it out.[الأسئلة الشائعة](./faq.md)

Support and assistance
----------------------

Did you have a problem or do you have a question?

* ¶**E-mail**: eng7mi@gmail.com
* ¶**Reporting error**== sync, corrected by elderman == @elder\_man[GitHub Issues](https://github.com/Alqudimi/OmniCoreDB/issues)
* ¶**Discussions**== sync, corrected by elderman == @elder\_man[GitHub Discussions](https://github.com/Alqudimi/OmniCoreDB/discussions)

---

**Developer**:: Abdul Aziz Al-Ogidi  
**Company**Old technology:  
**© 2024 All rights reserved**