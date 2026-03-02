import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-4 overflow-hidden relative">
      {/* Decorative animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Brand messaging */}
          <div className="hidden lg:block text-white space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-sm font-medium backdrop-blur-sm">
                  🌱 Welcome to AgriPlatform
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 bg-clip-text text-transparent leading-tight">
                Growing Together, Thriving Together
              </h1>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                Connect with buyers and farmers. Transform agricultural commerce with our trusted platform built for sustainable growth.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4 pt-4">
              {[
                { icon: '🚀', title: 'Fast & Secure', desc: 'Enterprise-grade security' },
                { icon: '🌍', title: 'Global Network', desc: 'Connect worldwide' },
                { icon: '📊', title: 'Smart Analytics', desc: 'Data-driven insights' },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="text-3xl mt-1 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-emerald-100">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative group">
              {/* Glow effect border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              
              {/* Form card */}
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-2 text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-white">Sign In</h2>
                    <p className="text-slate-400 text-sm">Enter your credentials to access your account</p>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="animate-shake bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl text-sm text-center backdrop-blur-sm flex items-center justify-center gap-2">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-200">
                        Email Address
                      </label>
                      <div className="relative group/input">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          required
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200 group-focus-within/input:border-emerald-500 group-focus-within/input:bg-slate-800 group-focus-within/input:ring-2 group-focus-within/input:ring-emerald-500/20 focus:border-emerald-500 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">✉️</span>
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-200">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <div className="relative group/input">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200 group-focus-within/input:border-emerald-500 group-focus-within/input:bg-slate-800 group-focus-within/input:ring-2 group-focus-within/input:ring-emerald-500/20 focus:border-emerald-500 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔒</span>
                      </div>
                    </div>

                    {/* Sign in button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative group/btn mt-8 py-3 px-4 font-bold text-white rounded-xl overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {/* Button background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover/btn:scale-105 group-hover/btn:shadow-lg group-hover/btn:shadow-emerald-500/50"></div>
                      
                      {/* Button text */}
                      <span className="relative flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Signing in...
                          </>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent"></div>
                    <span className="text-xs text-slate-400">or</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-slate-600 to-transparent"></div>
                  </div>

                  {/* Register button */}
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="w-full py-3 px-4 font-semibold text-white border-2 border-emerald-500/50 rounded-xl transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-500/10 active:scale-95"
                  >
                    Create an Account
                  </button>

                  {/* Footer text */}
                  <p className="text-center text-xs text-slate-400 pt-2">
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                      Terms of Service
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Demo credentials hint (optional) */}
            <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg text-slate-400 text-xs text-center backdrop-blur-sm">
              
            </div>
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

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        /* Smooth focus transitions */
        input:focus {
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;