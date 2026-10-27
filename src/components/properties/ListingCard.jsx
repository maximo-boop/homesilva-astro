import { buildTitle, formatPrice, getArea, getFeatures, priceLabel } from '../../scripts/utils.js'

// Datos útiles según el tipo; los null se omiten

export default function ListingCard({ p, priority = false }) {
	const url = `/propiedades/${p.slug}`
	const title = p.title || buildTitle(p)
	const place = [p.barrio, p.locality].filter(Boolean).join(', ')
	const features = getFeatures(p)

	// Precio por m² solo en ventas, que es donde sirve para comparar
	const area = getArea(p)
	const perM2 =
		p.operation === 'Venta' && area && p.price
			? formatPrice(Math.round(p.price / area), p.currency)
			: null

	return (
		<article aria-labelledby={`titulo-${p.id}`} className="h-full hover:shadow-[2px_2px_15px_rgba(0,0,0,0.08)] transition-shadow">
			<a href={url} className="group flex h-full flex-col">
				<div className="relative overflow-hidden bg-[var(--card)]">
					<img
						src={p.images?.[0]}
						alt={buildTitle(p)}
						width="600"
						height="400"
						loading={priority ? 'eager' : 'lazy'}
						fetchPriority={priority ? 'high' : undefined}
						decoding="async"
						className="aspect-[3/2] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
					/>

					<span className="absolute left-4 top-4 bg-[#6f8a6f] px-3 py-1 text-[.9rem] font-medium text-[var(--moss-pale)] ">
						{p.operation}
					</span>

					<span
						aria-hidden="true"
						className="absolute right-4 top-4 flex h-9 w-9 -translate-x-2 translate-y-2 items-center justify-center bg-[var(--bg)] text-[var(--text2)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
							<path d="M17 7l-10 10" />
							<path d="M8 7l9 0l0 9" />
						</svg>
					</span>
				</div>

				<div className="flex flex-1 flex-col gap-1 bg-[var(--paper)] p-5 text-[var(--green)]">
					<h2 id={`titulo-${p.id}`} className="line-clamp-2">
						{title}
					</h2>

					<p className="flex flex-wrap text-[var(--green)] items-baseline gap-x-3">
						<span className="text-xl font-medium [-webkit-text-stroke:0.02em_currentColor]">
				          {priceLabel(p)}
						</span>
						{perM2 && <span className="text-[.8rem] opacity-50">{perM2}/m²</span>}
					</p>

					{p.expensas && (
						<p className="text-xs opacity-50">Expensas {formatPrice(p.expensas, 'ARS')}</p>
					)}

					<p className="text-[.9rem] opacity-50">
						{p.type}{place && ` · ${place}`}
					</p>

					{features.length > 0 && (
						<ul className="flex flex-wrap gap-x-2 text-[.9rem] text-[var(--text)] ">
							{features.map((f, i) => (
								<li key={f}>{i > 0 && '· '}{f}</li>
							))}
						</ul>
					)}
				</div>
			</a>
		</article>
	)
}