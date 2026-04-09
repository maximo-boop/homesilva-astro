// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'

// https://astro.build/config
export default defineConfig({
	site: 'https://homesilva.com.ar',
	integrations: [
		react(),
		sitemap({
			filter: (page) => {
				const url = new URL(page);
				return url.search === '';
			},
			serialize: (item) => {
				const path = new URL(item.url).pathname;
				if(path === '/'){
					return { ...item, priority: 1.0, changefreq: 'weekly' }
				}
				if(/^\/propiedades\/[^/]+$/.test(path)){
					return { ...item, priority: 1.0, changefreq: 'weekly' }
				}
				if(/^\/propiedades\/[^/]+\/[^/]+\/[^/]+$/.test(path)){
					return { ...item, priority: 0.9, changefreq: 'daily' }
				}

				return { ...item, priority: 0.5, changefreq: 'monthly' }
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