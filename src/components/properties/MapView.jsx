'use client'
import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { applyQueryFilters, formatPrice } from '../../scripts/utils.js'

const KEY = import.meta.env.PUBLIC_CARTO_KEY
const CORDOBA = [-31.4, -64.5]
const QUERY_KEYS = ['habitaciones', 'banos', 'precioMin', 'precioMax', 'orden']

const inArgentina = (p) => {
	const { lat, lng } = p.position ?? {}
	return lat > -56 && lat < -21 && lng > -75 && lng < -52
}

const readQuery = () => {
	const p = new URLSearchParams(window.location.search)
	return Object.fromEntries(QUERY_KEYS.map((k) => [k, p.get(k)]))
}

export default function MapView({ items }) {
	const elRef = useRef(null)

	useEffect(() => {
		const el = elRef.current
		const points = items.filter(inArgentina)
		let map, group, L, ro
		let current = []
		let needsFit = false
		let cancelled = false

		const fit = () => {
			if (!map) return
			// Si el mapa está oculto no tiene tamaño: se ajusta cuando se muestre
			if (!el.clientWidth) { needsFit = true; return }
			needsFit = false
			if (!current.length) return map.setView(CORDOBA, 9)
			const pts = current.map((p) => [p.position.lat, p.position.lng])
			if (pts.length === 1) return map.setView(pts[0], 13)
			map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 14 })
		}

		const draw = () => {
			if (!map) return
			const q = readQuery()
			current = applyQueryFilters(points, q, q.orden)
			group.clearLayers()
			current.forEach((p) => {
				const icon = L.divIcon({
					className: '',
					iconSize: [0, 0],
					html: `<a href="/propiedades/${p.slug}" class="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--green)] hover:bg-[var(--moss)] px-3 py-1 text-[.85rem]  transition-colors duration-200"><span class="[-webkit-text-stroke:0.02em_currentColor] text-[var(--bg)]">${formatPrice(p.price, p.currency)}</span></a>`,
				})
				L.marker([p.position.lat, p.position.lng], { icon, title: p.title }).addTo(group)
			})
			fit()
		}

		import('leaflet').then((mod) => {
			if (cancelled) return
			L = mod.default ?? mod
			map = L.map(el, { center: CORDOBA, zoom: 9, scrollWheelZoom: false, zoomControl: true })

			L.tileLayer(`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${KEY}`, {
	maxZoom: 19,
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map)

			group = L.layerGroup().addTo(map)

			ro = new ResizeObserver(() => {
				map.invalidateSize()
				if (needsFit) fit()
			})
			ro.observe(el)

			draw()
			window.addEventListener('filterschange', draw)
			window.addEventListener('popstate', draw)
		})

		return () => {
			cancelled = true
			window.removeEventListener('filterschange', draw)
			window.removeEventListener('popstate', draw)
			ro?.disconnect()
			map?.remove()
		}
	}, [items])

	return <div ref={elRef} className="h-full w-full bg-[var(--card)]" />
}