import { create } from 'zustand';
import type { CartItem } from './cart';
import apiClient from '../utils/apiClient';

export type Address = {
    firstName: string;
    lastName: string;
    addressLine: string;
    subDistrict: string; // ตำบล/แขวง
    district: string;    // อำเภอ/เขต
    province: string;
    postalCode: string;
    phone: string;
};

export type PaymentMethod = 'Bank' | 'QR PromptPay' | 'Credit Card';

export type Order = {
	id: string;
	items: CartItem[];
    subtotal: number;
    vat: number;
    shipping: number;
    grandTotal: number;
	createdAt: string;
    status: 'Pending' | 'Paid' | 'Shipped' | 'Completed';
    address: Address;
    payment: PaymentMethod;
};

type OrdersState = {
	orders: Order[];
	loading: boolean;
	error: string | null;
	fetchOrders: () => Promise<void>;
    addOrder: (
        items: CartItem[],
        subtotal: number,
        address: Address,
        payment: PaymentMethod,
        vat: number,
        shipping: number
    ) => Promise<string | null>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
    reloadForUser: (email: string | null) => void;
};

// Removed localStorage functions - now using API only

export const useOrdersStore = create<OrdersState>((set, get) => ({
	orders: [],
	loading: false,
	error: null,
	fetchOrders: async () => {
		set({ loading: true, error: null });
		try {
			const response = await apiClient.get('/orders');
			const { data } = response.data;
			set({ orders: data, loading: false });
		} catch (error) {
			set({ error: 'Failed to fetch orders', loading: false });
		}
	},
    addOrder: async (items, subtotal, address, payment, vat, shipping) => {
		set({ loading: true, error: null });
		try {
			const response = await apiClient.post('/orders', {
				items: items.map(item => ({
					productId: item.product.id,
					quantity: item.quantity
				})),
				subtotal,
				address,
				paymentMethod: payment,
				vat,
				shipping
			});
			
			const { data } = response.data;
			
			// Transform the response data to match our Order type
			const newOrder: Order = {
				id: data.id,
				items: data.items || [],
				subtotal: data.subtotal,
				vat: data.vat,
				shipping: data.shipping,
				grandTotal: data.grandTotal,
				createdAt: data.createdAt,
				status: data.status,
				address: data.address,
				payment: data.paymentMethod
			};
			
			set(state => ({ orders: [newOrder, ...state.orders], loading: false }));
			return data.id;
		} catch (error: any) {
			console.error('Create order failed:', error);
			console.error('Error response:', error.response?.data);
			console.error('Error status:', error.response?.status);
			console.error('Request data:', { items, subtotal, address, paymentMethod: payment, vat, shipping });
			set({ error: 'Failed to create order', loading: false });
			return null;
		}
	},
    updateOrderStatus: async (orderId, status) => {
		set({ loading: true, error: null });
		try {
			await apiClient.put(`/orders/${orderId}/status`, { status });
			set(state => ({
				orders: state.orders.map(order => 
					order.id === orderId ? { ...order, status } : order
				),
				loading: false
			}));
		} catch (error) {
			console.error('Update order status failed:', error);
			set({ error: 'Failed to update order status', loading: false });
		}
	},
    reloadForUser: (email) => {
        // No longer needed - orders are fetched from API
        console.log('reloadForUser called but not needed with API');
    },
}));



