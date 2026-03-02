import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    // Redirect after a short delay to show message
    const timer = setTimeout(() => navigate('/login'), 2000);
    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">You have been logged out.</h1>
      <p>Redirecting to login...</p>
    </div>
  );
}