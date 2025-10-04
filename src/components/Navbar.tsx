import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProducts } from '../store/products';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';

export default function Navbar() {
    const [open, setOpen] = useState(false);
	const { setQuery, clearAllFilters } = useProducts();
	const navigate = useNavigate();
    const { user, logoutAndRedirect } = useAuthStore();
    const cartCount = useCartStore(s => s.items.reduce((n, it) => n + it.quantity, 0));

    // Handle logo click - clear all filters and go to home
    const handleLogoClick = () => {
        clearAllFilters();
        navigate('/');
    };

    // close profile dropdown when clicking outside
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            const menu = document.getElementById('profile-menu');
            const btn = document.getElementById('profile-btn');
            if (!menu || !btn) return;
            if (menu.contains(e.target as Node) || btn.contains(e.target as Node)) return;
            setOpen(false);
        }
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, []);

	return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0b1220] to-[#1e40af] text-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 grid grid-cols-3 items-center gap-4">
                <button onClick={handleLogoClick} className="font-bold text-white text-4xl hover:text-blue-200 transition-colors">E‑Tech</button>
                <form onSubmit={e=>{e.preventDefault(); navigate('/search');}} className="flex items-center gap-2">
                    <input className="w-full max-w-xl mx-auto rounded-full px-4 py-2 bg-white/90 text-gray-800 placeholder-gray-400 shadow-inner focus:ring-2 focus:ring-blue-300 outline-none" placeholder="Search products..." onChange={e=>setQuery(e.target.value)} />
                    <div className="relative group">
                        <button type="button" aria-label="filters" className="rounded-full p-2 bg-white/90 text-blue-700 hover:bg-white" onClick={()=>navigate('/search?open=filters')}>
                            {/* Heroicons: Funnel */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 5h18M6 12h12M10 19h4" />
                            </svg>
                        </button>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Filters
                        </div>
                    </div>
                </form>
                <nav className="ml-auto flex items-center justify-end gap-4 text-xl">
                    <div className="relative group">
                        <Link to="/cart" aria-label="cart" className="relative flex items-center gap-2 text-white/80 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.78H6" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="text-sm bg-white text-blue-700 rounded-full px-2 py-0.5">{cartCount}</span>
                            )}
                        </Link>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Shopping Cart
                        </div>
                    </div>
                    <div className="relative group">
                        <Link to="/orders" aria-label="orders" className="text-white/80 hover:text-white flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"/>
                                <path d="M3.3 7L12 12l8.7-5"/>
                                <path d="M12 22V12"/>
                            </svg>
                        </Link>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            My Orders
                        </div>
                    </div>
                    {user?.role === 'admin' && (
                        <div className="relative group">
                            <Link to="/admin" aria-label="Admin Dashboard" className="text-white/80 hover:text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"/>
                                    <rect x="14" y="3" width="7" height="7"/>
                                    <rect x="14" y="14" width="7" height="7"/>
                                    <rect x="3" y="14" width="7" height="7"/>
                                </svg>
                            </Link>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                Admin Dashboard
                            </div>
                        </div>
                    )}
                    {user ? (
                        <div className="relative flex items-center gap-3 text-white/90">
                            <span className="text-sm bg-white/20 rounded-full px-2 py-0.5">{user.role}</span>
                            <button className="hidden">Sign out</button>
                            <div className="relative group">
                                <button id="profile-btn" onClick={()=>setOpen(!open)} className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-semibold overflow-hidden">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{user.email?.[0]?.toUpperCase() || 'U'}</span>
                                    )}
                                </button>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                    Profile Menu
                                </div>
                            </div>
                            {open && (
                                <div id="profile-menu" className="absolute right-0 top-10 bg-white text-gray-800 rounded-xl shadow-lg w-44 p-2" onClick={()=>setOpen(false)}>
                                    <Link to="/profile" className="block px-3 py-2 rounded hover:bg-gray-100">Profile</Link>
                                    <Link to="/addresses" className="block px-3 py-2 rounded hover:bg-gray-100">Addresses</Link>
                                    <button onClick={logoutAndRedirect} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-white/80 hover:text-white">Sign in</Link>
                            <Link to="/register" className="bg-white text-blue-700 rounded-full px-3 py-1">Sign up</Link>
                        </div>
                    )}
                    {/* dark mode removed */}
				</nav>
			</div>
		</header>
	);
}



