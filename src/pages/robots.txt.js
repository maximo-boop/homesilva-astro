export async function GET(){
	return new Response(`
		User-agent: *
		Allow: /
		Disallow: /?*
		
		Sitemap: https://homesilva.com.ar/sitemap-index.xml
	`.trim());
}