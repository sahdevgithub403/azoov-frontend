import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- Icons (Same logic, consistent style) ---
const Icons = {
  Store: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  Eye: ({ show }) => (
    show ?
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg> :
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
  ),
  Google: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="grayscale group-hover:grayscale-0 transition-all"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" /><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.059 -13.144 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" /><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.489 -26.754 49.309 -26.754 51.239 C -26.754 53.169 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z" /><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" /></g></svg>
  ),
  Apple: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-black"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-.55-3.69 2.68-1.58 8.12 1.55 9.35-.98 1.95-1.51 2.33-2.05 3.43zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
  ),
  Help: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  )
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative font-sans text-black selection:bg-[#85aee1]">
    

      {/* Main Container */}
      <div className="w-full max-w-[420px] z-10 flex flex-col items-center">

        {/* Header Logo Box - ADDED ROUNDED-XL & UPDATED COLOR */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#85aee1] border-2 border-black rounded-2xl flex items-center justify-center text-black mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Icons.Store />
          </div>
          {/* Added rounded-full to badge */}
          <h2 className="text-2xl font-black text-black uppercase tracking-tight bg-white border-2 border-black px-5 py-1.5 rounded-full -rotate-1">
            ShopManager ERP
          </h2>
        </div>

        {/* Card (Neo-Brutalist Box) - ADDED ROUNDED-3XL */}
        <div className="w-full bg-white border-2 border-black p-8 sm:p-10 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-black mb-2 uppercase tracking-tighter">Welcome Back</h1>
            {/* Added rounded-lg */}
            <p className="text-black font-bold text-sm bg-[#eaf4ff] inline-block px-3 py-1 border border-black rounded-lg">
              Manage your shop easily
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field - ADDED ROUNDED-XL */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-black mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-focus-within:scale-110">
                  <Icons.Mail />
                </span>
                <input
                  type="email"
                  placeholder="name@shop.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-black rounded-xl text-black placeholder-gray-400 font-bold focus:outline-none focus:bg-[#f0f7ff] focus:border-black focus:shadow-[4px_4px_0px_0px_#85aee1] transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field - ADDED ROUNDED-XL */}
            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-xs font-black uppercase tracking-widest text-black">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-black hover:text-[#85aee1] hover:underline decoration-2 underline-offset-2 uppercase">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-focus-within:scale-110">
                  <Icons.Lock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-black rounded-xl text-black placeholder-gray-400 font-bold focus:outline-none focus:bg-[#f0f7ff] focus:border-black focus:shadow-[4px_4px_0px_0px_#85aee1] transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#85aee1] focus:outline-none transition-colors"
                >
                  <Icons.Eye show={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <div className="border-2 border-black bg-red-100 p-3 rounded-xl flex items-center justify-center">
                 <p className="text-red-600 font-bold text-sm uppercase">{error}</p>
              </div>
            )}

            {/* Main Button - ADDED ROUNDED-XL & UPDATED COLOR */}
            <button
              type="submit"
              className="w-full bg-[#85aee1] hover:bg-[#749ecc] text-black border-2 border-black rounded-xl font-black uppercase tracking-wider py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:rounded-xl"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-black"></div>
            </div>
            <div className="relative flex justify-center text-[10px] tracking-widest font-black">
              {/* Added rounded-full */}
              <span className="px-3 bg-white text-black border-2 border-black rounded-full uppercase py-1">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons - ADDED ROUNDED-FULL */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8081/oauth2/authorization/google'}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-black rounded-full bg-white hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] group"
            >
              <Icons.Google />
              <span className="text-sm font-bold text-black uppercase tracking-wide">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-black rounded-full bg-white hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] group">
              <Icons.Apple />
              <span className="text-sm font-bold text-black uppercase tracking-wide">Apple</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-black font-bold">
            Don't have an account?{' '}
            <Link to="/register" className="text-black bg-[#85aee1] px-2 py-0.5 rounded-md ml-1 hover:bg-black hover:text-white transition-colors border border-black">
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex items-center gap-6 text-xs font-bold text-black uppercase tracking-wider">
          <Link to="#" className="flex items-center gap-2 hover:text-[#85aee1] transition-colors group">
            <div className="w-6 h-6 border-2 border-black rounded-full bg-white flex items-center justify-center group-hover:bg-[#85aee1] transition-colors">
              <Icons.Help />
            </div>
            Help Center
          </Link>
          <Link to="#" className="flex items-center gap-2 hover:text-[#85aee1] transition-colors group">
            <div className="w-6 h-6 border-2 border-black rounded-full bg-white flex items-center justify-center group-hover:bg-[#85aee1] transition-colors">
              <Icons.Shield />
            </div>
            Privacy Policy
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;