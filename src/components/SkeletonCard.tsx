export default function SkeletonCard() {
	return (
		<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
			<div className="h-48 bg-slate-200 animate-pulse" />
			<div className="p-4 space-y-2">
				<div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
				<div className="h-5 w-40 bg-slate-200 animate-pulse rounded" />
				<div className="h-4 w-28 bg-slate-200 animate-pulse rounded" />
				<div className="h-8 w-24 bg-slate-200 animate-pulse rounded-full ml-auto" />
			</div>
		</div>
	);
}


