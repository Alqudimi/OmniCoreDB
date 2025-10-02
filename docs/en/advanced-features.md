Advanced features - Omni Core DB Manager
========================================

Contents
--------

1. [العمليات الجماعية](#العمليات-الجماعية)
2. [إدارة الفهارس المتقدمة](#إدارة-الفهارس-المتقدمة)
3. [القيود والعلاقات](#القيود-والعلاقات)
4. [تحليل الأداء](#تحليل-الأداء)
5. [التحقق من صحة البيانات](#التحقق-من-صحة-البيانات)
6. [النسخ الاحتياطي المتقدم](#النسخ-الاحتياطي-المتقدم)
7. [تحليل الجداول](#تحليل-الجداول)

Group operations
----------------

### Group input (Bulk Insert)

#### Basic use

```
[
  {"name": "أحمد", "email": "ahmed@example.com", "age": 30},
  {"name": "فاطمة", "email": "fatima@example.com", "age": 25},
  {"name": "محمد", "email": "mohamed@example.com", "age": 35}
]
```

#### With default values.

```
[
  {"name": "سارة", "email": "sarah@example.com"},
  {"name": "علي", "email": "ali@example.com"}
]
```

**Note**The deleted fields will take the default values.

#### With complicated data.

```
[
  {
    "product_name": "لابتوب",
    "price": 3500.00,
    "specs": {
      "cpu": "Intel i7",
      "ram": "16GB",
      "storage": "512GB SSD"
    },
    "tags": ["electronics", "computers"]
  }
]
```

### Bulk Update

#### An update on a simple condition.

```
{
  "where": {"status": "pending"},
  "updates": {"status": "completed"}
}
```

#### Multifield update

```
{
  "where": {"created_at": {"<": "2024-01-01"}},
  "updates": {
    "status": "archived",
    "archived_at": "2024-10-02"
  }
}
```

#### Update on complex terms

```
{
  "where": {
    "AND": [
      {"age": {">": 18}},
      {"status": "active"}
    ]
  },
  "updates": {"category": "adult"}
}
```

### Bulk Delete

#### Delete specific identifiers

```
{
  "ids": [1, 2, 3, 4, 5]
}
```

#### Delete on condition

```
{
  "where": {"created_at": {"<": "2023-01-01"}}
}
```

Department of Advanced Indexes
------------------------------

### Speculations

#### 1. Simple Index

```
CREATE INDEX idx_username ON users(username);
```

**When do you use it?**:: Rapid search in one column for sorting with a particular column

#### 2. Composition Index

```
CREATE INDEX idx_name_email ON users(name, email);
```

**When do you use it?**:: When searching several columns together, the order of the columns is important!

#### 3. Unique Index

```
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```

**When do you use it?**:: To ensure that values are not repeated for alternative keys

#### 4. Partial Index

```
CREATE INDEX idx_active_users ON users(created_at) WHERE status = 'active';
```

**When do you use it?**:: Selective indexing to provide space

### Indexing strategies

#### Left column rule (Leftmost Prefix)

If you have a composite index on A, B, C): - ♫ works with: A - ♫ works with: A, B - ♫ works with: A, B, C - ♫ does not work with: B, C or B, C ♫

#### Indexing tips

1. **WHERE Column Index**Columns used in terms
2. **JOIN Column Index**:: Schedule-link pillars
3. **Catalogue of Order BY columns**For quick screening:
4. **Don't overdo it.**:: Each index slows INSERT/UPDATE/DELETE

### Automatic index proposals

#### How does it work?

1. System analyzes slow information.
2. He discovers the columns he uses a lot.
3. He's proposing catalogs to improve performance.

#### Example of the proposal

```
الاستعلام: SELECT * FROM orders WHERE customer_id = 123 AND status = 'pending'
الاقتراح: CREATE INDEX idx_orders_customer_status ON orders(customer_id, status)
التحسن المتوقع: 10x أسرع
```

Constraints and relationships
-----------------------------

### Types of restrictions

#### 1. Core key (Primary Key)

```
ALTER TABLE users ADD CONSTRAINT pk_users PRIMARY KEY (id);
```

**Characteristics**:: Unique value -- non-acceptable NULL -- one table with only one basic key

#### 2. Foreign Key

```
ALTER TABLE orders ADD CONSTRAINT fk_customer 
  FOREIGN KEY (customer_id) REFERENCES customers(id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
```

**Options on DELETE**:`CASCADE`Delete associated rows--`SET NULL`: Set NULL--`RESTRICT`:: Prevention of deletion -`NO ACTION`Nothing:

#### 3. Unique entry (Unique)

```
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

**Use**:: To ensure that values are not repeated, one NULL (in most databases) is allowed

#### 4. Under examination (Check)

```
ALTER TABLE products ADD CONSTRAINT check_price 
  CHECK (price > 0 AND price < 1000000);
```

**Examples**== sync, corrected by elderman == @elder\_man

```
-- التحقق من العمر
CHECK (age >= 18 AND age <= 120)

-- التحقق من التاريخ
CHECK (end_date > start_date)

-- التحقق من القيم المسموحة
CHECK (status IN ('pending', 'active', 'completed'))
```

### Show Relationships

#### Relationship scheme (ER Diagram)

1. Click "Relationships"
2. Pick a table.
3. Watch all relationships:
4. Published relations (external keys)
5. Relationships received (associated tables)

#### Types of relationships

* **1:1.**(One to One): User ▸ Personal File
* **1:N**(One to Many): A client of requests
* **N:M**(Many to Many): Students, materials (through an intermediate schedule)

Performance analysis
--------------------

### Control of slow information

#### Slow threshold

* Default: 1 seconds
* It can be changed in settings.

#### Slow query analysis.

```
EXPLAIN ANALYZE SELECT * FROM orders 
  JOIN customers ON orders.customer_id = customers.id
  WHERE orders.status = 'pending';
```

**Reading the result**:**Seq Scan**Full table scan (slow) -**Index Scan**:: Use of index (rapid) -**Cost**Estimated cost -**Rows**Number of classes

### Performance statistics

#### Available measures

1. **Average response time**For each type of query:
2. **Number of inquiries**At 1:00 a.m. today:
3. **Memory use ratio**:: Temporary storage
4. **Success rate**:: Successful information ratio

#### Improved performance

```
المشكلة: استعلام بطيء على جدول كبير
الحل: إنشاء فهرس على الأعمدة المستخدمة في WHERE

المشكلة: استخدام SELECT *
الحل: حدد الأعمدة المطلوبة فقط

المشكلة: عدم استخدام LIMIT
الحل: استخدم LIMIT للنتائج الكبيرة
```

Data validation
---------------

### Establishment of verification rules

#### 1. Range verification

```
{
  "tableName": "products",
  "columnName": "price",
  "validationType": "range",
  "config": {
    "min": 0,
    "max": 1000000
  },
  "errorMessage": "السعر يجب أن يكون بين 0 و 1000000"
}
```

#### 2. Checking of Regex

```
{
  "tableName": "users",
  "columnName": "email",
  "validationType": "regex",
  "config": {
    "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  },
  "errorMessage": "البريد الإلكتروني غير صالح"
}
```

#### 3. Verification of permissible values (Enum)

```
{
  "tableName": "orders",
  "columnName": "status",
  "validationType": "enum",
  "config": {
    "allowedValues": ["pending", "processing", "completed", "cancelled"]
  },
  "errorMessage": "الحالة غير صالحة"
}
```

#### 4. Ad hoc verification (Custom)

```
{
  "tableName": "events",
  "columnName": "end_date",
  "validationType": "custom",
  "config": {
    "expression": "end_date > start_date"
  },
  "errorMessage": "تاريخ النهاية يجب أن يكون بعد تاريخ البداية"
}
```

### Operation of verification

#### Manual verification

1. Pick the schedule.
2. Click "Data Validation"
3. Click "Run Validation"
4. Watch the results and the mistakes.

#### Automatic verification

* Automatically verified at INSERT/UPDATE
* Inappropriate classes are denied.
* Clear error messages.

Advance backup
--------------

### Back-up strategies

#### 1. Full Backup

```
التكرار: يومي أو أسبوعي
المحتوى: جميع الجداول والبيانات
الحجم: كبير
وقت الاستعادة: سريع
```

#### 2. Incremental version

```
التكرار: كل ساعة
المحتوى: التغييرات فقط منذ آخر نسخة
الحجم: صغير
وقت الاستعادة: متوسط
```

#### 3. Differential version

```
التكرار: يومي
المحتوى: التغييرات منذ آخر نسخة كاملة
الحجم: متوسط
وقت الاستعادة: متوسط
```

### Back-up options

#### With the scheme (Schema)

```
✅ البنية الكاملة للجداول
✅ الفهارس
✅ القيود
✅ المشغلات (Triggers)
```

#### Data only

```
✅ محتوى الجداول فقط
❌ بدون بنية
مفيد: للاستيراد في قاعدة بيانات موجودة
```

#### Specific tables

```
اختر الجداول المهمة فقط
تقليل حجم النسخة الاحتياطية
نسخ احتياطي سريع
```

Analysis of tables
------------------

### Available statistics

#### 1. Background

* Total number of classes
* Number of columns
* Table size (MB)
* Date of establishment/amendment

#### 2. Data analysis

* Distribution of values in each column
* Empty values (NULL)
* Unique values
* More frequent values.

#### 3. Performance analysis

* Catalysts used
* Index use rate
* Slow information on this table.

#### 4. Proposals for improvement

* Proposed catalogues.
* Unused columns
* Structural improvements

### Use of analysis

```
1. اختر الجدول
2. انقر "Analyze Table"
3. انتظر اكتمال التحليل
4. راجع النتائج والاقتراحات
5. طبّق التحسينات الموصى بها
```

Best practices
--------------

### Safety

* Do a backup before the big ops.
* Use transaction (Transactions) for complex operations
* Keep a record of significant changes

### Performance

* Keep an eye on the slow information.
* Remove unused catalogues
* Clean the old data

### Maintenance

* Do an analysis of the tables on a monthly basis.
* :: Review statistics periodically
* ▪ Catalyze the catalogues as needed

---

**Developer**:: Abdul Aziz Al-Ogidi  
**E-mail**: ing7mi@gmail.com, alqudemitechnology@gmail.com  
**GitHub**== sync, corrected by elderman == @elder\_man[@Alqudimi](https://github.com/Alqudimi)  
**© 2024 - Old Tech**