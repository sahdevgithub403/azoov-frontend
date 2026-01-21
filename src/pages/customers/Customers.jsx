import { useEffect, useState, useCallback } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} from "../../api/customerApi";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data || []);
      setFilteredCustomers(response.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }
    try {
      const response = await searchCustomers(searchQuery);
      setFilteredCustomers(response.data || []);
    } catch (error) {
      console.error("Error searching customers:", error);
    }
  }, [searchQuery, customers]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers, handleSearch]);

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        status: customer.status || "Active",
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await createCustomer(formData);
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const totalCustomers = customers.length;
  const newThisMonth = customers.filter((c) => {
    const created = new Date(c.createdAt);
    const now = new Date();
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;
  const incompleteProfiles = customers.filter(
    (c) => !c.email || !c.phone,
  ).length;

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#F7F9FB]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Customers</h1>
        <p className="text-gray-500 mt-2 font-medium">
          Manage relationships and track client history.
        </p>
      </div>

      {/* Action Bar: Search & Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // Neo-Brutalist Input: Bold Border + Rounded-3xl + Hard Shadow on Focus
            className="w-full px-4 py-3 pl-11 border-2 border-gray-900 rounded-3xl focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-[1px] transition-all placeholder:text-gray-400 font-medium text-gray-900"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#5B8DEF]">
            <svg
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
        </div>
        
        {/* Filter Button */}
        <button className="px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-3xl hover:bg-gray-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[1px]">
          Filter
        </button>

        {/* Add Customer Button: Primary Blue */}
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-[#5B8DEF] hover:bg-[#4a7bdc] border-2 border-gray-900 text-white font-bold rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] transition-all active:shadow-none active:translate-y-[4px]"
        >
          + Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Customers */}
        <div className="bg-white rounded-[20px] p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 bg-blue-50 border-2 border-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">Total Customers</h3>
          <p className="text-4xl font-extrabold text-gray-900">{totalCustomers}</p>
        </div>

        {/* New This Month */}
        <div className="bg-white rounded-[20px] p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 bg-green-50 border-2 border-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-2xl">➕</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">New This Month</h3>
          <p className="text-4xl font-extrabold text-gray-900">+{newThisMonth}</p>
        </div>

        {/* Incomplete Profiles */}
        <div className="bg-white rounded-[20px] p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 bg-orange-50 border-2 border-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">Incomplete Profiles</h3>
          <p className="text-4xl font-extrabold text-gray-900">
            {incompleteProfiles}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[20px] border-2 border-gray-900 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                <input type="checkbox" className="w-4 h-4 rounded border-2 border-gray-400 checked:bg-gray-900" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                CUSTOMER
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                PHONE
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                EMAIL
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-[#F7F9FB] transition-colors group">
                <td className="px-6 py-4">
                  <input type="checkbox" className="w-4 h-4 rounded border-2 border-gray-300" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-900 font-bold group-hover:border-[#5B8DEF] group-hover:text-[#5B8DEF] transition-colors">
                      {customer.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Added{" "}
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {customer.phone || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {customer.email || "-"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      customer.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-orange-50 text-orange-700 border-orange-200"
                    }`}
                  >
                    {customer.status || "Active"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(customer)}
                      className="p-2 text-gray-400 hover:text-[#5B8DEF] hover:bg-[#5B8DEF]/10 rounded-lg transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <p className="text-center py-12 text-gray-400 font-medium">No customers found</p>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               <p className="text-sm text-gray-500 font-bold">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}{" "}
                of {filteredCustomers.length} customers
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Full Name</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Email</label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors font-medium"
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-900 mb-1">Phone</label>
             <input 
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors font-medium"
             />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Address</label>
            <input 
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-0 transition-colors font-medium"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">
              Status
            </label>
            <div className="relative">
                <select
                value={formData.status}
                onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 appearance-none font-medium bg-white"
                >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button 
                type="submit" 
                className="flex-1 px-4 py-2 bg-[#5B8DEF] border-2 border-transparent text-white font-bold rounded-xl hover:bg-[#4a7bdc] shadow-md hover:shadow-lg transition-all"
            >
              {editingCustomer ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;