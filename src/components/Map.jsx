"use client";
import {lazy} from 'React';
const module = await import('react-leaflet')
const { MapContainer, TileLayer, Marker, Popup, Tooltip } = module;
import "leaflet/dist/leaflet.css";

export default function map({items, set}) {
	if (typeof window === 'undefined') return (
		<></>
	)

	return (
		<MapContainer
			center={[-31.4201, -64.1888]}
			zoom={15}
			// 13
			className="h-full w-full lg:rounded-[30px] z-0"
		>

			<TileLayer attribution='&copy; openstreetmap contributors' className="z-20"
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				// url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=n63amUfZm8UovlgOFkDN"
				// url="https://api.maptiler.com/maps/dataviz-v2/{z}/{x}/{y}.png?key=n63amUfZm8UovlgOFkDN"
			/>

			{items.map((p) => (				
				<Popup key={p.id} position={[p.position.lat, p.position.lng]} closeButton={false} autoClose={false} closeOnClick={false} className="mi-popup">
					<a href={`/propiedades/${p.slug}`} className="peer py-3 px-5 text-nowrap text-center flex text-white bg-white rounded-[12px] shadow-[0_0_20px_rgba(0,0,0,0.2)]">
						{`${p.currency} ${p.price}`}
					</a>
				</Popup>
			))}
			<button onClick={()=> set(false)} type="button" className="lg:hidden absolute top-3 right-3 bg-white p-2 border border-gray-400 border-2 z-[2000]">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					<path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
				</svg>
			</button>
		</MapContainer>
	);
}