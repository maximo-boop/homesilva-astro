  'use client'

import { useEffect, useState, useCallback } from "react";
import Carousel from '@/components/CarouselDefault.jsx'
import useEmblaCarousel from "embla-carousel-react";

const LabelButtons = ({cat, i, emblaApi, selected}) => (
	<button
		key={i}
		type="button"
		aria-pressed={i === selected}
		aria-label={`Ver los servicios para ${cat.label}es`}
		className={`${i === selected ? "bg-white" : "cursor-pointer text-[var(--text)]"} transition-bg transition-text duration-200 ease rounded-[16px] focus:outline-none p-3 px-5 border-none`}
		onClick={() => emblaApi?.scrollTo(i)}
	>
		{cat.label}
	</button>
)

export default function CarouselThumbnails({ data, id=0, alt='' }) {
	
	const [selected, setSelected] = useState(0);
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
	const [isAnimating, setIsAnimating] = useState(false);
	const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
		containScroll: id === 1 ? 'trimSnaps' : 'keepSnaps',
		dragFree: true
	})
	const [imgSelected, setImgSelected] = useState(null)
	const [imgErrors, setImgErrors] = useState({});
	const handleImgError = (i) => {
		setImgErrors(prev => ({ ...prev, [i]: true }));
	};

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setSelected(emblaApi.selectedScrollSnap());
		};

		emblaApi.on("select", onSelect);
		onSelect();
	}, [emblaApi]);

	const isEnabled = (n) => {
		if(!emblaApi) return
		return n===1 ? !emblaApi.canScrollPrev() : !emblaApi.canScrollNext()
	}

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev()
	}, [emblaApi])
	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext()
	}, [emblaApi])

	return (
		<div className={`flex ${id===0 ? 'flex-col' : 'flex-col-reverse gap-2'}`}>

			{/* thumbnails */}
			<div ref={emblaThumbsRef}
				className={`${id===0? 'mb-8 m-auto bg-[#00000008] rounded-[16px] w-fit' : 'overflow-hidden'}`}
			>
				<div className={`flex ${id===0 ? '' : 'gap-3'}`}>
					{data.map((cat, i) => (
						id===0? (
							<LabelButtons key={i} cat={cat} i={i} emblaApi={emblaApi} selected={selected} />
						) : (
							<button
								type="button"
								aria-label={`Ir a la posicion ${i+1} del carousel`}
								key={i}
								className="h-[100px] lg:h-[150px] flex-[0_0_auto] bg-white rounded-[30px] lg:rounded-[40px] overflow-hidden cursor-pointer"
								onClick={() => emblaApi?.scrollTo(i)}
							>
								{imgErrors[i] ? (
									<div className="w-[100px] lg:w-[150px] h-full bg-gray-200 text-xs text-wrap">
										<span className="text-gray-500">Imagen no disponible</span>
									</div>
								) : (
									<img
										src={cat}
										loading='lazy'
										className="w-[100px] lg:w-[150px] h-full object-cover"
										onError={() => handleImgError(i)}
										alt={`${alt} - foto ${i+1}`}
										width="100"
										height="100"
									/>
								)}
							</button>
						)
					))}
				</div>
			</div>

			{id!== 0 && (
				<div className="flex justify-between items-center">
					<h2>Fotos</h2>
					<button 
						type="button"
						aria-label="Expandir las fotos actuales"
						onClick={() => setImgSelected(1)} 
						className="text-gray-400 cursor-pointer" 
					>Ver todas</button>
				</div>
			)}

			<div className={`overflow-hidden relative ${id===1? 'rounded-[45px]' : ''}`} ref={emblaRef}>
				<div className={`flex ${id===0 ? '-ml-[1rem]' : ''} peer`}>

					{data.map((cat, i) => (
						id===0? (
							<div className="flex-[0_0_100%]" key={i}>
								<ul className={`${id===0?'grid-cols-1 lg:grid-cols-3':'grid-cols-3'} grid  gap-[1rem]`}>
									{cat.services.map((service, idx) => (
										<li className="cursor-pointer text-start p-6 bg-white overflow-hidden text-ellipsis rounded-[40px] flex flex-col gap-2 ml-[1rem]" key={idx}>
											<span dangerouslySetInnerHTML={{ __html: service.icon }} />
											<h3 className="font-[500] text-[1.1rem] lg:text-lg">{service.title}</h3>
											<p className="text-[#aaa]">{service.description}</p>
										</li>
									))}
								</ul>
							</div>
						) : (
							<button 
								key={i}
								type="button"
								aria-label={`Deslizar hasta la imagen ${i+1}`}
								onClick={()=> setImgSelected(i)}
								className="flex-[0_0_100%] min-h-[300px] lg:min-h-[400px] bg-white cursor-pointer" 
							>
								{imgErrors[i] ? (
									<div className="h-[250px] lg:h-[400px] w-full bg-gray-200 text-wrap">
										<span className="text-gray-500">Imagen no disponible</span>
									</div>
									) : (
									<img
										src={cat}
										className="h-[300px] lg:h-[400px] w-full object-cover"
										alt={`${alt} - foto ${i+1}`}
										width="150"
										height="150"
										loading={i===0 ? 'eager' : 'lazy'}
										fetchpriority={i === 0 ? 'high' : 'auto'}
										onError={() => handleImgError(i)}
									/>
								)}
							</button>
						)
					))}
				</div>

				{id===1 && (
					<div className="peer-hover:opacity-100 opacity-0 hover:opacity-50 transition-opacity duration-300">
					{[1,2].map(n => (
						<button 
							key={n}
							type="button"
							aria-label={`${n===1 ? 'Retroceder' : 'Avanzar'} en el slider`}
							onClick={n===1?scrollPrev:scrollNext}
							className={`${isEnabled(n) ? 'opacity-0' : 'cursor-pointer'} absolute top-[50%] -translate-y-[50%] shadow-[0_0_1rem_rgba(0,0,0,0.1)] focus:outline-none bg-white rounded-full p-2 z-5 ${n===1?'left-5' : 'right-5'}`} 
						>
							<svg focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

				{id===1 && (
					<div className="absolute bottom-5 right-5 lg:bottom-10 lg:right-10 flex items-center gap-5">
							<p className="bg-[#000a] text-sm p-2 text-white rounded-[12px] flex items-center gap-2">
							{`${selected+1}/${data.length}`}
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
								<g clip-path="url(#clip0_4418_9254)">
								<path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M2.67004 18.9496L7.60004 15.6396C8.39004 15.1096 9.53004 15.1696 10.24 15.7796L10.57 16.0696C11.35 16.7396 12.61 16.7396 13.39 16.0696L17.55 12.4996C18.33 11.8296 19.59 11.8296 20.37 12.4996L22 13.8996" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</g>
								<defs>
								<clipPath id="clip0_4418_9254">
								<rect width="24" height="24" fill="white"/>
								</clipPath>
								</defs>
							</svg>
						</p>
					</div>
				)}
			</div>

			{imgSelected!== null && (
				<div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-100 h-screen w-screen flex items-center justify-center">

					<div className="bg-red-100 lg:h-[90%] lg:w-[90%] w-full h-full overflow-hidden z-30 relative">
						<Carousel data={data} id={4} startIndex={imgSelected} alt={alt} closeModal={()=> setImgSelected(null)} />
						<button 
							type="button"
							aria-label="Cerrar modal de imagenes"
							onClick={() => setImgSelected(null)} 
							className="absolute top-5 right-5 z-20 cursor-pointer" 
						>
							<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" width="30" height="30" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M6.707 5.293l5.293 5.292l5.293 -5.292a1 1 0 0 1 1.414 1.414l-5.292 5.293l5.292 5.293a1 1 0 0 1 -1.414 1.414l-5.293 -5.292l-5.293 5.292a1 1 0 1 1 -1.414 -1.414l5.292 -5.293l-5.292 -5.293a1 1 0 0 1 1.414 -1.414" />
							</svg>
						</button>
					</div>
					<button 
						type="button"
						aria-label="Cerrar modal de imagenes"
						onClick={() => setImgSelected(null)} 
						className="absolute w-screen h-screen top-0 left-0 z-20" 
					/>

				</div>
			)}

		</div>
	);
}