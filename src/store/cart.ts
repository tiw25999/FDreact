import { create } from 'zustand';
import type { Product } from './products';
import apiClient from '../utils/apiClient';

export type CartItem = { id?: string; product: Product; quantity: number };

type CartState = {
	items: CartItem[];
	loading: boolean;
	error: string | null;
	fetchCart: () => Promise<void>;
	addItem: (product: Product, quantity: number) => Promise<void>;
	removeItem: (productId: string) => Promise<void>;
	setQuantity: (productId: string, quantity: number) => Promise<void>;
	clear: () => Promise<void>;
	total: () => number;
	reloadForUser: (email: string | null) => void;
};

const BASE_KEY = 'etech_cart';
const USER_KEY = 'etech_user';
const keyFor = (email: string | null) => `${BASE_KEY}_${email || 'guest'}`;

function getCurrentEmail(): string | null {
    try {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        const u = JSON.parse(raw);
        return u?.email ?? null;
    } catch { return null; }
}

function loadFor(email: string | null): CartItem[] {
    try {
        const raw = localStorage.getItem(keyFor(email));
        if (!raw) return [];
        const parsed = JSON.parse(raw) as CartItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function persist(items: CartItem[]) {
    try {
        const email = getCurrentEmail();
        localStorage.setItem(keyFor(email), JSON.stringify(items));
    } catch {}
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    loading: false,
    error: null,
    fetchCart: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/cart');
            const { data } = response.data;
            set({ items: data, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch cart', loading: false });
        }
    },
    addItem: async (product, quantity) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.post('/cart', {
                productId: product.id,
                quantity
            });
            const { data } = response.data;
            
            set(state => {
                const existing = state.items.find(i => i.product.id === product.id);
                if (existing) {
                    return {
                        items: state.items.map(i => 
                            i.product.id === product.id ? data : i
                        ),
                        loading: false
                    };
                }
                return { items: [data, ...state.items], loading: false };
            });
        } catch (error) {
            set({ error: 'Failed to add item to cart', loading: false });
        }
    },
    removeItem: async (productId) => {
        set({ loading: true, error: null });
        try {
            // Find the cart item ID for this product
            const cartItem = get().items.find(i => i.product.id === productId);
            if (cartItem) {
                await apiClient.delete(`/cart/${cartItem.id}`);
                set(state => ({
                    items: state.items.filter(i => i.product.id !== productId),
                    loading: false
                }));
            }
        } catch (error) {
            set({ error: 'Failed to remove item from cart', loading: false });
        }
    },
    setQuantity: async (productId, quantity) => {
        set({ loading: true, error: null });
        try {
            // Find the cart item ID for this product
            const cartItem = get().items.find(i => i.product.id === productId);
            if (cartItem) {
                const response = await apiClient.put(`/cart/${cartItem.id}`, { quantity });
                const { data } = response.data;
                
                set(state => ({
                    items: state.items.map(i => i.product.id === productId ? data : i),
                    loading: false
                }));
            }
        } catch (error) {
            set({ error: 'Failed to update quantity', loading: false });
        }
    },
    clear: async () => {
        set({ loading: true, error: null });
        try {
            await apiClient.delete('/cart');
            set({ items: [], loading: false });
        } catch (error) {
            set({ error: 'Failed to clear cart', loading: false });
        }
    },
    total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    reloadForUser: (email) => set({ items: loadFor(email) }),
}));



