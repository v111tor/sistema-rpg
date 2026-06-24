const fs = require("fs");
const path = require("path");

const root = process.cwd();
const files = [
  path.join(root, "public", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "dist", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html")
];

const start = "<!-- BEGIN EXPANSAO SENSIENTE DEVOTO -->";
const end = "<!-- END EXPANSAO SENSIENTE DEVOTO -->";
const sensStart = "<!-- BEGIN CARACTERISTICAS EXPANDIDAS SENSIENTE -->";
const sensEnd = "<!-- END CARACTERISTICAS EXPANDIDAS SENSIENTE -->";
const devStart = "<!-- BEGIN CARACTERISTICAS EXPANDIDAS DEVOTO -->";
const devEnd = "<!-- END CARACTERISTICAS EXPANDIDAS DEVOTO -->";

function sectionBetween(text, a, b) {
  const startIndex = text.indexOf(a);
  const endIndex = text.indexOf(b);
  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) return "";
  return text.slice(startIndex + a.length, endIndex).trim();
}

function splitTables(block) {
  const sensIndex = block.search(/<h4>Sensiente - 20 caracter(?:i|í)sticas por estado emocional<\/h4>/);
  const devIndex = block.search(/<h4>Devoto - 20 caracter(?:i|í)sticas por dom(?:i|í)nio<\/h4>/);
  if (sensIndex < 0 || devIndex < 0) return null;
  return {
    sens: block.slice(sensIndex, devIndex).trim(),
    dev: block.slice(devIndex).trim()
  };
}

function removeMarked(text, a, b) {
  const re = new RegExp(`${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\n?`, "g");
  return text.replace(re, "");
}

function insertBefore(text, marker, content) {
  const index = text.indexOf(marker);
  if (index < 0) return text;
  return text.slice(0, index) + content + "\n" + text.slice(index);
}

function organize(html) {
  let block = sectionBetween(html, start, end);
  if (!block) {
    const sens = sectionBetween(html, sensStart, sensEnd);
    const dev = sectionBetween(html, devStart, devEnd);
    if (!sens || !dev) return html;
    block = `${sens}\n${dev}`;
  }

  const tables = splitTables(block);
  if (!tables) return html;

  let next = removeMarked(html, start, end);
  next = removeMarked(next, sensStart, sensEnd);
  next = removeMarked(next, devStart, devEnd);

  const sensBlock = `${sensStart}\n${tables.sens}\n${sensEnd}`;
  const devBlock = `${devStart}\n${tables.dev}\n${devEnd}`;

  next = insertBefore(next, "<hr />\n<h3 id=\"devoto\">", `${sensBlock}\n`);
  next = insertBefore(next, "<hr />\n<h3 id=\"artÃ­fice\">", `${devBlock}\n`);
  next = insertBefore(next, "<hr />\n<h3 id=\"artífice\">", `${devBlock}\n`);

  return next;
}

let updated = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = organize(before);
  fs.writeFileSync(file, after, "utf8");
  if (after !== before) updated++;
}

console.log(JSON.stringify({ updated }, null, 2));
