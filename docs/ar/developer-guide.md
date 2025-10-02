# دليل المطور - Omni Core DB Manager

## نظرة عامة على البنية

Omni Core DB Manager هو تطبيق Full-Stack مبني بـ:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: FastAPI + Python
- **Database**: دعم متعدد (SQLite, PostgreSQL, MySQL)

## هيكل المشروع

```
OmniCoreDB/
├── client/                 # الواجهة الأمامية (Frontend)
│   ├── src/
│   │   ├── components/     # مكونات React
│   │   ├── pages/          # صفحات التطبيق
│   │   ├── lib/            # مكتبات مساعدة
│   │   ├── hooks/          # React Hooks
│   │   ├── App.tsx         # المكون الرئيسي
│   │   └── main.tsx        # نقطة الدخول
│   └── index.html
│
├── server_py/              # الخادم الخلفي (Backend)
│   ├── main.py             # FastAPI Application
│   ├── database_service.py # خدمة قاعدة البيانات
│   ├── models.py           # نماذج البيانات
│   └── storage.py          # التخزين في الذاكرة
│
├── docs/                   # التوثيق
├── requirements.txt        # تبعيات Python
├── package.json            # تبعيات Node.js
└── vite.config.ts          # إعدادات Vite
```

## إعداد بيئة التطوير

### المتطلبات
```bash
# Node.js
node --version  # يجب أن يكون 20.x+

# Python
python --version  # يجب أن يكون 3.11+

# uv
uv --version
```

### التثبيت
```bash
# استنساخ المستودع
git clone https://github.com/Alqudimi/OmniCoreDB.git
cd OmniCoreDB

# تثبيت التبعيات
npm install
uv sync
```

### التشغيل في وضع التطوير
```bash
# في نافذة طرفية واحدة
npm run dev

# هذا يشغل:
# - Backend على localhost:8000
# - Frontend على localhost:5000
```

## بنية الواجهة الأمامية (Frontend)

### التقنيات المستخدمة

#### React و TypeScript
```typescript
// مثال على مكون React مع TypeScript
import { FC } from 'react';

interface Props {
  connectionId: string;
  tableName: string;
}

const TableViewer: FC<Props> = ({ connectionId, tableName }) => {
  // المنطق هنا
  return <div>...</div>;
};
```

#### TanStack Query (React Query)
```typescript
// للحصول على البيانات
const { data, isLoading } = useQuery({
  queryKey: ['/api/connections', connectionId, 'tables'],
});

// للتعديل
const mutation = useMutation({
  mutationFn: (data) => apiRequest('POST', '/api/tables', data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/tables'] });
  }
});
```

#### Wouter للتوجيه
```typescript
import { Route, Switch } from 'wouter';

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/404" component={NotFound} />
    </Switch>
  );
}
```

### إنشاء مكون جديد

#### 1. مكون UI بسيط
```typescript
// client/src/components/MyComponent.tsx
import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <Button onClick={onAction}>تنفيذ</Button>
    </div>
  );
};
```

#### 2. مكون مع بيانات
```typescript
// client/src/components/DataList.tsx
import { useQuery } from '@tanstack/react-query';

export const DataList: FC<{ connectionId: string }> = ({ connectionId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/connections', connectionId, 'tables'],
  });

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error.message}</div>;

  return (
    <ul>
      {data?.map((table: any) => (
        <li key={table.name}>{table.name}</li>
      ))}
    </ul>
  );
};
```

### إضافة صفحة جديدة

#### 1. إنشاء الصفحة
```typescript
// client/src/pages/MyPage.tsx
import { FC } from 'react';

const MyPage: FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">صفحتي الجديدة</h1>
      {/* المحتوى */}
    </div>
  );
};

export default MyPage;
```

#### 2. إضافة المسار
```typescript
// client/src/App.tsx
import MyPage from '@/pages/MyPage';

function App() {
  return (
    <Switch>
      {/* المسارات الموجودة */}
      <Route path="/mypage" component={MyPage} />
    </Switch>
  );
}
```

## بنية الخادم الخلفي (Backend)

### FastAPI

#### إضافة Endpoint جديد
```python
# server_py/main.py

@app.get("/api/connections/{connection_id}/stats")
async def get_connection_stats(connection_id: str):
    """الحصول على إحصائيات الاتصال"""
    try:
        # المنطق هنا
        stats = db_service.get_stats(connection_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### نماذج البيانات مع Pydantic
```python
# server_py/models.py

from pydantic import BaseModel
from typing import Optional

class TableStats(BaseModel):
    name: str
    row_count: int
    size_mb: float
    last_updated: Optional[str] = None
```

### خدمة قاعدة البيانات

#### إضافة عملية جديدة
```python
# server_py/database_service.py

class DatabaseService:
    def get_table_stats(self, connection_id: str, table_name: str):
        """الحصول على إحصائيات جدول"""
        connection = self.connections.get(connection_id)
        if not connection:
            raise ValueError("Connection not found")
        
        engine = connection['engine']
        
        with engine.connect() as conn:
            # الاستعلام
            result = conn.execute(text(
                f"SELECT COUNT(*) FROM {table_name}"
            ))
            row_count = result.scalar()
            
            return {
                'table_name': table_name,
                'row_count': row_count
            }
