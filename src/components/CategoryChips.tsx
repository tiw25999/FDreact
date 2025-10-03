import { Link } from 'react-router-dom';
import { useProducts } from '../store/products';

export default function CategoryChips() {
	const { getCategories } = useProducts();
	const categories = getCategories();
	
	// Map Thai categories to English
	const categoryMap: { [key: string]: string } = {
		'มือถือ': 'Mobile',
		'แล็ปท็อป': 'Laptop', 
		'อุปกรณ์เสริม': 'Accessories'
	};
	
	// All categories including "All"
	const allCategories = [
		{ thai: '', english: 'All' },
		...categories.map(c => ({ thai: c, english: categoryMap[c] || c }))
	];
	
	return (
		<div className="flex flex-wrap gap-2 mb-4">
			{allCategories.map(category => (
				<Link
					key={category.thai || 'all'}
					to={category.thai ? `/search?category=${encodeURIComponent(category.thai)}` : '/search'}
					className="px-3 py-1 rounded-full border text-sm hover:bg-blue-50 transition-colors duration-200"
				>
					{category.english}
				</Link>
			))}
		</div>
	);
}


