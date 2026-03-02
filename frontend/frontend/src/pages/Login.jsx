import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.type === 'farmer') {
        navigate('/farmer-dashboard');
      } else if (userData.type === 'admin') {
        navigate('/admin-dashboard');
      } else if (userData.type === 'buyer') {
        navigate('/buyer-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b4f6c] to-[#01baef] p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
        <h1 className="text-3xl font-bold mb-2 text-[#0b4f6c] text-center">
          Welcome back to AgriPlatform
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Please enter your details to sign in
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base outline-none transition-all duration-200 mb-5 focus:border-[#01baef] focus:ring-2 focus:ring-[#01baef] focus:ring-opacity-50"
            placeholder="your email"
            required
          />

          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base outline-none transition-all duration-200 mb-5 focus:border-[#01baef] focus:ring-2 focus:ring-[#01baef] focus:ring-opacity-50"
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white px-4 py-3 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-200 mb-4 shadow-lg shadow-green-500/30 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleRegisterClick}
          className="w-full bg-transparent text-[#0b4f6c] px-4 py-3 border-2 border-[#0b4f6c] rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:text-[#083344] hover:border-[#083344]"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}