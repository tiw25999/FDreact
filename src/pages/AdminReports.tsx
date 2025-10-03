import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useProducts } from '../store/products';
import CustomSelect from '../components/CustomSelect';

type PaymentMethod = 'Bank Transfer' | 'QR PromptPay' | 'Credit Card' | string;

function readAllOrders() {
    try {
        const allOrders: any[] = [];
        const profiles = localStorage.getItem('etech_profiles');
        if (profiles) {
            const profilesData = JSON.parse(profiles);
            Object.keys(profilesData).forEach((email: string) => {
                const userOrders = localStorage.getItem(`etech_orders_${email}`);
                if (userOrders) {
                    const orders = JSON.parse(userOrders);
                    allOrders.push(...orders);
                }
            });
        }
        return allOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
        return [] as any[];
    }
}

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d: Date) { const x = new Date(d); x.setHours(23,59,59,999); return x; }
function formatYMD(d: Date) { return d.toISOString().slice(0,10); }

export default function AdminReports() {
    const { user } = useAuthStore();
    const { products } = useProducts();
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

    const [range, setRange] = useState<'7d' | '30d' | '90d' | 'custom'>('7d');
    const [from, setFrom] = useState<string>(() => formatYMD(new Date(Date.now() - 6*24*60*60*1000)));
    const [to, setTo] = useState<string>(() => formatYMD(new Date()));

    const allOrders = useMemo(() => readAllOrders(), []);

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

    // CSV export
    function exportCSV() {
        const headers = ['Date','Order ID','Customer','Items','Subtotal','VAT','Shipping','Grand Total','Payment','Status'];
        const rows = filtered.map((o: any) => [
            new Date(o.createdAt).toISOString(),
            o.id,
            `${o.address.firstName} ${o.address.lastName}`,
            String(o.items.length),
            String(o.subtotal),
            String(o.vat),
            String(o.shipping),
            String(o.grandTotal),
            o.payment,
            o.status,
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reports_${from}_${to}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const totalRevenue = filtered.reduce((s: number, o: any) => s + o.grandTotal, 0);
    const totalOrders = filtered.length;

    return (
        <div className="mx-auto max-w-7xl p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <Link to="/admin" className="text-blue-600 hover:text-blue-700">← Back to Dashboard</Link>
            </div>

            {/* Filters */}
            <div className="card-themed p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Preset</label>
                        <CustomSelect
                            options={[
                                { value: "7d", label: "Last 7 days" },
                                { value: "30d", label: "Last 30 days" },
                                { value: "90d", label: "Last 90 days" },
                                { value: "custom", label: "Custom" }
                            ]}
                            value={range}
                            onChange={(value) => onPresetChange(value as any)}
                            placeholder="Select range..."
                            className="w-40"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">From</label>
                        <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border rounded-full px-3 py-2" />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">To</label>
                        <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border rounded-full px-3 py-2" />
                    </div>
                    <div className="flex-1" />
                    <button onClick={exportCSV} className="btn-primary rounded-full px-5 py-2">Export CSV</button>
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
                    <div className="grid grid-cols-12 gap-2 items-end h-40">
                        {salesByDay.map(row => (
                            <div key={row.date} className="col-span-1">
                                <div className="bg-blue-500 rounded-t-md" style={{height: `${Math.min(100, Math.round((row.amount/Math.max(1,totalRevenue))*100))}%`}} />
                                <div className="text-[10px] text-gray-600 mt-1 text-center">{row.date.slice(5)}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <div className="text-lg mb-2">No sales data</div>
                            <div className="text-sm">Try selecting a different date range</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Orders per day/week */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-themed p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Orders per Day</h2>
                    {ordersPerDay.length > 0 ? (
                        <div className="grid grid-cols-12 gap-2 items-end h-40">
                            {ordersPerDay.map(row => (
                                <div key={row.date} className="col-span-1">
                                    <div className="bg-emerald-500 rounded-t-md" style={{height: `${Math.min(100, row.count*12)}%`}} />
                                    <div className="text-[10px] text-gray-600 mt-1 text-center">{row.date.slice(5)}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <div className="text-lg mb-2">No orders data</div>
                                <div className="text-sm">Try selecting a different date range</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="card-themed p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Orders per Week</h2>
                    <div className="space-y-2">
                        {ordersPerWeek.map(row => (
                            <div key={row.week} className="flex items-center gap-3">
                                <div className="w-28 text-sm text-gray-600">{row.week}</div>
                                <div className="flex-1 bg-purple-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-purple-600 h-full" style={{width: `${Math.min(100, row.count*10)}%`}} />
                                </div>
                                <div className="w-10 text-sm text-gray-700 text-right">{row.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top selling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-themed p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Top-selling Products</h2>
                    <div className="space-y-2">
                        {topProducts.map(({product, qty}) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm">
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-gray-600">{product.brand} • ฿{product.price.toLocaleString()}</div>
                                </div>
                                <div className="font-semibold text-green-600">{qty} sold</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card-themed p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Top Brands</h2>
                    <div className="space-y-2">
                        {topBrands.map(({brand, qty}) => (
                            <div key={brand} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium">{brand}</div>
                                <div className="font-semibold text-blue-600">{qty}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Payment breakdown */}
            <div className="card-themed p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                <div className="space-y-2">
                    {paymentBreakdown.map(row => (
                        <div key={row.method} className="flex items-center gap-3">
                            <div className="w-40 text-sm text-gray-600">{row.method}</div>
                            <div className="flex-1 bg-blue-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-blue-600 h-full" style={{width: `${row.pct}%`}} />
                            </div>
                            <div className="w-12 text-sm text-gray-700 text-right">{row.count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


