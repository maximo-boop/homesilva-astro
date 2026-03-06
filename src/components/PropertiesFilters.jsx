'use client'
import { useState, useMemo, useEffect } from 'react';
import PropertyCard from './Property.jsx';
import Map from './Map.jsx'
import {toSlug, toPlural} from '@/utils/utils.js'
import ButtonFilter from './ButtonFilter.jsx'
import propiedades from '@/data/propiedades.json'

const PropertiesFilters = ({ 
	// propiedadesPaginadas, 
	todasLasPropiedades, titulo, params }) => {


	// console.log("propiedadesPaginadas", propiedadesPaginadas);
	console.log("todasLasPropiedades", todasLasPropiedades);

	const PAGE_SIZE = 2
	const url = new URLSearchParams(window.location.search);
	const [grid, setGrid] = useState(true);
	const [displayMap, setDisplayMap] = useState(true);
	const [filtros, setFiltros] = useState({
		habitaciones: url.get('habitaciones') || null,
		banos: url.get('banos') || null,
		precioMax: url.get('precioMax') || null,
		precioMin: url.get('precioMin') || null,
	})
	const [currentPage, setCurrentPage] = useState(Number(url.get('page')) || 1);
	const [orderBy, setOrderBy] = useState('sin-filtros');

	const filtrosActivos = Object.values(filtros).some(Boolean)

	const sortedItems = (filtrosActivos ? [...todasLasPropiedades] : [...propiedadesPaginadas])
		.filter(p => {

			if (filtros.habitaciones) {
				const num = Number(filtros.habitaciones)
				if (num === 5 ? p.caracteristicas.habitaciones < 5 : p.caracteristicas.habitaciones !== num) return false
			}
			if (filtros.banos) {
				const num = Number(filtros.banos)
				if (num === 3 ? p.caracteristicas.banos < 3 : p.caracteristicas.banos !== num) return false
			}
			if (filtros.precioMin && p.price < Number(filtros.precioMin)) return false
			if (filtros.precioMax && p.price > Number(filtros.precioMax)) return false

			return true
		})
		.sort((a, b) => {
			switch (orderBy) {
				case 'mayor-precio':
					return b.price - a.price;
				case 'menor-precio':
					return a.price - b.price;
				case 'ultimas-publicadas':
					return new Date(a.public) - new Date(b.public) // invertir?
				case 'mas-antiguas':
					return new Date(b.public) - new Date(a.public)
				case 'sin-filtros':
				default:
					return 0
				// case 'modify':
					// return b.last_modified - a.last_modified
			}
		})

	function buildFilteredPath(currentParams, filterType, newValue) {
		const updated = { ...currentParams };

		if (updated[filterType] === newValue) {
			delete updated[filterType];
		} else {
			updated[filterType] = newValue;
		}

		const parts = [
			updated.operacion,
			updated.tipo,
			updated.localidad,
		].filter(Boolean);

		return '/propiedades/' + parts.join('/');
	}
	const sorts = [
		"Sin filtros",
		"Ultimas publicadas",
		"Más antiguas",
		"Mayor precio",
		"Menor precio",
	]
	const filters = [
		{
			title: "Tipo de propiedad",
			slug: "tipo",
			options: [...new Set(propiedades.map(p => p.tipo))]
		},
		{
			title: "Operación",
			slug: "operacion",
			options: [...new Set(propiedades.map(p => p.operacion))]
		},
		{
			title: "Localidad",
			slug: "localidad",
			options: [...new Set(propiedades.map(p => p.localidad))]
		}
	]
	 
	// QUERY PARAMS
	function setQuerys(clave, valor) {
		const params = new URLSearchParams(window.location.search)
		const actual = params.get(clave)

		if(actual === String(valor)){
			params.delete(clave)
			valor=null
		} else if (valor){
			params.set(clave, valor)
		} else {
			params.delete(clave)
		}

		if (clave !== 'page') {
			setFiltros(prev => ({...prev, [clave]: valor}))
			params.delete('page')
			setCurrentPage(1)
		} else {
			setCurrentPage(Number(valor) || 1)
		}

		const query = params.toString();
		const url = query ? `${window.location.pathname}?${query}` : window.location.pathname
		history.pushState({}, '', url)
	}
	const queryFilters = [
		{
			title: "Habitaciones",
			slug: "habitaciones",
			options: [1,2,3,4,5]
		},
		{
			title: "Baños",
			slug: "banos",
			options: [1,2,3,4]
		},
		{
			title: "Precio máximo",
			slug: 'precioMax',
			options: [50000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000]
		},
		{
			title: "Precio mínimo",
			slug: 'precioMin',
			options: [50000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000]
		}
	]

	const totalPages = Math.ceil(sortedItems.length / PAGE_SIZE)
	const pageItems = sortedItems.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE
	)

	return (
		<>
			<section className="lg:px-20 bg-white flex gap-2 pb-5 sticky top-20 z-5">

				{filters.map((f,i) => (
					<ButtonFilter 
						i={i}
						id={1}
						title={
							params[f.slug] ? 
							f.options.map(o => 
								i===0? (toPlural(o.toLowerCase()) === params.tipo && o)
								: i===1? (o.toLowerCase() === params.operacion && o)
								: (toSlug(o.toLowerCase()) === params.localidad && o)
							) : f.title
						}
						set={(newValue) => {
							const slug =
								i === 0 ? toPlural(newValue.toLowerCase())
								: i === 1 ? newValue.toLowerCase()
								: toSlug(newValue.toLowerCase());

							return buildFilteredPath(params, f.slug, slug);
						}}
						currentValue={params[f.slug]}
						options={f.options}
						styles={`${params[f.slug] ? 'border-[#ffa361]' : 'border-[#ddd]'} py-3 px-4 border`}
					/>
				))}

				{queryFilters.map((q, i) => (
					<ButtonFilter
						title={
							filtros[q.slug] ? (
								i===0? `${filtros[q.slug]} Hab.`:
								i===1? `${filtros[q.slug]} Bañ.`:
								i===2? `${filtros[q.slug]} Max.`:
								`${filtros[q.slug]} Mín.`
							) : q.title
						}
						id={2}
						currentValue={filtros[q.slug]}
						options={q.options}
						set={(value) => setQuerys(q.slug, value)}
						styles={`${filtros[q.slug] ? 'border-[#ffa361]' : 'border-[#ddd]'} py-3 px-4 border`}
					/>
				))}
				
			</section>

			<section className="lg:px-20">
				<h1>{titulo}</h1>
			</section>

			<section className="lg:px-20 flex justify-between items-center">
				<p>{pageItems.length} propiedades encontradas</p>
				
				<div className="flex gap-2">
					<ButtonFilter 
						title={sorts.find(f => toSlug(f) === orderBy)}
						options={sorts} 
						set={setOrderBy}
						icon
						styles='py-3 px-5'
					/>

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

					<button onClick={() => setDisplayMap(!displayMap)}>Map</button>

				</div>
			</section>

			<section className="flex flex-col gap-10 lg:px-20">

				<div className="flex gap-10">
					<div className={`h-min flex-1 gap-10 items-start bg-green-200
						grid grid-cols-1 md:grid-cols-3
						${grid? (!displayMap ? 'lg:grid-cols-4' : 'lg:grid-cols-2') : 'lg:grid-cols-1'}
					`}>
						{pageItems.map(p => (
							<PropertyCard key={p.id} p={p} grid={grid} displayMap={displayMap} />
						))}
					</div>

					{displayMap && (
						<aside className="flex-1 sticky top-45 h-[70vh] bg-red-200">
							{/* mapa usar =>  sortedItems */}
							{/*<Map client:only="react" />*/}
						</aside>
					)}
				</div>

				<div className="flex gap-10 justify-center w-full bg-green-200">
					{[1,2].map(n => (
						<button 
							onClick={() => setQuerys('page', n===1? currentPage-1 : currentPage+1)}
							disabled={n===1 ? currentPage === 1 : currentPage === totalPages}
						>{n===1? 'Anterior' : 'Siguiente'}</button>
					))}
				</div>

			</section>
		</>
	);
};

export default PropertiesFilters;