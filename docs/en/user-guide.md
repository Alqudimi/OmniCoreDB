Universal User Guide - Omni Core DB Manager
===========================================

Contents
--------

1. [واجهة المستخدم](#واجهة-المستخدم)
2. [إدارة الاتصالات](#إدارة-الاتصالات)
3. [إدارة الجداول](#إدارة-الجداول)
4. [إدارة البيانات](#إدارة-البيانات)
5. [الاستعلامات](#الاستعلامات)
6. [التصدير والاستيراد](#التصدير-والاستيراد)
7. [الميزات المتقدمة](#الميزات-المتقدمة)

User interface
--------------

### Main screen

When you open the app, you'll find:

#### Upper toolbar

* **Application logo**: Omni Core DB Manager
* **Help icon**To access documentation
* **Sound icon**To activate/stop sound effects
* **Appearance icon**- To make a difference between a dark and a feather.
* **Color icon**To choose the appearance of colors
* **New connection button**To create a new connection

#### Statistical cards

* **Active communications**:: Number of related databases
* **Total tables**:: Number of tables in all communications
* **Recent information**:: Number of inquiries implemented
* **Performance**:: Status of application performance

#### Department of Excellence.

Rapid presentation of key features: database management -- powerful SQL editor -- export-import -- backup and recovery

Communications management
-------------------------

### Create new connection

#### SQLite

```
نوع قاعدة البيانات: SQLite
الاسم: [اسم الاتصال]
مسار الملف: [مثال: database.db أو /path/to/database.db]
```

**SQLite features:**- Doesn't need a separate server - perfect for small and medium applications - one file containing the entire database

#### PostgreSQL

```
نوع قاعدة البيانات: PostgreSQL
الاسم: [اسم الاتصال]
المضيف: [مثال: localhost أو 192.168.1.100]
المنفذ: [افتراضي: 5432]
اسم المستخدم: [مثال: postgres]
كلمة المرور: [كلمة مرور المستخدم]
اسم قاعدة البيانات: [اسم قاعدة البيانات]
```

**PostgreSQL features:**- Strong and reliable database - excellent support for advanced features - ideal for large applications

#### MySQL

```
نوع قاعدة البيانات: MySQL
الاسم: [اسم الاتصال]
المضيف: [مثال: localhost]
المنفذ: [افتراضي: 3306]
اسم المستخدم: [مثال: root]
كلمة المرور: [كلمة مرور المستخدم]
اسم قاعدة البيانات: [اسم قاعدة البيانات]
```

**MySQL features:**- Quick and reliable - widespread - easy to use

### Existing communications management

#### Presentation of communications

* All communications appear on the left side list.
* Green color indicates active contact.
* Click any contact to switch to him.

#### Delete connection

1. Specify the contact from the list.
2. Click on the deleted icon
3. Confirm Delete

**Note**:: Deletion of communication does not delete the database itself, but only removes communication from application.

Table management
----------------

### Establishment of a new schedule

1. Select the call from the side list
2. Click on icon next to "Tables"
3. Enter the name of the table
4. Add columns:

#### Types of data supported

**Digital types:**- What?`INTEGER`- Correct numbers.`BIGINT`- Big numbers.`FLOAT`- Small decimal numbers.`DOUBLE`- Big decimals.`DECIMAL`Precise figures (for currencies)

**Types of texts:**- What?`TEXT`Undefined length text--`VARCHAR(n)`: Text of a specified length:`CHAR(n)`:: Fixed-long text

**Types of date and time:**- What?`DATE`- Just a date.`TIME`- Just time.`DATETIME`- Date and time.`TIMESTAMP`:: Time stamp

**Other:**- What?`BOOLEAN`Correct/mistake--`BLOB`- Bilateral statements.`JSON`JSON data (PostgreSQL, MySQL 5.7+)

#### Column restrictions

* **Primary Key**Key:
* **Not Null**Doesn't accept empty values:
* **Unique**Unique values:
* **Auto Increment**:: Automatic increase
* **Default Value**Hypothetic value:

### Modification of tables

#### Add Column

1. Pick the schedule.
2. Click on "Column Management"
3. Click "Add Column"
4. Enter the column details.
5. Save Changes

#### Modify Column

1. Select the column from the list of columns
2. Click on "Modify."
3. Modify Characters
4. Save Changes

#### Delete Column

1. Select Column
2. Click on Delete.
3. Confirm Delete

**Warning.**Delete a column that permanently deletes all data in it!

### Table processes

#### Rename Table

1. Click the right mouse button on the table.
2. Choose "Rename Table"
3. Enter the new name.
4. Confirm

#### Clear Table (Truncate)

1. Click the right mouse button on the table.
2. Choose "Truncate Table"
3. Confirm the operation.

**Note**This deletes all data but maintains the structure of the table.

#### Delete Table (Drop)

1. Click the right mouse button on the table.
2. Choose "Drop Table."
3. Confirm Delete

**Warning.**This deletes the table and all its data permanently!

Data management
---------------

### Presentation of statements

#### Browsing

* Use page buttons to move.
* You can change the number of classes offered (10, 25, 50, 100)

#### Research

* Use the search box at the top of the table.
* The search includes all columns.
* Supports micro-search.

#### Order

* Click on the top of the column of the order upwards.
* Click again for descending order.
* Click the third time to remove the order.

### Add data

#### Add one row

1. Click on "Insert Row"
2. Fill the fields.
3. Click "Insert"

#### Group entry

1. Click on "Bulk Operations."
2. Choose "Bulk Insert"
3. Enter the data in JSON:

```
[
  {
    "column1": "value1",
    "column2": "value2"
  },
  {
    "column1": "value3",
    "column2": "value4"
  }
]
```

### Data adjustment

#### Modify row one.

1. Click on the editorial icon... next to the row.
2. Modify Values
3. Save Changes

#### Group update

1. Click on "Bulk Operations."
2. Choose "Bulk Update"
3. Specify the condition and new values

### Delete data

#### Delete row one

1. Click on the deleted icon
2. Confirm Delete

#### Collective deletion

1. Choose rows (checkbox)
2. Click "Bulk Delete"
3. Confirm Delete

Information
-----------

### Editor SQL

#### Open Editor

Click "SQL Query" on the toolbar

#### Editor &apos; s Advantages

* **Coloring the codes.**SQL construction distinction
* **Autocompletion**:: Proposals in writing
* **Keyboard shortcuts.**== sync, corrected by elderman == @elder\_man
* `Ctrl+Enter`:: Information implementation
* `Ctrl+/`:: Comment/dismissal
* `Ctrl+Space`:: Visibility of proposals

#### Information implementation

**SELECT info:**

```
SELECT * FROM users WHERE age > 25;
SELECT name, email FROM users ORDER BY created_at DESC;
SELECT COUNT(*) FROM orders;
```

**INSERT info:**

```
INSERT INTO users (name, email) VALUES ('أحمد', 'ahmed@example.com');
```

**UPDATE INTELLIGENCE:**

```
UPDATE users SET status = 'active' WHERE id = 1;
```

**DELETE:**

```
DELETE FROM users WHERE created_at < '2023-01-01';
```

### Information log

#### Presentation of the Register

1. Click on "Actions."
2. Choose "Query History."

#### Features of the Register

* Another 50 quiz show.
* Presentation of implementation time
* Presentation of state of success/failure
* Repeal of previous information

### Recorded information

#### Save Query

1. After writing the query...
2. Click "Save Query"
3. Enter name and description
4. Save

#### Use of archived query

1. Click on "Saved Queries."
2. Choose to enquire.
3. Click "Execute"

Export and import
-----------------

### Data export

#### Foreword of a full schedule

1. Pick the schedule.
2. Click Export
3. Select formula:
4. **JSON**:: Appropriate for applications
5. **CSV**For Excel and Analysis:
6. **SQL**:: Back-up
7. Load File

#### Exporting the results of the inquiry

1. Do the SELECT query.
2. Click "Export Results"
3. Choose the formula.
4. Load File

### Data import

#### Import from JSON

1. Select the target schedule
2. Click Import
3. Choose JSON
4. Paste the data or upload the file.
5. Click Import

**JSON Example:**

```
[
  {"name": "علي", "age": 30},
  {"name": "سارة", "age": 25}
]
```

#### Import from CSV

1. Pick the schedule.
2. Click Import
3. Select CSV
4. Pick up the file.
5. Set the line (comma, semicolon, tab)
6. Click Import

Advanced Advantages
-------------------

### The management of the catalogues.

#### Establishment of an index

1. Pick the schedule.
2. Click "Index Management"
3. Click "Create Index"
4. Select Columns
5. Specify index type (normal/fried)
6. Save

#### Delete Index

1. Open "Index Management"
2. Select Index
3. Click "Drop Index"

### Restriction management

#### Addendum

1. Click "Constraint Management"
2. Select the entry type:
3. Primary Key
4. Foreign Key
5. Unique
6. Check
7. Enter the details.
8. Save

### Performance control

#### Slow information display

1. Click "Performance"
2. Choose "Slow Queries"
3. Watch the information that took more than a second.

#### Index proposals

1. Open "Performance"
2. Choose "Index Suggestions"
3. Watch the proposed catalogues to improve performance

### Back-up and recovery

#### Create backup

1. Click "Backup & Restore"
2. Choose "Create Backup."
3. Specify tables (or all)
4. Choose formula (SQL/JSON)
5. Click "Create Backup"

#### Restore Backup

1. Click "Backup & Restore"
2. Choose "Restore."
3. Pick up the backup file.
4. Confirm recovery.

**Warning.**Recovery may replace current data!

Advice and best practices
-------------------------

### :: Safety

* Use powerful passwords for communications.
* Do not share contact information
* Do a regular backup of your data.

### Performance

* Use the catalogues for the columns used in WHERE
* Avoid the SELECT in the Big Inquisition.
* Watch the slow information.

### Regulation of data

* Use clear names for tables and columns
* Document your complicated information.
* Save Recurrent Inquisitions

---

**Developer**:: Abdul Aziz Al-Ogidi  
**E-mail**: eng7mi@gmail.com  
**© 2024 - Old Tech**