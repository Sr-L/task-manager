import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext.jsx';
import { PrivateRoute } from './shared/components/PrivateRoute.jsx';
import { Layout } from './shared/components/Layout.jsx';
import { LoginPage } from './features/auth/ui/LoginPage.jsx';
import { TasksPage } from './features/tasks/ui/TasksPage.jsx';

export function App() {
  const { isAuthenticated } = useAuthContext();
  return (
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
  );
}
