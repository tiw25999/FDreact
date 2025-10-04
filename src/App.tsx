import { Link, Outlet, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { ToastViewport } from './components/Toast';
import { useAuthStore } from './store/auth';
import { useProducts } from './store/products';
import { useCartStore } from './store/cart';
import { useOrdersStore } from './store/orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProductsAdmin from './pages/ProductsAdmin';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';

function Modal({ title, body, onClose }: { title: string; body: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6">
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <div className="prose max-w-none text-base text-gray-700 whitespace-pre-line leading-relaxed">{body}</div>
                <div className="text-right mt-8">
                    <button className="btn-primary rounded-full px-5 py-2 text-base" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

function ShellLayout() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1 pt-24">
				<Outlet />
			</main>
			<ToastViewport />
            <footer className="border-t bg-white text-base">
                <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="text-gray-600">© {new Date().getFullYear()} E-Tech. All rights reserved. • Made by Group 1</div>
                    <nav className="flex items-center gap-4 text-gray-600">
                        <button id="btn-privacy" className="rounded-full px-4 py-1.5 text-sm hover:bg-blue-50">Privacy Policy</button>
                        <button id="btn-terms" className="rounded-full px-4 py-1.5 text-sm hover:bg-blue-50">Terms of Service</button>
                        <button id="btn-contact" className="rounded-full px-4 py-1.5 text-sm hover:bg-blue-50">Contact</button>
                    </nav>
                </div>
            </footer>
		</div>
	);
}

export default function App() {
    const [modal, setModal] = useState<{ title: string; body: string } | null>(null);
    const { user, loadUser } = useAuthStore();
    const { fetchProducts, products } = useProducts();
    const { fetchCart } = useCartStore();
    const { fetchOrders } = useOrdersStore();

    // Load initial data
    useEffect(() => {
        // Load user if token exists
        loadUser();
        
        // Load products
        fetchProducts();
    }, []);

    // Load user-specific data when user is logged in
    useEffect(() => {
        if (user) {
            fetchCart();
            fetchOrders();
        } else {
            // When user logs out, clear cart and orders, but keep products
            // Products should be available for all users (logged in or not)
        }
    }, [user]);

    // attach global openers for footer buttons after mount
    if (typeof window !== 'undefined') {
        (window as any).openPolicy = (type: 'privacy' | 'terms' | 'contact') => {
            if (type === 'privacy') setModal({ title: 'Privacy Policy', body: `We collect minimal personal data necessary to operate E‑Tech Store, such as account information and purchase history.\n\nHow we use data:\n- Provide and improve services\n- Prevent fraud and ensure security\n\nWe do not sell your data. We may share with service providers (e.g., payment, analytics) under strict contracts.\n\nYour rights:\n- Access, correct, or delete your data\n- Opt out of marketing emails at any time\n\nContact: suntonrapot.khunchit@gmail.com` });
            if (type === 'terms') setModal({ title: 'Terms of Service', body: `Welcome to E‑Tech Store. By using this website, you agree to:\n\n1) Use the service lawfully and responsibly\n2) Provide accurate information when creating an account\n3) Payments and orders are subject to availability and pricing at checkout\n4) Returns/refunds follow our store policy\n5) We may update these terms; continued use means acceptance\n\nIf you have questions, contact: suntonrapot.khunchit@gmail.com` });
            if (type === 'contact') setModal({ title: 'Contact', body: `For support or inquiries, please email:\n\nsuntonrapot.khunchit@gmail.com\n\nWe usually respond within 1–2 business days.` });
        };
        setTimeout(() => {
            const p = document.getElementById('btn-privacy');
            const t = document.getElementById('btn-terms');
            const c = document.getElementById('btn-contact');
            if (p) p.onclick = () => (window as any).openPolicy('privacy');
            if (t) t.onclick = () => (window as any).openPolicy('terms');
            if (c) c.onclick = () => (window as any).openPolicy('contact');
        }, 0);
    }
    return (
        <>
        {modal && <Modal title={modal.title} body={modal.body} onClose={() => setModal(null)} />}
        <Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route element={<ShellLayout />}> 
				<Route index element={<Dashboard />} />
				<Route path="search" element={<Search />} />
				<Route path="product/:id" element={<ProductDetail />} />
				<Route path="cart" element={<Cart />} />
				<Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="profile" element={<Profile />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="admin" element={<AdminDashboard />} />
				<Route path="admin/products" element={<ProductsAdmin />} />
				<Route path="admin/orders" element={<AdminOrders />} />
				<Route path="admin/users" element={<AdminUsers />} />
                <Route path="admin/reports" element={<AdminReports />} />
			</Route>
        </Routes>
        </>
	);
}


