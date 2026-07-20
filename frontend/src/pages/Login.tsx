import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Credenciais inválidas. Verifique seu usuário e senha.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

        <div className="bg-primary-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">LOCADORA SYSTEM</h1>
          <p className="text-primary-100 text-sm mt-2">Painel de Gerenciamento</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-corporate pl-10"
                  placeholder="Ex: admin"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-corporate pl-10"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Autenticando...
                </>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <p>Ambiente de Desenvolvimento</p>
            <p className="mt-1">Use: <strong>admin</strong> / <strong>novaSenha123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}