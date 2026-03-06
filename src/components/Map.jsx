"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function map() {

	const marcadores = [
		{ id: 1, position: [-31.4210, -64.1870], precio: "$500" },
		{ id: 2, position: [-31.4190, -64.1900], precio: "$700" },
		{ id: 3, position: [-31.4180, -64.1850], precio: "$650" },
		{ id: 4, position: [-31.4225, -64.1920], precio: "$800" },
	];

	return (
		<MapContainer
			center={[-31.4201, -64.1888]}
			zoom={15}
			// 13
			className="h-full w-full rounded-xl"
		>

			<TileLayer attribution='&copy; openstreetmap contributors' 
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			// url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=n63amUfZm8UovlgOFkDN"
			// url="https://api.maptiler.com/maps/dataviz-v2/{z}/{x}/{y}.png?key=n63amUfZm8UovlgOFkDN"
			/>

			{marcadores.map((m) => (
				<Popup key={m.id} position={m.position} closeButton={false} autoClose={false} closeOnClick={false} className="mi-popup">
					<a href="#" className="py-3 px-5 text-nowrap text-center flex text-white bg-white rounded-[12px] shadow-[0_0_20px_rgba(0,0,0,0.2)]">
						USD {m.precio}
					</a>
				</Popup>
			))}
		</MapContainer>
	);
}