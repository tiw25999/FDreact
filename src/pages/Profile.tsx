import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);

  function onPickFile() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl); // persistable base64 for after refresh
    };
    reader.readAsDataURL(file);
  }

  async function onSave() {
    if (!user) {
      console.log('Profile onSave - no user found');
      return;
    }
    
    console.log('Profile onSave - starting update with data:', {
      firstName,
      lastName,
      phone,
      avatarUrl: avatarUrl ? 'Base64 data present' : 'No avatar data'
    });
    
    try {
      // Update user profile via API
      console.log('Profile onSave - calling updateUser API');
      await updateUser({
        firstName,
        lastName,
        phone: phone || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      
      console.log('Profile onSave - updateUser API call successful');
      
      // Update addresses with new name
      if (user.addresses && user.addresses.length > 0) {
        const updatedAddresses = user.addresses.map(a => ({ 
          ...a, 
          firstName, 
          lastName 
        }));
        
        // Update addresses in localStorage
        const profiles = JSON.parse(localStorage.getItem('etech_profiles') || '{}');
        if (profiles[user.email]) {
          profiles[user.email].addresses = updatedAddresses;
          localStorage.setItem('etech_profiles', JSON.stringify(profiles));
        }
      }
      
      console.log('Profile onSave - navigation to home');
      navigate('/');
    } catch (error) {
      console.error('Profile onSave - Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="card p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
            )}
          </div>
          <div className="space-x-2">
            <button className="border rounded-full px-4 py-2" onClick={onPickFile}>Upload</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="w-full border rounded-full px-4 py-2" placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
          <input className="w-full border rounded-full px-4 py-2" placeholder="Last name" value={lastName} onChange={e=>setLastName(e.target.value)} />
        </div>
        <input className="w-full border rounded-full px-4 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-full px-4 py-2" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <div className="text-right">
          <button className="btn-primary rounded-full px-6 py-2.5" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}


