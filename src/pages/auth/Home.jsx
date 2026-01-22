import React from "react";
import { Link } from "react-router-dom";

// --- Icons (Logic kept same, styling updated) ---
const InventoryIcon = () => (
  <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const BillingIcon = () => (
  <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);



// --- Main Component ---
export const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-black relative overflow-x-hidden selection:bg-[#f55bf9]">
      
      {/* --- Navbar (Refactored to Box Style) --- */}
      <nav className="relative max-w-7xl mx-auto px-6 py-8 z-10">
        <div className="flex flex-wrap gap-0 items-stretch">
          
          {/* Logo Box */}
          <div className="bg-black text-white px-4 py-3 border-2 border-black flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Brand Name Box */}
          <a href="/home" className="flex items-center px-6 py-3 border-y-2 border-r-2 border-black bg-white hover:bg-gray-50 transition">
             <span className="font-bold text-lg tracking-wider uppercase">azoov</span>
          </a>

          {/* Links as Boxes */}
          <div className="hidden md:flex">
             <a href="#" className="flex items-center px-6 py-3 border-y-2 border-r-2 border-black bg-white hover:bg-[#85aee1] transition font-bold text-sm uppercase tracking-wide">
               Features
             </a>
             <a href="#" className="flex items-center px-6 py-3 border-y-2 border-r-2 border-black bg-white hover:bg-[#85aee1] transition font-bold text-sm uppercase tracking-wide">
               Pricing
             </a>
             <Link to="/login" className="flex items-center px-6 py-3 border-y-2 border-r-2 border-black bg-white hover:bg-[#85aee1] transition font-bold text-sm uppercase tracking-wide">
               Login
             </Link>
          </div>

          <div className="ml-auto">
             <Link to="/register">
              <button className="h-full bg-white hover:text-[#85aee1] text-black border-2 border-black px-6 py-3 font-bold text-sm uppercase tracking-wider transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section (Refactored to Big Blocky Style) --- */}
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-10">
            
            {/* Title Construction mimicking the 'Discover Events' layout */}
            <div className="flex flex-col items-start gap-0">
               <div className="border-2 border-black px-8 py-4 bg-white">
                 <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black">
                   Manage
                 </h1>
               </div>
               
               <div className="flex flex-wrap items-center -mt-0.5">
                 <div className="border-2 border-black px-8 py-4 bg-white border-t-0 md:border-t-2 md:border-l-0">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black">
                      Your Shop
                    </h1>
                 </div>
                 {/* The Pink Pill for Emphasis */}
                 <div className="bg-[#85aee1] border-2 border-black rounded-full px-8 py-3 ml-0 md:-ml-4 z-10 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black">
                      with ease
                    </h1>
                 </div>
               </div>
            </div>

            <p className="text-xl text-black font-medium leading-relaxed max-w-lg border-l-4 border-[#85aee1] pl-6">
              The all-in-one ERP solution designed for small business owners.
              Track stock, bill customers, and grow your sales without the headache.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register">
                <button className="bg-black hover:bg-gray-800 text-white border-2 border-black px-8 py-4 text-lg font-bold uppercase tracking-wider transition shadow-[6px_6px_0px_0px_#85aee1] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                  Start Free Trial
                </button>
              </Link>
              <button className="bg-white hover:bg-gray-50 text-black border-2 border-black px-8 py-4 text-lg font-bold uppercase tracking-wider transition shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                View Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-6 flex items-center gap-4 border-2 border-black p-4 w-fit bg-[#f0f0f0]">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-300 overflow-hidden z-0 hover:z-10 transition">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover filter grayscale contrast-125" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-black uppercase tracking-tight">Join 2,000+ shops</p>
                <p className="text-xs font-bold text-gray-600">Streamlining operations</p>
              </div>
            </div>
          </div>

          {/* Right Image (Reskinned Mockup) */}
          <div className="relative">
             {/* Background Pattern */}
             <div className="absolute inset-0 bg-[#85aee1] transform translate-x-4 translate-y-4 border-2 border-black rounded-3xl"></div>
             
             {/* Dashboard Container */}
             <div className="relative bg-white border-2 border-black rounded-3xl p-4 overflow-hidden">
                {/* Browser Header */}
                <div className="border-b-2 border-black pb-4 mb-4 flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full border-2 border-black bg-white"></div>
                   <div className="w-4 h-4 rounded-full border-2 border-black bg-black"></div>
                   <div className="flex-1 bg-gray-100 border-2 border-black h-6 rounded-full mx-2"></div>
                </div>

                {/* Dashboard Content (Simplified & Outline Style) */}
                <div className="grid grid-cols-12 gap-4">
                   {/* Sidebar */}
                   <div className="col-span-3 border-r-2 border-black pr-4 space-y-4">
                      <div className="h-8 bg-black w-full"></div>
                      <div className="h-4 bg-gray-200 w-3/4 border border-black"></div>
                      <div className="h-4 bg-gray-200 w-1/2 border border-black"></div>
                   </div>
                   {/* Main */}
                   <div className="col-span-9 space-y-4">
                      <div className="flex gap-4">
                         <div className="flex-1 h-24 border-2 border-black bg-[#85aee1] p-2">
                            <div className="w-8 h-8 bg-white border-2 border-black mb-2"></div>
                         </div>
                         <div className="flex-1 h-24 border-2 border-black bg-white p-2">
                             <div className="w-8 h-8 bg-black mb-2"></div>
                         </div>
                      </div>
                      <div className="h-32 border-2 border-black bg-gray-50 flex items-end">
                         {/* Graph Line */}
                         <svg className="w-full h-full" preserveAspectRatio="none">
                            <path d="M0 100 L 20 80 L 40 90 L 60 40 L 80 60 L 100 20" stroke="black" strokeWidth="3" fill="none" />
                         </svg>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- Features Section (Refactored to Grid of Boxes) --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t-4 border-black">
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tighter">
            Everything you need <br /> <span className="text-[#85aee1] bg-black px-2">to run your shop</span>
          </h2>
          <p className="text-xl font-bold text-gray-600 mt-4">
            Powerful features. Simple interface. No clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black bg-black">
          {/* Feature 1 */}
          <div className="bg-white p-10 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-[#fff0fc] transition duration-300 group">
            <div className="w-16 h-16 bg-[#85aee1] border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
              <InventoryIcon />
            </div>
            <h3 className="text-2xl font-black text-black mb-3 uppercase">Inventory</h3>
            <p className="text-black font-medium leading-relaxed">
              Keep real-time tabs on your stock levels. Get low-stock alerts automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-10 border-b-2 md:border-b-0 md:border-r-2 border-black hover:bg-[#fff0fc] transition duration-300 group">
            <div className="w-16 h-16 bg-[#85aee1] border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
              <BillingIcon />
            </div>
            <h3 className="text-2xl font-black text-black mb-3 uppercase">Billing</h3>
            <p className="text-black font-medium leading-relaxed">
              Generate professional invoices in seconds. Scan barcodes and add discounts easily.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-10 hover:bg-[#fff0fc] transition duration-300 group">
            <div className="w-16 h-16 bg-[#85aee1] border-2 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
              <AnalyticsIcon />
            </div>
            <h3 className="text-2xl font-black text-black mb-3 uppercase">Analytics</h3>
            <p className="text-black font-medium leading-relaxed">
              Visualize profit margins, peak hours, and top products with simple dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-10 mb-10">
        <div className="bg-black text-white border-2 border-black p-12 md:p-20 text-center relative overflow-hidden shadow-[8px_8px_0px_0px_#85aee1]">
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
              Ready to grow?
            </h2>
            <p className="text-white text-xl font-medium">
              Join thousands of shop owners using Mini ERP today. Start your 14-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <button className="w-full sm:w-auto bg-[#85aee1] text-black border-2 border-white px-8 py-4 text-lg font-bold uppercase tracking-wider hover:bg-white transition">
                Get Started Now
              </button>
              <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 text-lg font-bold uppercase tracking-wider hover:bg-white hover:text-black transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t-2 border-black mt-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-black p-2 border-2 border-black">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <span className="font-black text-black text-xl tracking-tighter uppercase">
              ShopManager
            </span>
          </div>
          <p className="text-sm font-bold text-gray-500">
            © 2024 ShopManager. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-8 text-sm font-bold text-black uppercase tracking-wide">
          <a href="#" className="hover:text-[#85aee1] hover:underline decoration-2 underline-offset-4 transition">
            Privacy
          </a>
          <a href="#" className="hover:text-[#85aee1] hover:underline decoration-2 underline-offset-4 transition">
            Terms
          </a>
          <a href="#" className="hover:text-[#85aee1] hover:underline decoration-2 underline-offset-4 transition">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;