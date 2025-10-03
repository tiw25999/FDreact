import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';

export default function Cart() {
	const { items, removeItem, setQuantity, total } = useCartStore();

	return (
		<div className="mx-auto max-w-6xl p-4">
			<h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
			{items.length === 0 ? (
				<p>Your cart is empty</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<section className="md:col-span-2 overflow-auto">
						<table className="w-full bg-white border rounded">
							<thead>
								<tr className="text-left">
									<th className="p-2">Product</th>
									<th className="p-2">Price</th>
									<th className="p-2">Qty</th>
									<th className="p-2">Total</th>
									<th className="p-2"></th>
								</tr>
							</thead>
							<tbody>
								{items.map(it => (
									<tr key={it.product.id} className="border-t">
										<td className="p-2 flex items-center gap-3">
											<img src={it.product.image} className="w-14 h-14 object-cover rounded" />
											<div className="font-medium">{it.product.name}</div>
										</td>
										<td className="p-2">฿{it.product.price.toLocaleString()}</td>
										<td className="p-2"><input type="number" min={1} className="w-20 border rounded px-2 py-1" value={it.quantity} onChange={e=>setQuantity(it.product.id, Number(e.target.value))} /></td>
										<td className="p-2">฿{(it.product.price*it.quantity).toLocaleString()}</td>
										<td className="p-2 text-right"><button className="text-red-600" onClick={()=>removeItem(it.product.id)}>Remove</button></td>
									</tr>
								))}
							</tbody>
						</table>
					</section>
					<aside className="md:sticky md:top-20 h-max card p-4 space-y-2">
						<div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">฿{total().toLocaleString()}</span></div>
					<Link to="/checkout" className="btn-primary block text-center rounded-full py-2.5">Checkout</Link>
					</aside>
				</div>
			)}
			{/* Mobile bottom CTA */}
			{items.length>0 && (
				<div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t p-3">
					<div className="flex items-center justify-between mb-2"><div>Total</div><div className="font-semibold">฿{total().toLocaleString()}</div></div>
				<Link to="/checkout" className="btn-primary block text-center rounded-full py-3">Checkout</Link>
				</div>
			)}
		</div>
	);
}



