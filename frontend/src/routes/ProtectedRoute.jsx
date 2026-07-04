import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingAnimation from '../components/common/LoadingAnimation';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink-950)' }}>
        <LoadingAnimation label="Loading your workspace…" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
