import { useOrdersStore } from '../store/orders';
import { Link } from 'react-router-dom';

export default function Orders() {
	const { orders } = useOrdersStore();

	return (
		<div className="mx-auto max-w-4xl p-4 space-y-4">
			<h1 className="text-2xl font-bold">Orders</h1>
			<ul className="space-y-3">
				{orders.map(o => (
					<li key={o.id} className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
						<Link to={`/orders/${o.id}`} className="block">
							<div className="font-medium">Order #{o.id}</div>
							<div className="text-sm text-gray-600">{o.items.length} items • ฿{o.grandTotal.toLocaleString()}</div>
							<div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()} • {o.status}</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}



