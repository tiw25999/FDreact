import { create } from 'zustand';
import { useProducts } from './products';
import type { Address } from './orders';
import { useCartStore } from './cart';
import { useOrdersStore } from './orders';

export type Role = 'user' | 'admin';
export type User = { id: string; firstName: string; lastName: string; email: string; phone?: string; avatarUrl?: string; role: Role; addresses?: Address[]; defaultAddressIndex?: number } | null;

type AuthState = {
	user: User;
	login: (user: NonNullable<User>) => void;
	logout: () => void;
    updateUser: (partial: Partial<NonNullable<User>>) => void;
    logoutAndRedirect: () => void;
};

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

export const useAuthStore = create<AuthState>((set) => ({
    user: loadUser(),
    login: (user) => {
        // merge with saved profile by email to preserve avatar/phone etc between sessions
        const profiles = readProfiles();
        const savedProfile = user.email ? profiles[user.email] || {} : {};
        // Preserve saved profile data (firstName, lastName, phone, avatarUrl, addresses) but use new user data for id, email, role
        const merged = { 
            ...user, // id, email, role from login
            firstName: savedProfile.firstName || user.firstName,
            lastName: savedProfile.lastName || user.lastName,
            phone: savedProfile.phone || user.phone,
            avatarUrl: savedProfile.avatarUrl || user.avatarUrl,
            addresses: savedProfile.addresses || user.addresses,
            defaultAddressIndex: savedProfile.defaultAddressIndex !== undefined ? savedProfile.defaultAddressIndex : user.defaultAddressIndex,
        } as NonNullable<User>;
        localStorage.setItem(persistedUserKey, JSON.stringify(merged));
        set({ user: merged });
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
    },
    logout: () => {
        const email = loadUser()?.email || null;
        localStorage.removeItem(persistedUserKey);
        set({ user: null });
        try { useCartStore.getState().reloadForUser(null); } catch {}
        try { useOrdersStore.getState().reloadForUser(null); } catch {}
    },
    logoutAndRedirect: () => {
        const email = loadUser()?.email || null;
        localStorage.removeItem(persistedUserKey);
        set({ user: null });
        try { useCartStore.getState().reloadForUser(null); } catch {}
        try { useOrdersStore.getState().reloadForUser(null); } catch {}
        try { useProducts.getState().reloadProducts(); } catch {}
        // redirect to home
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    },
    updateUser: (partial) => set((state)=>{
        if(!state.user) return state;
        const updated = { ...state.user, ...partial } as NonNullable<User>;
        localStorage.setItem(persistedUserKey, JSON.stringify(updated));
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
        return { user: updated } as any;
    })
}));



