import React from 'react';
import { Link } from 'react-router-dom';

// --- Icons Components (Updated with Brand Color #238898) ---
const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#238898]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 10h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V10zM4 10l1.5-4h13L20 10" />
    <path d="M9 14h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const InventoryIcon = () => (
  <svg className="w-6 h-6 text-[#238898]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const BillingIcon = () => (
  <svg className="w-6 h-6 text-[#238898]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-6 h-6 text-[#238898]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// --- Main Component ---
export const Home = () => {
//   const gridStyle = {
//     backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)`,
//     backgroundSize: '35px 35px'
//   };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative">
      {/* Background Grid Layer */}
      {/* <div className="absolute inset-0 pointer-events-none" style={gridStyle}></div> */}
      
      {/* Navbar */}
      <nav className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <LogoIcon />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">azoov</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-[#238898] transition">Features</a>
          <a href="#" className="hover:text-[#238898] transition">Pricing</a>
          <Link to="/login" className="hover:text-[#238898] transition">Login</Link>
        </div>

        <Link to="/register">
          <button className="bg-[#238898] hover:bg-[#1d7380] text-white px-6 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-[#238898]/20 active:scale-95">
            Get Started
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 max-w-lg">
            {/* <div className="inline-flex items-center gap-2 bg-[#238898]/10 border border-[#238898]/20 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 bg-[#238898] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-[#238898] tracking-wide uppercase">New V2.0 Released</span>
            </div>
             */}
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1]">
              Manage Your Shop <br />
              <span className="text-[#238898] underline decoration-[#238898]/20 decoration-4 underline-offset-4">with Ease</span>
            </h1>
            
            <p className="text-lg text-gray-500 leading-relaxed">
              The all-in-one ERP solution designed for small business owners. Track stock, bill customers, and grow your sales without the headache.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register">
                <button className="bg-[#238898] hover:bg-[#1d7380] text-white px-8 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-[#238898]/20 active:scale-[0.98]">
                  Start Free Trial
                </button>
              </Link>
              <button className="bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 px-8 py-3.5 rounded-xl font-semibold transition shadow-sm active:scale-[0.98]">
                View Demo
              </button>
            </div>

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

          {/* Right Image (Mockup) */}
          <div className="relative">
             {/* Abstract blob behind mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#238898]/20 to-transparent rounded-full blur-3xl -z-10"></div>
            
            {/* Monitor/Dashboard Mockup */}
            <div className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 aspect-[4/3] relative">
                    {/* Window Controls */}
                    <div className="bg-slate-800/50 px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    {/* Dashboard Abstract Content */}
                    <div className="p-6 grid grid-cols-12 gap-4 opacity-90">
                        {/* Sidebar */}
                        <div className="col-span-3 space-y-3 border-r border-slate-800 pr-4">
                            <div className="h-2 w-8 bg-slate-700 rounded"></div>
                            <div className="h-8 bg-[#238898] rounded-lg w-full opacity-20 mt-4"></div>
                            <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                            <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                        </div>
                        {/* Main Content */}
                        <div className="col-span-9 space-y-4">
                            <div className="flex gap-4">
                                <div className="h-24 bg-slate-800 flex-1 rounded-xl border border-slate-700/50 p-3">
                                   <div className="w-8 h-8 rounded-lg bg-[#238898]/20 mb-2"></div>
                                   <div className="h-2 w-12 bg-slate-600 rounded"></div>
                                </div>
                                <div className="h-24 bg-slate-800 flex-1 rounded-xl border border-slate-700/50 p-3">
                                   <div className="w-8 h-8 rounded-lg bg-purple-500/20 mb-2"></div>
                                   <div className="h-2 w-12 bg-slate-600 rounded"></div>
                                </div>
                            </div>
                            <div className="h-32 bg-slate-800 rounded-xl border border-slate-700/50 relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#238898]/20 to-transparent"></div>
                                <svg className="absolute bottom-0 left-0 right-0 h-16 text-[#238898]" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0 100 L 0 60 Q 25 40 50 60 T 100 30 V 100 Z" fill="currentColor" opacity="0.4" />
                                    <path d="M0 100 L 0 80 Q 25 60 50 80 T 100 50 V 100 Z" fill="currentColor" opacity="0.6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to <br/> run your shop</h2>
          <p className="text-gray-500">Powerful features packaged in a simple interface. We removed the clutter so you can focus on selling.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-200/40 hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-[#238898]/10 rounded-xl flex items-center justify-center mb-6">
              <InventoryIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Inventory Tracking</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Keep real-time tabs on your stock levels. Get low-stock alerts automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-200/40 hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-[#238898]/10 rounded-xl flex items-center justify-center mb-6">
              <BillingIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Quick Billing</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Generate professional invoices in seconds. Scan barcodes and add discounts easily.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-200/40 hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-[#238898]/10 rounded-xl flex items-center justify-center mb-6">
              <AnalyticsIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Sales Analytics</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Visualize profit margins, peak hours, and top products with simple dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-10 mb-10">
        <div className="bg-[#1e293b] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle Glow Effect using brand color */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#238898]/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to grow your business?</h2>
            <p className="text-gray-300 text-lg">
              Join thousands of shop owners using Mini ERP today. Start your 14-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="w-full sm:w-auto bg-[#238898] hover:bg-[#1d7380] text-white px-8 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-[#238898]/30">
                Get Started Now
              </button>
              <button className="w-full sm:w-auto bg-transparent border border-gray-600 hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-semibold transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-200/60 mt-10">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="bg-[#238898] p-1.5 rounded-lg">
                   <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <span className="font-bold text-slate-800 text-lg">ShopManager</span>
            </div>
            <p className="text-xs text-gray-400">© 2024 ShopManager. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-[#238898] transition">Privacy</a>
            <a href="#" className="hover:text-[#238898] transition">Terms</a>
            <a href="#" className="hover:text-[#238898] transition">Contact</a>
        </div>
      </footer>

    </div>
  );
};

export default Home;