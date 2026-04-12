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
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([mod]) => {
      setComponents({
        MapContainer: mod.MapContainer,
        TileLayer: mod.TileLayer,
        Marker: mod.Marker,
        Popup: mod.Popup,
      });
    });
  }, []);

  // Solo propiedades dentro de Argentina
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

  if (!Components) return (
    <div className="h-full w-full bg-gray-100 animate-pulse lg:rounded-[30px]" />
  );

  const { MapContainer, TileLayer, Marker, Popup } = Components;

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
          attribution="&copy; openstreetmap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Solo renderiza markers de Argentina */}
        {localItems.map((p) => (
          <Marker
            key={p.id}
            position={[p.position.lat, p.position.lng]}
            opacity={0}
            eventHandlers={{
              add: (e) => e.target.openPopup(),
            }}
          >
            <Popup
              closeButton={false}
              autoClose={false}
              closeOnClick={false}
              className="mi-popup"
            >
              <a
                href={`/propiedades/${p.slug}`}
                className="py-3 px-5 text-nowrap text-center flex text-white bg-white rounded-[12px] shadow-[0_0_20px_rgba(0,0,0,0.2)]"
              >
                {`${p.currency} ${p.price.toLocaleString("es-AR")}`}
              </a>
            </Popup>
          </Marker>
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