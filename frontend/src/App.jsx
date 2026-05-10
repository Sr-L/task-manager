import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthContext } from './context/AuthContext.jsx';
import { PrivateRoute } from './shared/components/PrivateRoute.jsx';
import { Layout } from './shared/components/Layout.jsx';
import { RouteFallback } from './shared/components/RouteFallback.jsx';

const LoginPage = lazy(() =>
  import('./features/auth/ui/LoginPage.jsx').then((m) => ({ default: m.LoginPage }))
);
const TasksPage = lazy(() =>
  import('./features/tasks/ui/TasksPage.jsx').then((m) => ({ default: m.TasksPage }))
);

export function App() {
  const { isAuthenticated } = useAuthContext();
  return (
    <Suspense fallback={<RouteFallback />}>
      <Toaster position="bottom-center" richColors />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <TasksPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
