'use client'
import React, { useState, useRef, useEffect } from 'react';
// import ChevronDown from '../assets/icons/ChevronDown.astro'
// import { useRouter } from 'next/navigation'; // O 'next/router' si usas pages router

const SearchProperties = ({ values }) => {
	// const router = useRouter();
	const seachContainer = useRef(null)
	const [currentId, setCurrentId] = useState()
	const [form, setForm] = useState({
		localidad: 'Buenos Aires',
		tipo: 'Casa',
		operacion: 'Comprar',
		habitaciones: 1
	});

	const handleChange = (name, value) => {
		setForm({ ...form, [name]: value });
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
		// router.push({
		// 	pathname: '/propiedades',
		// 	query: form,
		// });
	};

	const filters = [
		{
			id: 1,
			title: 'Localidad',
			operation: "localidad",
			options: values?.localidades || ["Córdoba", "Valle Hermoso", "La Falda"],
			icon: <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0" /></svg>
		},
		{
			id: 2,
			title: 'Tipo de propiedad',
			operation: "tipo",
			options: values?.categorias || ["Casa", "Departamento"],
			icon: <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 8.71l-5.333 -4.148a2.666 2.666 0 0 0 -3.274 0l-5.334 4.148a2.665 2.665 0 0 0 -1.029 2.105v7.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-7.2c0 -.823 -.38 -1.6 -1.03 -2.105" /><path d="M16 15c-2.21 1.333 -5.792 1.333 -8 0" /></svg>
		},
		// {
		// 	id: 3,
		// 	title: 'Habitaciones',
		// 	operation: "habitaciones",
		// 	options: values?.habitaciones || ["1","2","3", "+4"],
		// 	icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 12v.01" /><path d="M3 21h18" /><path d="M6 21v-16a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v16" /></svg>
		// }
	];

	return (
		<div className="text-sm">

			<div className="flex">
				{["Comprar", "Alquilar"].map((item,index) => (
					<button key={index} onClick={() => handleChange("operacion", item)} className={`w-full lg:w-auto focus:outline-none transition-opacity duration-200 ease bg-white pb-1 pt-4 px-4 rounded-t-[18px] ${form.operacion === item ? "" : "opacity-[.6] cursor-pointer"}`}>{item}</button>
				))}
			</div>

			<form ref={seachContainer} onSubmit={handleSubmit}  className="bg-white p-5 rounded-t-none lg:rounded-tr-[24px] rounded-[24px] flex flex-col lg:flex-row lg:items-center flex-nowrap gap-4 w-auto  lg:w-fit" style={{ boxShadow: "0 0 25px rgba(0,0,0,0.1)" }}>

				{filters.map((item, i) => (
						<div key={item.id} className={`flex flex-col relative ${item.id === 4 ? "hidden lg:flex" : ""}`}>

							{/* lg:border-r  lg:border-[#efefef] */}
							<button onClick={()=> openOptions(item.id)}  className="items-start cursor-pointer flex flex-col focus:outline-none ">
								<div className="flex justify-between items-center gap-10 w-full">
									<div className="flex items-center gap-[5px]">
										{/* item.icon */}
										<h3 className="text-[.9rem] text-nowrap">{item.title}</h3>
									</div>
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" /></svg>
								</div>


								<p className="opacity-[.6] truncate max-w-[140px]">{form[item.operation]}</p>
							</button>

							{currentId == item.id && (
								<ul className="options absolute top-8 left-0 bg-white min-w-full max-h-[250px] overflow-y-auto z-10 overflow-hidden flex flex-col py-2 rounded-[10px]" style={{ boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
									{item.options.map((o, index) => (
										<li data-value={index} key={index}>
											<button onClick={()=> handleChange(item.operation, o)} className="w-full opacity-[.6] text-start cursor-pointer p-2 px-4 hover:bg-[#fafafa] focus:outline-none">
												{o}
											</button>
										</li>
									))}
								</ul>
							)}
						</div>
					))
				}

				<button type="submit" alt="buscar propiedades" className="cursor-pointer bg-[var(--cta)] px-[16px] py-[12px] text-white rounded-[16px]">
					<p className="m-auto font-medium">
						Buscar
					</p>
				</button>
			</form>
		</div>
	);
}

export default SearchProperties;