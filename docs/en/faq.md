Common questions - Omni Core DB Manager
=======================================

General
-------

### What's Omni Core DB Manager?

Omni Core DB Manager is an open source database management application that provides an easy-to-use visual interface to connect to and manage multiple types of databases (SQLite, PostgreSQL, MySQL).

### Is the app free?

Yeah, the application is free and open source. All rights are reserved for an old tech company.

### What databases are supported?

Currently supporting the application:**SQLite**3.x -**PostgreSQL**9.x and the newest--**MySQL**5.7 and more recent / MariaDB 10.x

### Is he working on different operating systems?

Yes, works on: - . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

Installation and preparation
----------------------------

### What are the requirements to run the app?

* Node.js 20 or more recent
* Python 3.11 or more recent
* Uv packing manager (for the Python)
* 4 GB RAM Minimum

### How did you prove the application?

```
git clone https://github.com/Alqudimi/OmniCoreDB.git
cd OmniCoreDB
npm install
uv sync
npm run dev
```

### Why do I need uv?

uv is a modern and very fast pack Manager of Python, making the fixation of dependencies faster and more reliable than the traditional pip.

### Can I use pip instead of uv?

Yes, you can:

```
pip install -r requirements.txt
```

Communications
--------------

### How do I contact a local database?

1. Click on "New Connection"
2. Select database type
3. For local communications, use:
4. Host:`localhost`or`127.0.0.1`
5. Port: Virtual Port (5432 for PostgreSQL, 3306 for MySQL)

### Can I call remote databases?

Yes, enter IP address or Domain Name for remote server.

**Warning.**:: Ensure that the port is opened and remote communications are activated on the server.

### How do I keep the password safe?

The application only preserves communications in memory and does not store them on the disk. When the application is reactivated, it will need to re-enter the contact information.

### What do you mean, "Auto-detect database type"?

If you leave the "type" field empty, the system will attempt to automatically discover the type of database of contact information.

Data management
---------------

### How do I search the data?

Use the search box at the top of the table. The search will include all columns on the current page.

### Can I edit the data directly in the table?

Right now, we need to click on each row's "Liberation" icon to modify it, direct editing in cells under development.

### How do I delete several rows at once?

1. Specify rows using checkboxes
2. Click "Bulk Delete"
3. Confirm Delete

**Warning.**:: This process is irreversible!

### What's the difference between Truncate and Drop?

* **Troncate**Delete all data but maintain the structure of the table
* **Drop**Delete the entire table (structure and data)

Information
-----------

### Does the SQL editor support autocompletion?

Yeah, press.`Ctrl+Space`To show proposals for columns and tables.

### How do I keep an inquiry for later use?

1. Write the query in the editor.
2. Click "Save Query"
3. Enter name and description
4. Save

### Can I do a couple of infos at once?

Currently, the application supports one query at a time to implement several inquiries, one by one.

### How do I see the plan to implement the query plan?

1. Write a SELECT query.
2. Click on Explain.
3. Watch how you're gonna do the enquire database.

Export and import
-----------------

### What are the subsidized export formulas?

* **JSON**:: For application
* **CSV**For Excel and Analysis:
* **SQL**:: Back-up and transfer

### How do I import data from Excel?

1. Save Excel file as CSV
2. In the app, click "Protect"
3. Choose CSV and upload the file.
4. Specify the interval used

### Can I export a very large schedule?

Yes, but it may take time. For very large tables (more than a million rows), the export is preferred: 1. Export over instalments 2. Use the SQL formula instead of JSON

Performance
-----------

### Why is the investigation so slow?

Possible causes: 1.**Lack of index**:: An index has been established on the columns used in WHERE 2.**Large table without LIMIT**Add LIMIT for results 3.**SELECT**\*: Specify only the required columns

### How do I improve the database?

1. Use Index Management to create catalogues
2. Watch Slow Queries for slow information.
3. Use "Table Analysis" for suggestions

### What's the slow enquire (Slow Query)?

Any query that takes more than one second to implement is considered slow and automatically recorded.

Advanced Advantages
-------------------

### How did he create a relationship between two schedules?

1. Go to Constraint Management.
2. Choose "Foreign Key"
3. Specify current column, table and reference column
4. Save

### What's Index and do I need it?

The index (Index) is the structure of data that speeds up search and sorting. Use it when: - You look a lot in a particular column - you separate with a particular column - you have a large table (over 10,000 rows)

### How do I create an automatic backup?

Currently, back-ups must be created manually. The default feature is being developed.

### What's Data Validation?

Rules for validating data prior to entry, such as: - making sure that the age is between 18 and 120 - checking the e-mail format - ensuring that the price is greater than 0

Safety
------

### Is the data safe?

* Contact information is only kept in memory.
* The passwords are not stored on the disk.
* Direct access to databases (not through external servers)

### Can I use it for production?

The application is designed for development and management. Production: - Build the application:`npm run build`- Play it on a dedicated portal - ♫ Use HTTPS if it's online

### Does it support multi-user validation?

Currently, the application is designed for individual use.

User interface
--------------

### How do I change the look of Theme?

1. Click on the color icon
2. Pick out of seven different sides.
3. Use sun/ moon icon for dark position/open

### Can I disable the sound effects?

Yeah, click on the sound icon on the top tape.

### How do I change the language?

Currently, the application is available in English. Multilingual support is under development.

Issuance and updates
--------------------

### How do I know the current version?

Check it out.`package.json`Or watch the title bar.

### How do I update the app?

```
git pull origin main
npm install
uv sync
npm run dev
```

### Where do I find the Change Log?

Go back.[GitHub Releases](https://github.com/Alqudimi/OmniCoreDB/releases)

Common problems
---------------

### The application doesn't work after the upgrade.

```
# امسح وأعد التثبيت
rm -rf node_modules package-lock.json
npm install
uv sync
```

### The interface is white and empty.

1. Wipe Temporary Memory (Ctrl+Shift+R)
2. Open Developer Console (F12) and look for errors

### I don't see my data.

1. Make sure you make the right call.
2. Check the authority.
3. Try reconnecting.

Support and contribution
------------------------

### How do I report a mistake?

1. GitHub Issues:<https://github.com/Alqudimi/OmniCoreDB/issues>
2. Or text us: ing7mi@gmail.com

### Can I contribute to the development?

Yes! We welcome contributions: 1. Fork Warehouse 2. Create a new Branch 3.

### How can I ask for a new advantage?

Open Feature Request on GitHub or e-mail us.

Additional information
----------------------

### Who's the developer?

* **Name**:: Abdul Aziz Al-Ogidi
* **Mail**: ing7mi@gmail.com, alqudemitechnology@gmail.com
* **GitHub**== sync, corrected by elderman == @elder\_man[@Alqudimi](https://github.com/Alqudimi)
* **Company**Old technology:

### Where's the source code?

<https://github.com/Alqudimi/OmniCoreDB>

### License?

All rights reserved for the old tech company © 2024

---

You didn't find an answer to your question?
-------------------------------------------

Communicate with us: -**E-mail**: ing7mi@gmail.com, alqudemitechnology@gmail.com - ▸**GitHub Discussions**== sync, corrected by elderman == @elder\_man<https://github.com/Alqudimi/OmniCoreDB/discussions>- Uh-huh. - Uh-huh.**Reporting a problem**== sync, corrected by elderman == @elder\_man<https://github.com/Alqudimi/OmniCoreDB/issues>

---

**© 2024 - Old Tech**