# Task Manager Frontend

Aplicación React para gestión de tareas

## Stack

- **Framework:** React 18 (con Hooks)
- **Routing:** React Router v6
- **HTTP:** Axios
- **Estilos:** CSS Modules
- **Bundler:** Vite
- **Tests:** Vitest + @testing-library/react
- **Lenguaje:** JavaScript nativo (sin TypeScript)

## Arquitectura

```
src/
├── main.jsx                         # Entry point
├── App.jsx                          # Router principal
├── context/
│   ├── AuthContext.jsx              # Estado global de autenticación
│   └── DependenciesProvider.jsx    # Composition root (inyección de deps)
├── shared/
│   ├── infrastructure/
│   │   └── httpClient.js           # Cliente Axios con interceptor JWT
│   └── ui/
│       └── global.css
└── features/
    ├── auth/
    │   ├── domain/
    │   │   └── authValidations.js  # Funciones puras de validación
    │   ├── application/
    │   │   └── useAuth.js          # Hook que orquesta login/register
    │   ├── infrastructure/
    │   │   └── AuthApiService.js   # Llamadas HTTP
    │   └── ui/
    │       ├── LoginPage.jsx
    │       └── LoginPage.module.css
    └── tasks/
        ├── domain/
        │   └── taskDomain.js       # Funciones puras (validación, filtros, sort)
        ├── application/
        │   └── useTasks.js         # Hook con toda la lógica de tareas
        ├── infrastructure/
        │   └── TaskApiService.js
        └── ui/
            ├── TasksPage.jsx
            ├── TaskForm.jsx
            ├── TaskList.jsx
            └── *.module.css
```

### Principios

- **Dominio:** funciones JS puras sin React ni efectos secundarios — fáciles de testear.
- **Aplicación:** custom hooks que usan las deps inyectadas y orquestan la lógica.
- **Infraestructura:** módulos Axios que solo hablan HTTP.
- **UI:** componentes React que solo llaman hooks, sin lógica de negocio.
- **Inyección de dependencias:** `DependenciesProvider` expone todas las dependencias por contexto. En tests, se pasa un objeto de mocks como `value` prop.

## Requisitos previos

- Node.js ≥ 18
- El backend corriendo en `http://localhost:3001`

## Instalación y arranque

```bash
# 1. Ir al directorio frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. (Opcional) Configurar la URL del backend
# Por defecto apunta a http://localhost:3001/api/v1
# Para cambiarlo, crear .env.local:
echo "VITE_API_URL=http://localhost:3001/api/v1" > .env.local

# 4. Arrancar en desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`.

## Funcionalidades

- **Login / Registro** — formulario con validación en cliente y servidor
- **Lista de tareas** — filtros por estado (All / Pending / Done)
- **Crear tarea** — formulario con título, descripción y responsable
- **Completar tarea** — un clic en el círculo de la izquierda
- **Eliminar tarea** — botón ✕ en cada fila
- **Diseño responsive** — adaptado a móvil, tablet y escritorio
- **Rutas protegidas** — redirige a `/login` si no hay sesión

## Tests

```bash
# Ejecutar todos los tests (una vez)
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage

# Lint
npm run lint
```

### Suite de tests incluida

**Dominio (puras, sin React):**
- `authValidations.test.js` — validaciones de formularios de auth
- `taskDomain.test.js` — validación de tareas, filtros, sort

**Componentes UI:**
- `LoginPage.test.jsx` — renderizado, errores de campo, llamada al servicio, error de servidor, switch login/register
- `TaskList.test.jsx` — skeleton, estado vacío, renderizado de ítems, complete, delete
- `TaskForm.test.jsx` — renderizado, validación, submit, reset, error de API

**Hooks (application layer):**
- `useTasks.test.jsx` — fetch inicial, create, validación, complete, delete

> Los tests usan el helper `renderWithProviders` (`__tests__/helpers/renderWithProviders.jsx`) que envuelve los componentes con `DependenciesProvider` aceptando un objeto de mocks por `value`. Esto permite testear hooks y UI sin `vi.mock()` por archivo.

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:3001/api/v1` |
