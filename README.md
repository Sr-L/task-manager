# Task Manager

Aplicación full-stack de gestión de tareas con autenticación JWT.

Monorepo con dos paquetes independientes:

- **`backend/`** — REST API
- **`frontend/`** — SPA React

Cada paquete tiene su propio README con detalles de arquitectura, endpoints y tests.

---

## Stack

### Backend
- Node.js ≥ 18 + Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcryptjs
- express-validator
- Swagger (swagger-jsdoc + swagger-ui-express)
- Jest + Supertest
- Arquitectura hexagonal simplificada con DI manual

### Frontend
- React 18 + React Router v6
- Vite
- Axios
- CSS Modules
- Vitest + @testing-library/react

### Lenguaje
- JavaScript nativo en ambos lados, ES Modules.

---

## Requisitos previos

- Node.js ≥ 18
- npm ≥ 9
- Una URI de MongoDB accesible (MongoDB Atlas o cualquier instancia con conexión)

---

## Arranque rápido

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd task-manager

# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
cp .env.example .env.local   # opcional, ya apunta a localhost:3001
```

### 2. Configurar la URI de Mongo

Edita `backend/.env` y rellena al menos:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/tasks-manager
JWT_SECRET=<una-clave-larga-y-aleatoria>
```

`MONGODB_URI` puede apuntar a un cluster de Atlas o a cualquier instancia accesible — no necesitas levantar Mongo localmente.

### 3. Arrancar el backend

```bash
cd backend
npm run dev
```

API en `http://localhost:3001` · Swagger en `http://localhost:3001/api/v1/docs`.

### 4. Arrancar el frontend

```bash
cd frontend
npm run dev
```

App en `http://localhost:5173`.

---

## Documentación detallada

- [`backend/README.md`](backend/README.md) — endpoints, arquitectura y tests del API
- [`frontend/README.md`](frontend/README.md) — arquitectura, features y tests de la SPA
