import { readFileSync } from "node:fs";
import { buildTitle } from "../src/scripts/utils.js";

const propiedades = JSON.parse(readFileSync("src/data/propiedades.json", "utf8"));

const BRAND = " | HomeSilva";
const fitTitle = (t, max = 65) => {
	if ((t + BRAND).length <= max) return t + BRAND;
	if (t.length <= max) return t;
	return t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
};

let cambian = 0;
for (const p of propiedades) {
	const base = p.title || buildTitle(p, true);
	const antes = `${base}${BRAND}`;
	const despues = fitTitle(base);
	if (antes === despues) continue;
	cambian++;
	console.log(`\n${p.slug}`);
	console.log(`  antes  (${antes.length}): ${antes}`);
	console.log(`  después(${despues.length}): ${despues}`);
}
console.log(`\n${cambian} de ${propiedades.length} fichas cambian.`);