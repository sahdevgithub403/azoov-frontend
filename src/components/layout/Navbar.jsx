import React from 'react';

const Navbar = () => {
  return (
    // changed border-b border-gray-100 -> border-b-2 border-gray-900 (Bold Divider)
    <header className="bg-white border-b-2 border-gray-900 px-8 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            {/* Icon Color: text-gray-400 -> text-gray-900 (High Contrast) */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#5B8DEF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </span>
            
            {/* Search Input: Neo-Brutalist Style
                - Added border-2 border-gray-900
                - Changed rounded-xl -> rounded-3xl
                - Added Hard Shadow on Focus
            */}
            <input
              type="text"
              placeholder="Quick search anything..."
              className="w-full bg-white border-2 border-gray-900 px-12 py-2.5 rounded-3xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-[1px] transition-all"
            />
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {/* Keys styled to look like physical keys with borders */}
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-gray-600 bg-gray-50 border-2 border-gray-200 rounded-md">⌘</kbd>
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-gray-600 bg-gray-50 border-2 border-gray-200 rounded-md">K</kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button className="p-2.5 text-gray-900 hover:bg-gray-100 rounded-xl relative transition-colors group border-2 border-transparent hover:border-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#5B8DEF] rounded-full border-2 border-white animate-pulse"></span>
          </button>

          {/* Help Button */}
          <button className="p-2.5 text-gray-900 hover:bg-gray-100 rounded-xl transition-colors border-2 border-transparent hover:border-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2"></div>

           {/* Uncommented part updated just in case: #238898 -> #5B8DEF */}
           {/* <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-extrabold text-[#5B8DEF]">UPGRADE</p>
              <p className="text-[10px] text-gray-500 font-bold">Pro Plan</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#5B8DEF] border-2 border-gray-900 flex items-center justify-center text-white font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              B
            </div>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;