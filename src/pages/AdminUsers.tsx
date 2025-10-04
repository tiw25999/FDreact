import { useState, useMemo, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { useAdminStore } from '../store/admin';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';

export default function AdminUsers() {
    const { user } = useAuthStore();
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
    
    const { users, loading, fetchUsers, createUser, updateUser, deleteUser } = useAdminStore();
    
    // Fetch users when component mounts
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'user'
    });

    // Use users from API - no need for localStorage

    const allUsers = users;

    const filteredUsers = allUsers
        .filter(user => {
            const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                user.last_name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'name-a':
                    return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
                case 'name-z':
                    return `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`);
                default:
                    return 0;
            }
        });

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            // Find the user to get their current data
            const user = users.find(u => u.id === userId);
            if (!user) return;

            await updateUser(userId, {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone || '',
                role: newRole
            });
        } catch (error: any) {
            console.error('Error updating user role:', error);
            alert(error.response?.data?.error || 'Failed to update user role');
        }
    };

    const handleAddUser = async () => {
        // Validate required fields
        if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate password length
        if (newUser.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        try {
            await createUser({
                first_name: newUser.firstName,
                last_name: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                password: newUser.password,
                role: newUser.role
            });
            
            setShowAddModal(false);
            setNewUser({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'user' });
        } catch (error: any) {
            console.error('Error adding user:', error);
            alert(error.response?.data?.error || 'Failed to add user');
        }
    };

    const handleEditUser = (user: any) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleUpdateUser = async () => {
        try {
            await updateUser(editingUser.id, {
                first_name: editingUser.first_name,
                last_name: editingUser.last_name,
                email: editingUser.email,
                phone: editingUser.phone,
                role: editingUser.role
            });
            
            setShowEditModal(false);
            setEditingUser(null);
        } catch (error: any) {
            console.error('Error updating user:', error);
            alert(error.response?.data?.error || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
            } catch (error: any) {
                console.error('Error deleting user:', error);
                alert(error.response?.data?.error || 'Failed to delete user');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">User Management</h1>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary rounded-full px-4 py-2"
                    >
                        + Add User
                    </button>
                    <Link to="/admin" className="text-blue-600 hover:text-blue-700">← Back to Dashboard</Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-themed p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-3xl font-bold text-blue-600">{allUsers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card-themed p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Regular Users</p>
                            <p className="text-3xl font-bold text-green-600">{allUsers.filter(u => u.role === 'user').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card-themed p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Admins</p>
                            <p className="text-3xl font-bold text-purple-600">{allUsers.filter(u => u.role === 'admin').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card-themed p-6 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                        <CustomSelect
                            options={[
                                { value: "all", label: "All Roles" },
                                { value: "user", label: "Users" },
                                { value: "admin", label: "Admins" }
                            ]}
                            value={roleFilter}
                            onChange={setRoleFilter}
                            placeholder="Select role..."
                            allowCustomInput={false}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <CustomSelect
                            options={[
                                { value: "newest", label: "Newest First" },
                                { value: "oldest", label: "Oldest First" },
                                { value: "name-a", label: "Name: A-Z" },
                                { value: "name-z", label: "Name: Z-A" }
                            ]}
                            value={sortBy}
                            onChange={setSortBy}
                            placeholder="Sort by..."
                            allowCustomInput={false}
                        />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card-themed rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Addresses</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.email} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <span className="text-gray-600 font-semibold">
                                                        {user.first_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.phone || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        N/A
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 rounded border"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-700 text-xs px-2 py-1 rounded border"
                                            >
                                                Delete
                                            </button>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                className="text-xs border rounded px-2 py-1 focus:ring-1 focus:ring-blue-300 outline-none"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No users found</div>
                    <div className="text-gray-400 text-sm">Try adjusting your search or filter criteria</div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-xl font-semibold mb-4">Add New User</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={newUser.firstName}
                                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={newUser.lastName}
                                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                    placeholder="Enter password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAddUser}
                                className="btn-primary rounded-full px-4 py-2 flex-1"
                            >
                                Add User
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="border rounded-full px-4 py-2 flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && editingUser && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowEditModal(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={editingUser.first_name || ''}
                                    onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={editingUser.last_name || ''}
                                    onChange={(e) => setEditingUser({...editingUser, last_name: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    disabled
                                    className="w-full border rounded-full px-4 py-2 bg-gray-100 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={editingUser.phone || ''}
                                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                                    className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleUpdateUser}
                                className="btn-primary rounded-full px-4 py-2 flex-1"
                            >
                                Update User
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="border rounded-full px-4 py-2 flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
