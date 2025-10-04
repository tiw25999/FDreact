import { create } from 'zustand';
import apiClient from '../utils/apiClient';
import { translateCategory } from '../utils/categoryTranslator';

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
	stockQuantity?: number;
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
	loading: boolean;
	error: string | null;
	query: string;
	setQuery: (q: string) => void;
	fetchProducts: () => Promise<void>;
	fetchCategories: () => Promise<any[]>;
	fetchBrands: () => Promise<any[]>;
	addProduct: (p: AddProductPayload) => Promise<void>;
	updateProduct: (id: string, updates: Partial<Product>) => Promise<any>;
	removeProduct: (id: string) => Promise<void>;
	reloadProducts: () => void;
	filters: { category?: string; brand?: string; min?: number; max?: number; sort?: 'new'|'low'|'high'|'best' };
	setFilters: (f: Partial<ProductsState['filters']>) => void;
	clearAllFilters: () => void;
	categories: string[];
	brands: string[];
	getCategories: () => string[];
	getBrands: () => string[];
	getCategoriesForDisplay: () => Array<{ value: string; label: string }>;
	getBrandsForDisplay: () => Array<{ value: string; label: string }>;
	getFilteredProducts: () => Product[];
	cache: {
		products: Product[];
		categories: any[];
		brands: any[];
		lastFetch: number;
	};
};

const categories = ['มือถือ', 'แล็ปท็อป', 'อุปกรณ์เสริม', 'หูฟัง', 'กล้อง'];
const brands = ['A-Tech', 'B-Plus', 'C-Lab'];


