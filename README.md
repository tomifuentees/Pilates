# Pilates Studio Management System

Sistema de gestión para estudio de pilates con registro self-service de clientas.

## Stack

- **Frontend:** Next.js 14 (App Router)
- **Backend:** TanStack Query + Next.js API Routes
- **Database:** PrismaDB (PostgreSQL)
- **UI:** shadcn/ui + Tailwind CSS

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and configure your `DATABASE_URL`:

```bash
cp .env.example .env
```

### 3. Run database migrations

```bash
npm run db:push
```

### 4. Seed initial data (optional)

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### 5. Start development server

```bash
npm run dev
```

## Test Accounts

After running the seed script:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pilates.com | admin123 |
| Instructor | maria@pilates.com | instructor123 |
| Client | cliente@ejemplo.com | client123 |

## Pages

### Client Portal (`/dashboard`)

- `/dashboard` - Dashboard principal
- `/book` - Reservar clases
- `/my-classes` - Mis clases (próximas y pasadas)
- `/membership` - Mi membresía
- `/profile` - Mi perfil

### Admin Portal (`/admin/dashboard`)

- `/admin/dashboard` - Métricas del estudio
- `/admin/schedule` - Gestionar horarios
- `/admin/clients` - Lista de clientas
- `/admin/memberships` - Gestión de membresías
- `/admin/payments` - Registro de pagos
- `/admin/instructors` - Instructoras
- `/admin/class-types` - Tipos de clase

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |
| POST | `/api/auth/register` | Registro de usuario |
| GET | `/api/auth/session` | Obtener sesión actual |
| GET/POST | `/api/classes/schedule` | Horario semanal |
| GET/POST | `/api/classes/types` | Tipos de clase |
| GET/POST | `/api/bookings` | Reservas |
| POST | `/api/waitlist` | Lista de espera |
| GET/POST | `/api/memberships` | Membresías |
| GET/POST | `/api/payments` | Pagos |
| GET | `/api/clients` | Clientas |
| GET/POST | `/api/instructors` | Instructoras |
| GET | `/api/reports/stats` | Estadísticas |