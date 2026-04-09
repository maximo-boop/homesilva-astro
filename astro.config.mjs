// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
	site: 'https://homesilva.com.ar',
	integrations: [
		react(),
		sitemap({
			filter: (page) => new URL(page).search === '',
			serialize: (item) => {
			const path = new URL(item.url).pathname;
			const segments = path.replace(/^\/|\/$/g, '').split('/');

			// Home
			if (path === '/') return { ...item, priority: 1.0, changefreq: 'daily' };

			if (segments[0] === 'propiedades') {
			// Ficha individual: /propiedades/[slug]/
			if (segments.length === 2 && !esSegmentoReservado(segments[1])) {
				return { ...item, priority: 1.0, changefreq: 'weekly' };
			}
			// Cualquier filtro estático (categoría, operación, ubicación, combinaciones, paginación)
			return { ...item, priority: 0.8, changefreq: 'weekly' };
			}

			return { ...item, priority: 0.5, changefreq: 'monthly' };
			}
		})
	],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve('./src')
			}
		}
	}
});

function esSegmentoReservado(seg) {
	return ['casas','departamentos','lotes','terrenos','cabañas','cabanas',
	'hoteles','hostels','locales','venta','alquiler',
	'cordoba','valle-hermoso','tanti','los-chanares',
	'casa-grande','page'].includes(seg);
}