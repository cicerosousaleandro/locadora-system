import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';

// Componente que protege rotas: só deixa passar se estiver logado
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Tela interna simples (Dashboard)
function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-900">Bem-vindo, {user?.username}!</h1>
            <p className="text-slate-600 mt-1">Seus níveis de acesso: <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{user?.roles.join(', ')}</span></p>
          </div>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm">
            Sair do Sistema
          </button>
        </div>

        <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg text-primary-800 text-sm">
          🚀 O sistema frontend está conectado com sucesso ao seu backend Java (iam-service) via JWT!
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

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}