import { Link } from 'react-router-dom';
import { useProducts } from '../store/products';
import { translateCategory } from '../utils/categoryTranslator';

export default function CategoryChips() {
	const { getCategories } = useProducts();
	const categories = getCategories();
	
	// All categories including "All"
	const allCategories = [
		{ thai: '', english: 'All' },
		...categories.map(c => ({ thai: c, english: translateCategory(c) }))
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


