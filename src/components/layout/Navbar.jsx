const Navbar = () => {
  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search invoices, customers, or products..."
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            🔔
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">❓</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
