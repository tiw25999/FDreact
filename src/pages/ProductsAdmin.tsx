import { useState, useEffect } from 'react';
import { useProducts } from '../store/products';
import { useAuthStore } from '../store/auth';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';
import { translateCategory } from '../utils/categoryTranslator';

export default function ProductsAdmin() {
    const { user } = useAuthStore();
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
	const { products, addProduct, removeProduct, updateProduct, getCategories, getCategoriesForDisplay, getBrands, fetchProducts, loading, error } = useProducts();
	const categories = getCategories();
	const brands = getBrands();
	const [open, setOpen] = useState(false);
	const [q, setQ] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [brandFilter, setBrandFilter] = useState('all');
	const [sortBy, setSortBy] = useState('name');
	const [form, setForm] = useState({ 
		name: '', 
		price: 0, 
		category: categories[0] || '', 
		brand: brands[0] || '',
		description: '',
		image: '',
		rating: 0,
		isNew: false,
		isSale: false
	});
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [editingProduct, setEditingProduct] = useState(null);

	// Fetch products when component mounts
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const filteredProducts = products
		.filter(p => p && p.name) // Filter out undefined/null products
		.filter(p => {
			const matchesSearch = p.name.toLowerCase().includes(q.toLowerCase());
			const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
			const matchesBrand = brandFilter === 'all' || p.brand === brandFilter;
			return matchesSearch && matchesCategory && matchesBrand;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name);
				case 'price-low':
					return a.price - b.price;
				case 'price-high':
					return b.price - a.price;
				case 'category':
					return a.category.localeCompare(b.category);
				default:
					return 0;
			}
		});

	const handleSubmit = async () => {
		if (form.name && form.price > 0 && form.category && form.brand) {
			try {
				await addProduct({
					name: form.name,
					price: form.price,
					category: form.category,
					brand: form.brand,
					description: form.description,
					image: form.image,
					rating: form.rating,
					isNew: form.isNew,
					isSale: form.isSale
				});
				
				// Show success message
				setSuccessMessage(`Product "${form.name}" added successfully!`);
				setShowSuccessMessage(true);
				setTimeout(() => setShowSuccessMessage(false), 3000);
				
				setOpen(false);
				setForm({ 
					name: '', 
					price: 0, 
					category: categories[0] || '', 
					brand: brands[0] || '',
					description: '',
					image: '',
					rating: 0,
					isNew: false,
					isSale: false
				});
			} catch (error) {
				console.error('Failed to add product:', error);
			}
		}
	};

	return (
		<div className="mx-auto max-w-7xl p-4 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Product Management</h1>
				<Link to="/admin" className="text-blue-600 hover:text-blue-700">← Back to Dashboard</Link>
			</div>

			{/* Error Display */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					<strong>Error:</strong> {error}
				</div>
			)}

			{/* Success Message */}
			{showSuccessMessage && (
				<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
					<strong>Success:</strong> {successMessage}
				</div>
			)}

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="card-themed p-6 rounded-2xl">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Products</p>
							<p className="text-3xl font-bold text-blue-600">{products.length}</p>
						</div>
						<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
							<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
						</div>
					</div>
				</div>

				<div className="card-themed p-6 rounded-2xl">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Categories</p>
							<p className="text-3xl font-bold text-green-600">{categories.length}</p>
						</div>
						<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
							<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
							</svg>
						</div>
					</div>
				</div>

				<div className="card-themed p-6 rounded-2xl">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Brands</p>
							<p className="text-3xl font-bold text-purple-600">{brands.length}</p>
						</div>
						<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
							<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 9h6m-6 4h6m-6 4h6" />
							</svg>
						</div>
					</div>
				</div>

				<div className="card-themed p-6 rounded-2xl">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">New Products</p>
							<p className="text-3xl font-bold text-orange-600">{products.filter(p => p.isNew).length}</p>
						</div>
						<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
							<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					</div>
				</div>
			</div>

			{/* Filters and Search */}
			<div className="card-themed p-6 rounded-2xl relative z-20">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
						<input
							type="text"
							placeholder="Search by name..."
							value={q}
							onChange={(e) => setQ(e.target.value)}
							className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
						<CustomSelect
							options={[
								{ value: "all", label: "All Categories" },
								...categories.map(c => ({
									value: c,
									label: translateCategory(c)
								}))
							]}
							value={categoryFilter}
							onChange={setCategoryFilter}
							placeholder="Select category..."
							allowCustomInput={false}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Filter by Brand</label>
						<CustomSelect
							options={[
								{ value: "all", label: "All Brands" },
								...brands.map(b => ({ value: b, label: b }))
							]}
							value={brandFilter}
							onChange={setBrandFilter}
							placeholder="Select brand..."
							allowCustomInput={false}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
						<CustomSelect
							options={[
								{ value: "name", label: "Name A-Z" },
								{ value: "price-low", label: "Price: Low to High" },
								{ value: "price-high", label: "Price: High to Low" },
								{ value: "category", label: "Category" }
							]}
							value={sortBy}
							onChange={setSortBy}
							placeholder="Sort by..."
							allowCustomInput={false}
						/>
					</div>
				</div>
			</div>

			{/* Add Product Button */}
			<div className="flex justify-end">
				<button 
					className="btn-primary rounded-full px-6 py-3"
					onClick={() => setOpen(true)}
				>
					+ Add New Product
				</button>
			</div>

			{/* Products Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-0">
				{filteredProducts.map(product => (
					<div 
						key={product.id} 
						className="card-themed rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
						onClick={() => setSelectedProduct(product)}
					>
						<div className="h-48 bg-gray-200 flex items-center justify-center relative">
							{product.image ? (
								<img 
									src={product.image} 
									alt={product.name} 
									className="w-full h-full object-cover" 
									onLoad={() => {
										// Image loaded successfully
									}}
									onError={() => {
										// Image failed to load, will show placeholder
									}}
								/>
							) : (
								<div className="text-gray-400 text-center">
									<svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<p className="text-sm">No Image</p>
								</div>
							)}
						</div>
						<div className="p-4">
							<div className="flex items-center gap-2 mb-2">
								{product.isNew && <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">New</span>}
								{product.isSale && <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">Sale</span>}
							</div>
							<h3 className="font-semibold text-lg mb-1">{product.name}</h3>
							<p className="text-sm text-gray-600 mb-2">
								{product.brand} • {translateCategory(product.category)}
							</p>
							<div className="flex items-center justify-between">
								<span className="text-xl font-bold text-blue-600">฿{product.price.toLocaleString()}</span>
								<button 
									onClick={(e) => {
										e.stopPropagation();
										removeProduct(product.id);
									}}
									className="text-red-600 hover:text-red-700 text-sm font-medium"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{filteredProducts.length === 0 && (
				<div className="text-center py-12">
					<div className="text-gray-500 text-lg">No products found</div>
					<div className="text-gray-400 text-sm">Try adjusting your search or filter criteria</div>
				</div>
			)}

			{/* Product Detail Modal */}
			{selectedProduct && (
				<div className="fixed inset-0 z-[10000] flex items-center justify-center">
					<div className="absolute inset-0 bg-black/40" onClick={() => setSelectedProduct(null)}></div>
					<div className="relative bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
							<button 
								onClick={() => setSelectedProduct(null)}
								className="text-gray-400 hover:text-gray-600"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Product Image */}
							<div className="space-y-4">
								<div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden relative">
									{loading ? (
										<div className="w-full h-full flex items-center justify-center">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
										</div>
									) : selectedProduct.image ? (
										<img 
											src={selectedProduct.image} 
											alt={selectedProduct.name} 
											className="w-full h-full object-cover" 
											onLoad={() => {
												// Image loaded successfully
											}}
											onError={() => {
												// Image failed to load, will show placeholder
											}}
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
									)}
								</div>
								
								{/* Badges */}
								<div className="flex gap-2">
									{selectedProduct.isNew && (
										<span className="bg-emerald-500 text-white text-sm px-3 py-1 rounded-full">
											New Product
										</span>
									)}
									{selectedProduct.isSale && (
										<span className="bg-rose-500 text-white text-sm px-3 py-1 rounded-full">
											On Sale
										</span>
									)}
								</div>
							</div>

							{/* Product Information */}
							<div className="space-y-6">
								<div>
									<h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>
									<div className="flex items-center gap-4 text-lg text-gray-600 mb-4">
										<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
											{selectedProduct.brand}
										</span>
										<span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
											{translateCategory(selectedProduct.category)}
										</span>
									</div>
									<div className="text-4xl font-bold text-blue-600 mb-4">
										฿{selectedProduct.price.toLocaleString()}
									</div>
								</div>

								{/* Rating */}
								<div className="flex items-center gap-2">
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<svg
												key={i}
												className={`w-5 h-5 ${
													i < Math.floor(selectedProduct.rating)
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
										{selectedProduct.rating}/5.0
									</span>
								</div>

								{/* Description */}
								<div>
									<h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
									<p className="text-gray-600 leading-relaxed">
										{selectedProduct.description || 'No description available for this product.'}
									</p>
								</div>

								{/* Product ID */}
								<div className="pt-4 border-t border-gray-200">
									<p className="text-sm text-gray-500">
										Product ID: <span className="font-mono text-gray-700">{selectedProduct.id}</span>
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
							<button
								onClick={() => {
									setEditingProduct(selectedProduct);
									setSelectedProduct(null);
								}}
								className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors"
							>
								Edit Product
							</button>
							<button
								onClick={() => {
									if (window.confirm('Are you sure you want to delete this product?')) {
										removeProduct(selectedProduct.id);
										setSelectedProduct(null);
									}
								}}
								className="flex-1 bg-red-600 text-white py-3 px-6 rounded-full font-medium hover:bg-red-700 transition-colors"
							>
								Delete Product
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Add Product Modal */}
			{open && (
				<div className="fixed inset-0 z-[10000] flex items-center justify-center">
					<div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)}></div>
					<div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
						<h2 className="text-2xl font-bold mb-6">Add New Product</h2>
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
									<input
										className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
										placeholder="Enter product name"
										value={form.name}
										onChange={(e) => setForm({...form, name: e.target.value})}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
									<input
										type="number"
										className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
										placeholder="Enter price"
										value={form.price}
										onChange={(e) => setForm({...form, price: Number(e.target.value)})}
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
									<CustomSelect
										options={getCategoriesForDisplay()}
										value={form.category}
										onChange={(value) => setForm({...form, category: value})}
										placeholder="Select or type category..."
										allowCustomInput={true}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
									<CustomSelect
										options={brands.map(b => ({ value: b, label: b }))}
										value={form.brand}
										onChange={(value) => setForm({...form, brand: value})}
										placeholder="Select or type brand..."
										allowCustomInput={true}
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
								<textarea
									className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
									placeholder="Enter product description"
									rows={3}
									value={form.description}
									onChange={(e) => setForm({...form, description: e.target.value})}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
								<input
									className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
									placeholder="Enter image URL"
									value={form.image}
									onChange={(e) => setForm({...form, image: e.target.value})}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
									<input
										type="number"
										min="0"
										max="5"
										step="0.1"
										className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
										value={form.rating}
										onChange={(e) => setForm({...form, rating: Number(e.target.value)})}
									/>
								</div>
								<div className="flex items-center gap-4">
									<label className="flex items-center">
										<input
											type="checkbox"
											className="mr-2"
											checked={form.isNew}
											onChange={(e) => setForm({...form, isNew: e.target.checked})}
										/>
										<span className="text-sm">New Product</span>
									</label>
									<label className="flex items-center">
										<input
											type="checkbox"
											className="mr-2"
											checked={form.isSale}
											onChange={(e) => setForm({...form, isSale: e.target.checked})}
										/>
										<span className="text-sm">On Sale</span>
									</label>
								</div>
							</div>
						</div>
						<div className="flex gap-3 mt-6">
							<button 
								className="flex-1 border rounded-full px-4 py-2 hover:bg-gray-50"
								onClick={() => setOpen(false)}
							>
								Cancel
							</button>
							<button 
								className="flex-1 btn-primary rounded-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={loading}
								onClick={handleSubmit}
							>
								{loading ? 'Adding...' : 'Add Product'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit Product Modal */}
			{editingProduct && (
				<div className="fixed inset-0 z-[10000] flex items-center justify-center">
					<div className="absolute inset-0 bg-black/40" onClick={() => setEditingProduct(null)}></div>
					<div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
						<h2 className="text-2xl font-bold mb-6">Edit Product</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
								<input
									className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
									placeholder="Enter product name"
									value={editingProduct.name}
									onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
									<input
										type="number"
										className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
										placeholder="Enter price"
										value={editingProduct.price}
										onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
									<CustomSelect
										options={getCategoriesForDisplay()}
										value={editingProduct.category}
										onChange={(value) => setEditingProduct({...editingProduct, category: value})}
										placeholder="Select category..."
										allowCustomInput={false}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
									<CustomSelect
										options={brands.map(b => ({ value: b, label: b }))}
										value={editingProduct.brand}
										onChange={(value) => setEditingProduct({...editingProduct, brand: value})}
										placeholder="Select brand..."
										allowCustomInput={false}
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
								<textarea
									className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
									placeholder="Enter product description"
									rows={3}
									value={editingProduct.description}
									onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
								<input
									className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
									placeholder="Enter image URL"
									value={editingProduct.image}
									onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
									<input
										type="number"
										min="0"
										max="5"
										step="0.1"
										className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
										value={editingProduct.rating}
										onChange={(e) => setEditingProduct({...editingProduct, rating: Number(e.target.value)})}
									/>
								</div>
								<div className="flex items-center gap-4">
									<label className="flex items-center">
										<input
											type="checkbox"
											className="mr-2"
											checked={editingProduct.isNew}
											onChange={(e) => setEditingProduct({...editingProduct, isNew: e.target.checked})}
										/>
										<span className="text-sm">New Product</span>
									</label>
									<label className="flex items-center">
										<input
											type="checkbox"
											className="mr-2"
											checked={editingProduct.isSale}
											onChange={(e) => setEditingProduct({...editingProduct, isSale: e.target.checked})}
										/>
										<span className="text-sm">On Sale</span>
									</label>
								</div>
							</div>
						</div>
						<div className="flex gap-3 mt-6">
							<button 
								className="flex-1 border rounded-full px-4 py-2 hover:bg-gray-50"
								onClick={() => setEditingProduct(null)}
							>
								Cancel
							</button>
							<button 
								className="flex-1 btn-primary rounded-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={loading}
								onClick={async () => {
									try {
										const updatedProduct = await updateProduct(editingProduct.id, editingProduct);
										// Update selectedProduct with the updated data
										if (selectedProduct && selectedProduct.id === editingProduct.id) {
											setSelectedProduct(updatedProduct);
										}
										setEditingProduct(null);
									} catch (error) {
										console.error('Failed to update product:', error);
									}
								}}
							>
								{loading ? 'Updating...' : 'Update Product'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}



