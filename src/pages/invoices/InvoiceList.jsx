import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getInvoices, updateInvoiceStatus } from "../../api/invoiceApi";
import { formatCurrency } from "../../utils/formatCurrency";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { 
  Search, 
  Plus, 
  FileText, 
  Clock, 
  DollarSign, 
  Filter, 
  Download, 
  Eye, 
  ChevronDown,
  ArrowUpRight 
} from "lucide-react";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("This Month");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchInvoices = useCallback(async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.data || []);
      setFilteredInvoices(response.data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filterInvoices = useCallback(() => {
    let filtered = [...invoices];

    if (searchQuery) {
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    if (dateFilter === "This Month") {
      const now = new Date();
      filtered = filtered.filter((inv) => {
        const invDate = new Date(inv.issuedDate);
        return (
          invDate.getMonth() === now.getMonth() &&
          invDate.getFullYear() === now.getFullYear()
        );
      });
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [invoices, searchQuery, dateFilter, statusFilter]);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchQuery, dateFilter, statusFilter, filterInvoices]);

  // eslint-disable-next-line no-unused-vars
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateInvoiceStatus(id, newStatus);
      fetchInvoices();
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Pending":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "Overdue":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const totalRevenue = invoices
    .filter((inv) => {
      const now = new Date();
      const invDate = new Date(inv.issuedDate);
      return invDate.getMonth() === now.getMonth() && inv.status === "Paid";
    })
    .reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0);

  const invoicesIssued = filteredInvoices.length;
  const pendingPayment = invoices
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0);

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Invoice History</h1>
          <p className="text-gray-500 mt-2">
            Manage, view, and track all your shop's transactions.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <Link to="/invoices/create">
            <button className="px-6 py-2.5 bg-[#189CAB] hover:bg-[#148a9c] text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
              <Plus size={20} strokeWidth={2.5} />
              New Invoice
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center gap-1">
              <ArrowUpRight size={14} /> 12%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">Total Revenue (Oct)</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalRevenue)}
          </p>
        </div>

        {/* Invoices Issued */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 flex items-center gap-1">
              <ArrowUpRight size={14} /> 5%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">Invoices Issued</h3>
          <p className="text-3xl font-bold text-gray-900">{invoicesIssued}</p>
        </div>

        {/* Pending Payment */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
              0%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">Pending Payment</h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(pendingPayment)}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters Section */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Search by Invoice ID or Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-11 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all text-gray-700 placeholder:text-gray-400 font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#189CAB]" size={18} />
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Date Filter */}
              <div className="relative min-w-[160px]">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-2.5 pl-4 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer"
                >
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                  <option>All Time</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              {/* Status Filter */}
              <div className="relative min-w-[160px]">
                 <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                   <Filter size={16} />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer"
                >
                  <option>All</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                  <option>Draft</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setDateFilter("This Month");
                  setStatusFilter("All");
                }}
                className="px-4 py-2.5 text-gray-500 hover:text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">#{invoice.invoiceNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 group-hover:bg-[#189CAB] group-hover:text-white transition-colors">
                        {invoice.customer?.name?.charAt(0) || "C"}
                      </div>
                      <span className="font-medium text-gray-700">{invoice.customer?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium text-sm">
                    {new Date(invoice.issuedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {formatCurrency(invoice.total || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="p-2 text-gray-400 hover:text-[#189CAB] hover:bg-[#189CAB]/10 rounded-lg transition-all flex items-center gap-1 text-sm font-medium"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-16">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
               <FileText size={32} />
             </div>
             <h3 className="text-gray-900 font-semibold mb-1">No invoices found</h3>
             <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredInvoices.length)}</span> of{" "}
              <span className="font-bold text-gray-900">{filteredInvoices.length}</span> invoices
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

export default InvoiceList;