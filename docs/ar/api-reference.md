# مرجع API - Omni Core DB Manager

## نظرة عامة

يوفر Omni Core DB Manager واجهة RESTful API كاملة لإدارة قواعد البيانات برمجياً.

**Base URL**: `http://localhost:8000`  
**التوثيق التفاعلي**: `http://localhost:8000/docs`

## نقاط النهاية (Endpoints)

### إدارة الاتصالات

#### الحصول على جميع الاتصالات
```http
GET /api/connections
```

**الاستجابة**:
```json
[
  {
    "id": "conn_123",
    "name": "My Database",
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "database": "mydb"
  }
]
```

#### إنشاء اتصال جديد
```http
POST /api/connections
```

**الطلب**:
```json
{
  "name": "PostgreSQL Local",
  "type": "postgresql",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "password",
  "database": "mydb"
}
```

#### حذف اتصال
```http
DELETE /api/connections/{connection_id}
```

### إدارة الجداول

#### الحصول على جميع الجداول
```http
GET /api/connections/{connection_id}/tables
```

**الاستجابة**:
```json
[
  {
    "name": "users",
    "schema": "public",
    "rowCount": 1500
  }
]
```

#### إنشاء جدول
```http
POST /api/connections/{connection_id}/tables
```

**الطلب**:
```json
{
  "tableName": "products",
  "columns": [
    {
      "name": "id",
      "type": "INTEGER",
      "primaryKey": true,
      "autoIncrement": true
    },
    {
      "name": "name",
      "type": "TEXT",
      "notNull": true
    },
    {
      "name": "price",
      "type": "DECIMAL",
      "precision": 10,
      "scale": 2
    }
  ]
}
```

#### حذف جدول
```http
DELETE /api/connections/{connection_id}/tables/{table_name}
```

#### إعادة تسمية جدول
```http
PATCH /api/connections/{connection_id}/tables/{table_name}/rename
```

**الطلب**:
```json
{
  "newName": "products_v2"
}
```

### إدارة الأعمدة

#### الحصول على أعمدة جدول
```http
GET /api/connections/{connection_id}/tables/{table_name}/columns
```

**الاستجابة**:
```json
[
  {
    "name": "id",
    "type": "integer",
    "nullable": false,
    "default": null,
    "primaryKey": true
  }
]
```

#### إضافة عمود
```http
POST /api/connections/{connection_id}/tables/{table_name}/columns
```

**الطلب**:
```json
{
  "name": "description",
  "type": "TEXT",
  "nullable": true,
  "default": null
}
```

#### تعديل عمود
```http
PATCH /api/connections/{connection_id}/tables/{table_name}/columns/{column_name}
```

**الطلب**:
```json
{
  "type": "VARCHAR(500)",
  "nullable": false,
  "default": "No description"
}
```

#### حذف عمود
```http
DELETE /api/connections/{connection_id}/tables/{table_name}/columns/{column_name}
```

### إدارة الصفوف

#### الحصول على الصفوف
```http
GET /api/connections/{connection_id}/tables/{table_name}/rows
  ?limit=50
  &offset=0
  &orderBy=created_at
  &orderDirection=desc
  &search=keyword
```

**المعاملات**:
- `limit`: عدد الصفوف (افتراضي: 50)
- `offset`: الإزاحة للصفحات
- `orderBy`: العمود للترتيب
- `orderDirection`: `asc` أو `desc`
- `search`: كلمة البحث

**الاستجابة**:
```json
{
  "rows": [
    {
      "id": 1,
      "name": "أحمد",
      "email": "ahmed@example.com"
    }
  ],
  "total": 150
}
```

#### إضافة صف
```http
POST /api/connections/{connection_id}/tables/{table_name}/rows
```

**الطلب**:
```json
{
  "name": "سارة",
  "email": "sarah@example.com",
  "age": 25
}
```

#### تحديث صف
```http
PATCH /api/connections/{connection_id}/tables/{table_name}/rows/{row_id}
```

**الطلب**:
```json
{
  "name": "سارة محمد",
  "age": 26
}
```

#### حذف صف
```http
DELETE /api/connections/{connection_id}/tables/{table_name}/rows/{row_id}
```

### الاستعلامات

#### تنفيذ استعلام SQL
```http
POST /api/connections/{connection_id}/query
```

