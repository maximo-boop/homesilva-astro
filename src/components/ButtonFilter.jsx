'use client'
import React, {useState, useRef, useEffect} from 'react'
import {toSlug, toPlural} from '@/utils/utils.js'

const ButtonFilter = ({title, options, set, styles, id=0, currentValue, i}) => {
	const buttonRef = useRef(null)
	const [view, setView] = useState(false);

	const selectOption = (o) => {
		if(id===2){
			set(o)
		} else {
			set(toSlug(o))
		}
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


	// tipo = 0
	// operacion = 1
	// localidad = 2

	return (
		<div className="relative flex" ref={buttonRef}>
			<button className={`${styles} cursor-pointer hover:border-[#ffa361] duration-200 flex gap-2 focus:outline-none items-center bg-white rounded-full`} onClick={() => setView(!view)}>
				{title}
				{id===0&& (
					<svg xmlns="http://www.w3.org/2000/svg" className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" /></svg>
				)}
			</button>

			{view &&(
				<ul className={`${id!==1 ? 'flex-col py-2' : 'p-6 gap-2 flex-wrap w-[300px]'} absolute top-full left-0 flex mt-1 bg-white z-5 min-w-full text-nowrap rounded-[12px] overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.1)]`}>

					{options.map((o,index) => (
						<li key={index}>
							{id!==1 ? (
								<button onClick={() => selectOption(o)} className={`${currentValue === o ? 'text-black font-bold' : 'text-[#000a]'} hover:bg-[#f8f8f8] text-[.9rem] w-full text-start p-2 px-3 cursor-pointer focus:outline-none`}>
									{o}
								</button>
							) : (
								<a href={set(o)} className={`${
									currentValue && (
										i===0? (toPlural(o.toLowerCase()) === currentValue && 'border-[#ffa361]')
										: i===1? (o.toLowerCase() === currentValue && 'border-[#ffa361]')
										: (toSlug(o.toLowerCase()) === currentValue && 'border-[#ffa361]')
									) || 'border-[#ddd]'
								} flex hover:border-[#ffa361] duration-200 border rounded-full p-2 px-3 cursor-pointer focus:outline-none`}>{o}</a>
							)}
						</li>
					) )}
				</ul>
			)}
		</div>
	)
}

export default ButtonFilter;