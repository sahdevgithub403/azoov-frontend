import React, { useState } from 'react';
import {
    Search,
    Trash2,
    Edit,
    UserCheck,
    MoreVertical,
    Shield,
    ShieldOff
} from 'lucide-react';
import { getUsers, toggleUserRole, deleteUser } from '../../api/adminApi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    React.useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await getUsers();
            const formattedUsers = response.data.map(u => ({
                id: u.id,
                name: u.fullName,
                email: u.email,
                role: u.role,
                status: u.active ? 'Active' : 'Inactive'
            }));
            setUsers(formattedUsers);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user");
            }
        }
    };

    const toggleRole = async (id) => {
        try {
            const response = await toggleUserRole(id);
            const updatedUser = response.data;
            setUsers(users.map(user => {
                if (user.id === id) {
                    return {
                        ...user,
                        role: updatedUser.role
                    };
                }
                return user;
            }));
        } catch (error) {
            console.error("Error toggling role:", error);
            alert("Failed to update role");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                    <p className="text-sm text-gray-500">Manage system users and their roles</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#238898]/20 focus:border-[#238898] w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#238898] to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN'
                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                        : user.role === 'MANAGER'
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                            : 'bg-green-50 text-green-700 border border-green-200'
                                        }`}>
                                        <span className="text-sm">
                                            {user.role === 'ADMIN' ? '👑' : user.role === 'MANAGER' ? '🧑‍💼' : '🧾'}
                                        </span>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></span>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleRole(user.id)}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                                            title={`Change Role (${user.role} → ${user.role === 'ADMIN' ? 'MANAGER' : user.role === 'MANAGER' ? 'SALES' : 'ADMIN'})`}
                                        >
                                            {user.role === 'ADMIN' ? <ShieldOff size={18} /> : <Shield size={18} />}
                                        </button>
                                        <button
                                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Edit User"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete User"
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
        </div>
    );
};

export default UserManagement;
