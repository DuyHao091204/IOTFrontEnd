import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import illustration from '../assets/login.svg';
import { Mail, User } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch {
      setError('Tài khoản hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#6f7aae]">
      <div className="flex w-[900px] rounded-lg overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md">
        {/* LEFT SIDE */}
        <div className="w-1/2 bg-[#58b3f9] p-8 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Cảm ơn bạn đã tin tưởng và lựa chọn{' '}
              <span className="font-bold">RFID System!</span>
            </h2>
            <p className="text-sm text-white/90 leading-relaxed">
              Chúng tôi sẽ nỗ lực hết mình để mang đến những trải nghiệm tốt
              nhất và giúp việc quản lý tài sản của bạn trở nên hiệu quả hơn.
            </p>
          </div>

          <div className="mt-6 space-y-1 text-sm">
            <p className="flex items-center gap-2">
              <Mail size={16} /> CSKH: support@rfid.com
            </p>
            <p className="flex items-center gap-2">
              <User size={16} /> Hotline: 028.6294.1556
            </p>
          </div>

          <img
            src={illustration}
            alt="Illustration"
            className="w-64 mx-auto mt-6"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 bg-[#3f5fa5] p-10 text-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-1">ĐĂNG NHẬP</h2>
          <p className="text-sm text-white/80 mb-6">
            Đăng nhập quản lý website
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username input */}
            <input
              type="text"
              placeholder="Tài Khoản"
              className="w-full rounded-md px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* Password input */}
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full rounded-md px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 rounded-md transition-all"
            >
              ĐĂNG NHẬP
            </button>
          </form>

          <p className="text-xs text-center mt-8 text-white/70">
            Copyright 2025 © RFID Technologies. <br /> Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
