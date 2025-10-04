import { useProducts } from '../store/products';
import ProductCard from '../components/ProductCard';
import CustomSelect from '../components/CustomSelect';
import { useToast } from '../components/Toast';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategoryOptions, translateCategory } from '../utils/categoryTranslator';

export default function Search() {
    const { products, setQuery, getCategories, getCategoriesForDisplay, getBrands, getBrandsForDisplay, setFilters, filters, query, fetchCategories, fetchBrands } = useProducts();
    const categories = getCategories();
    const brands = getBrands();
    const [drawer, setDrawer] = useState(false);
    const [params, setParams] = useSearchParams();

	const { push } = useToast();

    // Load categories and brands on component mount
    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, [fetchCategories, fetchBrands]);

    // sync sort via query string (?sort=best|low|high|new)
    useEffect(() => {
        const sort = params.get('sort');
        const category = params.get('category') || undefined;
        const brand = params.get('brand') || undefined;
        const min = params.get('min');
        const max = params.get('max');
        const q = params.get('q');
        if (sort) setFilters({ sort: sort as any });
        setFilters({ category, brand, min: min? Number(min): undefined, max: max? Number(max): undefined });
        if (q) setQuery(q);
    }, [params, setFilters, setQuery]);

    const sortKey = params.get('sort') || 'new';
    const view = useMemo(() => {
        const q = (query || '').trim().toLowerCase();
        let arr = products.filter(p =>
            (!q || p.name.toLowerCase().includes(q)) &&
            (!filters.category || p.category === filters.category) &&
            (!filters.brand || p.brand === filters.brand) &&
            (filters.min === undefined || p.price >= filters.min) &&
            (filters.max === undefined || p.price <= filters.max)
        );
        if (sortKey === 'low') return arr.sort((a,b)=> a.price - b.price);
        if (sortKey === 'high') return arr.sort((a,b)=> b.price - a.price);
        if (sortKey === 'best') return arr.sort((a,b)=> b.rating - a.rating);
        if (sortKey === 'new') return arr.sort((a,b)=> Number(b.isNew) - Number(a.isNew));
        return arr;
    }, [products, filters, query, sortKey]);

    return (
        <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] p-4">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Search & Filters</h1>
				<div className="flex items-center gap-3">
                    <CustomSelect
                        options={[
                            { value: "new", label: "Newest" },
                            { value: "low", label: "Price: Low to High" },
                            { value: "high", label: "Price: High to Low" },
                            { value: "best", label: "Top Rated" }
                        ]}
                        value={sortKey}
                        onChange={(value) => {
                            const p = Object.fromEntries(params.entries());
                            setFilters({ sort: value as any });
                            setParams({ ...p, sort: value });
                        }}
                        placeholder="Sort by..."
                        className="w-48"
                        allowCustomInput={false}
                    />
					<button className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={()=>setDrawer(true)}>Filters</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-visible">
                <aside className="hidden md:block space-y-6 bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-3xl p-6 h-max shadow-lg relative z-10 overflow-visible" style={{ isolation: 'isolate' }}>
                    <input className="w-full border-2 border-gray-200 rounded-full px-4 py-3 text-sm font-medium bg-white shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200" placeholder="Search products..." defaultValue={params.get('q')||''} onChange={e=>{ const p = Object.fromEntries(params.entries()); setQuery(e.target.value); setParams({ ...p, q: e.target.value }); }} />
					<div className="relative z-60">
						<div className="font-semibold text-gray-700 mb-2 text-sm">Category</div>
                        <CustomSelect
                            options={getCategoriesForDisplay()}
                            value={filters.category || ''}
                            onChange={(value) => {
                                const p = Object.fromEntries(params.entries());
                                setFilters({ category: value || undefined });
                                setParams({ ...p, category: value });
                            }}
                            placeholder="Select category..."
                            allowCustomInput={false}
                        />
					</div>
					<div className="relative z-50">
						<div className="font-semibold text-gray-700 mb-2 text-sm">Brand</div>
                        <CustomSelect
                            options={[
                                { value: "", label: "All Brands" },
                                ...getBrandsForDisplay()
                            ]}
                            value={filters.brand || ''}
                            onChange={(value) => {
                                const p = Object.fromEntries(params.entries());
                                setFilters({ brand: value || undefined });
                                setParams({ ...p, brand: value });
                            }}
                            placeholder="Select brand..."
                            allowCustomInput={false}
                        />
					</div>
					<div className="grid grid-cols-2 gap-3">
                        <input type="number" className="border-2 border-gray-200 rounded-full px-4 py-3 text-sm font-medium bg-white shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200" placeholder="Min price" defaultValue={params.get('min')||''} onChange={e=>{ const p = Object.fromEntries(params.entries()); const v = e.target.value; setFilters({ min: v? Number(v): undefined }); setParams({ ...p, min: v }); }} />
                        <input type="number" className="border-2 border-gray-200 rounded-full px-4 py-3 text-sm font-medium bg-white shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200" placeholder="Max price" defaultValue={params.get('max')||''} onChange={e=>{ const p = Object.fromEntries(params.entries()); const v = e.target.value; setFilters({ max: v? Number(v): undefined }); setParams({ ...p, max: v }); }} />
					</div>
				</aside>

                <section className="md:col-span-3">
                    <div className="grid grid-cols-12 gap-6 relative z-0">
                        {view.map(p => (
                            <div key={p.id} className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-3 2xl:col-span-2" onClick={()=>push(`Selected ${p.name}`)}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
				</section>
			</div>

			{/* Mobile Drawer */}
			{drawer && (
				<div className="fixed inset-0 z-[10000] md:hidden">
					<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setDrawer(false)}></div>
					<div className="absolute top-0 right-0 h-full w-80 bg-gradient-to-br from-white to-blue-50 p-6 space-y-4 shadow-2xl overflow-visible">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Filters</h2>
							<button onClick={()=>setDrawer(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<input className="w-full border-2 border-gray-200 rounded-full px-4 py-3 text-sm font-medium bg-white shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200" placeholder="Search products..." onChange={e=>setQuery(e.target.value)} />
						<div className="relative z-60">
							<div className="font-semibold text-gray-700 mb-2 text-sm">Category</div>
							<CustomSelect
								options={[
									{ value: "", label: "All Categories" },
									...getCategoriesForDisplay()
								]}
								value={filters.category || ''}
								onChange={(value) => setFilters({ category: value || undefined })}
								placeholder="Select category..."
								allowCustomInput={false}
							/>
						</div>
						<div className="relative z-50">
							<div className="font-semibold text-gray-700 mb-2 text-sm">Brand</div>
							<CustomSelect
								options={[
									{ value: "", label: "All Brands" },
									...getBrandsForDisplay()
								]}
								value={filters.brand || ''}
								onChange={(value) => setFilters({ brand: value || undefined })}
								placeholder="Select brand..."
								allowCustomInput={false}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<input type="number" className="border-2 border-gray-200 rounded-full px-4 py-3 text-sm font-medium bg-white shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200" placeholder="Min price" onChange={e=>setFilters({ min: Number(e.target.value)||undefined })} />
							<input type="number" className="border-2 border-gray-200 rounded-full px-4 py-3 text-sm font-medium bg-white shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200" placeholder="Max price" onChange={e=>setFilters({ max: Number(e.target.value)||undefined })} />
						</div>
						<button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full py-3 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={()=>setDrawer(false)}>Apply Filters</button>
					</div>
				</div>
			)}
		</div>
	);
}



