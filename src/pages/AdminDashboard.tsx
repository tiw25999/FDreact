import { useAuthStore } from '../store/auth';
import { useProducts } from '../store/products';
import { useAdminStore } from '../store/admin';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuthStore();
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
    
    const { products } = useProducts();
    const { stats, loading, fetchStats } = useAdminStore();
    
    // Fetch stats when component mounts
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Use stats from API or fallback to local data
    const totalProducts = stats?.totalProducts || products.length;
    const totalOrders = stats?.totalOrders || 0;
    const totalRevenue = stats?.totalRevenue || 0;
    const pendingOrders = stats?.pendingOrders || 0;
    const statusCounts = stats?.statusCounts || {};
    const topSellingProducts = stats?.topSellingProducts || [];
    const recentOrders = stats?.recentOrders || [];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="card-themed p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/admin/products" className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            Manage Products
                        </Link>
                        <Link to="/admin/orders" className="block w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
                            Manage Orders
                        </Link>
                        <Link to="/admin/users" className="block w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                            Manage Users
                        </Link>
                        <Link to="/admin/reports" className="block w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                            View Reports
                        </Link>
                    </div>
                </div>

                {/* Order Status Overview */}
                <div className="card-themed p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Order Status Overview</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Pending</span>
                            <span className="font-semibold text-orange-600">{statusCounts.Pending || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Paid</span>
                            <span className="font-semibold text-blue-600">{statusCounts.Paid || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Shipped</span>
                            <span className="font-semibold text-purple-600">{statusCounts.Shipped || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Completed</span>
                            <span className="font-semibold text-green-600">{statusCounts.Completed || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Selling Products */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
                {topSellingProducts.length > 0 ? (
                    <div className="space-y-3">
                        {topSellingProducts.map((product, index) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                    <img 
                                        src={product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjdmN2Y3Ii8+PHRleHQgeD0iMjAiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='} 
                                        alt={product.name}
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">฿{product.totalRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No sales data available</p>
                )}
            </div>

            {/* Recent Orders */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                {recentOrders.length > 0 ? (
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">#{order.orderNumber}</p>
                                    <p className="text-sm text-gray-500">{order.customer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">฿{order.total.toLocaleString()}</p>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        order.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                                        order.status === 'Paid' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No recent orders</p>
                )}
            </div>
        </div>
    );
}