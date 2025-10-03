import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../store/products';
import { useCartStore } from '../store/cart';
import { useState } from 'react';

export default function ProductDetail() {
	const { id } = useParams();
	const product = useProducts(s => s.products.find(p => p.id === id));
	const add = useCartStore(s => s.addItem);
	const [quantity, setQuantity] = useState(1);

	if (!product) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
						<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
					<p className="text-gray-600">The product you're looking for doesn't exist.</p>
				</div>
			</div>
		);
	}

	// Single product image
	const productImage = product.image;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
			<div className="mx-auto max-w-7xl px-4 py-8">
				{/* Breadcrumb */}
				<nav className="mb-8">
					<div className="flex items-center space-x-2 text-sm text-gray-500">
						<Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
						<Link 
							to={`/search?category=${encodeURIComponent(product.category)}`} 
							className="text-gray-900 hover:text-blue-600 transition-colors"
						>
							{product.category === 'มือถือ' ? 'Mobile' : 
							 product.category === 'แล็ปท็อป' ? 'Laptop' : 
							 product.category === 'อุปกรณ์เสริม' ? 'Accessories' : product.category}
						</Link>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
						<span className="text-gray-900">{product.name}</span>
					</div>
				</nav>

				<div className="grid lg:grid-cols-2 gap-12">
					{/* Product Image */}
					<div className="space-y-4">
						{/* Main Image */}
						<div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-xl">
							<img 
								src={productImage} 
								alt={product.name} 
								className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
							/>
						</div>
					</div>

					{/* Product Info */}
					<div className="space-y-8">
						{/* Badges */}
						<div className="flex gap-3">
							{product.isNew && (
								<span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
									New Product
								</span>
							)}
							{product.isSale && (
								<span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
									On Sale
								</span>
							)}
						</div>

						{/* Product Name */}
						<h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>

						{/* Brand & Category */}
						<div className="flex items-center gap-4">
							<span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
								{product.brand}
							</span>
							<span className="bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full">
								{product.category === 'มือถือ' ? 'Mobile' : 
								 product.category === 'แล็ปท็อป' ? 'Laptop' : 
								 product.category === 'อุปกรณ์เสริม' ? 'Accessories' : product.category}
							</span>
						</div>

						{/* Rating */}
						<div className="flex items-center gap-3">
							<div className="flex items-center">
								{[...Array(5)].map((_, i) => (
									<svg
										key={i}
										className={`w-6 h-6 ${
											i < Math.floor(product.rating)
												? 'text-amber-400'
												: 'text-gray-300'
										}`}
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>
							<span className="text-gray-600 font-medium">
								{product.rating}/5.0
							</span>
						</div>

						{/* Price */}
						<div className="text-5xl font-bold text-blue-600">
							฿{product.price.toLocaleString()}
						</div>

						{/* Description */}
						<div className="space-y-4">
							<h3 className="text-xl font-semibold text-gray-900">Description</h3>
							<p className="text-gray-600 leading-relaxed text-lg">
								{product.description || 'No description available for this product.'}
							</p>
						</div>

						{/* Quantity & Add to Cart */}
						<div className="space-y-6">
							<div className="flex items-center gap-4">
								<label className="text-lg font-medium text-gray-900">Quantity:</label>
								<div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
									<button
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
										</svg>
									</button>
									<span className="px-6 py-3 text-lg font-medium min-w-[60px] text-center">{quantity}</span>
									<button
										onClick={() => setQuantity(quantity + 1)}
										className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
										</svg>
									</button>
								</div>
							</div>

							<button 
								onClick={() => add(product, quantity)}
								className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-full hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
							>
								Add to Cart
							</button>
						</div>

						{/* Product Features */}
						<div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
							<div className="text-center p-4 bg-gray-50 rounded-2xl">
								<svg className="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
								</svg>
								<p className="text-sm font-medium text-gray-900">Shipping</p>
								<p className="text-lg font-bold text-blue-600">฿80</p>
							</div>
							<div className="text-center p-4 bg-gray-50 rounded-2xl">
								<svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<p className="text-sm font-medium text-gray-900">Quality Guaranteed</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}



