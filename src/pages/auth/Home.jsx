import React from "react";
import { Link } from "react-router-dom";

// --- Icons (Clean, Thinner Stroke) ---
const InventoryIcon = () => (
  <svg className="w-6 h-6 text-[#189CAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const BillingIcon = () => (
  <svg className="w-6 h-6 text-[#189CAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-6 h-6 text-[#189CAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// --- Main Component ---
export const Home = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900">
      
      {/* --- Navbar (Clean & Floating) --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center gap-2">
            
            <span className="font-bold text-3xl tracking-tight text-gray-900">azoov</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
             <a href="#" className="hover:text-[#189CAB] transition">Features</a>
             <a href="#" className="hover:text-[#189CAB] transition">Pricing</a>
             <Link to="/login" className="hover:text-[#189CAB] transition">Login</Link>
          </div>

          {/* CTA */}
          <div>
             <Link to="/register">
              <button className="bg-[#189CAB] hover:bg-[#148a9c] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition shadow-sm shadow-cyan-500/30">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 md:pt-40 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 max-w-xl">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Manage your shop <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#189CAB] to-[#63D2E0]">
                with ease.
              </span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed">
              The all-in-one ERP solution designed for small business owners. 
              Track stock, bill customers, and update your business profile without the headache.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register">
                <button className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-semibold text-base transition shadow-lg shadow-gray-200">
                  Start Free Trial
                </button>
              </Link>
              <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-3.5 rounded-xl font-semibold text-base transition shadow-sm">
                View Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-sm font-medium text-gray-500">Trusted by 2,000+ shops</p>
              </div>
            </div>
          </div>

          {/* Right Image (Mockup imitating the screenshot) */}
          <div className="relative">
             {/* Background Blob */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-cyan-100/50 to-blue-50/50 rounded-full blur-3xl -z-10"></div>
             
             {/* Dashboard Shell */}
             <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex h-[400px] md:h-[500px] w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
                
                {/* Sidebar (Visual copy of screenshot sidebar) */}
                <div className="w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-8 text-[#189CAB]">
                    <div className="w-6 h-6 bg-current rounded md:block hidden"></div>
                    <span className="font-bold text-gray-900 hidden md:block">Mini ERP</span>
                  </div>

                  <div className="space-y-1">
                    {/* Inactive Items */}
                    <div className="h-10 w-full rounded-lg flex items-center gap-3 text-gray-400 px-3">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="h-2 w-20 bg-gray-100 rounded hidden md:block"></div>
                    </div>
                    <div className="h-10 w-full rounded-lg flex items-center gap-3 text-gray-400 px-3">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="h-2 w-24 bg-gray-100 rounded hidden md:block"></div>
                    </div>
                    
                    {/* Active Item (Settings) */}
                    <div className="h-10 w-full bg-cyan-50 rounded-lg flex items-center gap-3 text-[#189CAB] px-3 mt-4">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="font-semibold text-sm hidden md:block">Settings</span>
                    </div>
                  </div>

                  {/* Profile at bottom */}
                  <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="space-y-1 hidden md:block">
                      <div className="h-2 w-20 bg-gray-200 rounded"></div>
                      <div className="h-2 w-12 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-[#F9FAFB] p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
                   {/* Header Mock */}
                   <div>
                     <div className="text-xs font-medium text-gray-400 mb-1">Settings / Business Profile</div>
                     <h2 className="text-2xl font-bold text-gray-900">Business Settings</h2>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Logo Card */}
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 aspect-square">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        </div>
                        <div className="text-xs text-gray-400">Click to upload</div>
                      </div>

                      {/* Form Card */}
                      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <div className="space-y-1">
                          <div className="h-2 w-24 bg-gray-200 rounded"></div>
                          <div className="h-8 w-full border border-gray-200 rounded-lg bg-gray-50"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 w-24 bg-gray-200 rounded"></div>
                          <div className="h-8 w-full border border-gray-200 rounded-lg bg-gray-50"></div>
                        </div>
                         {/* The Blue Button */}
                         <div className="pt-2 flex justify-end">
                            <div className="h-8 w-32 bg-[#189CAB] rounded-lg shadow-sm"></div>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to run your shop
            </h2>
            <p className="text-lg text-gray-500">
              Powerful features packed into a clean, simple interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-cyan-100 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-6 text-[#189CAB] group-hover:scale-110 transition-transform">
                <InventoryIcon />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Inventory</h3>
              <p className="text-gray-500 leading-relaxed">
                Keep real-time tabs on your stock levels. Get low-stock alerts automatically and never run out.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-cyan-100 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-6 text-[#189CAB] group-hover:scale-110 transition-transform">
                <BillingIcon />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Billing</h3>
              <p className="text-gray-500 leading-relaxed">
                Generate professional invoices in seconds. Scan barcodes and apply tax or discounts instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-cyan-100 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-6 text-[#189CAB] group-hover:scale-110 transition-transform">
                <AnalyticsIcon />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics</h3>
              <p className="text-gray-500 leading-relaxed">
                Visualize profit margins, peak hours, and top products with beautiful, easy-to-read charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#189CAB] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-cyan-900/20">
           {/* Abstract Circles */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Ready to grow your business?
            </h2>
            <p className="text-cyan-50 text-xl font-medium max-w-2xl mx-auto">
              Join thousands of shop owners using Mini ERP today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-white text-[#189CAB] px-8 py-3.5 rounded-xl text-lg font-bold hover:bg-cyan-50 transition shadow-lg">
                Get Started Now
              </button>
              <button className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-xl text-lg font-bold hover:bg-white/10 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#189CAB] text-white p-1 rounded-md">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">Mini ERP</span>
            <span className="text-gray-400 text-sm ml-4">© 2024 Your Company Inc.</span>
          </div>

          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-[#189CAB] transition">Privacy</a>
            <a href="#" className="hover:text-[#189CAB] transition">Terms</a>
            <a href="#" className="hover:text-[#189CAB] transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;