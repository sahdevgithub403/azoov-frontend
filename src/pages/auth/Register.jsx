import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Inline Icons to match the design
const Icons = {
  Logo: () => (
    <div className="w-8 h-8 bg-[#2C9DA6] rounded-lg flex items-center justify-center text-white shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
    </div>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Role: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Eye: ({ show }) => (
    show ? 
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> :
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
  ),
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  Arrow: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col font-sans text-gray-900">
      
      {/* Top Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <Icons.Logo />
          <span className="text-xl font-bold text-gray-900 tracking-tight">Mini ERP</span>
        </div>
        <div className="text-sm text-gray-500">
          Already a member?{' '}
          <Link to="/login" className="text-[#2C9DA6] font-semibold hover:underline">
            Log In
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start lg:justify-center gap-12 lg:gap-24">
          
          {/* Left Side: Visuals (Image Card & Social Proof) */}
          <div className="hidden lg:block w-[400px] shrink-0 pt-8">
            {/* Image Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 aspect-[4/3] bg-gray-100 group">
              {/* Background Image Placeholder (Clothing Rack) */}
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
                alt="Shop Interior" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              
              {/* Floating Badge */}
              <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                 <Icons.Chart /> Sales up 24%
              </div>

              {/* Bottom Text */}
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-2xl font-bold text-white leading-tight">
                  Manage your shop<br/>with confidence.
                </h2>
              </div>
            </div>

            {/* Social Proof (Avatars) */}
            <div className="mt-6 flex items-center gap-4 px-2">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="w-9 h-9 rounded-full border-2 border-[#F7F9FB] bg-gray-300 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                   </div>
                ))}
                <div className="w-9 h-9 rounded-full border-2 border-[#F7F9FB] bg-[#2C9DA6] text-white flex items-center justify-center text-[10px] font-bold">
                  +2k
                </div>
              </div>
              <div className="flex flex-col justify-center">
                 <p className="text-sm font-bold text-gray-800">Join 2,000+ shops</p>
                 <p className="text-xs text-gray-500">Streamlining operations daily</p>
              </div>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/50">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
            <p className="text-gray-500 text-sm mb-8">Start managing your inventory and sales today.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icons.User />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] transition-all"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 ml-1">Work Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icons.Mail />
                  </span>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Role & Password Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Role */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 ml-1">Role</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <Icons.Role />
                    </span>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 appearance-none focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] transition-all cursor-pointer"
                    >
                      <option value="STAFF">Select role</option>
                      <option value="STAFF">Staff</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Icons.Lock />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] transition-all tracking-widest"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <Icons.Eye show={showPassword} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 mt-2">
                <div className="relative flex items-center h-5">
                   <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-5 h-5 border-2 border-gray-300 rounded-full text-[#2C9DA6] focus:ring-[#2C9DA6] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#2C9DA6] checked:border-[#2C9DA6]"
                  />
                </div>
                <label htmlFor="terms" className="text-xs text-gray-500 leading-5 pt-0.5">
                  I agree to the <Link to="#" className="text-gray-900 font-semibold hover:underline">Terms of Service</Link> and <Link to="#" className="text-gray-900 font-semibold hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              {error && <div className="p-3 rounded-xl bg-red-50 text-red-500 text-xs text-center">{error}</div>}

              <button
                type="submit"
                className="w-full bg-[#2C9DA6] hover:bg-[#238a92] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[#2C9DA6]/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
              >
                Create Account
                <Icons.Arrow />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center py-6 text-[10px] text-gray-400">
        © 2024 Mini ERP Inc. All rights reserved.
      </div>
    </div>
  );
};

export default Register;