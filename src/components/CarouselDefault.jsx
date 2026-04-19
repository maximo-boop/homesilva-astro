'use client'
import React, { useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {toPlural, toSlug} from '@/utils/utils.js'
import Property from './Property.jsx'

const CarouselDefault = ({ data, id=0, url="#", startIndex, alt="", customH=false }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start' })

	useEffect(() => {
		if(!emblaApi || !startIndex) return

		setTimeout(() => {
			emblaApi.scrollTo(startIndex, true)
		}, 100)	

	}, [emblaApi, startIndex])

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev()
	}, [emblaApi])
	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext()
	}, [emblaApi])

	return (
		<div className={`relative h-full ${id===4 ? 'flex bg-[var(--cta)] w-full h-full' : ''}`}>
			<div ref={emblaRef} className="h-full">
				<div className={`
					flex h-full ${
						id===0 ? 'gap-8' : 
						id===1 ? '' :
						id===4 ? 'flex h-full w-full' :
						id === 5 ? 'gap-10'
						: ""
					}`
				}>
					{data.map((item,i) => (
						id===0 ? (
							<Property key={i} p={item} />
						) : id === 1 ? (
							<a href={url} aria-label={alt} key={i} className={`flex-[0_0_100%] relative ${customH? 'min-h-44 max-h-44' : 'min-h-40 max-h-40'}  overflow-hidden`}>
								<img
									src={item}
									alt={`${alt} - foto ${i+1}`}
									loading={i===0 ? 'eager' : 'lazy'}
									fetchPriority={i === 0 ? 'high' : 'auto'}
									className="object-cover w-full h-full group-hover:scale-[1.1] duration-450 ease" 
								/>

								{i===2 && (
									<div className="bg-[#0005] inset-0 absolute flex items-center justify-center">
										<p className="text-white z-5">Ver más...</p>
									</div>
								)}
							</a>
						) : id === 4 ? (
							<div className="flex flex-[0_0_100%] h-full" key={i}>
								<img 
									src={item}
									alt={`${alt} - foto ${i+1}`}
									loading={i===0 ? 'eager' : 'lazy'}
									fetchPriority={i === 0 ? 'high' : 'auto'}
									className="object-contain w-full h-full"
								/>
							</div>
						) : (
							<ul className="flex-[0_0_100%] lg:flex-[0_0_40%] grid grid-cols-1 grid-rows-2 gap-10" key={i}>
								{item.map((sub, ind) => (
									<li className="flex" key={ind}>
										<a href={`/propiedades/${sub.operation.toLowerCase()}/${toPlural(sub.type.toLowerCase())}/${toSlug(sub.locality.toLowerCase())}`} alt={`${sub.operation} de ${toPlural(sub.type.toLowerCase())} en la zona de ${sub.locality}`}
											className="w-full flex-1 flex items-center group bg-white rounded-[32px] hover:shadow-[0_0_20px_rgba(0,0,0,0.05)] transition-shadow ease duration-200"
										>

										<div className="overflow-hidden 
											h-full
											min-w-[135px] 
											max-w-[135px] 
											min-h-[135px] 
											w-[135px]
											h-[135px]

											lg:min-h-[150px] 
											lg:min-w-[150px] 
											lg:max-w-[150px] 
											lg:w-[150px] 
											lg:h-[150px] 
											flex items-center justify-center rounded-[35px] flex-1
											relative
										">
											<img 
												src={sub.img}
												alt={`Localidad de ${sub.locality}`}
												width="150"
												height="150"
												loading='lazy'
												className="bg-[#fafafa] h-full w-full group-hover:scale-[1.2] transition-scale duration-500 ease object-cover "
											/>
											<div className="absolute bg-[rgba(0,0,0,0.1)] w-full h-full" />
										</div>
										<div className="p-4 lg:p-6 flex flex-col flex-1">
											<div className="flex justify-between items-center">
												<h2 className="text-xl z-9 font-[600]">{sub.locality}</h2>
												<svg className="mb-auto" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 7l-10 10" /><path d="M8 7l9 0l0 9" /></svg>
											</div>

											<div>
												<p className="text-[#aaa] z-9 mt-1">{`${sub.operation} de ${toPlural(sub.type.toLowerCase())} en la localidad de ${sub.locality}`}</p>
											</div>
										</div>
										</a>
									</li>
								))}
							</ul>
						)
					))}
				</div>
			</div>

			<div className={`${id===1 ? 'px-3 group-hover:opacity-100 hover:opacity-50 opacity-0 transition-opacity duration-500' : 'flex gap-4 mt-10 mx-auto w-fit' }`}>
				{[1,2].map(n => (
					<button 
						type="button"
						aria-label={`${n===1? 'Retroceder' : 'Avanzar'} en el carousel`}
						key={n}
						className={`${n===1?'left-3':'right-3'} cursor-pointer focus:outline-none ${id===1||id===4 ? 'bg-white rounded-full p-2 absolute top-1/2 -translate-y-1/2' : 'bg-black p-3 text-white rounded-[12px]'}`} 
						onClick={n===1?scrollPrev:scrollNext}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width={id===1? 20 : 25} height={id===1?20:25} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							{id===1 ? (
								n===1 ? (
									<path d="M15 6l-6 6l6 6" fill="none" />
								) : (
									<path d="M9 6l6 6l-6 6" fill="none" />
								)
							) : (
								<>
									<path d="M5 12l14 0" />
									{n===1 ? (
										<>
											<path d="M5 12l4 4" />
											<path d="M5 12l4 -4" />
										</>
									): (
										<>
											<path d="M15 16l4 -4" />
											<path d="M15 8l4 4" />
										</>
									)}
								</>
							)}						
						</svg>
					</button>
				))}
			</div>
		</div>
	)
}

export default CarouselDefault