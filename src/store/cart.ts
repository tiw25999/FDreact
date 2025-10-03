import { create } from 'zustand';
import type { Product } from './products';

export type CartItem = { product: Product; quantity: number };

type CartState = {
	items: CartItem[];
	addItem: (product: Product, quantity: number) => void;
	removeItem: (productId: string) => void;
	setQuantity: (productId: string, quantity: number) => void;
	clear: () => void;
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
    items: loadFor(getCurrentEmail()),
    addItem: (product, quantity) => set(state => {
        const existing = state.items.find(i => i.product.id === product.id);
        const newItems = existing
            ? state.items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
            : [...state.items, { product, quantity }];
        persist(newItems);
        return { items: newItems };
    }),
    removeItem: (productId) => set(state => {
        const newItems = state.items.filter(i => i.product.id !== productId);
        persist(newItems);
        return { items: newItems };
    }),
    setQuantity: (productId, quantity) => set(state => {
        const newItems = state.items.map(i => i.product.id === productId ? { ...i, quantity } : i);
        persist(newItems);
        return { items: newItems };
    }),
    clear: () => {
        persist([]);
        set({ items: [] });
    },
    total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    reloadForUser: (email) => set({ items: loadFor(email) }),
}));



