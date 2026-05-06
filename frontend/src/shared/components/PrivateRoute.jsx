import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext.jsx';

export function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
