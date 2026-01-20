import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    DollarSign,
    Activity,
    TrendingUp,
    Package,
    FileText,
    AlertCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

import { getDashboardStats } from '../../api/adminApi';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDashboardStats();
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            title: "Total Revenue",
            value: dashboardData ? `$${dashboardData.totalRevenue}` : "...",
            change: "+12.5%",
            isPositive: true,
            icon: DollarSign,
            color: "bg-green-500"
        },
        {
            title: "Active Users",
            value: dashboardData ? dashboardData.activeUsers : "...",
            change: "+8.2%",
            isPositive: true,
            icon: Users,
            color: "bg-blue-500"
        },
        {
            title: "Total Orders",
            value: dashboardData ? dashboardData.totalOrders : "...",
            change: "-2.4%",
            isPositive: false,
            icon: Package,
            color: "bg-purple-500"
        },
        {
            title: "System Health",
            value: dashboardData ? dashboardData.systemHealth : "...",
            change: "+0.1%",
            isPositive: true,
            icon: Activity,
            color: "bg-orange-500"
        }
    ];



    const revenueData = [
        { name: 'Mon', revenue: 4000, orders: 240 },
        { name: 'Tue', revenue: 3000, orders: 139 },
        { name: 'Wed', revenue: 2000, orders: 980 },
        { name: 'Thu', revenue: 2780, orders: 390 },
        { name: 'Fri', revenue: 1890, orders: 480 },
        { name: 'Sat', revenue: 2390, orders: 380 },
        { name: 'Sun', revenue: 3490, orders: 430 },
    ];

    const categoryData = [
        { name: 'Electronics', value: 400 },
        { name: 'Clothing', value: 300 },
        { name: 'Groceries', value: 300 },
        { name: 'Books', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const recentActivities = [
        { id: 1, user: "John Doe", action: "Created new invoice", time: "2 mins ago", icon: FileText, color: "text-blue-500" },
        { id: 2, user: "Sarah Smith", action: "Updated inventory", time: "15 mins ago", icon: Package, color: "text-purple-500" },
        { id: 3, user: "System", action: "Backup completed", time: "1 hour ago", icon: AlertCircle, color: "text-green-500" },
        { id: 4, user: "Mike Johnson", action: "Refund processed", time: "2 hours ago", icon: DollarSign, color: "text-red-500" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500">System overview and analytics</p>
                </div>
                <button className="px-4 py-2 bg-[#238898] text-white rounded-lg hover:bg-[#1a6672] transition-colors flex items-center gap-2">
                    <TrendingUp size={18} />
                    <span>Generate Report</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-600`}>
                                <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Analytics</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#238898" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#238898" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#238898" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Category Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {categoryData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-sm text-gray-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recent System Activity</h3>
                <div className="space-y-4">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                            <div className={`p-3 rounded-full bg-gray-100 ${activity.color}`}>
                                <activity.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">{activity.user}</h4>
                                <p className="text-sm text-gray-500">{activity.action}</p>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
