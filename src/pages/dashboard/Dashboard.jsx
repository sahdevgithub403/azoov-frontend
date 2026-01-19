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

// Custom Icons to match the specific visual style of the image
const Icons = {
  Box: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 16V8C20.9996 7.64927 20.9049 7.30538 20.725 7.00002L12.725 2.40002C12.5034 2.27276 12.2536 2.20557 12 2.20557C11.7464 2.20557 11.4966 2.27276 11.275 2.40002L3.275 7.00002C3.09509 7.30538 3.00036 7.64927 3 8V16C3.00036 16.3508 3.09509 16.6946 3.275 17L11.275 21.6C11.4966 21.7273 11.7464 21.7945 12 21.7945C12.2536 21.7945 12.5034 21.7273 12.725 21.6L20.725 17C20.9049 16.6946 20.9996 16.3508 21 16Z" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22.08V12" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Warning: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8V12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 16H12.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Dollar: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1V23" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3688 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Users: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
};

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
        .slice(0, 5)
        .map((inv) => ({
          id: inv.invoiceNumber,
          time: getTimeAgo(new Date(inv.createdAt)),
          amount: parseFloat(inv.total || 0),
          status: inv.status
        }));
      setRecentSales(recent);

      // Generate monthly revenue data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const revenueData = months.map((month, index) => {
        const monthInvoices = invoices.filter((inv) => {
          const invDate = new Date(inv.issuedDate);
          return invDate.getMonth() === index && inv.status === "Paid";
        });
        const income = monthInvoices.reduce(
          (sum, inv) => sum + parseFloat(inv.total || 0),
          0
        );
        return { month, income };
      });
      // Just showing first 7 months for UI cleaner look like image
      setMonthlyRevenue(revenueData.slice(0, 7));
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
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F7F9FB]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] p-8 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Track sales, stock levels and manage your shop daily.</p>
        </div>
        <div className="flex items-center gap-3">
            {/* Filter mimicking the dropdowns in the image */}
            <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 shadow-sm cursor-pointer hover:border-gray-300">
                <span>📅 This Month</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4L6 8L10 4"/></svg>
            </div>

            <Link
                to="/invoices/create"
                className="bg-[#2C9DA6] hover:bg-[#238a92] text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-[#2C9DA6]/20 flex items-center gap-2 transition-all active:scale-95"
            >
                <Icons.Plus />
                <span>New Sale</span>
            </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Total Products */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-medium mb-1">Total Products</p>
            <div className="flex items-end gap-2 mb-1">
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</h3>
                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full mb-1">+5%</span>
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 scale-110">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                <Icons.Box />
            </div>
          </div>
        </div>

        {/* Card 2: Low Stock (Warning) */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-medium mb-1">Low Stock Items</p>
            <div className="flex items-end gap-2 mb-1">
                <h3 className="text-3xl font-bold text-gray-900">{stats.lowStockItems}</h3>
                <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2 py-1 rounded-full mb-1">Action Needed</span>
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
             {/* Using a subtle warning background */}
             <div className="w-16 h-16 bg-orange-50/50 rounded-2xl flex items-center justify-center">
                <Icons.Warning />
             </div>
          </div>
        </div>

        {/* Card 3: Total Value (Revenue) */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
            <div className="flex items-end gap-2 mb-1">
                <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(stats.todaySales)}</h3>
                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full mb-1">+12%</span>
            </div>
          </div>
           <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 scale-110">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                <Icons.Dollar />
            </div>
          </div>
        </div>

         {/* Card 4: Customers */}
         <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-medium mb-1">Total Customers</p>
             <div className="flex items-end gap-2 mb-1">
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</h3>
                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full mb-1">+2 new</span>
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 scale-110">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                <Icons.Users />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section - Styled to look like the main table card in the image */}
        <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
              <p className="text-sm text-gray-500">Monthly income overview</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                    onClick={() => setSelectedYear("This Year")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selectedYear === "This Year" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    This Year
                </button>
                <button 
                    onClick={() => setSelectedYear("Last Year")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selectedYear === "Last Year" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Last Year
                </button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                    dataKey="income" 
                    fill="#2C9DA6" 
                    radius={[4, 4, 0, 0]} 
                    barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Sales List - Styled to look clean and contained */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <Link to="/invoices" className="text-sm text-[#2C9DA6] font-medium hover:underline">View All</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                <div key={sale.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-[#F7F9FB] transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Order #{sale.id}</p>
                            <p className="text-xs text-gray-400">{sale.time}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">+{formatCurrency(sale.amount)}</p>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{sale.status}</span>
                    </div>
                </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p>No recent sales found</p>
                </div>
            )}
          </div>
          
          {/* Pagination Placeholder (Visual Only) */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50" disabled>
                ←
            </button>
            <span className="text-sm text-gray-600 font-medium">Page 1</span>
             <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                →
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-xs text-gray-400 px-2">
        <p>© 2024 MiniShop Inc. All rights reserved.</p>
        <div className="flex gap-6">
            <Link to="#" className="hover:text-gray-600">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-600">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};