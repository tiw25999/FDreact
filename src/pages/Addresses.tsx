import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import type { Address } from '../store/orders';

function AddressForm({ initial, onSave, onCancel }: { initial: Address; onSave: (a: Address)=>void; onCancel: ()=>void }) {
  const [addr, setAddr] = useState<Address>(initial);
  return (
    <div className="card p-4 rounded-2xl space-y-3">
      <input className="w-full border rounded-full px-4 py-2" placeholder="Address" value={addr.addressLine} onChange={e=>setAddr({...addr, addressLine: e.target.value})} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="w-full border rounded-full px-4 py-2" placeholder="Sub-district (Tambon)" value={addr.subDistrict} onChange={e=>setAddr({...addr, subDistrict: e.target.value})} />
        <input className="w-full border rounded-full px-4 py-2" placeholder="District (Amphoe)" value={addr.district} onChange={e=>setAddr({...addr, district: e.target.value})} />
        <input className="w-full border rounded-full px-4 py-2" placeholder="Province" value={addr.province} onChange={e=>setAddr({...addr, province: e.target.value})} />
        <input className="w-full border rounded-full px-4 py-2" placeholder="Postal code" value={addr.postalCode} onChange={e=>setAddr({...addr, postalCode: e.target.value})} />
      </div>
      <div className="text-right space-x-2">
        <button className="border rounded-full px-4 py-2" onClick={onCancel}>Cancel</button>
        <button className="btn-primary rounded-full px-6 py-2" onClick={()=>onSave(addr)}>Save</button>
      </div>
    </div>
  );
}

export default function Addresses() {
  const { user, updateUser } = useAuthStore();
  const addresses = user?.addresses || [];
  const [creating, setCreating] = useState(false);

  // Auto-set default address if there's only one address
  useEffect(() => {
    if (addresses.length === 1 && user?.defaultAddressIndex !== 0) {
      setDefault(0);
    }
  }, [addresses.length, user?.defaultAddressIndex]);
  

  function addNew(a: Address) {
    const list = [...addresses, a];
    const newDefaultIndex = list.length - 1; // Index of the newly added address
    
    // If this is the first address, set it as default automatically
    const shouldSetAsDefault = list.length === 1;
    
    updateUser({ 
      addresses: list,
      defaultAddressIndex: shouldSetAsDefault ? newDefaultIndex : user?.defaultAddressIndex
    });
    
    // Also update profiles map to ensure persistence
    try {
      const profiles = localStorage.getItem('etech_profiles');
      if (profiles && user?.email) {
        const profilesData = JSON.parse(profiles);
        if (profilesData[user.email]) {
          profilesData[user.email].addresses = list;
          if (shouldSetAsDefault) {
            profilesData[user.email].defaultAddressIndex = newDefaultIndex;
          }
          localStorage.setItem('etech_profiles', JSON.stringify(profilesData));
        }
      }
    } catch (error) {
      console.error('Error updating addresses in profiles:', error);
    }
    
    setCreating(false);
  }

  function setDefault(index: number) {
    updateUser({ defaultAddressIndex: index });
    
    // Also update profiles map to ensure persistence
    try {
      const profiles = localStorage.getItem('etech_profiles');
      if (profiles && user?.email) {
        const profilesData = JSON.parse(profiles);
        if (profilesData[user.email]) {
          profilesData[user.email].defaultAddressIndex = index;
          localStorage.setItem('etech_profiles', JSON.stringify(profilesData));
        }
      }
    } catch (error) {
      console.error('Error updating default address in profiles:', error);
    }
  }

  function removeAddress(index: number) {
    const list = addresses.filter((_, i) => i !== index);
    let newDefaultIndex = user?.defaultAddressIndex || 0;
    
    // If we're removing the default address, set the first remaining address as default
    if (user?.defaultAddressIndex === index) {
      newDefaultIndex = list.length > 0 ? 0 : 0;
    } else if (user?.defaultAddressIndex !== undefined && user.defaultAddressIndex > index) {
      // Adjust default index if we removed an address before the default
      newDefaultIndex = user.defaultAddressIndex - 1;
    }
    
    updateUser({ 
      addresses: list,
      defaultAddressIndex: newDefaultIndex
    });
    
    // Also update profiles map to ensure persistence
    try {
      const profiles = localStorage.getItem('etech_profiles');
      if (profiles && user?.email) {
        const profilesData = JSON.parse(profiles);
        if (profilesData[user.email]) {
          profilesData[user.email].addresses = list;
          profilesData[user.email].defaultAddressIndex = newDefaultIndex;
          localStorage.setItem('etech_profiles', JSON.stringify(profilesData));
        }
      }
    } catch (error) {
      console.error('Error updating addresses in profiles:', error);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">Addresses</h1>
      <button className="border rounded-full px-4 py-2" onClick={()=>setCreating(true)}>New address</button>
      {creating && (
        <AddressForm initial={{ addressLine:'', subDistrict:'', district:'', province:'', postalCode:'', phone: user?.phone||'', firstName: user?.firstName||'', lastName: user?.lastName||'' }} onSave={addNew} onCancel={()=>setCreating(false)} />
      )}
      <ul className="space-y-3">
        {addresses.map((a, i) => (
          <li key={i} className="bg-white border rounded-2xl p-4 flex items-start justify-between">
            <div>
              <div className="font-medium">{a.firstName} {a.lastName}</div>
              <div className="text-sm text-gray-700">{a.addressLine}</div>
              <div className="text-sm text-gray-700">{a.subDistrict}, {a.district}, {a.province} {a.postalCode}</div>
              <div className="text-sm text-gray-700">Phone: {a.phone}</div>
            </div>
            <div className="text-right space-x-2">
              {user?.defaultAddressIndex === i ? (
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">Default</span>
              ) : (
                <button className="border rounded-full px-3 py-1" onClick={()=>setDefault(i)}>Set default</button>
              )}
              <button 
                className="border rounded-full px-3 py-1 text-red-600 hover:bg-red-50" 
                onClick={()=>removeAddress(i)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


