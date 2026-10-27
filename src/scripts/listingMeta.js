import { EXCHANGE_RATE, toPlurralLabel, capitalize } from "./utils.js";

const REGION = "Córdoba y las Sierras";

const superficie = (p) =>
  p.type === "Terreno" ? p.characteristics?.superficie_total : p.characteristics?.superficie_cubierta;

export function buildListingMeta(items, { operacionLabel, tipoLabel, localidadLabel }) {
  const count = items.length;

  const tiposStr = Object.entries(
    items.reduce((acc, p) => {
      const t = p.type.toLowerCase();
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([t]) => capitalize(toPlurralLabel(t)))
    .join(", ");

  const precioMinUSD = Math.min(
    ...items.map((p) => (p.currency === "USD" ? p.price : Math.round(p.price / EXCHANGE_RATE.usdToArs)))
  );
  const conFinanciacion = items.some(
    (p) => p.detalles?.includes("Financiación") || p.detalles?.includes("Apta crédito")
  );
  const barrios = [...new Set(items.map((p) => p.barrio).filter(Boolean))].slice(0, 3);
  const superficies = items
    .filter((p) => !["Local", "Oficina"].includes(p.type))
    .map(superficie)
    .filter((s) => s > 0);

  const tipoConteo = tipoLabel
    ? count === 1
      ? tipoLabel
      : capitalize(toPlurralLabel(tipoLabel.toLowerCase()))
    : null;

  const operacion = operacionLabel ? `en ${operacionLabel}` : "en Venta y Alquiler";
  const lugar = localidadLabel ? `en ${localidadLabel}` : `en ${REGION}`;

  const titulo = `${tipoConteo ?? "Propiedades"} ${operacion} ${lugar}`;

  const precioPart =
    operacionLabel && precioMinUSD ? ` · Desde USD ${precioMinUSD.toLocaleString("es-AR")}` : "";
  const tiposPart = !tipoLabel ? ` · ${tiposStr} y más` : "";
  const tituloSEO = `${count} ${tipoConteo ?? "Propiedades"} ${operacion} ${lugar}${precioPart || tiposPart} | HomeSilva`;

  const description =
    `${count} ${tipoConteo ?? "propiedades"} ${lugar}` +
    (!tipoLabel ? ` — ${tiposStr} y más.` : ".") +
    (barrios.length ? ` Barrios: ${barrios.join(", ")}.` : "") +
    (superficies.length ? ` Superficies desde ${Math.min(...superficies)} m².` : "") +
    (conFinanciacion ? " Financiación disponible." : "") +
    " Corredor matriculado, trato directo.";

  return { titulo, tituloSEO, description };
}