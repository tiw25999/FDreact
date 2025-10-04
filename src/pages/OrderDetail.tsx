import { Link, useParams } from 'react-router-dom';
import { useOrdersStore } from '../store/orders';
import { useAdminStore } from '../store/admin';
import { useAuthStore } from '../store/auth';
import { useState, useEffect } from 'react';

export default function OrderDetail() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const currentUserOrders = useOrdersStore(s => s.orders);
    const { orders: adminOrders, fetchOrders } = useAdminStore();
    const { updateOrderStatus } = useOrdersStore();
    const [isCancelling, setIsCancelling] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const backHref = user?.role === 'admin' ? '/admin/orders' : '/orders';
    
    // Handle cancel order
    const handleCancelOrder = async () => {
        if (!order) return;
        
        const confirmed = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.');
        if (!confirmed) return;
        
        setIsCancelling(true);
        try {
            await updateOrderStatus(order.id, 'Cancelled');
            // Update local order status
            order.status = 'Cancelled';
        } catch (error) {
            console.error('Failed to cancel order:', error);
            alert('Failed to cancel order. Please try again.');
        } finally {
            setIsCancelling(false);
        }
    };
    
    // Find order in current user's orders or admin orders
    useEffect(() => {
        const findOrder = async () => {
            setLoading(true);
            
            // First check current user's orders
            let foundOrder = currentUserOrders.find(o => o.id === String(id));
            
            // If not found and user is admin, fetch admin orders
            if (!foundOrder && user?.role === 'admin') {
                await fetchOrders();
                foundOrder = adminOrders.find(o => o.id === String(id));
            }
            
            setOrder(foundOrder as any || null);
            setLoading(false);
        };
        
        findOrder();
    }, [id, currentUserOrders, adminOrders, user?.role, fetchOrders]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
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
                <h1 className="text-2xl font-bold">Order #{order.orderNumber || order.id}</h1>
                <Link to={backHref} className="border rounded-full px-4 py-1.5">Back</Link>
            </div>
            <div className="card p-6 rounded-2xl space-y-4">
                <div className="text-sm text-gray-600">Created: {new Date(order.createdAt).toLocaleString()}</div>
                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <span className="font-medium">Status:</span> 
                        <span className={`px-2 py-0.5 rounded-full ml-2 ${
                            order.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Paid' ? 'bg-green-100 text-green-700' :
                            order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {order.status}
                        </span>
                    </div>
                    {order.status === 'Pending' && (
                        <button
                            onClick={handleCancelOrder}
                            disabled={isCancelling}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    )}
                </div>
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
                        {order.items.map((it: any, index: number) => (
                            <tr key={it.id || `item-${index}`} className="border-t">
                                <td className="p-2 flex items-center gap-3">
                                    <img 
                                        src={it.product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'} 
                                        alt={it.product.name}
                                        className="w-14 h-14 object-cover rounded border"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                                        }}
                                    />
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
                        {order.address ? (
                            <>
                                <div className="text-sm text-gray-700">{order.address.firstName} {order.address.lastName}</div>
                                <div className="text-sm text-gray-700">{order.address.addressLine}</div>
                                <div className="text-sm text-gray-700">{order.address.subDistrict}, {order.address.district}, {order.address.province} {order.address.postalCode}</div>
                                <div className="text-sm text-gray-700">Phone: {order.address.phone}</div>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">Address not available</div>
                        )}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="font-medium mb-1">Payment</div>
                        <div className="text-sm text-gray-700">{order.payment || 'Not specified'}</div>
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


