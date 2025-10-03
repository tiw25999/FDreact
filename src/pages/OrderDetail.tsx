import { Link, useParams } from 'react-router-dom';
import { useOrdersStore } from '../store/orders';
import { useAuthStore } from '../store/auth';

export default function OrderDetail() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const currentUserOrders = useOrdersStore(s => s.orders);
    const backHref = user?.role === 'admin' ? '/admin/orders' : '/orders';
    
    // Find order in current user's orders first
    let order = currentUserOrders.find(o => o.id === String(id));
    
    // If not found and user is admin, search in all users' orders
    if (!order && user?.role === 'admin') {
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
            order = allOrders.find(o => o.id === String(id));
        } catch (error) {
            console.error('Error fetching all orders:', error);
        }
    }

    if (!order) {
        return (
            <div className="mx-auto max-w-4xl p-4">
                <h1 className="text-2xl font-bold mb-4">Order not found</h1>
                <Link to={backHref} className="text-blue-600 underline">Back to orders</Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <Link to={backHref} className="border rounded-full px-4 py-1.5">Back</Link>
            </div>
            <div className="card p-6 rounded-2xl space-y-4">
                <div className="text-sm text-gray-600">Created: {new Date(order.createdAt).toLocaleString()}</div>
                <div className="text-sm"><span className="font-medium">Status:</span> <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{order.status}</span></div>
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-600">
                            <th className="p-2">Product</th>
                            <th className="p-2">Price</th>
                            <th className="p-2">Qty</th>
                            <th className="p-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(it => (
                            <tr key={it.product.id} className="border-t">
                                <td className="p-2 flex items-center gap-3">
                                    <img src={it.product.image} className="w-14 h-14 object-cover rounded" />
                                    <div className="font-medium">{it.product.name}</div>
                                </td>
                                <td className="p-2">฿{it.product.price.toLocaleString()}</td>
                                <td className="p-2">{it.quantity}</td>
                                <td className="p-2">฿{(it.product.price*it.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="font-medium mb-1">Shipping address</div>
                        <div className="text-sm text-gray-700">{order.address.firstName} {order.address.lastName}</div>
                        <div className="text-sm text-gray-700">{order.address.addressLine}</div>
                        <div className="text-sm text-gray-700">{order.address.subDistrict}, {order.address.district}, {order.address.province} {order.address.postalCode}</div>
                        <div className="text-sm text-gray-700">Phone: {order.address.phone}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="font-medium mb-1">Payment</div>
                        <div className="text-sm text-gray-700">{order.payment}</div>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span>฿{order.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>VAT (7%)</span><span>฿{order.vat.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>฿{order.shipping.toLocaleString()}</span></div>
                    <div className="flex justify-between font-semibold text-blue-700 pt-2"><span>Grand total</span><span>฿{order.grandTotal.toLocaleString()}</span></div>
                </div>
            </div>
        </div>
    );
}


