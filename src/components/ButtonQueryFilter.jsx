'use client'
import React, {useState, useRef, useEffect} from 'react'
import {toSlug, toPlural, setQuerys} from '@/utils/utils.js'

const ButtonQueryFilter = ({ item }) => {
	if (typeof window === 'undefined') return
	
	const [view, setView] = useState(false);
	const buttonRef = useRef(null)
	const params = new URLSearchParams(window.location.search)
	const active = params.get(item.slug)

	const selectOption = (slug, option) => {
		const value = typeof option === 'object' ? option.value : option
		setQuerys(slug, value)
		setView(false)
	}

	useEffect(() => {
		function handleClick(event){
			if(buttonRef.current && !buttonRef.current.contains(event.target)){
				setView(false)
			}
		}

		document.addEventListener("mousedown", handleClick);
		return ()=> document.removeEventListener("mousedown", handleClick)
	}, [])

	return (
		<div className="relative flex flex-col lg:flex-row " ref={buttonRef}>
			<button 
				type="button" 
				aria-haspopup='listbox'
				aria-expanded={view}
				aria-controls='filtros'
				aria-label={`Abrir filtros de ${
					item.id === 1? 'habitaciones' :
					item.id === 2? 'baños' :
					item.id === 3? 'precio máximo' :
					'precio mínimo'
					}
				`}
				onClick={() => setView(!view)}
				className={`
					${active ? 'border-[#ffa361]' : 'border-gray-200'} 
					lg:py-3 lg:px-4 
					lg:border 
					text-lg
					lg:text-base
					flex 
					cursor-pointer 
					hover:border-[#ffa361] duration-200 
					gap-2 
					focus:outline-none items-center bg-white rounded-full
				`}
			>
				{active ? 
					`${item.id === 1 ? 'Hab.' : item.id === 2 ? 'Baños' : item.id === 3 ? 'Máx.' : 'Mín.'} ${
					item.id === 1 ? (active == 5 ? '+5' : active) : 
					item.id === 2 ? (active == 4 ? '+4' : active) : 
					item.options.find(o => o.value == active)?.label ?? active
					}`
					: item.title}
			</button>

			<ul role='listbox' id="filtros" className={`${view ? 'flex' : 'lg:hidden'} flex-wrap lg:flex-col py-2 lg:absolute top-full left-0 flex mt-1 bg-white z-5 min-w-full text-nowrap rounded-[12px] overflow-hidden lg:shadow-[0_0_10px_rgba(0,0,255,0.05)]`}>
				{item.options.map((o, i) => (
					<li key={i}>
						<button 
							type="button" 
							onClick={() => selectOption(item.slug, o)}
							className={`
								${active == (typeof o === 'object' ? o.value : o) ? 'text-black font-bold bg-[#f8f8f8]' : 'text-[#000a]'} 
								hover:bg-[#f8f8f8] text-[1rem] lg:text-[.9rem] w-full text-start p-2 px-3 cursor-pointer focus:outline-none
							`}
						>
							{item.id === 1 ? (i===4 ? '+5' : o) : item.id === 2 ? (i===3 ? '+4' : o) : o.label}
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default ButtonQueryFilter;