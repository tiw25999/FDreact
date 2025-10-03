import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const login = useAuthStore(s => s.login);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get('redirect') || '/';

    	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
	        // Check if user exists in profiles map
	        try {
	            const raw = localStorage.getItem('etech_profiles');
	            if (raw) {
	                const map = JSON.parse(raw);
	                if (map[email]) {
	                    // User exists, use their saved data
	                    const userData = map[email];
	                    login({ 
	                        id: 'u1', 
	                        firstName: userData.firstName || 'Demo', 
	                        lastName: userData.lastName || 'User', 
	                        email, 
	                        phone: userData.phone || '', 
	                        role: userData.role || 'user' 
	                    });
	                    navigate(redirectTo);
	                    return;
	                }
	            }
	        } catch {}
	        
	        // User doesn't exist, show error
	        alert('User not found! Please register first.');
	}

    	return (
    		<AuthLayout title="Sign in">
            <form onSubmit={onSubmit} className="space-y-4">
    				<input className="w-full border rounded-full px-4 py-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
    				<input className="w-full border rounded-full px-4 py-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
    				<button className="w-full rounded-full px-4 py-3 bg-blue-600 text-white">Sign in</button>
    			</form>
            <p className="text-sm mt-4 text-center">No account? <Link to={`/register${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-blue-700 underline">Create one</Link></p>
    		</AuthLayout>
    	);
}



