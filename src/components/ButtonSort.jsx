'use client'
import React, {useState, useRef, useEffect} from 'react'

const ButtonSort = ({ item, set }) => {
	const [view, setView] = useState(false);
	const buttonRef = useRef(null)

	const selectOption = (value) => {
		set(value)
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
		<div className="relative flex" ref={buttonRef}>
			<button 
				onClick={() => setView(!view)}
				type="button" 
				className={`${false ? 'border-[#ffa361]' : ''} truncate py-3 px-4 cursor-pointer duration-200 flex gap-2 focus:outline-none items-center bg-white rounded-full`}
			>
				{item.title}
				<svg xmlns="http://www.w3.org/2000/svg" className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" /></svg>
			</button>

			<ul className={`${view ? 'flex' : 'hidden'} flex-col py-2 absolute top-full left-0 flex mt-1 bg-white z-5 min-w-full text-nowrap rounded-[12px] overflow-hidden shadow-[0_0_10px_rgba(0,0,255,0.05)]`}>
				{item.options.map((o, i) => (
					<li key={i}>
						<button 
							type="button" 
							onClick={() => selectOption(o.slug)}
							className={`
							${false ? 'text-black font-bold bg-[#f8f8f8]' : 'text-[#000a]'} 
							hover:bg-[#f8f8f8] text-[.9rem] w-full text-start p-2 px-3 cursor-pointer focus:outline-none`}
						>
							{o.title}
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default ButtonSort;