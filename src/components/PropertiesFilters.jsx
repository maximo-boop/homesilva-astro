'use client'
import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import PropertyCard from './Property.jsx';
import { toPesos, toSlug, toPlural, setQuerys} from '@/utils/utils.js'
import ButtonSort from './ButtonSort.jsx'
const Map = lazy(() => import('./Map.jsx'))

const PropertiesFilters = ({ items, itemsPP, titulo, params, totalP, currentURL, currentP}) => {

	const ITEMS_PER_PAGE = 12;
	const getParams = () => {
		if (typeof window === 'undefined') return {
			habitaciones: null,
			banos: null,
			precioMax: null,
			precioMin: null,
			page: currentP || 1,
		};
		const p = new URLSearchParams(window.location.search);
		return {
			habitaciones: p.get('habitaciones') || null,
			banos: p.get('banos') || null,
			precioMax: p.get('precioMax') || null,
			precioMin: p.get('precioMin') || null,
			page: Number(p.get('page')) || 1,
		};
	};
	const [urlState, setUrlState] = useState(() => {
		if (typeof window === 'undefined') return {
			habitaciones: null,
			banos: null,
			precioMax: null,
			precioMin: null,
			page: currentP || 1,
		};
		return getParams();
	});
	const [grid, setGrid] = useState(true);
	const [displayMap, setDisplayMap] = useState(false);
	const [orderBy, setOrderBy] = useState('sin-filtros');

	useEffect(() => {
		const media = window.matchMedia('(max-width: 768px)')
		setDisplayMap(!media.matches)
		const handleFiltersChange = () => {
			setUrlState(getParams());
		};

		window.addEventListener('filterschange', handleFiltersChange);
		window.addEventListener('popstate', handleFiltersChange);
		return () => {
			window.removeEventListener('filterschange', handleFiltersChange);
			window.removeEventListener('popstate', handleFiltersChange);
		};
	}, []);

	const { habitaciones, banos, precioMax, precioMin, page: currentPageQuery } = urlState;
	const filtrosActivos = !!(habitaciones || banos || precioMax || precioMin);
	const currentPage = filtrosActivos ? currentPageQuery : currentP;

	const sortedItems = (filtrosActivos?items:itemsPP)
		.filter(p => {
			if (!filtrosActivos) return true;
			if (habitaciones) {
				const num = Number(habitaciones);
				if (num === 5 ? p.characteristics.dormitorios < 5 : p.characteristics.dormitorios !== num) return false;
			}
			if (banos) {
				const num = Number(banos);
				if (num === 4 ? p.characteristics.banos < 4 : p.characteristics.banos !== num) return false;
			}
			if (precioMin && toPesos(p.price, p.currency) < Number(precioMin)) return false;
			if (precioMax && toPesos(p.price, p.currency) > Number(precioMax)) return false;
			return true;
		})
		.sort((a, b) => {
			switch (orderBy) {
				case 'mayor-precio':
					return toPesos(b.price, b.currency) - toPesos(a.price, a.currency)
				case 'menor-precio':
					return toPesos(a.price, a.currency) - toPesos(b.price, b.currency)
				case 'ultimas-publicadas':
					return new Date(a.publicated) - new Date(b.publicated) // invertir?
				case 'mas-antiguas':
					return new Date(b.publicated) - new Date(a.publicated)
				case 'sin-filtros':
				default:
					return 0
			}
		})

	const sorts = [
		{
			title: "Sin orden",
			slug: "sin-orden"
		},
		{
			title: "Ultimas publicadas",
			slug: "ultimas-publicadas",
		},
		{
			title: "Más antiguas",
			slug: "mas-antiguas"
		},
		{
			title: "Mayor precio",
			slug: "mayor-precio",
		},
		{
			title: "Menor precio",
			slug: "menor-precio",
		}
	]
	 
	const handleCurrentPage = (e, n) => {
		e.preventDefault();
		if (n <= 1) {
			setQuerys('page', null);
		} else {
			setQuerys('page', n);
		}
	}

	const totalPages = filtrosActivos ? Math.ceil(sortedItems.length / ITEMS_PER_PAGE) : totalP;
	const baseURL = currentURL?.length ? `propiedades/${currentURL.join('/')}` : 'propiedades';
	const prevPage = currentPage - 1;
	const nextPage = currentPage + 1;
	const prevURL = prevPage <= 1 
		? `/${baseURL}` 
		: `/${baseURL}/page/${prevPage}`;
	const nextURL = `/${baseURL}/page/${nextPage}`;
	const startPage = Math.max(1, currentPage - 1);
	const endPage = Math.min(totalPages, currentPage + 1);
	const visiblePages = Array.from(
		{ length: endPage - startPage + 1 }, 
		(_, i) => startPage + i
	);

	const visibleItems = !filtrosActivos 
	? sortedItems 
	: sortedItems.slice((currentPage - 1) * ITEMS_PER_PAGE,currentPage * ITEMS_PER_PAGE)
	const mapItems = useMemo(() => 
		items
		.filter(p => p.position?.lat && p.position?.lng)
		.map(({ id, slug, position, price, currency }) => ({ id, slug, position, price, currency }))
		, [items])

	return (
		<section className="max-w-[1700px] mx-auto w-full flex flex-col gap-5">
			<div className="px-5 lg:px-20 flex flex-col lg:flex-row gap-5 justify-between lg:items-center">
				<h2>{visibleItems.length} propiedades encontradas</h2>
				
				<div className="flex justify-between lg:flex-row gap-2">

					<ButtonSort 
						item={{
							id: 1, 
							title: sorts.find(s => s.slug===orderBy)?.title || 'Sin orden', 
							options: [...sorts] 
						}}
						set={setOrderBy}
					/>

					<div className="flex gap-2">
						<button onClick={()=> setGrid(!grid)} className="focus:outline-none cursor-pointer bg-white p-2 rounded-full flex items-center">
							{[1,2].map(n => (
								<div key={n} className={`${(grid&&n===1) || (!grid && n===2) ? 'bg-[#f6f6f6]' : 'opacity-[.5] '} transition-opacity ease duration-200 transition-bg p-2 rounded-full`}>
									{n==1? (
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M14 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /></svg>
									):(
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -2" /><path d="M4 16a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -2" /></svg>
									)}
								</div>
							))}
						</button>

						<button onClick={() => setDisplayMap(!displayMap)} className="cursor-pointer bg-white  flex items-center p-2 gap-2 rounded-full">
							<div className={`${displayMap ? 'bg-gray-100' : ''} rounded-full p-2 transition-bg duration-350`}>
								<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
									<path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
									<path d="M9 4v13" />
									<path d="M15 7v13" />
								</svg>
							</div>
						</button>
					</div>

				</div>
			</div>

			<div className="flex flex-col gap-10 px-7 lg:px-20">

				<div className="flex gap-10 min-h-screen">
					<div className={`h-min flex-1 gap-10 items-start 
						grid grid-cols-1
						${grid? (!displayMap ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-1 lg:grid-cols-2') : 'lg:grid-cols-1'}
					`}>
						{visibleItems.map(p => (
							<PropertyCard key={p.id} p={p} grid={grid} displayMap={displayMap} id={1} />
						))}
					</div>

					<aside className={`${displayMap ? '' : 'hidden'} flex-1 fixed top-38 left-0 h-full w-full lg:sticky lg:top-45 lg:h-[70vh] `}>
						<Suspense fallback={
							<div className="w-full h-full bg-gray-100 rounded-[20px] flex items-center justify-center">
								<div className="flex flex-col items-center gap-2 text-gray-400">
								<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
									<path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
									<path d="M9 4v13" />
									<path d="M15 7v13" />
								</svg>
								<p>Cargando mapa...</p>
								</div>
							</div>
						}>			
							<Map items={mapItems} set={setDisplayMap} />
						</Suspense>
					</aside>
				</div>

				<nav className="flex items-center gap-10 justify-center w-full" aria-label="Paginación de propiedades">

					<a 
						href={currentPage === 1 ? undefined : prevURL}
						onClick={filtrosActivos ? e=> handleCurrentPage(e, currentPage-1) : undefined}
						aria-label="Ir a la paginación anterior"
						aria-disabled={currentPage === 1 ? "true" : "false"}
						className="h-12 w-12 bg-white flex items-center justify-center rounded-full"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M15 6l-6 6l6 6" fill="none" />
						</svg>
					</a>

					{visiblePages.map(n => (
						<a 
							key={n}
							href={filtrosActivos ? undefined : (n <= 1 ? `/${baseURL}` : `/${baseURL}/page/${n}`)}
							onClick={filtrosActivos ? e => handleCurrentPage(e, n) : undefined}
							aria-label={`Ir a la página ${n}`}
							className={`${currentPage === n ? 'text-black' : 'text-gray-500'} flex items-center justify-center rounded-[32px] h-12 w-12 bg-white`}
						>
							{n}
						</a>
					))}

					<a 
						href={currentPage === totalPages ? undefined : nextURL} 
						onClick={filtrosActivos ? e=> handleCurrentPage(e, currentPage+1) : undefined}
						aria-label="Ir a la siguiente paginación"
						aria-disabled={currentPage === totalPages ? "true" : "false"}
						className="h-12 w-12 bg-white flex items-center justify-center rounded-full"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M9 6l6 6l-6 6" fill="none" />
						</svg>
					</a>
				</nav>
			</div>
		</section>
	);
};

export default PropertiesFilters;