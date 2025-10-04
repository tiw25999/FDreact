import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const { login, loading, error: authError } = useAuthStore();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get('redirect') || '/';

    	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		
		const success = await login(email, password);
		if (success) {
			navigate(redirectTo);
		} else {
			setError(authError || 'Login failed');
		}
		setIsLoading(false);
	}

    	return (
    		<AuthLayout title="Sign in">
            <form onSubmit={onSubmit} className="space-y-4">
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				)}
    				<input 
					className="w-full border rounded-full px-4 py-3" 
					placeholder="Email" 
					type="email"
					value={email} 
					onChange={e=>setEmail(e.target.value)} 
					required
				/>
    				<input 
					className="w-full border rounded-full px-4 py-3" 
					placeholder="Password" 
					type="password" 
					value={password} 
					onChange={e=>setPassword(e.target.value)} 
					required
				/>
    				<button 
					className="w-full rounded-full px-4 py-3 bg-blue-600 text-white disabled:opacity-50" 
					disabled={isLoading || loading}
				>
					{isLoading || loading ? 'Signing in...' : 'Sign in'}
				</button>
    			</form>
            <p className="text-sm mt-4 text-center">No account? <Link to={`/register${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-blue-700 underline">Create one</Link></p>
    		</AuthLayout>
    	);
}



