import { create } from 'zustand';
import type { CartItem } from './cart';

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
    addOrder: (
        items: CartItem[],
        subtotal: number,
        address: Address,
        payment: PaymentMethod,
        vat: number,
        shipping: number
    ) => string;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
    reloadForUser: (email: string | null) => void;
};

const BASE_KEY = 'etech_orders';
const USER_KEY = 'etech_user';
const keyFor = (email: string | null) => `${BASE_KEY}_${email || 'guest'}`;
function getCurrentEmail(): string | null {
    try { const raw = localStorage.getItem(USER_KEY); return raw ? (JSON.parse(raw)?.email ?? null) : null; } catch { return null; }
}
function loadFor(email: string | null): Order[] {
    try { const raw = localStorage.getItem(keyFor(email)); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function persistFor(email: string | null, orders: Order[]) { try { localStorage.setItem(keyFor(email), JSON.stringify(orders)); } catch {} }

export const useOrdersStore = create<OrdersState>((set, get) => ({
	orders: loadFor(getCurrentEmail()),
    addOrder: (items, subtotal, address, payment, vat, shipping) => {
		// Generate unique ID using timestamp and random number
		const timestamp = Date.now().toString().slice(-6);
		const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
		const id = `${timestamp}${random}`;
        const grandTotal = subtotal + vat + shipping;
        const order: Order = { id, items, subtotal, vat, shipping, grandTotal, createdAt: new Date().toISOString(), status: 'Pending', address, payment };
		set(state => {
            const updated = [order, ...state.orders];
            persistFor(getCurrentEmail(), updated);
            return { orders: updated };
        });
		return id;
	},
    updateOrderStatus: (orderId, status) => set(state => {
        const updated = state.orders.map(order => 
            order.id === orderId ? { ...order, status } : order
        );
        persistFor(getCurrentEmail(), updated);
        return { orders: updated };
    }),
    reloadForUser: (email) => set({ orders: loadFor(email) }),
}));



