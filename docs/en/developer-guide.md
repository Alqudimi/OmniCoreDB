Developmenter &apos; s Guide - Omni Core DB Manager
===================================================

Structure Overview
------------------

Omni Core DB Manager is a Full-Stack application built by--**Frontend**: React 18 + TypeScript + Vite -**Backend**: FastaPI + Python -**Database**:: Multiple support (SQLite, PostgreSQL, MySQL)

Project structure
-----------------

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

Preparation of the development environment
------------------------------------------

### Requirements

```
# Node.js
node --version  # يجب أن يكون 20.x+

# Python
python --version  # يجب أن يكون 3.11+

# uv
uv --version
```

### Installing

```
# استنساخ المستودع
git clone https://github.com/Alqudimi/OmniCoreDB.git
cd OmniCoreDB

# تثبيت التبعيات
npm install
uv sync
```

### Operating in development mode

```
# في نافذة طرفية واحدة
npm run dev

# هذا يشغل:
# - Backend على localhost:8000
# - Frontend على localhost:5000
```

Frontend structure
------------------

### Techniques used

#### React and TypeScript

```
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

```
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

#### Wouter Guidance

```
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

### Create a new component

#### 1. A simple UI component

```
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

#### 2. A component with data

```
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

### Add a new page

#### 1. Creating the page

```
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

#### 2. Add path

```
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

Backend structure
-----------------

### FastaPI

#### Add New Endpoint

```
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

#### Data models with Pydantic

```
# server_py/models.py

from pydantic import BaseModel
from typing import Optional

class TableStats(BaseModel):
    name: str
    row_count: int
    size_mb: float
    last_updated: Optional[str] = None
```

### Database service

#### Add new process

```
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

Database
--------

### SQLALchemy

#### Communication

```
from sqlalchemy import create_engine

# SQLite
engine = create_engine('sqlite:///database.db')

# PostgreSQL
engine = create_engine('postgresql://user:pass@localhost:5432/dbname')

# MySQL
engine = create_engine('mysql+mysqlconnector://user:pass@localhost:3306/dbname')
```

#### Information implementation

```
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

Patterns and standards
----------------------

### TypeScript/React

#### Name of files

```
PascalCase للمكونات: UserProfile.tsx
camelCase للمساعدات: queryClient.ts
kebab-case للصفحات: user-profile.tsx
```

#### Organization of the Code

```
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

### Python/FastaPI

#### Designation of files and functions

```
# snake_case للملفات والوظائف
def get_user_data():
    pass

# PascalCase للفئات
class UserService:
    pass
```

#### Organization of the Code

```
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

Code test.
----------

### Frontend (Jest)

```
// __tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

test('renders component', () => {
  render(<MyComponent title="Test" onAction={() => {}} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Backend (pytest)

```
# tests/test_api.py
def test_get_connections():
    response = client.get("/api/connections")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

Construction for production
---------------------------

### Frontend

```
# بناء التطبيق
npm run build

# الملفات المبنية في: dist/public/
```

### Backend

```
# تشغيل مع Uvicorn
PORT=5000 uv run python server_py/main.py
```

### Docker (optional)

```
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

Contribution
------------

### Conduct of work

```
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

### Criteria for Commitment

```
Add: إضافة ميزة جديدة
Fix: إصلاح خطأ
Update: تحديث ميزة موجودة
Remove: حذف كود/ميزة
Docs: تحديث التوثيق
Style: تغييرات التنسيق
Refactor: إعادة هيكلة الكود
```

Useful tools
------------

### VS Code Extensions

* ESLint
* Prettier
* Python
* Tailwind CSS IntelliSense

### Useful orders.

```
# التحقق من الأخطاء
npm run check

# تنسيق الكود
npm run format

# تحليل حزم JavaScript
npm run analyze
```

Resources
---------

### Documentation

* [React](https://react.dev)
* [TypeScript](https://www.typescriptlang.org/docs)
* [FastAPI](https://fastapi.tiangolo.com)
* [SQLAlchemy](https://docs.sqlalchemy.org)
* [TanStack Query](https://tanstack.com/query/latest)

### Society

* GitHub Issues:<https://github.com/Alqudimi/OmniCoreDB/issues>
* Discussions:<https://github.com/Alqudimi/OmniCoreDB/discussions>

---

**Developer**:: Abdul Aziz Al-Ogidi  
**E-mail**: ing7mi@gmail.com, alqudemitechnology@gmail.com  
**GitHub**== sync, corrected by elderman == @elder\_man[@Alqudimi](https://github.com/Alqudimi)  
**© 2024 - Old Tech**