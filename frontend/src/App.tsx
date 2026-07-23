import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { Vehicles } from './pages/Vehicles';
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

function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">Bem-vindo ao Painel, {user?.username}!</h1>
        <p className="text-slate-600 mb-6">Seus níveis de acesso: <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-primary-700">{user?.roles.join(', ')}</span></p>

        <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg text-primary-800 text-sm flex items-start gap-3">
          <span className="text-xl">🚀</span>
          <div>
            <p className="font-semibold">Sistema Integrado com Sucesso!</p>
            <p className="mt-1 text-primary-700">O frontend está se comunicando com o backend Java (iam-service e vehicle-service) de forma segura via JWT.</p>
          </div>
        </div>
      </div>
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