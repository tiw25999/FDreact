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
	const [role, setRole] = useState<Role>('user');
	const navigate = useNavigate();
	const login = useAuthStore(s=>s.login);
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get('redirect') || '/';

    function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		
		// Create user ID
		const userId = crypto.randomUUID();
		
		// Save profile data to localStorage
		try {
			const profiles = localStorage.getItem('etech_profiles');
			const profilesData = profiles ? JSON.parse(profiles) : {};
			
			profilesData[email] = {
				firstName,
				lastName,
				phone: '',
				role,
				addresses: [],
				avatarUrl: '',
				lastLogin: new Date().toISOString()
			};
			
			localStorage.setItem('etech_profiles', JSON.stringify(profilesData));
		} catch (error) {
			console.error('Error saving profile:', error);
		}
		
		// Auto login after registration
        login({ id: userId, firstName, lastName, email, role });
		navigate(redirectTo);
	}

    return (
        <AuthLayout title="Create account">
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className="w-full border rounded-full px-4 py-3" placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                    <input className="w-full border rounded-full px-4 py-3" placeholder="Last name" value={lastName} onChange={e=>setLastName(e.target.value)} />
                </div>
                <input className="w-full border rounded-full px-4 py-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                <input className="w-full border rounded-full px-4 py-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                <CustomSelect
                    options={[
                        { value: "user", label: "User" },
                        { value: "admin", label: "Admin" }
                    ]}
                    value={role}
                    onChange={(value) => setRole(value as Role)}
                    placeholder="Select role..."
                />
                <button className="w-full rounded-full px-4 py-3 bg-blue-600 text-white">Sign up</button>
            </form>
            <p className="text-sm mt-4 text-center text-gray-600">Already have an account? <Link to={`/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-blue-700 underline">Sign in</Link></p>
        </AuthLayout>
    );
}



