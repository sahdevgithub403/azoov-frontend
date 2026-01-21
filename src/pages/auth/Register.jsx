import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// --- Icons (Styled for Neo-Brutalist Look: Thicker strokes, Black) ---
const Icons = {
  Logo: () => (
    <div className="w-10 h-10 bg-[#85aee1] border-2 border-black rounded-xl flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
    </div>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Role: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Eye: ({ show }) => (
    show ? 
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> :
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
  ),
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  Arrow: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  )
};

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STAFF',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    const result = await register(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-black selection:bg-[#85aee1]">
      
      {/* Top Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Icons.Logo />
          {/* Brand Name with border box */}
          <span className="text-lg font-black text-black uppercase tracking-tight border-2 border-black bg-white px-3 py-1 rounded-lg -rotate-1 hidden sm:block">
            Mini ERP
          </span>
        </div>
        <div className="text-sm font-bold text-black uppercase tracking-wide">
          Already a member?{' '}
          <Link to="/login" className="text-black bg-[#85aee1] border border-black rounded-md px-2 py-1 ml-1 hover:bg-black hover:text-white transition-all">
            Log In
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 mb-10">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-stretch lg:justify-center gap-8 lg:gap-12">
          
          {/* Left Side: Visuals (Image Card) */}
          <div className="hidden lg:block w-[480px] shrink-0 relative">
            {/* Image Card Container */}
            <div className="h-full relative rounded-3xl overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white group">
              {/* Background Image */}
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
                alt="Shop Interior" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter saturate-0 group-hover:saturate-100"
              />
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
              
              {/* Floating Badge (Neo-Brutalist Style) */}
              <div className="absolute top-8 left-8 bg-white border-2 border-black text-black text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-[4px_4px_0px_0px_#85aee1]">
                 <Icons.Chart /> 
                 <span className="uppercase tracking-wide">Sales up 24%</span>
              </div>

              {/* Bottom Text Box */}
              <div className="absolute bottom-8 left-8 right-8 bg-white border-2 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black text-black uppercase leading-tight tracking-tight mb-2">
                  Manage your shop <br/>
                  <span className="text-[#85aee1] bg-black px-2">with confidence.</span>
                </h2>
                
                {/* Social Proof */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-300 overflow-hidden relative z-0 hover:z-10 hover:scale-110 transition-transform">
                          <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover grayscale" />
                       </div>
                    ))}
                  </div>
                  <div className="flex flex-col justify-center">
                     <p className="text-xs font-black uppercase">2k+ Shops Joined</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background shape */}
            <div className="absolute -z-10 top-10 -left-6 w-full h-full bg-[#85aee1] rounded-3xl border-2 border-black"></div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="w-full max-w-[500px] bg-white rounded-3xl border-2 border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-2">Create account</h1>
            <p className="text-black font-bold text-sm bg-[#eaf4ff] inline-block px-3 py-1 border border-black rounded-lg mb-8">
              Start managing your inventory today.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-focus-within:scale-110">
                    <Icons.User />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder-gray-400 focus:outline-none focus:bg-[#f0f7ff] focus:border-black focus:shadow-[4px_4px_0px_0px_#85aee1] transition-all"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2 ml-1">Work Email</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-focus-within:scale-110">
                    <Icons.Mail />
                  </span>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder-gray-400 focus:outline-none focus:bg-[#f0f7ff] focus:border-black focus:shadow-[4px_4px_0px_0px_#85aee1] transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Role & Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Role */}
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-2 ml-1">Role</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-transform group-focus-within:scale-110">
                      <Icons.Role />
                    </span>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full pl-12 pr-8 py-3.5 bg-white border-2 border-black rounded-xl text-sm font-bold text-black appearance-none focus:outline-none focus:bg-[#f0f7ff] focus:border-black focus:shadow-[4px_4px_0px_0px_#85aee1] transition-all cursor-pointer"
                    >
                      <option value="STAFF">Select role</option>
                      <option value="STAFF">Staff</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                       <svg width="12" height="8" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-2 ml-1">Password</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-focus-within:scale-110">
                      <Icons.Lock />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-10 py-3.5 bg-white border-2 border-black rounded-xl text-sm font-bold text-black placeholder-gray-400 focus:outline-none focus:bg-[#f0f7ff] focus:border-black focus:shadow-[4px_4px_0px_0px_#85aee1] transition-all tracking-widest"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-black hover:text-[#85aee1] focus:outline-none transition-colors"
                    >
                      <Icons.Eye show={showPassword} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 mt-4 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="relative flex items-center pt-0.5">
                   <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="appearance-none w-5 h-5 border-2 border-black rounded bg-white checked:bg-[#85aee1] checked:border-black cursor-pointer transition-all relative z-10"
                  />
                  {/* Custom Checkmark for appearance-none */}
                  {agreeToTerms && (
                    <svg className="absolute top-1 left-0.5 w-4 h-4 text-black pointer-events-none z-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <label htmlFor="terms" className="text-xs font-bold text-gray-600 leading-5 cursor-pointer select-none">
                  I agree to the <Link to="#" className="text-black decoration-2 underline hover:text-[#85aee1]">Terms of Service</Link> and <Link to="#" className="text-black decoration-2 underline hover:text-[#85aee1]">Privacy Policy</Link>.
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-xl border-2 border-black bg-red-100 text-red-600 font-bold text-xs uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#85aee1] hover:bg-[#749ecc] text-black border-2 border-black font-black uppercase tracking-wider py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                Create Account
                <Icons.Arrow />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
        © 2024 Mini ERP Inc. All rights reserved.
      </div>
    </div>
  );
};

export default Register;