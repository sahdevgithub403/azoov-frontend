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
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  UserPlus, 
  AlertCircle, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  MapPin,
  ChevronDown
} from "lucide-react";

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-gray-500 mt-2">
            Manage relationships and track client history.
          </p>
        </div>
      </div>

      {/* Action Bar: Search & Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-11 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all text-gray-700 placeholder:text-gray-400 font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#189CAB]" size={18} />
        </div>
        
        {/* Filter Button */}
        <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm">
          <Filter size={18} />
          <span>Filter</span>
        </button>

        {/* Add Customer Button */}
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-[#189CAB] hover:bg-[#148a9c] text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={2.5} />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">All Time</span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">Total Customers</h3>
          <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
        </div>

        {/* New This Month */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <UserPlus size={24} />
            </div>
             <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
              +{newThisMonth}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">New This Month</h3>
          <p className="text-3xl font-bold text-gray-900">{newThisMonth}</p>
        </div>

        {/* Incomplete Profiles */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
             <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100">
              Needs Attention
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">Incomplete Profiles</h3>
          <p className="text-3xl font-bold text-gray-900">
            {incompleteProfiles}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left w-10">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#189CAB] focus:ring-[#189CAB]" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#189CAB] focus:ring-[#189CAB]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold group-hover:bg-[#189CAB] group-hover:text-white transition-colors">
                        {customer.name?.charAt(0).toUpperCase() || "C"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500 font-medium">
                          ID: {customer.id.toString().slice(0, 6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        {customer.phone || "-"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        customer.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {customer.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(customer)}
                        className="p-2 text-gray-400 hover:text-[#189CAB] hover:bg-[#189CAB]/10 rounded-lg transition-all"
                        title="Edit Customer"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Customer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-16">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
               <Users size={32} />
             </div>
             <h3 className="text-gray-900 font-semibold mb-1">No customers found</h3>
             <p className="text-gray-500 text-sm">Try adjusting your search query.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</span> of{" "}
              <span className="font-bold text-gray-900">{filteredCustomers.length}</span> customers
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <div className="relative group">
               <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all text-gray-700 font-medium placeholder:text-gray-400"
                />
                <Users className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <div className="relative group">
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all text-gray-700 font-medium placeholder:text-gray-400"
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Phone</label>
                <div className="relative group">
                   <input 
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all text-gray-700 font-medium placeholder:text-gray-400"
                   />
                   <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Address</label>
            <div className="relative group">
               <input 
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, Springfield"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all text-gray-700 font-medium placeholder:text-gray-400"
                />
                <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Status
            </label>
            <div className="relative">
                <select
                value={formData.status}
                onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] appearance-none font-medium text-gray-700 bg-white cursor-pointer"
                >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
                type="submit" 
                className="flex-1 px-4 py-2.5 bg-[#189CAB] border border-transparent text-white font-semibold rounded-xl hover:bg-[#148a9c] shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
            >
              {editingCustomer ? "Update Customer" : "Create Customer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;