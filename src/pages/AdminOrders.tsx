import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { useAdminStore } from '../store/admin';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';

export default function AdminOrders() {
    const { user } = useAuthStore();
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
    
    const { orders, loading, fetchOrders, updateOrderStatus, deleteOrder } = useAdminStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');

    // Fetch orders when component mounts
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = orders
        .filter(order => {
            const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'amount-high':
                    return b.grandTotal - a.grandTotal;
                case 'amount-low':
                    return a.grandTotal - b.grandTotal;
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            // Refresh orders after update
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await deleteOrder(orderId);
                // Orders will be automatically updated in the store
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    const handleViewOrder = (orderId: string) => {
        navigate(`/orders/${orderId}`);
    };

    return (
        <div className="mx-auto max-w-7xl p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Order Management</h1>
                <Link to="/admin" className="text-blue-600 hover:text-blue-700">← Back to Dashboard</Link>
            </div>

            {/* Filters and Search */}
            <div className="card-themed p-6 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                        <input
                            type="text"
                            placeholder="Search by order ID or customer name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                        <CustomSelect
                            options={[
                                { value: "all", label: "All Status" },
                                { value: "pending", label: "Pending" },
                                { value: "paid", label: "Paid" },
                                { value: "shipped", label: "Shipped" },
                                { value: "completed", label: "Completed" }
                            ]}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            placeholder="Select status..."
                            allowCustomInput={false}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <CustomSelect
                            options={[
                                { value: "newest", label: "Newest First" },
                                { value: "oldest", label: "Oldest First" },
                                { value: "amount-high", label: "Amount: High to Low" },
                                { value: "amount-low", label: "Amount: Low to High" }
                            ]}
                            value={sortBy}
                            onChange={setSortBy}
                            placeholder="Sort by..."
                            allowCustomInput={false}
                        />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card-themed rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => handleViewOrder(order.id)} 
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            #{order.orderNumber}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.customer.name}
                                            </div>
                                            <div className="text-sm text-gray-500">{order.customer.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.items.length} items
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ฿{order.grandTotal.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                            order.status === 'Paid' ? 'bg-blue-100 text-blue-600' :
                                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className="text-xs border rounded px-2 py-1 focus:ring-1 focus:ring-blue-300 outline-none"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            <button
                                                onClick={() => handleViewOrder(order.id)}
                                                className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 rounded border"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="text-red-600 hover:text-red-700 text-xs px-2 py-1 rounded border"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No orders found</div>
                    <div className="text-gray-400 text-sm">Try adjusting your search or filter criteria</div>
                </div>
            )}
        </div>
    );
}
