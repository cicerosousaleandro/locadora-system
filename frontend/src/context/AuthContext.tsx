import { createContext, useContext, useState, ReactNode } from 'react';
import api from '../services/api';

interface User {
  username: string;
  roles: string[];
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Tenta recuperar o usuário salvo ao recarregar a página
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { token, username: userUsername, roles } = response.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify({ username: userUsername, roles }));
    setUser({ username: userUsername, roles });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto facilmente em qualquer componente
export function useAuth() {
  return useContext(AuthContext);
}