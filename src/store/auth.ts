import { create } from 'zustand';
import { useProducts } from './products';
import type { Address } from './orders';
import { useCartStore } from './cart';
import { useOrdersStore } from './orders';
import apiClient from '../utils/apiClient';

export type Role = 'user' | 'admin';
export type User = { id: string; firstName: string; lastName: string; email: string; phone?: string; avatarUrl?: string; role: Role; addresses?: Address[]; defaultAddressIndex?: number } | null;

type AuthState = {
	user: User;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<boolean>;
	register: (userData: RegisterData) => Promise<boolean>;
	logout: () => void;
    updateUser: (partial: Partial<NonNullable<User>>) => Promise<void>;
    logoutAndRedirect: () => void;
	loadUser: () => Promise<void>;
};

interface RegisterData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone?: string;
}

const persistedUserKey = 'etech_user';
const profilesKey = 'etech_profiles'; // map<email, {firstName,lastName,phone,avatarUrl}>

function loadUser(): User {
	try {
		const raw = localStorage.getItem(persistedUserKey);
		return raw ? JSON.parse(raw) : null;
	} catch { return null; }
}

type ProfileData = { firstName?: string; lastName?: string; phone?: string; avatarUrl?: string; addresses?: Address[]; defaultAddressIndex?: number; role?: Role };
function readProfiles(): Record<string, ProfileData> {
    try {
        const raw = localStorage.getItem(profilesKey);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}
function writeProfiles(map: Record<string, ProfileData>) {
    localStorage.setItem(profilesKey, JSON.stringify(map));
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: loadUser(),
    loading: false,
    error: null,
    login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem('etech_token', token);
            
            // merge with saved profile by email to preserve avatar/phone etc between sessions
            const profiles = readProfiles();
            const savedProfile = user.email ? profiles[user.email] || {} : {};
            // Preserve saved profile data (firstName, lastName, phone, avatarUrl, addresses) but use new user data for id, email, role
            const merged = { 
                ...user, // id, email, role from login
                firstName: savedProfile.firstName || user.firstName,
                lastName: savedProfile.lastName || user.lastName,
                phone: savedProfile.phone || user.phone,
                avatarUrl: user.avatarUrl || savedProfile.avatarUrl, // Prioritize backend avatarUrl
                addresses: savedProfile.addresses || user.addresses,
                defaultAddressIndex: savedProfile.defaultAddressIndex !== undefined ? savedProfile.defaultAddressIndex : user.defaultAddressIndex,
            } as NonNullable<User>;
            localStorage.setItem(persistedUserKey, JSON.stringify(merged));
            set({ user: merged, loading: false });
            // reload user-scoped stores
            try { useCartStore.getState().reloadForUser(merged.email || null); } catch {}
            try { useOrdersStore.getState().reloadForUser(merged.email || null); } catch {}
            try { useProducts.getState().reloadProducts(); } catch {}
            // also keep/update profile map by email for future logins
            if (merged.email) {
                profiles[merged.email] = {
                    firstName: merged.firstName,
                    lastName: merged.lastName,
                    phone: merged.phone,
                    avatarUrl: merged.avatarUrl,
                    addresses: merged.addresses,
                    defaultAddressIndex: merged.defaultAddressIndex,
                    role: merged.role,
                };
                writeProfiles(profiles);
            }
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            set({ error: 'Login failed', loading: false });
            return false;
        }
    },
    register: async (userData: RegisterData) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.post('/auth/register', userData);
            const { token, user } = response.data;
            
            localStorage.setItem('etech_token', token);
            
            // merge with saved profile by email to preserve avatar/phone etc between sessions
            const profiles = readProfiles();
            const savedProfile = user.email ? profiles[user.email] || {} : {};
            // Preserve saved profile data (firstName, lastName, phone, avatarUrl, addresses) but use new user data for id, email, role
            const merged = { 
                ...user, // id, email, role from login
                firstName: savedProfile.firstName || user.firstName,
                lastName: savedProfile.lastName || user.lastName,
                phone: savedProfile.phone || user.phone,
                avatarUrl: user.avatarUrl || savedProfile.avatarUrl, // Prioritize backend avatarUrl
                addresses: savedProfile.addresses || user.addresses,
                defaultAddressIndex: savedProfile.defaultAddressIndex !== undefined ? savedProfile.defaultAddressIndex : user.defaultAddressIndex,
            } as NonNullable<User>;
            localStorage.setItem(persistedUserKey, JSON.stringify(merged));
            set({ user: merged, loading: false });
            // reload user-scoped stores
            try { useCartStore.getState().reloadForUser(merged.email || null); } catch {}
            try { useOrdersStore.getState().reloadForUser(merged.email || null); } catch {}
            try { useProducts.getState().reloadProducts(); } catch {}
            // also keep/update profile map by email for future logins
            if (merged.email) {
                profiles[merged.email] = {
                    firstName: merged.firstName,
                    lastName: merged.lastName,
                    phone: merged.phone,
                    avatarUrl: merged.avatarUrl,
                    addresses: merged.addresses,
                    defaultAddressIndex: merged.defaultAddressIndex,
                    role: merged.role,
                };
                writeProfiles(profiles);
            }
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            set({ error: 'Registration failed', loading: false });
            return false;
        }
    },
    logout: () => {
        const email = loadUser()?.email || null;
        localStorage.removeItem(persistedUserKey);
        localStorage.removeItem('etech_token');
        set({ user: null });
        try { useCartStore.getState().reloadForUser(null); } catch {}
        try { useOrdersStore.getState().reloadForUser(null); } catch {}
    },
    logoutAndRedirect: () => {
        const email = loadUser()?.email || null;
        localStorage.removeItem(persistedUserKey);
        localStorage.removeItem('etech_token');
        set({ user: null });
        try { useCartStore.getState().reloadForUser(null); } catch {}
        try { useOrdersStore.getState().reloadForUser(null); } catch {}
        try { 
            useProducts.getState().reloadProducts(); 
        } catch (error) {
            console.error('logoutAndRedirect - error reloading products:', error);
        }
        // redirect to home
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    },
    updateUser: async (partial) => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.put('/auth/profile', partial);
            const { user } = response.data;
            
            const updated = { ...get().user, ...user } as NonNullable<User>;
            localStorage.setItem(persistedUserKey, JSON.stringify(updated));
            set({ user: updated, loading: false });
            
            // keep profile map
            const profiles = readProfiles();
            if(updated.email){
                profiles[updated.email] = {
                    firstName: updated.firstName,
                    lastName: updated.lastName,
                    phone: updated.phone,
                    avatarUrl: updated.avatarUrl,
                    // @ts-ignore store extra fields
                    addresses: updated.addresses,
                    defaultAddressIndex: updated.defaultAddressIndex,
                    role: updated.role,
                } as any;
                writeProfiles(profiles);
            }
        } catch (error) {
            console.error('Auth updateUser - Update profile failed:', error);
            set({ error: 'Update profile failed', loading: false });
        }
    },
    loadUser: async () => {
        const token = localStorage.getItem('etech_token');
        if (!token) return;
        
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/auth/me');
            const { user } = response.data;
            
            // merge with saved profile by email to preserve avatar/phone etc between sessions
            const profiles = readProfiles();
            const savedProfile = user.email ? profiles[user.email] || {} : {};
            // Preserve saved profile data (firstName, lastName, phone, avatarUrl, addresses) but use new user data for id, email, role
            const merged = { 
                ...user, // id, email, role from login
                firstName: savedProfile.firstName || user.firstName,
                lastName: savedProfile.lastName || user.lastName,
                phone: savedProfile.phone || user.phone,
                avatarUrl: user.avatarUrl || savedProfile.avatarUrl, // Prioritize backend avatarUrl
                addresses: savedProfile.addresses || user.addresses,
                defaultAddressIndex: savedProfile.defaultAddressIndex !== undefined ? savedProfile.defaultAddressIndex : user.defaultAddressIndex,
            } as NonNullable<User>;
            localStorage.setItem(persistedUserKey, JSON.stringify(merged));
            set({ user: merged, loading: false });
        } catch (error) {
            console.error('Load user failed:', error);
            localStorage.removeItem('etech_token');
            set({ user: null, loading: false });
        }
    }
}));