```

## قاعدة البيانات

### SQLAlchemy

#### الاتصال
```python
from sqlalchemy import create_engine

# SQLite
engine = create_engine('sqlite:///database.db')

# PostgreSQL
engine = create_engine('postgresql://user:pass@localhost:5432/dbname')

# MySQL
engine = create_engine('mysql+mysqlconnector://user:pass@localhost:3306/dbname')
```

#### تنفيذ استعلامات
```python
from sqlalchemy import text

with engine.connect() as connection:
    # SELECT
    result = connection.execute(text("SELECT * FROM users"))
    rows = result.fetchall()
    
    # INSERT
    connection.execute(text(
        "INSERT INTO users (name, email) VALUES (:name, :email)"
    ), {"name": "أحمد", "email": "ahmed@example.com"})
    connection.commit()
```

## الأنماط والمعايير

### TypeScript/React

#### تسمية الملفات
```
PascalCase للمكونات: UserProfile.tsx
camelCase للمساعدات: queryClient.ts
kebab-case للصفحات: user-profile.tsx
```

#### تنظيم الكود
```typescript
// 1. الاستيرادات
import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. الأنواع والواجهات
interface Props {
  id: string;
}

// 3. المكون
export const MyComponent: FC<Props> = ({ id }) => {
  // 3.1 Hooks
  const { data } = useQuery(...);
  
  // 3.2 المتغيرات المحلية
  const [state, setState] = useState();
  
  // 3.3 الوظائف
  const handleClick = () => { };
  
  // 3.4 التصيير
  return <div>...</div>;
};
```

### Python/FastAPI

#### تسمية الملفات والوظائف
```python
# snake_case للملفات والوظائف
def get_user_data():
    pass

# PascalCase للفئات
class UserService:
    pass
```

#### تنظيم الكود
```python
# 1. الاستيرادات
from fastapi import FastAPI, HTTPException
from typing import List

# 2. النماذج
class User(BaseModel):
    name: str
    email: str

# 3. المسارات
@app.get("/api/users")
async def get_users() -> List[User]:
    # المنطق
    pass
```

## اختبار الكود

### Frontend (Jest)
```typescript
// __tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

test('renders component', () => {
  render(<MyComponent title="Test" onAction={() => {}} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Backend (pytest)
```python
# tests/test_api.py
def test_get_connections():
    response = client.get("/api/connections")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

## البناء للإنتاج

### Frontend
```bash
# بناء التطبيق
npm run build

# الملفات المبنية في: dist/public/
```

### Backend
```bash
# تشغيل مع Uvicorn
PORT=5000 uv run python server_py/main.py
```

### Docker (اختياري)
```dockerfile
# Dockerfile
FROM node:20 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.11
WORKDIR /app
COPY --from=frontend /app/dist /app/dist
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY server_py ./server_py
CMD ["uvicorn", "server_py.main:app", "--host", "0.0.0.0", "--port", "5000"]
```

## المساهمة

### سير العمل
```bash
# 1. Fork المستودع
# 2. Clone الـ fork
git clone https://github.com/YOUR_USERNAME/OmniCoreDB.git

# 3. إنشاء branch
git checkout -b feature/my-feature

# 4. التغييرات
# عدّل الكود

# 5. Commit
git add .
git commit -m "Add: my new feature"

# 6. Push
git push origin feature/my-feature

# 7. Pull Request على GitHub
```

### معايير Commit
```
Add: إضافة ميزة جديدة
Fix: إصلاح خطأ
Update: تحديث ميزة موجودة
Remove: حذف كود/ميزة
Docs: تحديث التوثيق
Style: تغييرات التنسيق
Refactor: إعادة هيكلة الكود
```

## الأدوات المفيدة

### VS Code Extensions
- ESLint
- Prettier
- Python
- Tailwind CSS IntelliSense

### أوامر مفيدة
```bash
# التحقق من الأخطاء
npm run check

# تنسيق الكود
npm run format

# تحليل حزم JavaScript
npm run analyze
```

## الموارد

### الوثائق
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [FastAPI](https://fastapi.tiangolo.com)
- [SQLAlchemy](https://docs.sqlalchemy.org)
- [TanStack Query](https://tanstack.com/query/latest)

### المجتمع
- GitHub Issues: [https://github.com/Alqudimi/OmniCoreDB/issues](https://github.com/Alqudimi/OmniCoreDB/issues)
- Discussions: [https://github.com/Alqudimi/OmniCoreDB/discussions](https://github.com/Alqudimi/OmniCoreDB/discussions)

---

**المطور**: عبدالعزيز القديمي  
**البريد الإلكتروني**: eng7mi@gmail.com, alqudimitechnology@gmail.com  
**GitHub**: [@Alqudimi](https://github.com/Alqudimi)  
**جميع الحقوق محفوظة © 2024 - تقنية القديمي**
