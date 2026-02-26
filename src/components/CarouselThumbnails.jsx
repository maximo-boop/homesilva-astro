'use client'

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const categories = [
	{
		label: "Comprador",
		services: [
			{ 
				title: "Búsqueda personalizada de propiedades",
				description: "Ofrecemos un servicio de búsqueda personalizada, donde te ayudamos a encontrar la propiedad perfecta que se ajuste a tus necesidades y criterios específicos.",
				icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>,
			},
			{ 
				// title: "Asesoría legal", 
				title: "Servicios de negociación",
				description: "Ofrecemos habilidades de negociación para obtener las mejores condiciones en las transacciones de compra o venta de propiedades.",
				icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>,
			},
			{ 
				// title: "Gestión hipotecaria", 
				title: "Asesoramiento en la compra y venta de propiedades",
				description: "Brindamos asesoramiento y orientación profesional durante todo el proceso de compra o venta de una propiedad.",
				icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
			},
		],
	},
	{
		label: "Vendedor",
		services: [
			{ 
				// title: "Tasación profesional", 
				title: "Evaluación y tasación de propiedades en Córdoba Capital",
				description: "Ofrecemos servicios de evaluación y tasación de propiedades para determinar el valor justo de una propiedad o para tener una idea realista del precio de compra.",
				icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
			},
			{ 
				// title: "Marketing inmobiliario", 
				title: "Asistencia en trámites legales y financieros",
				description: "Te proporcionamos asistencia en los trámites legales y financieros asociados con la compra o venta de una propiedad, asegurando una transacción sin problemas.",
				icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
			},
			{ 
				// title: "Gestión de visitas",
				title: "Gestión de visitas y exhibiciones de propiedades",
				description: "Realizamos visitas a las propiedades para que puedas conocerlas en persona y tomar decisiones informadas.",
				icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
			},
			// Si deseas mejorar el aspecto y el valor de una propiedad, ofrecemos servicios de diseño de interiores y remodelación.
		],
	},
];

export default function CarouselThumbnails() {
	const [selected, setSelected] = useState(0);
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setSelected(emblaApi.selectedScrollSnap());
		};

		emblaApi.on("select", onSelect);
		onSelect();
	}, [emblaApi]);

	return (
		<div>
			<div className="mb-10 m-auto bg-[#0000000a] rounded-full w-fit text-[#000]">
				{categories.map((cat, i) => (
					<button
						key={i}
						className={`${i === selected ? "bg-white" : "cursor-pointer opacity-[.6]"} transition-bg transition-opacity duration-200 ease rounded-full focus:outline-none p-3 px-5 border-none`}
						onClick={() => emblaApi?.scrollTo(i)}
					>
						{cat.label}
					</button>
				))}
			</div>

			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex -ml-[1rem]">
					{categories.map((cat, i) => (
					<div className="flex-[0_0_100%]" key={i}>
						<div className="grid grid-cols-3 gap-[1rem]">
							{cat.services.map((service, idx) => (
								<div className="cursor-pointer text-start p-6 bg-white overflow-hidden font-[500] text-ellipsis rounded-[40px] flex flex-col gap-2 ml-[1rem]" key={idx}>
									<div className='p-[9px] bg-[#f5f5f5] w-fit rounded-[12px]'>
										{service.icon}
									</div>
									<h3 className="font-[500] text-[1.1rem]">{service.title}</h3>
									<p className="opacity-[.6]">{service.description}</p>
								</div>
							))}
						</div>
					</div>
					))}
				</div>
			</div>
		</div>
	);
}