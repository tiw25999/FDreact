import { create } from 'zustand';

export type Product = {
	id: string;
	name: string;
	price: number;
	image: string;
	description: string;
	category: string;
	brand: string;
	rating: number; // 0-5
	isNew?: boolean;
	isSale?: boolean;
};

type AddProductPayload = { 
	name: string; 
	price: number; 
	category?: string; 
	brand?: string;
	description?: string;
	image?: string;
	rating?: number;
	isNew?: boolean;
	isSale?: boolean;
};

type ProductsState = {
	products: Product[];
	query: string;
	setQuery: (q: string) => void;
	filteredProducts: Product[];
	addProduct: (p: AddProductPayload) => void;
	updateProduct: (id: string, updates: Partial<Product>) => void;
	removeProduct: (id: string) => void;
	reloadProducts: () => void;
	filters: { category?: string; brand?: string; min?: number; max?: number; sort?: 'new'|'low'|'high'|'best' };
	setFilters: (f: Partial<ProductsState['filters']>) => void;
	categories: string[];
	brands: string[];
	getCategories: () => string[];
	getBrands: () => string[];
};

const SAMPLE_IMAGES = [
	'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
];

const categories = ['มือถือ', 'แล็ปท็อป', 'อุปกรณ์เสริม'];
const brands = ['A-Tech', 'B-Plus', 'C-Lab'];

const initialProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
	id: `p${i + 1}`,
	name: `Electronic Product ${i + 1}`,
	price: 990 + i * 100,
	image: SAMPLE_IMAGES[i % SAMPLE_IMAGES.length],
	description: 'Short product description for project demonstration',
	category: categories[i % categories.length],
	brand: brands[i % brands.length],
	rating: (i % 5) + 1,
	isNew: i % 4 === 0,
	isSale: i % 3 === 0,
}));

// Load products from localStorage or use initial
const loadProducts = (): Product[] => {
	try {
		const saved = localStorage.getItem('etech_products');
		if (saved) {
			const parsed = JSON.parse(saved);
			return Array.isArray(parsed) ? parsed : initialProducts;
		}
		return initialProducts;
	} catch {
		return initialProducts;
	}
};

// Save products to localStorage
const saveProducts = (products: Product[]) => {
	try {
		localStorage.setItem('etech_products', JSON.stringify(products));
	} catch (error) {
		console.error('Error saving products:', error);
	}
};

export const useProducts = create<ProductsState>((set, get) => ({
	products: loadProducts(),
	query: '',
	setQuery: (q) => set({ query: q }),
	filters: {},
	setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
	categories,
	brands,
	getCategories: () => {
		const products = Array.isArray(get().products) ? get().products : [];
		const uniqueCategories = [...new Set(products.map(p => p.category))];
		return [...new Set([...categories, ...uniqueCategories])];
	},
	getBrands: () => {
		const products = Array.isArray(get().products) ? get().products : [];
		const uniqueBrands = [...new Set(products.map(p => p.brand))];
		return [...new Set([...brands, ...uniqueBrands])];
	},
	get filteredProducts() {
		const q = get().query.trim().toLowerCase();
		const { category, brand, min, max, sort } = get().filters;
		const products = Array.isArray(get().products) ? get().products : [];
		let list = products.filter(p =>
			(!q || p.name.toLowerCase().includes(q)) &&
			(!category || p.category === category) &&
			(!brand || p.brand === brand) &&
			(min === undefined || p.price >= min) &&
			(max === undefined || p.price <= max)
		);
		if (sort === 'new') list = [...list].sort((a,b)=> Number(b.isNew) - Number(a.isNew));
		if (sort === 'low') list = [...list].sort((a,b)=> a.price - b.price);
		if (sort === 'high') list = [...list].sort((a,b)=> b.price - a.price);
		if (sort === 'best') list = [...list].sort((a,b)=> b.rating - a.rating);
		return list;
	},
	addProduct: ({ name, price, category, brand, description, image, rating, isNew, isSale }) => set(state => {
		const currentProducts = Array.isArray(state.products) ? state.products : [];
		const id = `p${currentProducts.length + 1}`;
		const product: Product = { 
			id, 
			name, 
			price, 
			image: image || SAMPLE_IMAGES[currentProducts.length % SAMPLE_IMAGES.length], 
			description: description || 'New product added', 
			category: category || categories[0], 
			brand: brand || brands[0], 
			rating: rating || 4, 
			isNew: isNew || false,
			isSale: isSale || false
		};
		const newProducts = [product, ...currentProducts];
		saveProducts(newProducts);
		
		// Update categories and brands arrays with new unique values
		const newCategories = [...new Set([...categories, product.category])];
		const newBrands = [...new Set([...brands, product.brand])];
		
		return { 
			products: newProducts,
			categories: newCategories,
			brands: newBrands
		};
	}),
	updateProduct: (id, updates) => set(state => {
		const currentProducts = Array.isArray(state.products) ? state.products : [];
		const newProducts = currentProducts.map(p => p.id === id ? { ...p, ...updates } : p);
		saveProducts(newProducts);
		
		// Update categories and brands arrays with new unique values from all products
		const allCategories = [...new Set(newProducts.map(p => p.category))];
		const allBrands = [...new Set(newProducts.map(p => p.brand))];
		const newCategories = [...new Set([...categories, ...allCategories])];
		const newBrands = [...new Set([...brands, ...allBrands])];
		
		return { 
			products: newProducts,
			categories: newCategories,
			brands: newBrands
		};
	}),
	removeProduct: (id) => set(state => {
		const currentProducts = Array.isArray(state.products) ? state.products : [];
		const newProducts = currentProducts.filter(p => p.id !== id);
		saveProducts(newProducts);
		
		// Update categories and brands arrays with remaining unique values
		const allCategories = [...new Set(newProducts.map(p => p.category))];
		const allBrands = [...new Set(newProducts.map(p => p.brand))];
		const newCategories = [...new Set([...categories, ...allCategories])];
		const newBrands = [...new Set([...brands, ...allBrands])];
		
		return { 
			products: newProducts,
			categories: newCategories,
			brands: newBrands
		};
	}),
	reloadProducts: () => set(state => {
		const newProducts = loadProducts();
		const allCategories = [...new Set(newProducts.map(p => p.category))];
		const allBrands = [...new Set(newProducts.map(p => p.brand))];
		const newCategories = [...new Set([...categories, ...allCategories])];
		const newBrands = [...new Set([...brands, ...allBrands])];
		
		return { 
			products: newProducts,
			categories: newCategories,
			brands: newBrands
		};
	}),
}));



