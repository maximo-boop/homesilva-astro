import React, {lazy, Suspense} from 'react';
import {buildTitle, formatPrice} from '@/utils/utils.js'
const Carousel = lazy(() => import('./CarouselDefault.jsx'))

const Property = ({p, grid=true, displayMap=true, id=0}) => {
	const url = `/propiedades/${p.slug}`;
	return (
		<article aria-labelledby={`titulo-${p.id}`} class={`${grid? 'flex-col' : 'min-h-[250px]'} ${id===1? 'h-full' : ''} group cursor-pointer bg-white rounded-[35px] flex-[0_0_260px] flex overflow-hidden hover:shadow-xl transition-shadow ease duration-450`}>

		<div class={`${grid ? '' : (!displayMap ? 'flex-1 overflow-hidden' : 'overflow-hidden flex-1')}`}>
			<Suspense fallback={
				<div className={`w-full ${id===1? 'h-44' : 'h-40'} bg-gray-100 rounded-t-[35px]`}>
					<img 
						src={p.images?.[0]}
						alt={buildTitle(p)}
						className="w-full h-full object-cover"
					/>
				</div>
			}>
				<Carousel data={p.images.slice(0,3)} id={1} url={url} alt={buildTitle(p)} customH={id===1? true : false} />
			</Suspense>
		</div>

		<a aria-label={`Ver ${p.type} en ${p.operation} en ${p.locality}`} href={url} class={`${grid ? 'flex flex-col gap-[8px] h-full' : (!displayMap ? 'flex-2 flex flex-col' : 'flex-1 flex flex-col')} p-5`}>
			<h2 class={`${(grid||displayMap) ? 'text-md lg:text-[1rem]' :  'lg:text-2xl'} font-[500]`}>{buildTitle(p)}</h2>
			<h3 class={`${(grid||displayMap) ? 'text-sm' : 'text-sm lg:text-xl'} text-[.9rem] flex-1 text-[#888]`}>{`${p.direction ? `${p.direction}, ` : ''}${p.barrio}`}</h3>

			<dl class="flex flex-wrap gap-2">
						{Object.entries(p.characteristics).map(([k, v], i) => {
							const visibleIndexes = 
								(p.type === 'Terreno' || p.type === 'Lote') ? [0, 1]
								: (p.type === 'Local' || p.type === 'Oficina') ? [1, 2, 4]
								: [1, 3, 4];

							if (!visibleIndexes.includes(i) || v === null) return null;
							const displayValue = (i === 0 || i === 1) ? `${v}m²` : `${v}`;

							return (
								<div key={k}>
									<dt class="sr-only">
										{k.includes('_') ? k.split('_').join(' ') : k}
									</dt>
									<dd class="flex items-center gap-1 bg-[var(--primaryColor)] w-fit text-[var(--cta)] py-[8px] px-3 rounded-[9px] font-semibold text-xs">
										{
											i=== 0 ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-maximize"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 4l4 0l0 4" /><path d="M14 10l6 -6" /><path d="M8 20l-4 0l0 -4" /><path d="M4 20l6 -6" /><path d="M16 20l4 0l0 -4" /><path d="M14 14l6 6" /><path d="M8 4l-4 0l0 4" /><path d="M4 4l6 6" /></svg>) : 
											i=== 1 ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-diagonal"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 4l4 0l0 4" /><path d="M14 10l6 -6" /><path d="M8 20l-4 0l0 -4" /><path d="M4 20l6 -6" /></svg>) : 
											i=== 2 ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -1" /><path d="M4 15a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -3" /><path d="M14 6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2l0 -12" /></svg>) : 
											i=== 3 ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-bed"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 17v-3h-20" /><path d="M2 8v9" /><path d="M12 14h10v-2a3 3 0 0 0 -3 -3h-7v5" /></svg>
											) : (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-bath"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1" /><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25" /><path d="M4 21l1 -1.5" /><path d="M20 21l-1 -1.5" /></svg>)
										}

										{displayValue}
									</dd>
								</div>
							);
						})}
					</dl>

			<div class="flex justify-between items-center mt-auto gap-2">
				<span class={` ${(grid||displayMap) ? 'text-lg' : 'lg:text-lg'} text-[1rem] text-nowrap`}>{`${p.toPrice ? 'Desde ' : ''}${formatPrice(p.price, p.currency)}`}</span>
				<p class={`${(grid||displayMap) ? '' : ''} py-[8px] px-[14px]  text-[.9rem] rounded-[12px] bg-black text-white truncate`}>Ver detalles</p>
			</div>
		</a>
	</article>
	);
}

export default Property;

