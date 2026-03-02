import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    user_type: 'farmer',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (generalError) setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!form.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!form.location.trim()) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register(
        form.full_name,
        form.email,
        form.phone_number,
        form.password,
        form.user_type,
        form.location
      );
      navigate('/');
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '#e2e8f0' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#f56565', '#ed8936', '#48bb78', '#38a169'];
    return {
      strength: Math.min(strength, 4),
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || '#e2e8f0',
    };
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b4f6c] to-[#01baef] p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-4 sm:p-6">
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🌱</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0b4f6c]">Join AgriPlatform</h1>
            <p className="text-sm text-gray-600">Create your account and start growing</p>
          </div>
        </div>

        {/* General error message */}
        {generalError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-6 text-sm text-center">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 2-column grid, stacks on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
                <span>👤</span> Full Name
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-all outline-none focus:border-[#01baef] focus:ring-2 focus:ring-[#01baef] focus:ring-opacity-20 bg-white ${
                  errors.full_name ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Your full name"
                disabled={isLoading}
              />
              {errors.full_name && (
                <p className="text-red-600 text-xs mt-1 ml-1">{errors.full_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
                <span>📧</span> Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-all outline-none focus:border-[#01baef] focus:ring-2 focus:ring-[#01baef] focus:ring-opacity-20 bg-white ${
                  errors.email ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Your email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
                <span>📞</span> Phone
              </label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-all outline-none focus:border-[#01baef] focus:ring-2 focus:ring-[#01baef] focus:ring-opacity-20 bg-white ${
                  errors.phone_number ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Phone number"
                disabled={isLoading}
              />
              {errors.phone_number && (
                <p className="text-red-600 text-xs mt-1 ml-1">{errors.phone_number}</p>
              )}
            </div>

            {/* Password with strength indicator */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
                <span>🔒</span> Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-all outline-none focus:border-[#01baef] focus:ring-2 focus:ring-[#01baef] focus:ring-opacity-20 bg-white ${
                  errors.password ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {form.password && (
                <>
                  <div className="mt-1 h-1 w-full bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full transition-all duration-200"
                      style={{
                        width: `${(passwordStrength.strength / 4) * 100}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <p
                    className="text-xs text-right mt-0.5"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </p>
                </>
              )}
              {errors.password && (
                <p className="text-red-600 text-xs mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            {/* User Type */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
                <span>👥</span> User Type
              </label>
              <select
                name="user_type"
                value={form.user_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer outline-none focus:border-[#01baef] focus:ring-2 focus:ring-[#01baef] focus:ring-opacity-20"
                disabled={isLoading}
              >
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1">
                <span>📍</span> Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-all outline-none focus:border-[#01baef] focus:ring-2 focus:ring-[#01baef] focus:ring-opacity-20 bg-white ${
                  errors.location ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Kigali, Rwanda"
                disabled={isLoading}
              />
              {errors.location && (
                <p className="text-red-600 text-xs mt-1 ml-1">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-lg font-semibold transition-all duration-200 mb-3 shadow-lg shadow-green-500/30 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* Login link button */}
          <button
            type="button"
            onClick={handleLoginClick}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-transparent text-[#0b4f6c] border-2 border-[#0b4f6c] rounded-lg font-semibold transition-all duration-200 hover:bg-blue-50 hover:text-[#083344] hover:border-[#083344] disabled:opacity-50"
          >
            Already have an account? Sign In
          </button>
        </form>
      </div>
    </div>
  );
}