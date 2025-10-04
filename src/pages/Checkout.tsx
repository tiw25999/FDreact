import { useNavigate, Navigate } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { useOrdersStore, type Address, type PaymentMethod } from '../store/orders';
import { useAuthStore } from '../store/auth';
import { useState, useEffect } from 'react';

export default function Checkout() {
    const { items, clear, total } = useCartStore();
    const auth = useAuthStore();
    const addOrder = useOrdersStore().addOrder;
    const navigate = useNavigate();
    const [step, setStep] = useState<1|2|3>(1);
    const [address, setAddress] = useState<Address>({ firstName: auth.user?.firstName || '', lastName: auth.user?.lastName || '', addressLine: '', subDistrict: '', district: '', province: '', postalCode: '', phone: auth.user?.phone || '' });
    const [payment, setPayment] = useState<PaymentMethod>('Bank');

    // Redirect to login if not authenticated
    if (!auth.user) {
        return <Navigate to={`/login?redirect=${encodeURIComponent('/checkout')}`} replace />;
    }
    // Prefill from default address if available
    const defaultAddress = auth.user?.addresses && auth.user.defaultAddressIndex !== undefined
        ? auth.user.addresses[auth.user.defaultAddressIndex]
        : undefined;
    if (defaultAddress && address.addressLine === '' && defaultAddress.addressLine) {
        setAddress({
            firstName: defaultAddress.firstName || auth.user?.firstName || '',
            lastName: defaultAddress.lastName || auth.user?.lastName || '',
            addressLine: defaultAddress.addressLine,
            subDistrict: defaultAddress.subDistrict,
            district: defaultAddress.district,
            province: defaultAddress.province,
            postalCode: defaultAddress.postalCode,
            phone: defaultAddress.phone || auth.user?.phone || ''
        });
    }

    function onPay() {
        const subtotal = total();
        const vat = Math.round(subtotal * 0.07);
        const shipping = subtotal > 0 ? 80 : 0;
        const orderId = addOrder(items, subtotal, address, payment, vat, shipping);
		clear();
		navigate('/orders');
	}

	return (
		<div className="mx-auto max-w-4xl p-4 pb-24">
			<h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <ol className="flex gap-2 text-sm mb-4">
                <li className={`${step>=1?'bg-blue-600 text-white':'bg-gray-200'} px-3 py-1.5 rounded-full`}>1 Address</li>
                <li className={`${step>=2?'bg-blue-600 text-white':'bg-gray-200'} px-3 py-1.5 rounded-full`}>2 Payment</li>
                <li className={`${step>=3?'bg-blue-600 text-white':'bg-gray-200'} px-3 py-1.5 rounded-full`}>3 Review</li>
            </ol>

            {step===1 && (
                <div className="card p-6 space-y-4 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input className="w-full border px-4 py-3 rounded-full focus:ring-2 focus:ring-blue-300 outline-none" placeholder="First name" value={address.firstName} onChange={e=>setAddress({...address, firstName: e.target.value})} />
                        <input className="w-full border px-4 py-3 rounded-full focus:ring-2 focus:ring-blue-300 outline-none" placeholder="Last name" value={address.lastName} onChange={e=>setAddress({...address, lastName: e.target.value})} />
                    </div>
                    <input className="w-full border px-4 py-3 rounded-full focus:ring-2 focus:ring-blue-300 outline-none" placeholder="Address" value={address.addressLine} onChange={e=>setAddress({...address, addressLine: e.target.value})} />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input className="w-full border px-4 py-3 rounded-full focus:ring-2 focus:ring-blue-300 outline-none" placeholder="Sub-district (Tambon)" value={address.subDistrict} onChange={e=>setAddress({...address, subDistrict: e.target.value})} />
                        <input className="w-full border px-4 py-3 rounded-full focus:ring-2 focus:ring-blue-300 outline-none" placeholder="District (Amphoe)" value={address.district} onChange={e=>setAddress({...address, district: e.target.value})} />
                        <input className="w-full border px-4 py-3 rounded-full focus:ring-2 focus:ring-blue-300 outline-none" placeholder="Province" value={address.province} onChange={e=>setAddress({...address, province: e.target.value})} />
                        <input className="w-full border px-4 py-3 rounded-full focus:ring-2 focus:ring-blue-300 outline-none" placeholder="Postal code" value={address.postalCode} onChange={e=>setAddress({...address, postalCode: e.target.value})} />
                    </div>
                    <input className="w-full border px-4 py-3 rounded-full focus:ring-2 focus:ring-blue-300 outline-none" placeholder="Phone" value={address.phone} onChange={e=>setAddress({...address, phone: e.target.value})} />
                    <button className="btn-primary rounded-full px-6 py-2.5" onClick={()=>setStep(2)}>Next</button>
                </div>
            )}
            {step===2 && (
                <div className="card p-6 space-y-4 rounded-2xl">
                    <div className="text-sm text-gray-600">Select a payment method</div>
                    <label className="flex items-center gap-3 px-4 py-3 border rounded-full"><input type="radio" name="pay" checked={payment==='Bank'} onChange={()=>setPayment('Bank')} />Bank Transfer</label>
                    <label className="flex items-center gap-3 px-4 py-3 border rounded-full"><input type="radio" name="pay" checked={payment==='QR PromptPay'} onChange={()=>setPayment('QR PromptPay')} />QR PromptPay</label>
                    <label className="flex items-center gap-3 px-4 py-3 border rounded-full"><input type="radio" name="pay" checked={payment==='Credit Card'} onChange={()=>setPayment('Credit Card')} />Credit Card</label>
                    <div className="flex gap-3"><button className="border rounded-full px-5 py-2" onClick={()=>setStep(1)}>Back</button><button className="btn-primary rounded-full px-6 py-2.5" onClick={()=>setStep(3)}>Next</button></div>
                </div>
            )}
            {step===3 && (
                <div className="card p-6 space-y-4 rounded-2xl">
                    <div className="text-sm text-gray-600">Review your order</div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="font-medium mb-1">Shipping address</div>
                        <div className="text-sm text-gray-700">{address.firstName} {address.lastName}</div>
                        <div className="text-sm text-gray-700">{address.addressLine}</div>
                        <div className="text-sm text-gray-700">{address.subDistrict}, {address.district}, {address.province} {address.postalCode}</div>
                        <div className="text-sm text-gray-700">Phone: {address.phone}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="font-medium mb-1">Payment</div>
                        <div className="text-sm text-gray-700">{payment}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                        <div className="flex justify-between"><span>Subtotal</span><span>฿{total().toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>VAT (7%)</span><span>฿{Math.round(total()*0.07).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>฿{total()>0?80:0}</span></div>
                        <div className="flex justify-between font-semibold text-blue-700 pt-2"><span>Grand total</span><span>฿{(total()+Math.round(total()*0.07)+(total()>0?80:0)).toLocaleString()}</span></div>
                    </div>
                    <div className="flex gap-3"><button className="border rounded-full px-5 py-2" onClick={()=>setStep(2)}>Back</button><button className="btn-primary rounded-full px-6 py-2.5" onClick={onPay} disabled={items.length===0}>Pay now</button></div>
                </div>
            )}

			{/* Mobile CTA */}
            {items.length>0 && (
                <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t p-3 flex items-center justify-between">
                    <div className="font-semibold">฿{total().toLocaleString()}</div>
                    <button className="btn-primary rounded-full px-6 py-2.5" onClick={step<3?()=>setStep((step+1) as any):onPay}>{step<3?'Next':'Pay now'}</button>
                </div>
            )}
		</div>
	);
}



