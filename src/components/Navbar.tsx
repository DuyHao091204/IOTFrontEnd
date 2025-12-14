import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="font-semibold text-gray-800 text-lg">RFID Dashboard</h1>

      <button
        onClick={handleLogout}
        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-all shadow"
      >
        Logout
      </button>
    </header>
  );
}
