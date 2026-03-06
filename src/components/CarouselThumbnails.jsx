  'use client'

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const LabelButtons = ({cat, i, emblaApi, selected}) => (
	<button
		key={i}
		className={`${i === selected ? "bg-white" : "cursor-pointer opacity-[.6]"} transition-bg transition-opacity duration-200 ease rounded-full focus:outline-none p-3 px-5 border-none`}
		onClick={() => emblaApi?.scrollTo(i)}
	>
		{cat.label}
	</button>
)

export default function CarouselThumbnails({ data, id=0 }) {
	const [selected, setSelected] = useState(0);
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
	const [isAnimating, setIsAnimating] = useState(false);
	const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
		containScroll: 'keepSnaps',
		dragFree: true
	})

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setSelected(emblaApi.selectedScrollSnap());
		};

		emblaApi.on("select", onSelect);
		onSelect();
	}, [emblaApi]);

	// useEffect(() => {
	// 	const onScroll = () => setIsAnimating(true)
	// 	const onSelect = () => setIsAnimating(false)

	// 	emblaApi.on('scroll', onScroll)
	// 	emblaApi.on('select', onSelect)

	// 	return () => {
	// 		emblaApi.off('scroll', onScroll)
	// 		emblaApi.off('select', onSelect)
	// 	}
	// }, [emblaApi]);

	const isEnabled = (n) => {
		if(!emblaApi) return
		return n===1 ? !emblaApi.canScrollPrev() : !emblaApi.canScrollNext()
	}

	const scrollPrev = useCallback(() => {
		// if (!emblaApi.canScrollPrev()) return
		if (emblaApi) emblaApi.scrollPrev()
	}, [emblaApi])

	const scrollNext = useCallback(() => {
		// if (!emblaApi.canScrollNext()) return
		if (emblaApi) emblaApi.scrollNext()
	}, [emblaApi])

	return (
		<div className={`flex ${id===0 ? 'flex-col' : 'flex-col-reverse gap-2'}`}>

			{/* thumbnails */}
			<div ref={emblaThumbsRef}
				className={`${id===0? 'mb-10 m-auto bg-[#0000000a] rounded-full w-fit text-[#000]' : 'overflow-hidden'}`}
			>
				<div className={`flex ${id===0 ? '' : 'gap-3'}`}>
					{data.map((cat, i) => (
						id===0? (
							<LabelButtons cat={cat} i={i} emblaApi={emblaApi} selected={selected} />
						) : (
							<button
								key={i}
								className="h-[130px] flex-[0_0_24%] bg-white rounded-[40px] cursor-pointer"
								onClick={() => emblaApi?.scrollTo(i)}
							>
							</button>
						)
					))}
				</div>
			</div>

			{id!== 0 && (
				<div className="flex justify-between items-center">
					<h2>Fotos</h2>
					<p className="opacity-[.6]">Ver todas</p>
				</div>
			)}

			{/* contenido principal */}
			<div className="overflow-hidden relative" ref={emblaRef}>
				<div className={`flex ${id===0 ? '-ml-[1rem]' : ''} peer`}>

					{data.map((cat, i) => (
						id===0? (
							<div className="flex-[0_0_100%]" key={i}>
								<div className={`${id===0?'grid-cols-1 lg:grid-cols-3':'grid-cols-3'} grid  gap-[1rem]`}>
									{cat.services.map((service, idx) => (
										<div className="cursor-pointer text-start p-6 bg-white overflow-hidden font-[500] text-ellipsis rounded-[40px] flex flex-col gap-2 ml-[1rem]" key={idx}>

											<div className='p-[9px] bg-[#f5f5f5] w-fit rounded-[12px]'>
												<span dangerouslySetInnerHTML={{ __html: service.icon }} />
											</div>
											<h3 className="font-[500] text-[1.1rem]">{service.title}</h3>
											<p className="opacity-[.6]">{service.description}</p>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="flex-[0_0_100%] min-h-[350px] bg-white rounded-[45px]" key={i} />
						)
					))}

				</div>

				{/* rows */}
				{id===1 && (
					<div className="peer-hover:opacity-100 opacity-0 hover:opacity-50 transition-opacity duration-300">
					{[1,2].map(n => (
						<button 
						className={`${isEnabled(n) ? 'opacity-0' : 'cursor-pointer'} absolute top-[50%] -translate-y-[50%] shadow-[0_0_1rem_rgba(0,0,0,0.1)] focus:outline-none bg-white rounded-full p-2 z-5 ${n===1?'left-5' : 'right-5'}`} 
						onClick={n===1?scrollPrev:scrollNext}>
							<svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								{n===1 ? (
										<path d="M15 6l-6 6l6 6" fill="none" />
									) : (
										<path d="M9 6l6 6l-6 6" fill="none" />
								)}
							</svg>
						</button>
					))}
				</div>
				)}
			</div>

		</div>
	);
}