import { useAuthStore } from '../store/auth';
import { useProducts } from '../store/products';
import { useOrdersStore } from '../store/orders';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuthStore();
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
    
    const { products } = useProducts();
    const { orders } = useOrdersStore();
    
    // Get all orders from all users for admin dashboard
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

    // Calculate statistics
    const totalProducts = products.length;
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.grandTotal, 0);
    const pendingOrders = allOrders.filter(o => o.status === 'Pending').length;
    const completedOrders = allOrders.filter(o => o.status === 'Completed').length;

    // Top selling products
    const productSales = products.map(product => {
        const sales = allOrders.reduce((count, order) => {
            return count + order.items.filter(item => item.product.id === product.id)
                .reduce((itemCount, item) => itemCount + item.quantity, 0);
        }, 0);
        return { ...product, sales };
    }).sort((a, b) => b.sales - a.sales).slice(0, 5);

    // Recent orders
    const recentOrders = allOrders.slice(0, 5);

    return (
        <div className="mx-auto max-w-7xl p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="text-sm text-gray-600">Welcome back, {user.firstName}!</div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-themed p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card-themed p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-3xl font-bold text-green-600">{totalOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card-themed p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-3xl font-bold text-purple-600">฿{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card-themed p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                            <p className="text-3xl font-bold text-orange-600">{pendingOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-themed p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/admin/products" className="btn-primary rounded-full px-4 py-3 text-center">
                            Manage Products
                        </Link>
                        <Link to="/admin/orders" className="btn-primary rounded-full px-4 py-3 text-center">
                            Manage Orders
                        </Link>
                        <Link to="/admin/users" className="btn-primary rounded-full px-4 py-3 text-center">
                            Manage Users
                        </Link>
                        <Link to="/admin/reports" className="btn-primary rounded-full px-4 py-3 text-center">
                            View Reports
                        </Link>
                    </div>
                </div>

                <div className="card-themed p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Order Status Overview</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Pending</span>
                            <span className="font-semibold text-orange-600">{pendingOrders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Paid</span>
                            <span className="font-semibold text-blue-600">{allOrders.filter(o => o.status === 'Paid').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Shipped</span>
                            <span className="font-semibold text-purple-600">{allOrders.filter(o => o.status === 'Shipped').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Completed</span>
                            <span className="font-semibold text-green-600">{completedOrders}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Selling Products */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
                <div className="space-y-3">
                    {productSales.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-green-600">{product.sales} sold</p>
                                <p className="text-sm text-gray-600">฿{product.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                <div className="space-y-3">
                    {recentOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Order #{order.id}</p>
                                <p className="text-sm text-gray-600">{order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">฿{order.grandTotal.toLocaleString()}</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                    order.status === 'Paid' ? 'bg-blue-100 text-blue-600' :
                                    order.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                                    'bg-green-100 text-green-600'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
