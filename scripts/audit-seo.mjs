import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });

const one = (html, re) => html.match(re)?.[1]?.trim();
const titles = new Map();
let withIssues = 0;

for (const file of walk("dist")) {
  const html = readFileSync(file, "utf8");
  const issues = [];

  const title = one(html, /<title[^>]*>([^<]*)<\/title>/i);
  const desc = one(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = one(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  const imgsNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []).length;

  if (!title) issues.push("sin <title>");
  else if (title.length > 65) issues.push(`title largo (${title.length})`);
  if (!desc) issues.push("sin meta description");
  else if (desc.length > 170) issues.push(`description larga (${desc.length})`);
  if (!canonical && !noindex) issues.push("sin canonical");
  if (h1s !== 1) issues.push(`${h1s} <h1>`);
  if (imgsNoAlt) issues.push(`${imgsNoAlt} <img> sin alt`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { issues.push("JSON-LD inválido"); }
  }

  if (title) titles.set(title, [...(titles.get(title) ?? []), file]);
  if (issues.length) {
    withIssues++;
    console.log(`${file}\n  - ${issues.join("\n  - ")}`);
  }
}

for (const [t, files] of titles)
  if (files.length > 1) console.log(`Título repetido en ${files.length} páginas: "${t}"`);

console.log(withIssues ? `\n${withIssues} página(s) con avisos` : "\nTodo ok");