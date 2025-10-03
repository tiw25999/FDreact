import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useOrdersStore } from '../store/orders';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';

export default function AdminOrders() {
    const { user } = useAuthStore();
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
    
    const { orders, updateOrderStatus } = useOrdersStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');

    // Get all orders from all users for admin
    const getAllOrders = () => {
        try {
            const allOrders: any[] = [];
            const profiles = localStorage.getItem('etech_profiles');
            if (profiles) {
                const profilesData = JSON.parse(profiles);
                Object.keys(profilesData).forEach(email => {
                    const userOrders = localStorage.getItem(`etech_orders_${email}`);
                    if (userOrders) {
                        const orders = JSON.parse(userOrders);
                        allOrders.push(...orders);
                    }
                });
            }
            return allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch {
            return [];
        }
    };
    
    const allOrders = getAllOrders();

    const filteredOrders = allOrders
        .filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                order.address.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                order.address.lastName.toLowerCase().includes(searchQuery.toLowerCase());
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

    const handleStatusUpdate = (orderId: string, newStatus: string) => {
        try {
            const profiles = localStorage.getItem('etech_profiles');
            if (!profiles) return;
            const profilesData = JSON.parse(profiles);
            
            // Find which user owns this order and update it
            for (const email of Object.keys(profilesData)) {
                const userOrders = localStorage.getItem(`etech_orders_${email}`);
                if (userOrders) {
                    const orders = JSON.parse(userOrders);
                    const orderIndex = orders.findIndex((o: any) => o.id === orderId);
                    if (orderIndex !== -1) {
                        orders[orderIndex].status = newStatus;
                        localStorage.setItem(`etech_orders_${email}`, JSON.stringify(orders));
                        break;
                    }
                }
            }
            
            // Refresh the page to show updated data
            window.location.reload();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleDeleteOrder = (orderId: string) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                const profiles = localStorage.getItem('etech_profiles');
                if (!profiles) return;
                const profilesData = JSON.parse(profiles);
                
                // Find which user owns this order and delete it
                for (const email of Object.keys(profilesData)) {
                    const userOrders = localStorage.getItem(`etech_orders_${email}`);
                    if (userOrders) {
                        const orders = JSON.parse(userOrders);
                        const orderIndex = orders.findIndex((o: any) => o.id === orderId);
                        if (orderIndex !== -1) {
                            orders.splice(orderIndex, 1);
                            localStorage.setItem(`etech_orders_${email}`, JSON.stringify(orders));
                            break;
                        }
                    }
                }
                
                // Refresh the page to show updated data
                window.location.reload();
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
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
                                        <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                                            #{order.id}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.address.firstName} {order.address.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">{order.address.phone}</div>
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
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 rounded border"
                                            >
                                                View
                                            </Link>
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
