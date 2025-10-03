export default function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
	return (
		<div className="text-center bg-white border rounded-2xl p-10 text-gray-600">
			<div className="text-4xl mb-2">🔍</div>
			<div className="font-medium mb-2">{title}</div>
			{action}
		</div>
	);
}


