const fs = require("fs");
const path = require("path");

const root = process.cwd();
const abilitiesPath = path.join(root, "src", "data", "abilities.ts");
const files = [
  path.join(root, "public", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "dist", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html")
];

const sourceStart = "// BEGIN EXPANSAO SENSIENTE DEVOTO";
const sourceEnd = "// END EXPANSAO SENSIENTE DEVOTO";
const sensStart = "<!-- BEGIN CARACTERISTICAS EXPANDIDAS SENSIENTE -->";
const sensEnd = "<!-- END CARACTERISTICAS EXPANDIDAS SENSIENTE -->";
const devStart = "<!-- BEGIN CARACTERISTICAS EXPANDIDAS DEVOTO -->";
const devEnd = "<!-- END CARACTERISTICAS EXPANDIDAS DEVOTO -->";
const legacyStart = "<!-- BEGIN EXPANSAO SENSIENTE DEVOTO -->";
const legacyEnd = "<!-- END EXPANSAO SENSIENTE DEVOTO -->";

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseItems() {
  const text = fs.readFileSync(abilitiesPath, "utf8");
  const start = text.indexOf(sourceStart);
  const end = text.indexOf(sourceEnd);
  const block = text.slice(start, end);
  const re = /\{ id:"([^"]+)", class:"([^"]+)", level:(\d+), name:"([^"]+)", effect:"([^"]*)" \}/g;
  const items = [];
  let m;
  while ((m = re.exec(block))) {
    const id = m[1];
    const cls = m[2];
    const slug = id.split("-")[1] ?? "";
    const cost = (m[5].match(/Gaste (\d+ P[ED])/) ?? [null, "Passivo"])[1];
    const [description, effect = ""] = m[5].split(" Efeito: ");
    items.push({
      id,
      cls,
      level: Number(m[3]),
      name: m[4],
      variation: labelFor(cls, slug),
      cost,
      description,
      effect
    });
  }
  return items;
}

function labelFor(cls, slug) {
  const sens = {
    raiva: "Raiva",
    amor: "Amor",
    medo: "Medo",
    alegria: "Alegria",
    tristeza: "Tristeza",
    determinacao: "Determinação"
  };
  const dev = {
    luz: "Luz",
    sombra: "Sombra",
    natureza: "Natureza",
    morte: "Morte",
    caos: "Caos",
    ordem: "Ordem",
    demonio: "Demônio"
  };
  return (cls === "Sensiente" ? sens : dev)[slug] ?? slug;
}

function table(title, items) {
  const rows = items.map((item, index) => `<tr><td>${escapeHtml(item.variation)}</td><td>${index + 1}</td><td>${escapeHtml(item.name)}</td><td>${item.level}+</td><td>${escapeHtml(item.cost)}</td><td>${escapeHtml(item.description)}</td><td>${escapeHtml(item.effect)}</td></tr>`);
  return `<h4>${title}</h4>
<table>
<thead><tr><th>Variação</th><th>#</th><th>Nome</th><th>Nível</th><th>Custo</th><th>Descrição</th><th>Efeito</th></tr></thead>
<tbody>
${rows.join("\n")}
</tbody>
</table>`;
}

function removeBlock(html, a, b) {
  const escapedA = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedB = b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`${escapedA}[\\s\\S]*?${escapedB}\\n?`, "g"), "");
}

function syncFile(file, sensTable, devTable) {
  if (!fs.existsSync(file)) return false;
  let html = fs.readFileSync(file, "utf8");
  html = removeBlock(html, legacyStart, legacyEnd);
  html = removeBlock(html, sensStart, sensEnd);
  html = removeBlock(html, devStart, devEnd);
  html = html.replace(/<h4>Sensiente - 20 caracter(?:i|í|Ã­)sticas por estado emocional<\/h4>\s*<table>[\s\S]*?<\/table>/g, "");
  html = html.replace(/<h4>Devoto - 20 caracter(?:i|í|Ã­)sticas por dom(?:i|í|Ã­)nio<\/h4>\s*<table>[\s\S]*?<\/table>/g, "");

  const sensBlock = `${sensStart}\n${sensTable}\n${sensEnd}\n`;
  const devBlock = `${devStart}\n${devTable}\n${devEnd}\n`;
  html = html.replace(/<hr \/>\s*<h3 id="devoto">/, `${sensBlock}<hr />\n<h3 id="devoto">`);
  html = html.replace(/<hr \/>\s*<h3 id="art(?:í|Ã­)fice">/, `${devBlock}<hr />\n<h3 id="artífice">`);
  fs.writeFileSync(file, html, "utf8");
  return true;
}

const items = parseItems();
const sensItems = items.filter(item => item.cls === "Sensiente");
const devItems = items.filter(item => item.cls === "Devoto");
const sensTable = table("Sensiente - 20 características por estado emocional", sensItems);
const devTable = table("Devoto - 20 características por domínio", devItems);
const updated = files.filter(file => syncFile(file, sensTable, devTable)).length;

console.log(JSON.stringify({ updated, sensiente: sensItems.length, devoto: devItems.length }, null, 2));
