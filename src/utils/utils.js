const PLURALES = {
	'casa': 'casas',
	'hostel': 'hostels',
	'cabaña': 'cabañas',
	'departamento': 'departamentos',
	'terreno': 'terrenos',
	'local': 'locales',
	'oficina': 'oficinas',
	'hotel': 'hoteles',
	'lote': 'lotes',
	'ph': 'ph'
}
const SINGULARES = Object.fromEntries(
	Object.entries(PLURALES).map(([k, v]) => [v, k])
)
export const toSlug = (str="") => {
	return str
	.toLowerCase()
	.normalize('NFD')                    		// descompone acentos
	.replace(/[\u0300-\u036f]/g, '')     // elimina acentos
	.replace(/\s+/g, '-')               		// espacios → guiones
	.trim()
}
export function toPlural(str) {
	return PLURALES[str] ?? str
}
export function toSingular(str) {
	return SINGULARES[str] ?? str
}
export function setQuerys(clave, valor) {
	if (typeof window === 'undefined') return;
	const params = new URLSearchParams(window.location.search)
	const actual = params.get(clave)

	if(actual === String(valor)){
		params.delete(clave)
		valor=null
	} else if (valor){
		params.set(clave, valor)
	} else {
		params.delete(clave)
	}

	if (clave !== 'page') {
		params.delete('page');
	}

	const query = params.toString();
	const url = query ? `${window.location.pathname}?${query}` : window.location.pathname
	history.pushState({}, '', `${url.toString()}`)
	window.dispatchEvent(new Event('filterschange'))
}
export const EXCHANGE_RATE = {
	usdToArs: 1390,
	updatedAt: '2026-04-08'
}
export const toPesos = (price, currency) => {
	return currency === 'USD'
		? price * EXCHANGE_RATE.usdToArs
		: price
}

export function formatPrice(price, currency){
	const formatted = new Intl.NumberFormat('es-AR').format(price)
	return currency === 'USD' ? `USD ${formatted}` : `$ ${formatted}`
}
export function buildTitle(p, withDirection = false) {
	const premiumFeatures = ['piscina', 'pileta', 'galpón', 'quincho', 'jardín']
	const premiumStructural = ['departamento', 'duplex', 'dúplex', 'suite', 'loft', 'cabaña']

	const hasPremium = p.detalles?.find(s =>
		premiumFeatures.some(f => s.toLowerCase().includes(f))
	)
	const hasStructural = p.detalles?.find(s =>
		premiumStructural.some(f => s.toLowerCase().includes(f))
	)

	const location = withDirection && p.barrio
		? `${p.barrio}, ${p.locality}`
		: p.locality

	if (p.type === 'Terreno' || p.type === 'Lote') {
		return `${p.type} en ${p.operation} de ${p.characteristics.superficie_total}m² en ${location}`
	}
	if (p.type === 'Local' || p.type === 'Oficina') {
		return `${p.type} en ${p.operation} de ${p.characteristics.superficie_cubierta}m² en ${location}`
	}
	if (hasStructural) {
		return `${p.type} con ${hasStructural.toLowerCase()} en ${p.operation.toLowerCase()} en ${location}`
	}
	if (hasPremium) {
		return `${p.type} en ${p.operation} con ${hasPremium.toLowerCase()} en ${location}`
	}
	if (p.characteristics.superficie_cubierta >= 150) {
		return `${p.type} de ${p.characteristics.superficie_cubierta}m² en ${p.operation.toLowerCase()} en ${location}`
	}
	if (p.characteristics.dormitorios) {
		const dormLabel = p.characteristics.dormitorios === 1
			? `1 dormitorio`
			: `${p.characteristics.dormitorios} dormitorios`
		return `${p.type} en ${p.operation} con ${dormLabel} en ${location}`
	}
	return `${p.type} en ${p.operation} de ${p.characteristics.superficie_total}m² en ${location}`
}
export function buildDescription(p) {
	const c = p.characteristics;
	const precio = formatPrice(p.price, p.currency);

	const sup = c.superficie_total
		? `${c.superficie_total}m² totales`
		: null;
	const supCubierta = c.superficie_cubierta
		? `${c.superficie_cubierta}m² cubiertos`
		: null;
	const dorm = c.dormitorios
		? `${c.dormitorios} dorm.`
		: null;
	const banos = c.banos
		? `${c.banos} baños`
		: null;

	const detalles = [sup, supCubierta, dorm, banos].filter(Boolean).join(", ");

	return `${p.type} en ${p.operation.toLowerCase()} en ${p.barrio}, ${p.locality}. ${detalles ? detalles + ". " : ""}Precio: ${precio}. Consultá con HomeSilva, corredor matriculado en Córdoba.`
}
export function distance(lat1, lon1, lat2, lon2){
	const R = 6371;
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;

	const a = 
	Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(lat1 * Math.PI/180) *
	Math.cos(lat2 * Math.PI/180) *
	Math.sin(dLon/2) * Math.sin(dLon/2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c;
}