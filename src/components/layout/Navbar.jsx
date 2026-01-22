import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#238898] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Quick search anything..."
              className="w-full bg-gray-50 border-none px-12 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#238898]/10 transition-all placeholder:text-gray-400"
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded">
                ⌘
              </kbd>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded">
                K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl relative transition-colors group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:scale-110 transition-transform"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>

          <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-100 mx-2"></div>

          {/* 
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#238898]">UPGRADE</p>
              <p className="text-[10px] text-gray-400">Pro Plan</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs ring-2 ring-orange-100 ring-offset-2">
              B
            </div>
          </div> 
          */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
