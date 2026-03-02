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
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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
    if (!password) return { strength: 0, label: '', color: '#94a3b8' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ef4444', '#f97316', '#10b981', '#06b6d4'];
    return {
      strength: Math.min(strength, 4),
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || '#94a3b8',
    };
  };

  const passwordStrength = getPasswordStrength(form.password);

  const userTypeEmoji = {
    farmer: '🌾',
    buyer: '🛒',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-4 overflow-hidden relative">
      {/* Decorative animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-2xl animate-fade-in">
        {/* Form card */}
        <div className="group">
          {/* Glow effect border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          
          {/* Form content */}
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="space-y-3 mb-8 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl animate-bounce" style={{ animationDelay: '0s' }}>🌱</span>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 bg-clip-text text-transparent">
                    Join AgriPlatform
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Create your account and start your agricultural journey</p>
                </div>
              </div>
            </div>

            {/* General error message */}
            {generalError && (
              <div className="animate-shake mb-6 bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl text-sm text-center backdrop-blur-sm flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Grid layout - 2 columns on desktop, 1 on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Full Name
                  </label>
                  <div className="relative group/input">
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('full_name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John Doe"
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200 group-focus-within/input:border-emerald-500 group-focus-within/input:bg-slate-800 group-focus-within/input:ring-2 group-focus-within/input:ring-emerald-500/20 disabled:opacity-50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">👤</span>
                  </div>
                  {errors.full_name && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <span>✗</span> {errors.full_name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Email Address
                  </label>
                  <div className="relative group/input">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200 group-focus-within/input:border-emerald-500 group-focus-within/input:bg-slate-800 group-focus-within/input:ring-2 group-focus-within/input:ring-emerald-500/20 disabled:opacity-50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">📧</span>
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <span>✗</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Phone Number
                  </label>
                  <div className="relative group/input">
                    <input
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone_number')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="+250 7XX XXX XXX"
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200 group-focus-within/input:border-emerald-500 group-focus-within/input:bg-slate-800 group-focus-within/input:ring-2 group-focus-within/input:ring-emerald-500/20 disabled:opacity-50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">📞</span>
                  </div>
                  {errors.phone_number && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <span>✗</span> {errors.phone_number}
                    </p>
                  )}
                </div>

                {/* Password with strength indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-200">
                      Password
                    </label>
                    {form.password && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-800/50 border border-slate-600/50" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative group/input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200 group-focus-within/input:border-emerald-500 group-focus-within/input:bg-slate-800 group-focus-within/input:ring-2 group-focus-within/input:ring-emerald-500/20 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors text-lg"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {form.password && (
                    <div className="space-y-1">
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300 rounded-full"
                          style={{
                            width: `${(passwordStrength.strength / 4) * 100}%`,
                            backgroundColor: passwordStrength.color,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <span>✗</span> {errors.password}
                    </p>
                  )}
                </div>

                {/* User Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    User Type
                  </label>
                  <div className="relative group/input">
                    <select
                      name="user_type"
                      value={form.user_type}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white outline-none transition-all duration-200 group-focus-within/input:border-emerald-500 group-focus-within/input:bg-slate-800 group-focus-within/input:ring-2 group-focus-within/input:ring-emerald-500/20 appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="farmer">🌾 Farmer</option>
                      <option value="buyer">🛒 Buyer</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Location
                  </label>
                  <div className="relative group/input">
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('location')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Kigali, Rwanda"
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200 group-focus-within/input:border-emerald-500 group-focus-within/input:bg-slate-800 group-focus-within/input:ring-2 group-focus-within/input:ring-emerald-500/20 disabled:opacity-50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">📍</span>
                  </div>
                  {errors.location && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <span>✗</span> {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent"></div>
                <span className="text-xs text-slate-400">Ready to sign up</span>
                <div className="flex-1 h-px bg-gradient-to-l from-slate-600 to-transparent"></div>
              </div>

              {/* Create Account button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group/btn py-3 px-4 font-bold text-white rounded-xl overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Button background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover/btn:scale-105 group-hover/btn:shadow-lg group-hover/btn:shadow-emerald-500/50"></div>
                
                {/* Button text */}
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </span>
              </button>

              {/* Sign In link */}
              <button
                type="button"
                onClick={handleLoginClick}
                disabled={isLoading}
                className="w-full py-3 px-4 font-semibold text-white border-2 border-emerald-500/50 rounded-xl transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-500/10 active:scale-95 disabled:opacity-50"
              >
                Already have an account? Sign In
              </button>

              {/* Footer text */}
              <p className="text-center text-xs text-slate-400 pt-2">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        .animate-bounce {
          animation: bounce 0.8s ease-in-out infinite;
        }

        /* Select dropdown styling */
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }
      `}</style>
    </div>
  );
}