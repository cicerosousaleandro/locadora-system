import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { Vehicles } from './pages/Vehicles';
import Dashboard from './pages/Dashboard';
import { Navbar } from './components/Navbar';

function ProtectedLayout({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-6">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/users" element={<ProtectedLayout><Users /></ProtectedLayout>} />
          <Route path="/vehicles" element={<ProtectedLayout><Vehicles /></ProtectedLayout>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}