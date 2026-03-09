# Ethara AI HRMS Lite

Live application: https://hrms-lite1495.vercel.app

Backend API: https://hrms-lite-backend-eta.vercel.app/api/

GitHub repository: https://github.com/affan004/HRMSLite

## Project overview

Ethara AI HRMS Lite is a lightweight full-stack HR application for managing employee records and daily attendance.

Core functionality:

- Add employees with unique employee ID, full name, email address, and department
- View all employees in a searchable directory
- Delete employees
- Mark daily attendance as Present or Absent
- View attendance by date with a dashboard summary

The project is split into a React frontend and a Django REST backend, with PostgreSQL used in production and SQLite supported for local development.

## Tech stack

Frontend:

- React 19
- Vite
- React Router
- Axios
- Lucide React
- Vanilla CSS

Backend:

- Python
- Django
- Django REST Framework
- django-cors-headers
- dj-database-url

Database:

- Neon Postgres in production
- SQLite for local development fallback

Deployment:

- Vercel frontend
- Vercel Python backend
- Neon Postgres via Vercel Marketplace integration

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/affan004/HRMSLite.git
cd HRMSLite
```

### 2. Run the backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Notes:

- Local development works without a `DATABASE_URL`; the backend falls back to SQLite at `Backend/db.sqlite3`
- To point local development at another database, set `DATABASE_URL` before running migrations

### 3. Run the frontend

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

Optional frontend env:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
```

If `VITE_API_URL` is not set locally, the frontend defaults to `/api`.

## Validation and verification

Frontend verification:

```bash
cd Frontend
npm run lint
npm run build
```

Backend verification:

```bash
cd Backend
python manage.py test
python manage.py check
```

## Assumptions and limitations

- The system assumes a single admin user; authentication is intentionally out of scope
- Attendance is managed per employee per date with two statuses only: Present and Absent
- There is no leave, payroll, or role-based access management
- The attendance screen is date-based rather than a separate per-employee history page
- Vercel is used for deployment, so backend configuration is environment-variable driven

## Submission checklist

- Public live application URL: included above
- Public GitHub repository: included above
- README with overview, stack, local setup, and assumptions/limitations: included here
