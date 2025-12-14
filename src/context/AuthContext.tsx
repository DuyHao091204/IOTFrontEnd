import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      // ✅ Gọi API thật, ví dụ: POST /auth/login
      const res = await api.post('/auth/login', { username, password });
      const { access_token, user } = res.data;

      // ✅ Lưu user và token vào AVlocalStorage
      setUser(user);
      setToken(access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', access_token);

      navigate('/');
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      alert('Sai tài khoản hoặc mật khẩu!');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
