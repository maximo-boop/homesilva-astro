import React from 'react';
import Carousel from './CarouselDefault.jsx'

const Property = ({p, grid=true, displayMap=true}) => {

	const url = `/propiedades/${p.slug}`;
	return (
		<div class={`${grid? 'flex-col' : ''} group cursor-pointer bg-white rounded-[35px] flex-[0_0_270px] flex overflow-hidden hover:shadow-xl transition-shadow ease duration-150`}>

		{/*// grid ? 'min-h-[170px]' :
		// (displayMap ? 'w-[300px] overflow-hidden' : 'w-[350px] overflow-hidden h-full')} bg-red-200`*/}

		<div class={`${grid ? '' : (!displayMap ? 'flex-1 overflow-hidden' : 'overflow-hidden flex-1')} bg-red-200`}>
			<Carousel data={[1,2,3]} id={1} url={url} />
		</div>

		{/**/}
		<a href={url} class={`${grid ? 'flex flex-col gap-2 h-full' : (!displayMap ? 'flex-2 flex flex-col' : 'flex-1 flex flex-col')} p-5`}>
			<h2 class={`${(grid||displayMap) ? 'text-[1rem]' :  'text-2xl'} font-[500]`}>{`${p.tipo} en ${p.operacion} en ${p.localidad}`}</h2>

			<div class="flex gap-1 opacity-[.6]">
				{/*<svg  xmlns="http://www.w3.org/2000/svg" width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="#000000"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
					<path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
				</svg>*/}
				<h3 class={`${(grid||displayMap) ? 'text-sm' : 'text-xl'} flex-1 `}>{p.descripcion}</h3>
			</div>

			<div class="flex gap-2 flex-wrap opacity-[.4]">{
					["1300 Sup", "2 Hab", "1 Baño"].map((item,i) => (
						<span key={i} class={`${(grid || displayMap) ? 'text-[13px]' : 'text-md'} rounded-[8px]  font-[500]`}>{item}</span>
					))
				}
			</div>

			<div class="flex justify-between items-center mt-auto">
				<span class={(grid||displayMap) ? '' : 'text-lg'}>{`${p.moneda} ${p.price}`}</span>
				<p class={`${(grid||displayMap) ? 'text-sm' : 'text-md'} py-[10px] px-[16px] rounded-[12px] bg-black text-white`}>Ver detalles</p>
			</div>
		</a>
	</div>
	);
}

export default Property;

