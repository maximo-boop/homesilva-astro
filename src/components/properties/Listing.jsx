'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import ListingCard from './ListingCard.jsx'
import { applyQueryFilters, setQuerys, ITEMS_PER_PAGE } from '../../scripts/utils.js'

const FILTER_KEYS = ['habitaciones', 'banos', 'precioMin', 'precioMax']

const readQuery = () => {
	const p = new URLSearchParams(window.location.search)
	return Object.fromEntries([...FILTER_KEYS, 'orden', 'page'].map((k) => [k, p.get(k)]))
}

const clearFilters = () => {
	const p = new URLSearchParams(window.location.search)
	;[...FILTER_KEYS, 'page'].forEach((k) => p.delete(k))
	const q = p.toString()
	history.pushState({}, '', q ? `${location.pathname}?${q}` : location.pathname)
	window.dispatchEvent(new Event('filterschange'))
}

// 1 … 4 5 6 … 12
const pageList = (current, total) => {
	const nums = [...new Set([1, total, current - 1, current, current + 1])]
		.filter((n) => n >= 1 && n <= total)
		.sort((a, b) => a - b)
	return nums.flatMap((n, i) => (i > 0 && n - nums[i - 1] > 1 ? [`gap-${n}`, n] : [n]))
}

const stepCls = 'flex h-11 min-w-11 items-center justify-center px-3 transition-colors duration-200'

export default function Listing({ items, itemsPP, basePath, currentP, totalP }) {
	// null = render del servidor: así la hidratación coincide con el HTML estático
	const [q, setQ] = useState(null)
	const topRef = useRef(null)

	useEffect(() => {
		const sync = () => setQ(readQuery())
		sync()
		window.addEventListener('filterschange', sync)
		window.addEventListener('popstate', sync)
		return () => {
			window.removeEventListener('filterschange', sync)
			window.removeEventListener('popstate', sync)
		}
	}, [])

	const clientMode = !!q && (FILTER_KEYS.some((k) => q[k]) || !!q.orden)

	const result = useMemo(
		() => (clientMode ? applyQueryFilters(items, q, q.orden) : null),
		[clientMode, items, q]
	)

	let visible = itemsPP
	let total = items.length
	let page = currentP
	let pages = totalP

	if (result) {
		total = result.length
		pages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))
		page = Math.min(Math.max(Number(q.page) || 1, 1), pages)
		visible = result.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
	}

	const href = (n) => (n <= 1 ? basePath : `${basePath}/page/${n}`)

	const goTo = (n) => {
		setQuerys('page', n > 1 ? n : null)
		topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	// La página actual y los extremos no son clickeables (evita el toggle de setQuerys)
	const Step = ({ n, label, disabled, current, children }) => {
		if (disabled || current) {
			return (
				<span
					aria-current={current ? 'page' : undefined}
					aria-disabled={disabled ? 'true' : undefined}
					className={`${stepCls} ${current ? 'bg-[var(--green)] text-[var(--bg)]' : 'opacity-30'}`}
				>
					{children}
				</span>
			)
		}
		const cls = `${stepCls} bg-[var(--card)] text-[var(--text2)] hover:bg-[var(--moss-pale)]`
		return clientMode ? (
			<button type="button" aria-label={label} onClick={() => goTo(n)} className={`${cls} cursor-pointer`}>
				{children}
			</button>
		) : (
			<a href={href(n)} aria-label={label} className={cls}>{children}</a>
		)
	}

	useEffect(() => {
		const el = document.getElementById('count')
		if (el) el.textContent = `${total} ${total === 1 ? 'propiedad' : 'propiedades'}`
	}, [total])

	return (
		<div ref={topRef} className="flex scroll-mt-[calc(var(--header-h)+1.25rem)] flex-col gap-5">

			{visible.length === 0 ? (
				<div className="flex flex-col items-start gap-4 bg-[var(--card)] p-8">
					<p className="text-[var(--green)]">No encontramos propiedades con esos filtros.</p>
					<button
						type="button"
						onClick={clearFilters}
						className="cursor-pointer text-[.9rem] text-[var(--text2)] underline underline-offset-4 transition-opacity hover:opacity-70"
					>
						Limpiar filtros
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 items-start gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
					{visible.map((p, i) => (
						<ListingCard key={p.id} p={p} priority={i < 3} />
					))}
				</div>
			)}

			{pages > 1 && (
				<nav aria-label="Paginación de propiedades" className="flex flex-wrap items-center justify-center gap-2">
					<Step n={page - 1} label="Página anterior" disabled={page === 1}>Anterior</Step>

					{pageList(page, pages).map((n) =>
						typeof n === 'string' ? (
							<span key={n} className="px-1 text-[var(--textop)]">…</span>
						) : (
							<Step key={n} n={n} label={`Ir a la página ${n}`} current={n === page}>{n}</Step>
						)
					)}

					<Step n={page + 1} label="Página siguiente" disabled={page === pages}>Siguiente</Step>
				</nav>
			)}
		</div>
	)
}