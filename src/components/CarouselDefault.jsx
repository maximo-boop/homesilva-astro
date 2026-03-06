'use client'
import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
// npm install embla-carousel-autoplay
// import Autoplay from 'embla-carousel-autoplay'
import Property from './Property.jsx'

const CarouselDefault = ({ data=[1,2,3], id=0, url }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({align: 'start'})
	// [Autoplay({ delay: 3000, stopOnInteraction: false })]

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev()
	}, [emblaApi])
	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext()
	}, [emblaApi])

	return (
		<div className="relative">
			<div ref={emblaRef}>
				<div className={`
					flex 
					${id===0 ? 'gap-8' : 
					id===1 ? '' 
					: ""}`
				}>
				{/*h-full w-full*/}

					{data.map((item,i) => (
						id===0 ? (
							<Property key={i} p={item} />
						) : id === 1 ? (
							// h-full min-h-[170px] 
							<a href={url} className="flex-[0_0_100%] relative">
								<img key={i} src="/example-1.webp" alt="" className="object-cover" />

								{i===2 && (
									<div className="bg-[#0005] inset-0 absolute flex items-center justify-center">
										<p className="text-white z-5">Ver más...</p>
									</div>
								)}
							</a>
						) : (
							<div key={i} className="flex-[0_0_100%]">
								<p class="text-2xl mt-10 opacity-[.6]">{item.title}</p>
							</div>
						)
					))}

				</div>
			</div>

			{/* botones */}
			<div className={`${id===1 ? 'px-3 group-hover:opacity-100 hover:opacity-50 opacity-0 transition-opacity duration-500' : 'flex gap-4 mt-10 mx-auto w-fit' }`}>
				{[1,2].map(n => (
					<button key={n} className={`${n===1?'left-3':'right-3'} cursor-pointer focus:outline-none ${id===1 ? 'bg-white rounded-full p-2 absolute top-[50%] -translate-y-[50%]' : 'bg-black p-3 text-white rounded-[12px]'}`} onClick={n===1?scrollPrev:scrollNext}>
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