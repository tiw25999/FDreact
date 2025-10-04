import { useMemo, useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useProducts } from '../store/products';
import { useAdminStore } from '../store/admin';
import CustomSelect from '../components/CustomSelect';

type PaymentMethod = 'Bank Transfer' | 'QR PromptPay' | 'Credit Card' | string;

// Removed readAllOrders function - now using API data

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d: Date) { const x = new Date(d); x.setHours(23,59,59,999); return x; }
function formatYMD(d: Date) { return d.toISOString().slice(0,10); }

export default function AdminReports() {
    const { user } = useAuthStore();
    const { products } = useProducts();
    const { orders: allOrders, loading, fetchOrders } = useAdminStore();
    
    // Fetch orders when component mounts
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const [range, setRange] = useState<'7d' | '30d' | '90d' | 'custom'>('7d');
    const [from, setFrom] = useState<string>(() => formatYMD(new Date(Date.now() - 6*24*60*60*1000)));
    const [to, setTo] = useState<string>(() => formatYMD(new Date()));

    // update dates when preset changes
    function onPresetChange(val: '7d' | '30d' | '90d' | 'custom') {
        setRange(val);
        if (val !== 'custom') {
            const days = val === '7d' ? 7 : val === '30d' ? 30 : 90;
            const now = new Date();
            const start = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
            setFrom(formatYMD(start));
            setTo(formatYMD(now));
        }
    }

    const filtered = useMemo(() => {
        const fromDate = startOfDay(new Date(from));
        const toDate = endOfDay(new Date(to));
        return allOrders.filter((o: any) => {
            const t = new Date(o.createdAt).getTime();
            return t >= fromDate.getTime() && t <= toDate.getTime();
        });
    }, [allOrders, from, to]);

    // 1) Sales by time (sum grandTotal per day)
    const salesByDay = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach((o: any) => {
            const key = formatYMD(new Date(o.createdAt));
            map[key] = (map[key] || 0) + o.grandTotal;
        });
        return Object.keys(map).sort().map(k => ({ date: k, amount: map[k] }));
    }, [filtered]);

    // 2) Orders per day and per week
    const ordersPerDay = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach((o: any) => {
            const key = formatYMD(new Date(o.createdAt));
            map[key] = (map[key] || 0) + 1;
        });
        return Object.keys(map).sort().map(k => ({ date: k, count: map[k] }));
    }, [filtered]);

    const ordersPerWeek = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach((o: any) => {
            const d = new Date(o.createdAt);
            const onejan = new Date(d.getFullYear(), 0, 1);
            const week = Math.ceil((((d as any) - (onejan as any)) / 86400000 + onejan.getDay() + 1) / 7);
            const key = `${d.getFullYear()}-W${week}`;
            map[key] = (map[key] || 0) + 1;
        });
        return Object.keys(map).sort().map(k => ({ week: k, count: map[k] }));
    }, [filtered]);

    // 3) Top-selling products/brands
    const topProducts = useMemo(() => {
        const productCount: Record<string, number> = {};
        filtered.forEach((o: any) => {
            o.items.forEach((it: any) => {
                productCount[it.product.id] = (productCount[it.product.id] || 0) + it.quantity;
            });
        });
        return products
            .map(p => ({ product: p, qty: productCount[p.id] || 0 }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 10);
    }, [filtered, products]);

    const topBrands = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach((o: any) => {
            o.items.forEach((it: any) => {
                map[it.product.brand] = (map[it.product.brand] || 0) + it.quantity;
            });
        });
        return Object.entries(map).map(([brand, qty]) => ({ brand, qty })).sort((a, b) => b.qty - a.qty).slice(0, 10);
    }, [filtered]);

    // 4) Payment methods breakdown
    const paymentBreakdown = useMemo(() => {
        const map: Record<string, number> = {};
        filtered.forEach((o: any) => {
            const key: PaymentMethod = o.payment;
            map[key] = (map[key] || 0) + 1;
        });
        const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
        return Object.entries(map).map(([method, count]) => ({ method, count, pct: Math.round((count as number) * 100 / total) }));
    }, [filtered]);

    // 5) Revenue by status
    const revenueByStatus = useMemo(() => {
        const statusRevenue: Record<string, number> = {};
        filtered.forEach((o: any) => {
            statusRevenue[o.status] = (statusRevenue[o.status] || 0) + o.grandTotal;
        });
        return Object.entries(statusRevenue)
            .map(([status, revenue]) => ({ status, revenue }))
            .sort((a, b) => b.revenue - a.revenue);
    }, [filtered]);

    // 6) Average order value
    const avgOrderValue = useMemo(() => {
        if (filtered.length === 0) return 0;
        const total = filtered.reduce((sum, o) => sum + o.grandTotal, 0);
        return total / filtered.length;
    }, [filtered]);

    // 7) Total revenue and orders
    const totalRevenue = useMemo(() => {
        return filtered.reduce((sum, o) => sum + o.grandTotal, 0);
    }, [filtered]);

    const totalOrders = useMemo(() => {
        return filtered.length;
    }, [filtered]);

    // Check admin role after all hooks
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reports...</p>
                </div>
            </div>
        );
    }

    // CSV export
    function exportCSV() {
        const headers = ['Date', 'Order ID', 'Customer', 'Status', 'Payment', 'Items', 'Subtotal', 'VAT', 'Shipping', 'Total'];
        const rows = filtered.map(o => [
            new Date(o.createdAt).toLocaleDateString(),
            o.orderNumber || o.id,
            o.customer?.name || 'N/A',
            o.status,
            o.payment || 'N/A',
            o.items?.length || 0,
            o.subtotal,
            o.vat,
            o.shipping,
            o.grandTotal
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${from}-to-${to}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="mx-auto max-w-7xl p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            options={[
                                { value: '7d', label: 'Last 7 days' },
                                { value: '30d', label: 'Last 30 days' },
                                { value: '90d', label: 'Last 90 days' },
                                { value: 'custom', label: 'Custom range' }
                            ]}
                            value={range}
                            onChange={(val) => onPresetChange(val as any)}
                            placeholder="Select period..."
                            allowCustomInput={false}
                        />
                        {range === 'custom' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="px-3 py-2 border rounded-lg text-sm"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>
                        )}
                    </div>
                    <button onClick={exportCSV} className="btn-primary rounded-full px-5 py-2">Export CSV</button>
                    <Link to="/admin" className="text-blue-600 hover:text-blue-700">← Back to Dashboard</Link>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-themed p-6 rounded-2xl">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-purple-600">฿{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="card-themed p-6 rounded-2xl">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
                </div>
                <div className="card-themed p-6 rounded-2xl">
                    <p className="text-sm text-gray-600">Avg. Order Value</p>
                    <p className="text-3xl font-bold text-green-600">฿{(totalOrders ? Math.round(totalRevenue/totalOrders) : 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Sales by day */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Sales by Day</h2>
                {salesByDay.length > 0 ? (
                    <div className="space-y-2">
                        {salesByDay.map((day) => (
                            <div key={day.date} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                                <span className="text-lg font-semibold text-purple-600">฿{day.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No sales data for selected period</p>
                )}
            </div>

            {/* Orders per day */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Orders per Day</h2>
                {ordersPerDay.length > 0 ? (
                    <div className="space-y-2">
                        {ordersPerDay.map((day) => (
                            <div key={day.date} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                                <span className="text-lg font-semibold text-blue-600">{day.count} orders</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No orders data for selected period</p>
                )}
            </div>

            {/* Top products */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
                {topProducts.length > 0 ? (
                    <div className="space-y-2">
                        {topProducts.map((item, index) => (
                            <div key={item.product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                    <span className="font-medium">{item.product.name}</span>
                                </div>
                                <span className="text-lg font-semibold text-green-600">{item.qty} sold</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No product sales data for selected period</p>
                )}
            </div>

            {/* Top brands */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Top Selling Brands</h2>
                {topBrands.length > 0 ? (
                    <div className="space-y-2">
                        {topBrands.map((item, index) => (
                            <div key={item.brand} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                    <span className="font-medium">{item.brand}</span>
                                </div>
                                <span className="text-lg font-semibold text-green-600">{item.qty} items sold</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No brand sales data for selected period</p>
                )}
            </div>

            {/* Payment breakdown */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                {paymentBreakdown.length > 0 ? (
                    <div className="space-y-2">
                        {paymentBreakdown.map((item) => (
                            <div key={item.method} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium">{item.method}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">{item.pct}%</span>
                                    <span className="text-lg font-semibold text-blue-600">{item.count} orders</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No payment data for selected period</p>
                )}
            </div>

            {/* Revenue by status */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Revenue by Order Status</h2>
                {revenueByStatus.length > 0 ? (
                    <div className="space-y-2">
                        {revenueByStatus.map((item) => (
                            <div key={item.status} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium">{item.status}</span>
                                <span className="text-lg font-semibold text-purple-600">฿{item.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No revenue data for selected period</p>
                )}
            </div>
        </div>
    );
}