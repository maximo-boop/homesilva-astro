'use client'
import { useState, useEffect } from 'react'
import { setQuerys, SORT_OPTIONS } from '../../scripts/utils.js'

export default function SortSelect() {
	const [value, setValue] = useState('')

	useEffect(() => {
		const sync = () => setValue(new URLSearchParams(window.location.search).get('orden') ?? '')
		sync()
		window.addEventListener('filterschange', sync)
		window.addEventListener('popstate', sync)
		return () => {
			window.removeEventListener('filterschange', sync)
			window.removeEventListener('popstate', sync)
		}
	}, [])

	return (
		<label className="flex items-center gap-2 bg-[var(--paper)] px-4 py-2">
			<span className="hidden text-[var(--textop)] sm:inline">Ordenar</span>
			<select
				value={value}
				onChange={(e) => setQuerys('orden', e.target.value || null)}
				className="cursor-pointer bg-transparent text-[var(--text2)] focus:outline-none"
			>
				{SORT_OPTIONS.map((o) => (
					<option key={o.value} value={o.value}>{o.label}</option>
				))}
			</select>
		</label>
	)
}