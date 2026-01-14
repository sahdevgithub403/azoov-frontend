import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/invoices', label: 'Invoices', icon: '📄' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/staff', label: 'Staff', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-gray-50 min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center text-white font-bold">
            M
          </div>
          <div>
            <h1 className="font-bold text-lg">Mini ERP</h1>
            <p className="text-xs text-gray-500">Shop Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Main Menu</div>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive(item.path)
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'Staff'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