**الطلب**:
```json
{
  "query": "SELECT * FROM users WHERE age > 25 LIMIT 10"
}
```

**الاستجابة**:
```json
{
  "columns": ["id", "name", "email", "age"],
  "rows": [
    [1, "أحمد", "ahmed@example.com", 30],
    [2, "سارة", "sarah@example.com", 28]
  ],
  "rowCount": 2,
  "executionTime": 0.025
}
```

#### شرح خطة تنفيذ الاستعلام
```http
POST /api/connections/{connection_id}/query/explain
```

**الطلب**:
```json
{
  "query": "SELECT * FROM orders WHERE customer_id = 123",
  "analyze": true
}
```

### سجل الاستعلامات

#### الحصول على السجل
```http
GET /api/connections/{connection_id}/query-history?limit=50
```

**الاستجابة**:
```json
[
  {
    "id": "q_123",
    "query": "SELECT * FROM users",
    "executionTime": 0.15,
    "success": true,
    "timestamp": "2024-10-02T10:30:00Z",
    "rowCount": 150
  }
]
```

#### مسح السجل
```http
DELETE /api/connections/{connection_id}/query-history
```

### الاستعلامات المحفوظة

#### الحصول على الاستعلامات المحفوظة
```http
GET /api/connections/{connection_id}/saved-queries
```

#### حفظ استعلام
```http
POST /api/connections/{connection_id}/saved-queries
```

**الطلب**:
```json
{
  "name": "Active Users",
  "description": "Get all active users",
  "query": "SELECT * FROM users WHERE status = 'active'"
}
```

#### حذف استعلام محفوظ
```http
DELETE /api/saved-queries/{query_id}
```

### العمليات الجماعية

#### الإدخال الجماعي
```http
POST /api/connections/{connection_id}/tables/{table_name}/bulk-insert
```

**الطلب**:
```json
{
  "rows": [
    {"name": "علي", "age": 30},
    {"name": "فاطمة", "age": 25}
  ]
}
```

#### التحديث الجماعي
```http
POST /api/connections/{connection_id}/tables/{table_name}/bulk-update
```

**الطلب**:
```json
{
  "where": {"status": "pending"},
  "updates": {"status": "completed"}
}
```

#### الحذف الجماعي
```http
POST /api/connections/{connection_id}/tables/{table_name}/bulk-delete
```

**الطلب**:
```json
{
  "ids": [1, 2, 3, 4, 5]
}
```

### التصدير والاستيراد

#### تصدير جدول
```http
GET /api/connections/{connection_id}/tables/{table_name}/export?format=json
```

**الصيغ المدعومة**: `json`, `csv`, `sql`

#### استيراد بيانات
```http
POST /api/connections/{connection_id}/tables/{table_name}/import
```

**الطلب**:
```json
{
  "format": "json",
  "data": "[{\"name\":\"أحمد\",\"age\":30}]"
}
```

### إدارة الفهارس

#### الحصول على الفهارس
```http
GET /api/connections/{connection_id}/tables/{table_name}/indexes
```

#### إنشاء فهرس
```http
POST /api/connections/{connection_id}/tables/{table_name}/indexes
```

**الطلب**:
```json
{
  "indexName": "idx_user_email",
  "columns": ["email"],
  "unique": true
}
```

#### حذف فهرس
```http
DELETE /api/connections/{connection_id}/tables/{table_name}/indexes/{index_name}
```

#### اقتراحات الفهارس
```http
GET /api/connections/{connection_id}/tables/{table_name}/index-suggestions
```

### إدارة القيود

#### الحصول على القيود
```http
GET /api/connections/{connection_id}/tables/{table_name}/constraints
```

#### إضافة قيد
```http
POST /api/connections/{connection_id}/tables/{table_name}/constraints
```

**الطلب - مفتاح خارجي**:
```json
{
  "constraintType": "FOREIGN_KEY",
  "constraintName": "fk_order_customer",
  "columns": ["customer_id"],
  "referencedTable": "customers",
  "referencedColumns": ["id"]
}
```

**الطلب - قيد فحص**:
```json
{
  "constraintType": "CHECK",
  "constraintName": "check_age",
  "expression": "age >= 18"
}
```

#### حذف قيد
```http
DELETE /api/connections/{connection_id}/tables/{table_name}/constraints/{constraint_name}
```

### النسخ الاحتياطي والاستعادة

