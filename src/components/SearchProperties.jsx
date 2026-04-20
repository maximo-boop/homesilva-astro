
import React, { useState, useRef, useEffect } from 'react';
import propiedades from '@/data/propiedades.json'
import {toSlug, toPlural} from '@/utils/utils.js'

const SearchProperties = () => {
	const seachContainer = useRef(null)
	const [currentId, setCurrentId] = useState()
	const [form, setForm] = useState({
		localidad: null,
		tipo: null,
		operacion: 'venta'
	});

	const handleChange = (name, value) => {
		setForm(prev => ({
			...prev,
			[name]: prev[name]===value ? null : value
		}));
		setCurrentId(null)
	};

	useEffect(() => {
		function handleClick(event){
			if(seachContainer.current && !seachContainer.current.contains(event.target)){
				setCurrentId(null)
			}
		}

		document.addEventListener("mousedown", handleClick);
		return ()=> document.removeEventListener("mousedown", handleClick)
	}, [])

	const openOptions = (id) => {
		setCurrentId(prevState => prevState === id ? null : id)
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const {operacion, tipo, localidad} = form;
		const url = `/propiedades${operacion!==null ? `/${operacion}` : ''}${tipo!==null?`/${toPlural(tipo.toLowerCase())}`:''}${localidad!==null?`/${toSlug(localidad.toLowerCase())}`:''}`
		window.location.href = url;
	};

	const filters = [
		{
			id: 1,
			title: 'Localidad',
			operation: "localidad",
			options: [...new Set(propiedades.map(p => p.locality))]
		},
		{
			id: 2,
			title: 'Tipo de propiedad',
			operation: "tipo",
			options: [...new Set(propiedades.map(p => p.type))],
		}
	];

	return (
		<div className="text-sm">

			<div className="flex">
				{["venta", "alquiler"].map((item,i) => (
					<button 
						key={i} 
						type="button" 
						aria-label={`Filtrar propiedades en ${item}`}
						aria-pressed={form.operacion === item}
						onClick={() => handleChange("operacion", item)} 
						className={`w-full lg:w-auto focus:outline-none transition-opacity duration-200 ease bg-white pb-1 pt-4 px-4 rounded-t-[18px] ${form.operacion === item ? "" : "opacity-[.5] cursor-pointer"}`}>{item==='venta' ? 'Comprar': 'Alquilar'}</button>
				))}
			</div>

			<form ref={seachContainer} onSubmit={handleSubmit}  className="bg-white p-5 rounded-t-none lg:rounded-tr-[24px] rounded-[24px] flex flex-col lg:flex-row lg:items-center flex-nowrap gap-4 w-auto  lg:w-fit lg:shadow-[0_0_25px_rgba(0,0,0,0.1)]">

				{filters.map((item, i) => (
						<div key={item.id} className={`flex flex-col relative ${item.id === 4 ? "hidden lg:flex" : ""}`}>

							{/* lg:border-r  lg:border-[#efefef] */}
							<button 
								type="button"
								aria-controls={`listbox-${item.id}`}
								aria-label={`${item.title}: ${form[item.operation] || "Seleccionar"}. Abrir opciones`}
								aria-haspopup="listbox"
								aria-expanded={currentId === item.id}
								onClick={()=> openOptions(item.id)} 
								className="items-start cursor-pointer flex flex-col focus:outline-none "
							>
								<div className="flex justify-between items-center gap-10 w-full">
									<div className="flex items-center gap-[5px]">
										<span className="text-[.9rem] text-nowrap">{item.title}</span>
									</div>
									<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" /></svg>
								</div>

								<p className="text-[var(--text)] truncate max-w-[140px]">{form[item.operation] || "Seleccionar"}</p>
							</button>

							<ul 
								id={`listbox-${item.id}`}
								role="listbox"
								aria-label={item.title}
								className={`${currentId === item.id ? 'flex' : 'hidden'} options absolute top-6 left-0 bg-white min-w-full max-h-[250px] overflow-y-auto overflow-hidden flex-col py-2 rounded-[10px] z-50`} 
								style={{ boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}
							>
								{item.options.map((o, index) => (
									<li data-value={index} key={index} role="option" aria-selected={form[item.operation] === o} className="z-50">
										<button type="button" aria-label={`Filtrar propiedades por ${item.title} ${o}`} onClick={()=> handleChange(item.operation, o)} className="w-full text-start cursor-pointer p-2 px-4 hover:bg-[#fafafa] focus:outline-none">
											{o}
										</button>
									</li>
								))}
							</ul>
						</div>
					))
				}

				<button aria-label="Buscar propiedades" type="submit" className="cursor-pointer bg-[var(--cta)] items-center justify-center gap-2 px-[16px] py-[12px] text-white flex rounded-[18px]">
					<span className="font-medium lg:hidden"> {/* span ?? */}
						Buscar
					</span>

					<svg focusable="false" aria-hidden="true" className="hidden lg:inline" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					<path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
					<path d="M19 19l-3 -3" /></svg>

				</button>
			</form>
		</div>
	);
}

export default SearchProperties;