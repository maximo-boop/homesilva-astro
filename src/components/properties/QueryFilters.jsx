'use client'
import { useState, useEffect } from 'react'
import { setQuerys, EXCHANGE_RATE } from '../../scripts/utils.js'

const KEYS = ['habitaciones', 'banos', 'precioMin', 'precioMax']

// En USD se agregó 20.000 para poder filtrar lotes; en ARS el máximo no pasa de 1M
const DEFAULT_PRESETS = {
	ars: [50000, 100000, 250000, 500000, 1000000],
	usd: [20000, 50000, 100000, 150000, 200000],
}

const ROOMS = [1, 2, 3, 4, 5]
const BATHS = [1, 2, 3, 4]

const readParams = () => {
	const p = new URLSearchParams(window.location.search)
	return Object.fromEntries(KEYS.map((k) => [k, p.get(k)]))
}

const clearAll = () => {
	const p = new URLSearchParams(window.location.search)
	;[...KEYS, 'page'].forEach((k) => p.delete(k))
	const q = p.toString()
	history.pushState({}, '', q ? `${location.pathname}?${q}` : location.pathname)
	window.dispatchEvent(new Event('filterschange'))
}

const Pill = ({ active, disabled, onClick, label, children }) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		aria-pressed={active}
		aria-label={label}
		className={[
			'inline-flex min-w-9 justify-center px-3 py-1.5 text-[.9rem] transition-colors duration-200',
			'disabled:cursor-not-allowed disabled:opacity-30',
			active
				? 'bg-[var(--green)] text-[var(--bg)]'
				: 'bg-[var(--bg)] text-[var(--text2)] enabled:cursor-pointer enabled:hover:bg-[var(--moss-pale)]',
		].join(' ')}
	>
		{children}
	</button>
)

const Group = ({ title, action, children }) => (
	<div className="flex flex-col gap-3">
		<div className="flex items-center justify-between gap-2">
			<h3 className="font-medium text-[var(--green)]">{title}</h3>
			{action}
		</div>
		{children}
	</div>
)

export default function QueryFilters({ defaultCurrency = 'usd', presets = DEFAULT_PRESETS }) {
	const [active, setActive] = useState({})
	const [currency, setCurrency] = useState(defaultCurrency)

	useEffect(() => {
		const sync = () => setActive(readParams())
		sync()

		// Si ya hay un precio en la URL, abre en la moneda que corresponde
		const first = readParams()
		const price = Number(first.precioMax ?? first.precioMin)
		if (price) {
			if (presets.usd.some((n) => n * EXCHANGE_RATE.usdToArs === price)) setCurrency('usd')
			else if (presets.ars.includes(price)) setCurrency('ars')
		}

		window.addEventListener('filterschange', sync)
		window.addEventListener('popstate', sync)
		return () => {
			window.removeEventListener('filterschange', sync)
			window.removeEventListener('popstate', sync)
		}
	}, [])

	const options = presets[currency].map((n) => ({
		label: currency === 'usd' ? `U$D ${n.toLocaleString('es-AR')}` : `$${n.toLocaleString('es-AR')}`,
		value: currency === 'usd' ? n * EXCHANGE_RATE.usdToArs : n,
	}))

	const min = Number(active.precioMin)
	const max = Number(active.precioMax)
	const hasActive = KEYS.some((k) => active[k])

	const priceRow = (title, key) => (
		<div className="flex flex-col gap-2">
			<span className="text-[.8rem] text-[var(--textop)]">{title}</span>
			<div className="flex flex-wrap gap-2">
				{options.map((o) => {
					const isActive = Number(active[key]) === o.value
					// Evita combinar un mínimo mayor que el máximo (y al revés)
					const blocked = key === 'precioMin' ? max && o.value >= max : min && o.value <= min
					return (
						<Pill key={o.value} active={isActive} disabled={!isActive && !!blocked} onClick={() => setQuerys(key, o.value)}>
							{o.label}
						</Pill>
					)
				})}
			</div>
		</div>
	)

	return (
		<div className="flex flex-col gap-8">
			<Group title="Habitaciones">
				<div className="flex flex-wrap gap-2">
					{ROOMS.map((n) => (
						<Pill key={n} active={Number(active.habitaciones) === n} onClick={() => setQuerys('habitaciones', n)}
							label={n === 5 ? '5 o más habitaciones' : `${n} habitaciones`}>
							{n === 5 ? '5+' : n}
						</Pill>
					))}
				</div>
			</Group>

			<Group title="Baños">
				<div className="flex flex-wrap gap-2">
					{BATHS.map((n) => (
						<Pill key={n} active={Number(active.banos) === n} onClick={() => setQuerys('banos', n)}
							label={n === 4 ? '4 o más baños' : `${n} baños`}>
							{n === 4 ? '4+' : n}
						</Pill>
					))}
				</div>
			</Group>

			<Group
				title="Precio"
				action={
					<div className="flex gap-1">
						{['ars', 'usd'].map((c) => (
							<Pill key={c} active={currency === c} onClick={() => setCurrency(c)}>
								{c.toUpperCase()}
							</Pill>
						))}
					</div>
				}
			>
				{priceRow('Mínimo', 'precioMin')}
				{priceRow('Máximo', 'precioMax')}
			</Group>

			{hasActive && (
				<button type="button" onClick={clearAll}
					className="w-fit cursor-pointer text-[.9rem] text-[var(--text2)] underline underline-offset-4 transition-opacity hover:opacity-70">
					Limpiar filtros
				</button>
			)}
		</div>
	)
}