#### إنشاء نسخة احتياطية
```http
POST /api/connections/{connection_id}/backup
```

**الطلب**:
```json
{
  "tables": ["users", "orders"],
  "format": "sql",
  "includeSchema": true,
  "includeData": true
}
```

#### الحصول على قائمة النسخ الاحتياطية
```http
GET /api/connections/{connection_id}/backups
```

#### استعادة نسخة احتياطية
```http
POST /api/connections/{connection_id}/restore
```

**الطلب**:
```json
{
  "backup": "-- SQL backup content here",
  "format": "sql"
}
```

### مراقبة الأداء

#### الحصول على مقاييس الأداء
```http
GET /api/connections/{connection_id}/performance/metrics
```

**الاستجابة**:
```json
{
  "totalQueries": 1500,
  "avgResponseTime": 0.125,
  "slowQueries": 15,
  "cacheHitRate": 0.85
}
```

#### الحصول على الاستعلامات البطيئة
```http
GET /api/connections/{connection_id}/performance/slow-queries?limit=50
```

### تحليل الجداول

#### تحليل جدول
```http
GET /api/connections/{connection_id}/tables/{table_name}/analyze
```

**الاستجابة**:
```json
{
  "rowCount": 1500,
  "sizeInMB": 15.5,
  "columnStats": {
    "age": {
      "min": 18,
      "max": 65,
      "avg": 35.5,
      "nullCount": 10
    }
  },
  "indexUsage": {
    "idx_email": 0.85,
    "idx_name": 0.45
  }
}
```

### التحقق من صحة البيانات

#### الحصول على قواعد التحقق
```http
GET /api/connections/{connection_id}/validations
```

#### إنشاء قاعدة تحقق
```http
POST /api/connections/{connection_id}/validations
```

**الطلب**:
```json
{
  "tableName": "users",
  "columnName": "age",
  "validationType": "range",
  "config": {
    "min": 18,
    "max": 120
  },
  "errorMessage": "العمر يجب أن يكون بين 18 و 120",
  "enabled": true
}
```

#### تشغيل التحقق
```http
POST /api/connections/{connection_id}/tables/{table_name}/validate
```

## رموز الحالة

| الكود | المعنى | الوصف |
|------|--------|-------|
| 200 | نجاح | العملية نجحت |
| 201 | تم الإنشاء | تم إنشاء المورد بنجاح |
| 400 | طلب خاطئ | خطأ في البيانات المرسلة |
| 404 | غير موجود | المورد غير موجود |
| 500 | خطأ في الخادم | خطأ داخلي في الخادم |

## رسائل الأخطاء

```json
{
  "detail": "Table 'users' not found"
}
```

## التوثيق
يستخدم API المصادقة الأساسية (إذا تم تفعيلها):

```http
Authorization: Bearer <token>
```

## أمثلة باستخدام cURL

### إنشاء اتصال
```bash
curl -X POST http://localhost:8000/api/connections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Database",
    "type": "sqlite",
    "database": "test.db"
  }'
```

### تنفيذ استعلام
```bash
curl -X POST http://localhost:8000/api/connections/conn_123/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM users LIMIT 10"
  }'
```

### تصدير بيانات
```bash
curl -X GET "http://localhost:8000/api/connections/conn_123/tables/users/export?format=json" \
  -o users_export.json
```

## SDK والمكتبات

### JavaScript/TypeScript
```javascript
const api = {
  baseURL: 'http://localhost:8000',
  
  async getConnections() {
    const res = await fetch(`${this.baseURL}/api/connections`);
    return res.json();
  },
  
  async executeQuery(connectionId, query) {
    const res = await fetch(
      `${this.baseURL}/api/connections/${connectionId}/query`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      }
    );
    return res.json();
  }
};
```

### Python
```python
import requests

class OmniCoreAPI:
    def __init__(self, base_url='http://localhost:8000'):
        self.base_url = base_url
    
    def get_connections(self):
        return requests.get(f'{self.base_url}/api/connections').json()
    
    def execute_query(self, connection_id, query):
        return requests.post(
            f'{self.base_url}/api/connections/{connection_id}/query',
            json={'query': query}
        ).json()
```

---

**المطور**: عبدالعزيز القديمي  
**البريد الإلكتروني**: eng7mi@gmail.com, alqudimitechnology@gmail.com  
**جميع الحقوق محفوظة © 2024 - تقنية القديمي**
