import { useEffect } from 'react';
import { useOrdersStore } from '../store/orders';
import { Link } from 'react-router-dom';

export default function Orders() {
	const { orders, fetchOrders, loading, error } = useOrdersStore();

	// Fetch orders when component mounts (only if not already loaded)
	useEffect(() => {
		if (orders.length === 0 && !loading) {
			fetchOrders();
		}
	}, [fetchOrders, orders.length, loading]);

	return (
		<div className="mx-auto max-w-4xl p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Orders</h1>
				<button 
					onClick={() => fetchOrders()} 
					disabled={loading}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? 'Refreshing...' : 'Refresh'}
				</button>
			</div>
			
			{loading && (
				<div className="text-center py-8">
					<div className="text-gray-600">Loading orders...</div>
				</div>
			)}
			
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					Error: {error}
				</div>
			)}
			
			{!loading && !error && orders.length === 0 && (
				<div className="text-center py-8">
					<div className="text-gray-600">No orders found</div>
					<Link to="/" className="text-blue-600 hover:text-blue-700 underline">
						Start shopping
					</Link>
				</div>
			)}
			
			{!loading && !error && orders.length > 0 && (
				<ul className="space-y-3">
					{orders.map(o => (
						<li key={o.id} className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
							<Link to={`/orders/${o.id}`} className="block">
								<div className="font-medium">Order #{o.id.slice(0, 8)}...</div>
								<div className="text-sm text-gray-600">{o.items?.length || 0} items • ฿{o.grandTotal.toLocaleString()}</div>
								<div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()} • {o.status}</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}



