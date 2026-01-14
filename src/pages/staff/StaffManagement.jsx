import { useEffect, useState } from "react";
import { getStaff } from "../../api/staffApi";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { Pagination } from "../../components/common/Pagination";

export const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await getStaff();
      setStaff(response.data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
      case "Store Manager":
        return "bg-purple-100 text-purple-700";
      case "Cashier":
        return "bg-orange-100 text-orange-700";
      case "Inventory":
        return "bg-gray-100 text-gray-700";
      case "Driver":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredStaff = staff.filter((s) => {
    const user = s.user || {};
    const query = searchQuery.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      s.position?.toLowerCase().includes(query)
    );
  });

  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.user?.active).length;
  const admins = staff.filter(
    (s) => s.user?.role === "ADMIN" || s.user?.role === "MANAGER"
  ).length;

  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">
            Manage team access, roles, and monitor recent activity across your
            shop.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">📥 Export</Button>
          <Button className="bg-primary-500 hover:bg-primary-600">
            + Add New User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Staff</h3>
          <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Active Now</h3>
          <p className="text-3xl font-bold text-gray-900">{activeStaff}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Admins</h3>
          <p className="text-3xl font-bold text-gray-900">{admins}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, role or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              🔍
            </span>
          </div>
          <Button variant="secondary">🔍 Filter</Button>
          <Button variant="secondary">📊 Sort</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-semibold text-gray-600">
                <th className="pb-3">EMPLOYEE</th>
                <th className="pb-3">ROLE</th>
                <th className="pb-3">LAST ACTIVE</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStaff.map((s) => {
                const user = s.user || {};
                const isActive = user.active;
                const lastActive = user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "Never";
                return (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            {user.fullName?.charAt(0) || "U"}
                          </div>
                          {isActive && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.fullName || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                          user.role || s.position
                        )}`}
                      >
                        {s.position || user.role || "Staff"}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{lastActive}</td>
                    <td className="py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          readOnly
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        <span className="ml-3 text-sm text-gray-700">
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </label>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          ✏️
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStaff.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No staff members found
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of{" "}
              {filteredStaff.length} staff members
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
