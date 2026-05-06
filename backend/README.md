# Task Manager API

REST API para gestión de tareas (to-do) con autenticación JWT.  
Construida con Node.js + Express + MongoDB siguiendo arquitectura hexagonal simplificada.

---

## Requisitos previos

- Node.js ≥ 18
- MongoDB (local o Atlas)
- npm ≥ 9

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3001` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/tasks-manager` |
| `JWT_SECRET` | Clave secreta para firmar JWT | `supersecretkey` |
| `JWT_EXPIRES_IN` | Expiración del token | `7d` |
| `NODE_ENV` | Entorno de ejecución | `development` |

---

## Comandos

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm start

# Tests
npm test

# Tests con cobertura
npm run test:coverage

# Linting
npm run lint
```

---

## Endpoints

### Auth

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Registro de usuario | ❌ |
| POST | `/api/v1/auth/login` | Login, devuelve JWT | ❌ |

### Tasks

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/v1/tasks` | Listar tareas del usuario | ✅ |
| POST | `/api/v1/tasks` | Crear tarea | ✅ |
| PATCH | `/api/v1/tasks/:id/complete` | Marcar como completada | ✅ |
| DELETE | `/api/v1/tasks/:id` | Eliminar tarea | ✅ |

### Sistema

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Health check |

### Documentación Swagger

Disponible en: `http://localhost:3001/api/v1/docs`

---

## Ejemplos de uso

### Registro

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Luis", "email": "luis@example.com", "password": "secret123"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "luis@example.com", "password": "secret123"}'
```

### Crear tarea

```bash
curl -X POST http://localhost:3001/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "Mi tarea", "description": "Detalles", "responsible": "Luis"}'
```

### Listar tareas

```bash
curl http://localhost:3001/api/v1/tasks \
  -H "Authorization: Bearer <token>"
```

---

## Arquitectura

```
backend/
├── docs/
│   └── swagger.js                # OpenAPI spec (swagger-jsdoc)
└── src/
    ├── app.js                    # Express factory + DI wiring
    ├── server.js                 # Entry point
    ├── shared/
    │   ├── domain/               # DomainError
    │   ├── infrastructure/
    │   │   ├── database/         # Conexión Mongoose
    │   │   └── logger/           # Logger con niveles
    │   ├── middlewares/          # error.handler, not.found.handler, validate.request
    │   └── utils/                # response.handler
    └── contexts/
        ├── auth/
        │   ├── domain/           # UserEntity, UserRepository (contrato)
        │   ├── application/      # RegisterUserUseCase, LoginUserUseCase
        │   └── infrastructure/   # Controller, Routes, Mongo repo, Model,
        │                         # JwtService, BcryptPasswordHasher, Middleware
        └── tasks/
            ├── domain/           # TaskEntity, TaskRepository (contrato)
            ├── application/      # Create, List, Complete, Delete use cases
            └── infrastructure/   # Controller, Routes, Mongo repo, Model, Validators
```

### Principios aplicados

- **Hexagonal (simplificada)**: Domain sin dependencias externas, Infrastructure aísla los frameworks.
- **Inyección de dependencias**: Resuelta manualmente en `app.js` (sin contenedor).
- **ES Modules**: `import`/`export` en todo el proyecto (`"type": "module"`).
- **Sin TypeScript**: JavaScript nativo puro.

---

## Tests

```
tests/
├── app.test.js                   # createApp() health + 404
├── auth/
│   ├── domain/                   # UserEntity, UserRepository (contrato)
│   ├── application/              # Unit: RegisterUserUseCase, LoginUserUseCase
│   └── infrastructure/           # AuthController (supertest), AuthMiddleware,
│                                 # JwtService, BcryptPasswordHasher
├── shared/
│   ├── infrastructure/logger/    # Logger
│   ├── middlewares/              # error.handler, not.found.handler
│   └── utils/                    # response.handler
└── tasks/
    ├── domain/                   # TaskEntity, TaskRepository (contrato)
    ├── application/              # Unit: Create, List, Complete, Delete use cases
    └── infrastructure/           # TaskController (supertest)
```

- **Domain**: funciones puras y contratos verificados sin dependencias.
- **Use cases**: mockeados con `jest.fn()`, sin base de datos.
- **Controllers**: supertest sobre Express, mocking de use cases.
- **Total**: 121 tests — 20 suites.
