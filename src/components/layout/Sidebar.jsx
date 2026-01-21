import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const Icons = {
    Store: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5" // Increased stroke weight for boldness
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
        <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
      </svg>
    ),
  };

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      allowedRoles: ["ADMIN", "MANAGER", "SALES"],
      icon: (props) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      path: "/inventory",
      label: "Inventory",
      allowedRoles: ["ADMIN", "MANAGER"],
      icon: (props) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m7.5 4.27 9 5.15" />
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
    },
    {
      path: "/invoices",
      label: "Invoices",
      allowedRoles: ["ADMIN", "MANAGER", "SALES"],
      icon: (props) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      ),
    },
    {
      path: "/customers",
      label: "Customers",
      allowedRoles: ["ADMIN", "MANAGER", "SALES"],
      icon: (props) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      path: "/staff",
      label: "Staff Management",
      allowedRoles: ["ADMIN"],
      icon: (props) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      path: "/settings",
      label: "Settings",
      allowedRoles: ["ADMIN"],
      icon: (props) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      path: "/admin",
      label: "Admin Panel",
      allowedRoles: ["ADMIN"],
      icon: (props) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
      ),
    },
    {
      path: "/admin/users",
      label: "Users",
      allowedRoles: ["ADMIN"],
      icon: (props) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    // Changed border-r-gray-100 -> border-r-2 border-gray-900 (Bold Divider)
    <aside className="w-72 bg-white border-r-2 border-gray-900 flex flex-col h-screen sticky top-0 z-20">
      <div className="p-8">
        <div className="flex items-center gap-3">
          {/* Logo Container: Switched Teal to Blue, Added Border & Hard Shadow */}
          <div className="w-12 h-12 bg-[#5B8DEF] rounded-xl flex items-center justify-center text-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Icons.Store />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-gray-900 leading-tight tracking-tight">
              azoov
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Business OS
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">
          Main Dashboard
        </p>
        {menuItems
          .filter((item) => item.allowedRoles.includes(user?.role))
          .map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                // Updated Active State: Neo-Brutalist Border + Blue Background
                // Updated Inactive State: Transparent Border
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border-2 ${
                  active
                    ? "bg-[#5B8DEF]/10 border-gray-900 text-[#5B8DEF] font-bold shadow-sm"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200"
                }`}
              >
                <item.icon
                  className={`${
                    active
                      ? "text-[#5B8DEF]"
                      : "text-gray-400 group-hover:text-gray-900"
                  } transition-colors`}
                />
                <span className="text-sm">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-[#5B8DEF]" />
                )}
              </Link>
            );
          })}
      </nav>

      {/* User Section: Bold Top Border */}
      <div className="p-4 mt-auto border-t-2 border-gray-900">
        <div className="flex items-center justify-between gap-3 group">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar with Bold Border & Blue Gradient */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B8DEF] to-blue-400 p-[2px] border-2 border-gray-900">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#5B8DEF] font-bold text-sm">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>

            {/* Text Info */}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">
                {user?.fullName || "User Name"}
              </span>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">
                {user?.role || "Admin"}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-red-100"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;