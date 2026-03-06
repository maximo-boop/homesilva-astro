const PLURALES = {
	'casa': 'casas',
	'departamento': 'departamentos',
	'terreno': 'terrenos',
	'local': 'locales',
	'oficina': 'oficinas',
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