import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getInvoices } from "../../api/invoiceApi";
import { getProducts } from "../../api/productApi";
import { getCustomers } from "../../api/customerApi";
import { formatCurrency } from "../../utils/formatCurrency";
import Loader from "../../components/common/Loader";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    todaySales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockItems: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("This Year");

  const fetchDashboardData = useCallback(async () => {
    try {
      const [invoicesRes, productsRes, customersRes] = await Promise.all([
        getInvoices(),
        getProducts(),
        getCustomers(),
      ]);

      const invoices = invoicesRes.data || [];
      const products = productsRes.data || [];
      const customers = customersRes.data || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySales = invoices
        .filter((inv) => {
          const invDate = new Date(inv.issuedDate);
          invDate.setHours(0, 0, 0, 0);
          return invDate.getTime() === today.getTime() && inv.status === "Paid";
        })
        .reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0);

      const lowStockItems = products.filter(
        (p) => p.stockLevel <= (p.lowStockThreshold || 10)
      ).length;

      setStats({
        todaySales,
        totalProducts: products.length,
        totalCustomers: customers.length,
        lowStockItems,
      });

      const recent = invoices
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
        .map((inv) => ({
          id: inv.invoiceNumber,
          time: getTimeAgo(new Date(inv.createdAt)),
          amount: parseFloat(inv.total || 0),
        }));
      setRecentSales(recent);

      // Generate monthly revenue data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const revenueData = months.map((month, index) => {
        const monthInvoices = invoices.filter((inv) => {
          const invDate = new Date(inv.issuedDate);
          return invDate.getMonth() === index && inv.status === "Paid";
        });
        const income = monthInvoices.reduce(
          (sum, inv) => sum + parseFloat(inv.total || 0),
          0
        );
        return { month, income, potential: 12000 };
      });
      setMonthlyRevenue(revenueData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Here is your daily shop overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
            <span>📅</span>
            <span>Oct 24, 2023</span>
          </button>
          <Link
            to="/invoices/create"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
          >
            <span>+</span>
            <span>New Sale</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
              <span>↑</span>
              <span>+5%</span>
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Today's Sales</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.todaySales)}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <span className="text-green-500 text-sm font-semibold">
              +12 new
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalProducts}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
              <span>↑</span>
              <span>+8%</span>
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Customers</h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalCustomers}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <span className="text-yellow-600 text-xs font-semibold">
              Action needed
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Low Stock Items</h3>
          <p className="text-2xl font-bold text-gray-900">
            {stats.lowStockItems}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Monthly Revenue
              </h2>
              <p className="text-sm text-gray-600">
                Income over the last 6 months
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedYear("This Year")}
                className={`px-3 py-1 rounded text-sm ${selectedYear === "This Year"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100"
                  }`}
              >
                This Year
              </button>
              <button
                onClick={() => setSelectedYear("Last Year")}
                className={`px-3 py-1 rounded text-sm ${selectedYear === "Last Year"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100"
                  }`}
              >
                Last Year
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="income" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sales</h2>
          <div className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">🛍️</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{sale.id}
                      </p>
                      <p className="text-sm text-gray-500">{sale.time}</p>
                    </div>
                  </div>
                  <p className="text-green-500 font-semibold">
                    +{formatCurrency(sale.amount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent sales</p>
            )}
          </div>
          <Link
            to="/invoices"
            className="block text-center mt-4 text-primary-500 hover:underline text-sm"
          >
            View all transactions
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <p>© 2024 Mini ERP. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-gray-700">
            Support
          </Link>
          <Link to="#" className="hover:text-gray-700">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};