export const useProducts = create<ProductsState>((set, get) => ({
	products: [],
	loading: false,
	error: null,
	query: '',
	setQuery: (q) => set({ query: q }),
	filters: {},
	setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
	clearAllFilters: () => set({ query: '', filters: {} }),
	categories: [],
	brands: [],
	cache: {
		products: [],
		categories: [],
		brands: [],
		lastFetch: 0
	},
	fetchProducts: async () => {
		const { cache } = get();
		const now = Date.now();
		const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
		
		// Check if cache is still valid
		if (cache.products.length > 0 && (now - cache.lastFetch) < CACHE_DURATION) {
			set({ products: cache.products, loading: false });
			return;
		}
		
		set({ loading: true, error: null });
		try {
			const response = await apiClient.get('/products');
			const { data } = response.data;
			
			// Transform backend data to frontend format
			const transformedProducts = data
				.filter((product: any) => product && product.id && product.name) // Filter out invalid products
				.map((product: any) => ({
					id: product.id,
					name: product.name,
					price: product.price,
					image: product.image_url,
					description: product.description,
					category: product.categories?.name || 'Unknown',
					brand: product.brands?.name || 'Unknown',
					rating: product.rating || 0,
					isNew: product.is_new || false,
					isSale: product.is_sale || false,
					stockQuantity: product.stock_quantity
				}));
			
			// Update cache
			set(state => ({ 
				...state,
				products: transformedProducts, 
				loading: false,
				cache: {
					...state.cache,
					products: transformedProducts,
					lastFetch: now
				}
			}));
		} catch (error) {
			console.error('Failed to fetch products:', error);
			set({ error: 'Failed to fetch products', loading: false });
		}
	},
	fetchCategories: async () => {
		const { cache } = get();
		const now = Date.now();
		const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
		
		// Check if cache is still valid
		if (cache.categories.length > 0 && (now - cache.lastFetch) < CACHE_DURATION) {
			console.log('Using cached categories:', cache.categories);
			return cache.categories;
		}
		
		try {
			console.log('Fetching categories from API...');
			const response = await apiClient.get('/products/categories');
			const { data } = response.data;
			console.log('Categories fetched:', data);
			
			// Update cache
			set(state => ({
				...state,
				cache: {
					...state.cache,
					categories: data,
					lastFetch: now
				}
			}));
			
			return data;
		} catch (error) {
			console.error('Failed to fetch categories:', error);
			return [];
		}
	},
	fetchBrands: async () => {
		const { cache } = get();
		const now = Date.now();
		const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
		
		// Check if cache is still valid
		if (cache.brands.length > 0 && (now - cache.lastFetch) < CACHE_DURATION) {
			console.log('Using cached brands:', cache.brands);
			return cache.brands;
		}
		
		try {
			console.log('Fetching brands from API...');
			const response = await apiClient.get('/products/brands');
			const { data } = response.data;
			console.log('Brands fetched:', data);
			
			// Update cache
			set(state => ({
				...state,
				cache: {
					...state.cache,
					brands: data,
					lastFetch: now
				}
			}));
			
			return data;
		} catch (error) {
			console.error('Failed to fetch brands:', error);
			return [];
		}
	},
	getCategories: () => {
		const { cache } = get();
		return cache.categories.map((c: any) => c.name);
	},
	getBrands: () => {
		const { cache } = get();
		return cache.brands.map((b: any) => b.name);
	},
	getFilteredProducts: () => {
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
	addProduct: async ({ name, price, category, brand, description, image, rating, isNew, isSale }) => {
		set({ loading: true, error: null });
		try {
			const { cache } = get();
			const now = Date.now();
			const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for categories/brands
			
			let categoryData, brandData;
			
			// Check cache for categories
			if (cache.categories.length > 0 && (now - cache.lastFetch) < CACHE_DURATION) {
				categoryData = cache.categories.find((c: any) => c.name === category);
			} else {
				const categoryResponse = await apiClient.get('/products/categories');
				categoryData = categoryResponse.data.data.find((c: any) => c.name === category);
				// Update cache
				set(state => ({
					cache: {
						...state.cache,
						categories: categoryResponse.data.data,
						lastFetch: now
					}
				}));
			}
			
			// Check cache for brands
			if (cache.brands.length > 0 && (now - cache.lastFetch) < CACHE_DURATION) {
				brandData = cache.brands.find((b: any) => b.name === brand);
			} else {
				const brandResponse = await apiClient.get('/products/brands');
				brandData = brandResponse.data.data.find((b: any) => b.name === brand);
				// Update cache
				set(state => ({
					cache: {
						...state.cache,
						brands: brandResponse.data.data,
						lastFetch: now
					}
				}));
			}
			
			if (!categoryData || !brandData) {
				throw new Error(`Category "${category}" or brand "${brand}" not found`);
			}
			
			// If category doesn't exist, create it
			if (!categoryData) {
				console.log(`Creating new category: ${category}`);
				const newCategoryResponse = await apiClient.post('/products/categories', { name: category });
				categoryData = newCategoryResponse.data.data;
			}
			
			// If brand doesn't exist, create it
			if (!brandData) {
				console.log(`Creating new brand: ${brand}`);
				const newBrandResponse = await apiClient.post('/products/brands', { name: brand });
				brandData = newBrandResponse.data.data;
			}
			
			const response = await apiClient.post('/products', {
				name,
				price,
				description,
				categoryId: categoryData.id,
				brandId: brandData.id,
				imageUrl: image,
				rating,
				isNew,
				isSale
			});
			
			// Transform the response data to match frontend format
			const transformedProduct = {
				id: response.data.id,
				name: response.data.name,
				price: response.data.price,
				image: response.data.image_url,
				description: response.data.description,
				category: category || 'Unknown',
				brand: brand || 'Unknown',
				rating: response.data.rating || 0,
				isNew: response.data.is_new || false,
				isSale: response.data.is_sale || false,
				stockQuantity: response.data.stock_quantity
			};
			
			set(state => ({ 
				...state,
				products: [transformedProduct, ...state.products], 
				loading: false 
			}));
			
			// Refresh categories and brands after adding new ones
			await get().fetchProducts();
		} catch (error) {
			console.error('Add product error:', error);
			set({ error: 'Failed to add product', loading: false });
		}
	},
	updateProduct: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const response = await apiClient.put(`/admin/products/${id}`, updates);
			const { data } = response.data;
			
			// Transform the data to match frontend format
			const transformedProduct = {
				id: data.id,
				name: data.name,
				price: data.price,
				image: data.image_url,
				description: data.description,
				category: data.category,
				brand: data.brand,
				rating: data.rating || 0,
				isNew: data.is_new || false,
				isSale: data.is_sale || false,
				stockQuantity: data.stock_quantity
			};
			
			set(state => ({
				...state,
				products: state.products.map(p => p.id === id ? transformedProduct : p),
				loading: false
			}));
			
			return transformedProduct;
		} catch (error) {
			set({ error: 'Failed to update product', loading: false });
			throw error;
		}
	},
	removeProduct: async (id) => {
		set({ loading: true, error: null });
		try {
			await apiClient.delete(`/admin/products/${id}`);
			set(state => ({
				...state,
				products: state.products.filter(p => p.id !== id),
				loading: false
			}));
		} catch (error) {
			set({ error: 'Failed to remove product', loading: false });
		}
	},
	reloadProducts: () => {
		// Refetch products from API instead of using dummy data
		get().fetchProducts();
	},

	getCategoriesForDisplay: () => {
		const { cache } = get();
		console.log('getCategoriesForDisplay - cache.categories:', cache.categories);
		const result = cache.categories.map((cat: any) => ({
			value: cat.name,
			label: translateCategory(cat.name)
		}));
		console.log('getCategoriesForDisplay - result:', result);
		return result;
	},
	getBrandsForDisplay: () => {
		const { cache } = get();
		console.log('getBrandsForDisplay - cache.brands:', cache.brands);
		const result = cache.brands.map((brand: any) => ({
			value: brand.name,
			label: brand.name
		}));
		console.log('getBrandsForDisplay - result:', result);
		return result;
	},
}));



