import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton({ className = '' }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition ${className}`}
    >
      Logout
    </button>
  );
}