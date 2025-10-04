import { useProducts, type Product } from '../store';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import HeroBanner from '../components/HeroBanner';
import CategoryChips from '../components/CategoryChips';

export default function Dashboard() {
	type ProductsState = ReturnType<typeof useProducts.getState>;
	const allProducts = useProducts((s: ProductsState) => s.products);
	const getFilteredProducts = useProducts((s: ProductsState) => s.getFilteredProducts);
	const filters = useProducts((s: ProductsState) => s.filters);
	const query = useProducts((s: ProductsState) => s.query);
	
	// Get filtered products - call once and store result
	const products = getFilteredProducts();
	
	// Debug: Log products data (removed excessive logging)

	return (
    <div className="mx-auto max-w-[1400px] 2xl:max-w-[1600px] p-4">
			<HeroBanner />
			<h1 className="text-2xl font-bold mb-2">Home</h1>
			<CategoryChips />
            {products.filter(p => p && p.id && p.name).length === 0 ? (
				<EmptyState title="ยังไม่มีสินค้า" />
			) : (
                <div className="grid grid-cols-12 gap-6">
                    {products.filter(p => p && p.id && p.name).map((p: Product) => (
                        <div key={p.id} className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 2xl:col-span-2">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
			)}
		</div>
	);
}



