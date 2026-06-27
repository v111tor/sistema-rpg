const fs = require("fs");
const path = require("path");

const root = process.cwd();
const rulebook = path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html");
const abilities = path.join(root, "src", "data", "abilities.ts");
const report = path.join(root, "reports", "auditoria_contagem_caracteristicas.md");

const classes = [
  { key: "guerreiro", label: "Guerreiro" },
  { key: "arcanista", label: "Arcanista" },
  { key: "sensiente", label: "Sensiente" },
  { key: "devoto", label: "Devoto" },
  { key: "artifice", label: "Artífice" },
  { key: "explorador", label: "Explorador" }
];

const emotions = ["raiva", "amor", "medo", "alegria", "tristeza", "determinacao"];
const deities = ["luz", "sombra", "natureza", "morte", "caos", "ordem", "demonio"];

function countBase(html, cls) {
  const heading = html.indexOf(`Pool de 40 Características — ${cls.label}`);
  const blockStart = html.indexOf(`<!-- BEGIN CARACTERISTICAS 31-40 ${cls.key} -->`, heading);
  const subclass = html.indexOf(`<div class="class-subclasses" id="${cls.key}-subclasses">`, heading);
  if (heading < 0 || subclass < 0) return 0;
  const baseBlock = html.slice(heading, blockStart > 0 ? blockStart : subclass);
  const extraBlock = blockStart > 0 ? html.slice(blockStart, subclass) : "";
  const baseNumbers = [...baseBlock.matchAll(/<strong>([1-9]|[12]\d|30)\./g)].length;
  const extraNumbers = [...extraBlock.matchAll(/<strong>(3[1-9]|40)\./g)].length;
  return baseNumbers + extraNumbers;
}

function countVariations(text, className, slugs) {
  const counts = Object.fromEntries(slugs.map(slug => [slug, 0]));
  const re = new RegExp(`\\{ id:"(?:sen|dev)-(${slugs.join("|")})-(\\d{2})-[^"]+", class:"${className}"`, "g");
  let m;
  while ((m = re.exec(text))) counts[m[1]]++;
  return counts;
}

const html = fs.readFileSync(rulebook, "utf8");
const source = fs.readFileSync(abilities, "utf8");
const baseCounts = Object.fromEntries(classes.map(cls => [cls.label, countBase(html, cls)]));
const sensCounts = countVariations(source, "Sensiente", emotions);
const devCounts = countVariations(source, "Devoto", deities);

const okBase = Object.values(baseCounts).every(count => count === 40);
const okSens = Object.values(sensCounts).every(count => count === 30);
const okDev = Object.values(devCounts).every(count => count === 30);

const lines = [
  "# Auditoria de contagem de características",
  "",
  "## Pool geral por classe",
  ...Object.entries(baseCounts).map(([label, count]) => `- ${label}: **${count}** características gerais.`),
  "",
  "## Sensiente por emoção",
  ...Object.entries(sensCounts).map(([label, count]) => `- ${label}: **${count}** características.`),
  "",
  "## Devoto por divindade",
  ...Object.entries(devCounts).map(([label, count]) => `- ${label}: **${count}** características.`),
  "",
  `Resultado: **${okBase && okSens && okDev ? "contagem correta" : "contagem fora do esperado"}**.`
];

fs.mkdirSync(path.dirname(report), { recursive: true });
fs.writeFileSync(report, lines.join("\n"), "utf8");
console.log(JSON.stringify({ ok: okBase && okSens && okDev, baseCounts, sensCounts, devCounts, report: "reports/auditoria_contagem_caracteristicas.md" }, null, 2));
if (!(okBase && okSens && okDev)) process.exitCode = 1;
