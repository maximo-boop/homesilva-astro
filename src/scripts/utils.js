const PLURALES = {
	'casa': 'casas',
	'hostel': 'hostels',
	'cabaña': 'cabanas',
	'departamento': 'departamentos',
	'terreno': 'terrenos',
	'local': 'locales',
	'oficina': 'oficinas',
	'hotel': 'hoteles',
	'lote': 'lotes',
	'duplex': 'duplex',
	'dúplex': 'duplex',
	'ph': 'ph'
}
const PLURALES_DISPLAY = {
  ...PLURALES,
  'cabaña': 'cabañas',
}
const SINGULARES = Object.fromEntries(
	Object.entries(PLURALES).map(([k, v]) => [v, k])
)
export const toSlug = (str="") => {
	return str
	.toLowerCase()
	.normalize('NFD')                    		// descompone acentos
	.replace(/[\u0300-\u036f]/g, '')     // elimina acentos
	.replace(/,/g, "")               		// comas
	.replace(/\s+/g, '-')               		// espacios → guiones
	.trim()
}
export function toPlural(str) {
	const normalizada = str
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
	return PLURALES[normalizada] ?? PLURALES[str] ?? str
}
export function toPlurralLabel(str) {
  const normalizada = str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return PLURALES_DISPLAY[str.toLowerCase()] ?? PLURALES_DISPLAY[normalizada] ?? str
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
	usdToArs: 1543.000,
	updatedAt: '2026-10-25'
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
	const premiumStructural = ['departamento', 'duplex', 'suite', 'loft', 'cabaña']
	const isEstrenar = p.detalles?.some(s => s.toLowerCase().includes('estrenar'))

	const hasPremium = p.detalles?.find(s =>
		premiumFeatures.some(f => s.toLowerCase().includes(f))
	)
	const hasStructural = p.detalles?.find(s =>
		premiumStructural.some(f => s.toLowerCase().includes(f))
	)

	const location = withDirection && p.barrio
		? `${p.barrio}, ${p.locality}`
		: p.locality

	const sup_total = p.characteristics.superficie_total || null
	const sup_cubierta = p.characteristics.superficie_cubierta || null
	const { dormitorios, ambientes, banos } = p.characteristics

	const enrich = () => {
		if (hasPremium)   return `con ${hasPremium.toLowerCase()}`
		if (hasStructural) return `con ${hasStructural.toLowerCase()}`
		if (dormitorios)  return `con ${dormitorios === 1 ? '1 dormitorio' : `${dormitorios} dormitorios`}`
		if (ambientes)    return `de ${ambientes} ambiente${ambientes > 1 ? 's' : ''}`
		if (banos)        return `con baño privado`
		return null
	}

	if (p.type === 'Terreno' || p.type === 'Lote') {
		return `${p.type} en ${p.operation}${sup_total ? ` de ${sup_total}m²` : ''} en ${location}`
	}
	if (p.type === 'Local' || p.type === 'Oficina') {
		const sup = sup_cubierta || sup_total
		if (sup) return `${p.type} en ${p.operation} de ${sup}m² en ${location}`
		const extra = enrich()
		return `${p.type} en ${p.operation}${extra ? ` ${extra}` : ''} en ${location}`
	}
	if (isEstrenar) {
	    const extra = enrich()
	    return `${p.type} a estrenar en ${p.operation.toLowerCase()}${extra ? ` ${extra}` : ''} en ${location}`
	}
	if (hasStructural) return `${p.type} con ${hasStructural.toLowerCase()} en ${p.operation.toLowerCase()} en ${location}`
	if (hasPremium) return `${p.type} en ${p.operation} con ${hasPremium.toLowerCase()} en ${location}`
	if (sup_cubierta >= 150) return `${p.type} de ${sup_cubierta}m² en ${p.operation.toLowerCase()} en ${location}`

	const extra = enrich()	
	if (extra) return `${p.type} en ${p.operation} ${extra} en ${location}`

	const supFallback = sup_cubierta || sup_total
	return `${p.type} en ${p.operation}${supFallback ? ` de ${supFallback}m²` : ''} en ${location}`
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

export const ITEMS_PER_PAGE = 12;

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// ¿La propiedad cumple todos los segmentos de la URL? (sin importar el orden)
export const matches = (p, segs) =>
  segs.every(
    (s) =>
      s === p.operation.toLowerCase() ||
      s === toPlural(p.type.toLowerCase()) ||
      s === toSlug(p.locality)
  );

  export const SORT_OPTIONS = [
	{ value: '', label: 'Predeterminado' },
	{ value: 'recientes', label: 'Más recientes' },
	{ value: 'antiguas', label: 'Más antiguas' },
	{ value: 'precio-desc', label: 'Mayor precio' },
	{ value: 'precio-asc', label: 'Menor precio' },
];

// Misma lógica que tenías en PropertiesFilters, ahora pura y reutilizable (lista y mapa)
export function applyQueryFilters(items, q = {}, orden) {
	const hab = Number(q.habitaciones);
	const ban = Number(q.banos);
	const min = Number(q.precioMin);
	const max = Number(q.precioMax);

	const out = items.filter((p) => {
		const c = p.characteristics ?? {};
		if (hab && (hab >= 5 ? (c.dormitorios ?? 0) < 5 : c.dormitorios !== hab)) return false;
		if (ban && (ban >= 4 ? (c.banos ?? 0) < 4 : c.banos !== ban)) return false;
		const pesos = toPesos(p.price, p.currency);
		if (min && pesos < min) return false;
		if (max && pesos > max) return false;
		return true;
	});

	const pesos = (p) => toPesos(p.price, p.currency);
	const date = (p) => new Date(p.publicated).getTime();
	const sorters = {
		recientes: (a, b) => date(b) - date(a),
		antiguas: (a, b) => date(a) - date(b),
		'precio-desc': (a, b) => pesos(b) - pesos(a),
		'precio-asc': (a, b) => pesos(a) - pesos(b),
	};

	return sorters[orden] ? [...out].sort(sorters[orden]) : out;
}

export const getArea = (p) => {
  const c = p.characteristics ?? {}
  return ['Terreno', 'Lote'].includes(p.type)
    ? c.superficie_total
    : c.superficie_cubierta || c.superficie_total
}

export const getFeatures = (p) => {
	const c = p.characteristics ?? {}
	const area = getArea(p)
	const isLand = ['Terreno', 'Lote'].includes(p.type)
	const m2 = (n) => `${n.toLocaleString('es-AR')} m²`

	const list = isLand
		? [area && m2(area)]
		: [
				c.dormitorios && `${c.dormitorios} dorm.`,
				c.banos && `${c.banos} ${c.banos === 1 ? 'baño' : 'baños'}`,
				area && m2(area),
				!c.dormitorios && c.ambientes && `${c.ambientes} amb.`,
		  ]

	return list.filter(Boolean).slice(0, 3)
}
export const priceLabel = (p) => {
  if (!(p.price > 0)) return 'Precio a consultar'
  const base = `${p.toPrice ? 'Desde ' : ''}${formatPrice(p.price, p.currency)}`
  return p.operation === 'Alquiler' ? `${base} /mes` : base
}
export function buildZones(
  propiedades,
  featured,
  { limit = 6, maxTypes = 3, images = {}, fallbackImage = "/localities/default.jpg", exclude = [] } = {}
) {
  // Stock agrupado por localidad
  const grupos = new Map();
  propiedades
    .filter((p) => p.active !== false)
    .forEach((p) => {
      const slug = toSlug(p.locality);
      if (exclude.includes(slug)) return;
      const g = grupos.get(slug) ?? { name: p.locality, items: [] };
      g.items.push(p);
      grupos.set(slug, g);
    });

  const build = (slug, name) => {
    const g = grupos.get(slug);
    if (!g) return null; // sin stock, no aparece

    const porTipo = new Map();
    g.items.forEach((p) => {
      const t = p.type.toLowerCase();
      porTipo.set(t, (porTipo.get(t) ?? 0) + 1);
    });

    const types = [...porTipo.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxTypes)
      .map(([t]) => ({
        label: capitalize(toPlurralLabel(t)),
        href: `/propiedades/${toPlural(t)}/${slug}`,
      }));

		const image = images[slug] ?? g.items.find((p) => p.images?.[0])?.images[0] ?? fallbackImage;
		return { slug, name, image, count: g.items.length, href: `/propiedades/${slug}`, types };
	};

  // 1. Destacadas, en el orden del JSON
  const destacadas = featured.map((z) => build(z.slug, z.name)).filter(Boolean);

  // 2. El resto, por cantidad de propiedades
  const usadas = new Set(featured.map((z) => z.slug));
  const resto = [...grupos.keys()]
    .filter((slug) => !usadas.has(slug))
    .map((slug) => build(slug, grupos.get(slug).name))
    .sort((a, b) => b.count - a.count);

  return [...destacadas, ...resto].slice(0, limit);
}
// Combinaciones reales operación|tipo|localidad con stock, y las opciones del buscador
export function buildSearchIndex(propiedades, { exclude = [] } = {}) {
  const combos = new Set();
  const types = new Map();
  const locations = new Map();

  const bump = (map, value, label) => {
    const e = map.get(value) ?? { value, label, count: 0 };
    e.count++;
    map.set(value, e);
  };

  propiedades
    .filter((p) => p.active !== false)
    .forEach((p) => {
      const op = p.operation.toLowerCase();
      const type = toPlural(p.type.toLowerCase());
      const loc = toSlug(p.locality);
      if (exclude.includes(loc)) return;

      combos.add(`${op}|${type}|${loc}`);
      bump(types, type, capitalize(toPlurralLabel(p.type.toLowerCase())));
      bump(locations, loc, p.locality);
    });

  const byCount = (m) =>
    [...m.values()].sort((a, b) => b.count - a.count).map(({ value, label }) => ({ value, label }));

  return {
    combos: [...combos],
    operations: [...new Set([...combos].map((c) => c.split("|")[0]))],
    types: byCount(types),
    locations: byCount(locations),
  };
}