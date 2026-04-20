"use client";
import { useState, useEffect, useMemo } from "react";

const CORDOBA = { center: [-31.4, -64.5], zoom: 9 };
const ARG_BOUNDS = {
	latMin: -56, latMax: -21,
	lngMin: -75, lngMax: -52,
};

function isInArgentina(p) {
	return (
		p?.position?.lat > ARG_BOUNDS.latMin &&
		p?.position?.lat < ARG_BOUNDS.latMax &&
		p?.position?.lng > ARG_BOUNDS.lngMin &&
		p?.position?.lng < ARG_BOUNDS.lngMax
	);
}

export default function PropertyMap({ items, set }) {
	const [Components, setComponents] = useState(null);

	useEffect(() => {
		let cancelled = false;
		Promise.all([
			import("react-leaflet"), 
			import("leaflet"),
			import("leaflet/dist/leaflet.css")
			]).then(([mod, L]) => {
			if (!cancelled) setComponents({
				MapContainer: mod.MapContainer,
				TileLayer: mod.TileLayer,
				useMap: mod.useMap,
				Marker: mod.Marker,
				L: L.default,
			});
		});
		return () => { cancelled = true; };
	}, []);

	const localItems = useMemo(
		() => items.filter(isInArgentina),
		[items]
	);

	const { center, zoom } = useMemo(() => {
		if (localItems.length === 0) return CORDOBA;
		const lats = localItems.map((p) => p.position.lat).sort((a, b) => a - b);
		const lngs = localItems.map((p) => p.position.lng).sort((a, b) => a - b);
		const mid = Math.floor(localItems.length / 2);
		const medLat = localItems.length % 2
			? lats[mid]
			: (lats[mid - 1] + lats[mid]) / 2;
		const medLng = localItems.length % 2
			? lngs[mid]
			: (lngs[mid - 1] + lngs[mid]) / 2;
		const spread = Math.max(
			Math.max(...lats) - Math.min(...lats),
			Math.max(...lngs) - Math.min(...lngs)
		);
		const zoom =
			localItems.length === 1 ? CORDOBA.zoom :
			spread > 5  ? 6  :
			spread > 1  ? 9  :
			spread > 0.3 ? 11 : 13;
		return { center: [medLat, medLng], zoom };
	}, [localItems]);

	const iconCache = useMemo(() => {
		if (!Components) return {};
		const { L } = Components;
		return Object.fromEntries(
			localItems.map(p => [
				p.id,
				L.divIcon({
					className: "",
					html: `<a 
						href="/propiedades/${p.slug}" 
						style="
						padding: 6px 14px;
						font-size: 0.875rem;
						color: #1a1a1a;
						background: white;
						border-radius: 12px;
						box-shadow: 0 0 20px rgba(0,0,0,0.2);
						white-space: nowrap;
						display: block;
						text-decoration: none;
						transition: color 0.2s;
						width: fit-content;
						"
						onmouseover="this.style.color='#e48957'"
						onmouseout="this.style.color='#1a1a1a'"
					>
						${p.currency} ${p.price.toLocaleString("es-AR")}
					</a>`,
					iconAnchor: [0, 0],
				})
			])
		);
	}, [localItems, Components]);

	if (!Components) return (
		<div className="h-full w-full bg-gray-100 animate-pulse lg:rounded-[30px]" />
	);

	const { MapContainer, TileLayer, Marker, useMap } = Components;

	function InvalidateSize() {
	const map = useMap();
	useEffect(() => {
	const t = setTimeout(() => map.invalidateSize(), 200);
	return () => clearTimeout(t);
	}, [map]);
	return null;
	}

	return (
		<div className="relative h-full w-full">
			<MapContainer
				center={center}
				zoom={zoom}
				maxBounds={[[-56, -75], [-21, -52]]}
				maxBoundsViscosity={1.0}
				className="h-full w-full lg:rounded-[30px] z-0"
				preferCanvas={true}
			>
				<TileLayer
					subdomains="abcd"
					detectRetina={true}
					updateWhenIdle={true}
					updateWhenZooming={false}
					attribution='&copy; CARTO'
					url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
				/>
				<InvalidateSize />
				{localItems.map(p => (
					<Marker
						key={p.id}
						position={[p.position.lat, p.position.lng]}
						icon={iconCache[p.id]}
					/>
				))}
			</MapContainer>
			<button
				onClick={() => set(false)}
				type="button"
				className="lg:hidden absolute top-3 right-3 bg-white p-2 border-2 border-gray-400 z-[2000]"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					<path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
				</svg>
			</button>
		</div>
	);
}