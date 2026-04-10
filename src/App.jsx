import React from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import AdminDashboard from './screens/AdminDashboard';
import Screen1 from './screens/Screen1';
import Screen2 from './screens/Screen2';
import Screen3 from './screens/Screen3';
import Screen4 from './screens/Screen4';
import { isAdmin, setAdmin } from './lib/storage';

// Secret token — bookmark: /#/open-admin/ph-magic-2025
const ADMIN_TOKEN = 'ph-magic-2025';

// Admin route guard
function AdminRoute({ children }) {
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
}

// Token-based admin unlock — validates token, sets session flag, redirects
function AdminUnlock() {
  const { token } = useParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (token === ADMIN_TOKEN) {
      setAdmin(true);
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);
  return null;
}

export default function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/"                       element={<Screen1 />} />
        <Route path="/symbols"                element={<Screen2 />} />
        <Route path="/choices"                element={<Screen3 />} />
        <Route path="/path"                   element={<Screen4 />} />
        <Route path="/open-admin/:token"      element={<AdminUnlock />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GameProvider>
  );
}
