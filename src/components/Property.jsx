import React from 'react';
import Carousel from './CarouselDefault.jsx'

const Property = ({p}) => {
    return (
        <div class="group cursor-pointer bg-white rounded-[35px] flex-[0_0_270px] flex overflow-hidden flex-col hover:shadow-xl transition-shadow ease duration-150">

	{/*<div class="relative">*/}
		<Carousel data={[1,2,3]} id={1} />
		{/*<p class="absolute top-[20px] right-[20px] bg-white rounded-[20px] py-[8px] px-[16px] text-xs">Venta</p>*/}
	{/*</div>*/}

	{/*<!-- CONTENIDO -->*/}

	<div class="flex flex-col gap-2 p-6">

		{/*<!-- TITULO -->*/}

		<h2 class="text-[1rem] font-[500]">{p.titulo}</h2>

		<div class="flex gap-1 opacity-[.6]">
			{/*<svg  xmlns="http://www.w3.org/2000/svg" width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="#000000"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round">
				<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
				<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
				<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
			</svg>*/}
			<h3 class="flex-1 text-sm">Villa los Angeles, Valle Hermoso, Córdoba</h3>
		</div>

		{/*<!-- CARACTERISTICAS -->*/}

		{/*<div class="flex gap-2 flex-wrap">{
				["1300 Sup", "2 Hab", "1 Baño"].map((item,i) => (
					<span key={i} class="bg-[#fff5ebff] py-1  px-4 rounded-[8px] text-[12px] text-[#402411ff] font-[500]">{item}</span>
				))
			}
		</div>*/}

		{/*<!-- CTA -->*/}

		<div class="flex justify-between items-center">
			<span>USD 130.000</span>
			<a href="/" class="py-[10px] px-[16px] rounded-[12px] bg-black text-white text-sm">Ver detalles</a>
		</div>

	</div>
</div>
    );
}

export default Property;

