import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../store/products';
import { useCartStore } from '../store/cart';
import { translateCategory } from '../utils/categoryTranslator';

function Stars({ value }: { value: number }) {
	return (
		<div className="text-amber-400 text-sm" aria-label={`rating ${value}`}>
			{Array.from({ length: 5 }).map((_, i) => (
				<span key={i}>{i < value ? '★' : '☆'}</span>
			))}
		</div>
	);
}

export default function ProductCard({ product }: { product: Product }) {
    const navigate = useNavigate();
    const add = useCartStore(s => s.addItem);

    // Guard against undefined product
    if (!product || !product.id || !product.name) {
        return null;
    }

    // Handle add to cart
    const handleAddToCart = () => {
        add(product, 1);
        // Navigate back to home after adding to cart
        navigate('/');
    };

    return (
        <div className="rounded-2xl overflow-hidden transition h-full flex flex-col bg-gradient-to-b from-white to-blue-50 border border-blue-100 shadow-[0_8px_24px_rgba(37,99,235,0.08)] hover:shadow-[0_14px_36px_rgba(37,99,235,0.14)]">
            <Link to={`/product/${product.id}`}>
                <div className="relative">
                    <img src={product.image || ''} alt={product.name} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 left-3 flex gap-1">
                        {product.isNew && <span className="text-xs px-2 py-1 rounded-full bg-emerald-500 text-white shadow">New</span>}
                        {product.isSale && <span className="text-xs px-2 py-1 rounded-full bg-rose-500 text-white shadow">Sale</span>}
                    </div>
                </div>
            </Link>
            <div className="p-4 flex flex-col gap-2 h-full">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{product.brand || 'Unknown'}</span>
                    <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                        {translateCategory(product.category || 'Unknown')}
                    </span>
                </div>
                <Link to={`/product/${product.id}`} className="text-base font-semibold line-clamp-2 hover:underline">{product.name}</Link>
                <div className="flex items-center justify-between">
                    <Stars value={product.rating || 0} />
                    <div className="text-blue-600 font-semibold">฿{product.price?.toLocaleString() || '0'}</div>
                </div>
                <div className="pt-1 mt-auto">
                    <button className="btn-primary rounded-full px-4 py-2 text-sm active:scale-95" onClick={handleAddToCart}>Add</button>
                </div>
            </div>
        </div>
    );
}


