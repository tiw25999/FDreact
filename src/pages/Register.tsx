import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore, type Role } from '../store/auth';
import AuthLayout from '../components/AuthLayout';
import { Link } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { register, loading, error: authError } = useAuthStore();
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get('redirect') || '/';

    async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		
		const success = await register({
			firstName,
			lastName,
			email,
			password,
			phone: phone || undefined
		});
		
		if (success) {
			navigate(redirectTo);
		} else {
			setError(authError || 'Registration failed');
		}
		setIsLoading(false);
	}

    return (
        <AuthLayout title="Create account">
            <form onSubmit={onSubmit} className="space-y-4">
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
						className="w-full border rounded-full px-4 py-3" 
						placeholder="First name" 
						value={firstName} 
						onChange={e=>setFirstName(e.target.value)} 
						required
					/>
                    <input 
						className="w-full border rounded-full px-4 py-3" 
						placeholder="Last name" 
						value={lastName} 
						onChange={e=>setLastName(e.target.value)} 
						required
					/>
                </div>
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
					minLength={6}
				/>
				<input 
					className="w-full border rounded-full px-4 py-3" 
					placeholder="Phone (optional)" 
					type="tel"
					value={phone} 
					onChange={e=>setPhone(e.target.value)} 
				/>
                <button 
					className="w-full rounded-full px-4 py-3 bg-blue-600 text-white disabled:opacity-50" 
					disabled={isLoading || loading}
				>
					{isLoading || loading ? 'Creating account...' : 'Sign up'}
				</button>
            </form>
            <p className="text-sm mt-4 text-center text-gray-600">Already have an account? <Link to={`/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-blue-700 underline">Sign in</Link></p>
        </AuthLayout>
    );
}



