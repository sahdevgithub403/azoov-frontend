import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices, updateInvoiceStatus } from '../../api/invoiceApi';
import { formatCurrency } from '../../utils/formatCurrency';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchQuery, dateFilter, statusFilter]);

  const fetchInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.data || []);
      setFilteredInvoices(response.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    if (searchQuery) {
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    if (dateFilter === 'This Month') {
      const now = new Date();
      filtered = filtered.filter((inv) => {
        const invDate = new Date(inv.issuedDate);
        return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
      });
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateInvoiceStatus(id, newStatus);
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const totalRevenue = invoices
    .filter((inv) => {
      const now = new Date();
      const invDate = new Date(inv.issuedDate);
      return invDate.getMonth() === now.getMonth() && inv.status === 'Paid';
    })
    .reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0);

  const invoicesIssued = filteredInvoices.length;
  const pendingPayment = invoices
    .filter((inv) => inv.status === 'Pending')
    .reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0);

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

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
          <h1 className="text-3xl font-bold text-gray-900">Invoice History</h1>
          <p className="text-gray-600 mt-1">Manage, view, and track all your shop's transactions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Export CSV</Button>
          <Link to="/invoices/create">
            <Button className="bg-primary-500 hover:bg-primary-600">+ New Invoice</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
              <span>↑</span>
              <span>12%</span>
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Revenue (Oct)</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
              <span>↑</span>
              <span>5%</span>
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Invoices Issued</h3>
          <p className="text-2xl font-bold text-gray-900">{invoicesIssued}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <span className="text-gray-500 text-sm">0%</span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Pending Payment</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingPayment)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by Invoice ID or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
            <option>Draft</option>
          </select>
          <Button variant="secondary" onClick={() => {
            setSearchQuery('');
            setDateFilter('This Month');
            setStatusFilter('All');
          }}>
            Clear All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-semibold text-gray-600">
                <th className="pb-3">INVOICE ID</th>
                <th className="pb-3">CUSTOMER</th>
                <th className="pb-3">DATE</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">TOTAL</th>
                <th className="pb-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 font-medium">{invoice.invoiceNumber}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                        {invoice.customer?.name?.charAt(0) || 'C'}
                      </div>
                      <span>{invoice.customer?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">
                    {new Date(invoice.issuedDate).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                      • {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 font-semibold text-primary-600">
                    {formatCurrency(invoice.total || 0)}
                  </td>
                  <td className="py-4">
                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="text-primary-500 hover:underline text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <p className="text-center py-8 text-gray-500">No invoices found</p>
        )}

        {totalPages > 1 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length}{' '}
              invoices
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

