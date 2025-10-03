import { create } from 'zustand';
import { useEffect } from 'react';

type Toast = { id: number; message: string };
type ToastStore = { toasts: Toast[]; push: (m: string) => void; remove: (id: number) => void };

export const useToast = create<ToastStore>((set) => ({
	toasts: [],
	push: (message) => set((s) => ({ toasts: [...s.toasts, { id: Date.now(), message }] })),
	remove: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));

export function ToastViewport() {
	const { toasts, remove } = useToast();
	useEffect(() => {
		const timers = toasts.map(t => setTimeout(() => remove(t.id), 2500));
		return () => { timers.forEach(clearTimeout); };
	}, [toasts, remove]);
	return (
		<div className="fixed bottom-4 right-4 z-50 space-y-2">
			{toasts.map(t => (
				<div key={t.id} className="bg-black text-white/90 rounded px-3 py-2 shadow-lg text-sm">{t.message}</div>
			))}
		</div>
	);
}


