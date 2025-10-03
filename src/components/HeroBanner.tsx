export default function HeroBanner() {
	return (
        <div className="relative overflow-hidden rounded-2xl mb-6 border bg-gradient-to-r from-[#0b1220] to-[#1e40af] text-white">
			<div className="px-6 py-10 md:py-12">
                <h2 className="text-xl md:text-2xl font-bold">E‑Tech Store</h2>
                <p className="text-sm md:text-base text-white/80 mt-1">Electronics you love. Fast shipping within 2 days.</p>
				<div className="mt-4 flex gap-3 text-sm">
					<a href="/search" className="bg-white text-blue-700 rounded-full px-5 py-2">Start shopping</a>
					<a href="/search?sort=best#hot" className="rounded-full px-5 py-2 border border-white/50 text-white/90">See popular items</a>
				</div>
			</div>
			<div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl" />
		</div>
	);
}


