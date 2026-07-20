import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Users, LayoutDashboard, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Função auxiliar para verificar se o link está ativo
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-primary-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo e Marca */}
          <div className="flex items-center gap-3">
            <Shield className="text-primary-500" size={28} />
            <span className="font-bold text-xl tracking-wide">LOCADORA SYSTEM</span>
          </div>

          {/* Links de Navegação */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-800'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/users"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/users') ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-800'
              }`}
            >
              <Users size={18} />
              Usuários
            </Link>
          </div>

          {/* Área do Usuário e Logout */}
          <div className="flex items-center gap-4 border-l border-primary-700 pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">{user?.username}</p>
              <p className="text-xs text-primary-200">{user?.roles.join(', ')}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}