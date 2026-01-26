import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Settings,
  Shield,
  ShieldAlert,
  LogOut,
  Store
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      allowedRoles: ["ADMIN", "MANAGER", "SALES"],
      icon: LayoutDashboard,
    },
    {
      path: "/inventory",
      label: "Inventory",
      allowedRoles: ["ADMIN", "MANAGER"],
      icon: Package,
    },
    {
      path: "/invoices",
      label: "Invoices",
      allowedRoles: ["ADMIN", "MANAGER", "SALES"],
      icon: FileText,
    },
    {
      path: "/customers",
      label: "Customers",
      allowedRoles: ["ADMIN", "MANAGER", "SALES"],
      icon: Users,
    },
    {
      path: "/staff",
      label: "Staff Management",
      allowedRoles: ["ADMIN"],
      icon: ShieldAlert,
    },
    {
      path: "/settings",
      label: "Settings",
      allowedRoles: ["ADMIN"],
      icon: Settings,
    },
    {
      path: "/admin",
      label: "Admin Panel",
      allowedRoles: ["ADMIN"],
      icon: Shield,
    },
    {
      path: "/admin/users",
      label: "Users",
      allowedRoles: ["ADMIN"],
      icon: Users,
    },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const userRole = user?.role || "";

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 z-20">
      
      {/* --- Header / Logo --- */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-[#189CAB] rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Store size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-xl text-gray-900 tracking-tight leading-none">
              Mini ERP
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Business OS
            </p>
          </div>
        </div>
      </div>

      {/* --- Navigation --- */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Menu
        </p>

        {menuItems
          .filter((item) => item.allowedRoles.includes(userRole))
          .map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-[#189CAB]/10 text-[#189CAB] font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  size={20}
                  className={`${
                    active
                      ? "text-[#189CAB]"
                      : "text-gray-400 group-hover:text-gray-600"
                  } transition-colors`}
                />
                <span className="text-sm">{item.label}</span>
                
                {/* Active Indicator Dot */}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#189CAB]" />
                )}
              </Link>
            );
          })}

        {menuItems.filter(item => item.allowedRoles.includes(userRole)).length === 0 && (
          <div className="px-4 py-8 text-sm text-gray-400 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50 mx-2">
            No access available for role: <br/> <span className="font-mono text-xs">{userRole}</span>
          </div>
        )}
      </nav>

      {/* --- User Footer --- */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#189CAB] to-cyan-300 p-[2px] shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#189CAB] font-bold text-sm">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">
                {user?.fullName || "User Name"}
              </span>
              <span className="text-xs text-gray-500 font-medium truncate capitalize">
                {userRole.toLowerCase() || "No Role"}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;