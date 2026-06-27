const fs = require("fs");
const path = require("path");

const root = process.cwd();
const reportsDir = path.join(root, "reports");
const targets = [
  {
    label: "Características do app",
    file: path.join(root, "src", "data", "abilities.ts"),
    re: /\{ id:"([^"]+)", class:"([^"]+)", level:(\d+), name:"([^"]+)", effect:"([^"]*)" \}/g,
    item: (m) => ({ id: m[1], name: m[4], text: m[5] })
  },
  {
    label: "Habilidades e magias do app",
    file: path.join(root, "src", "data", "magic.ts"),
    re: /"id":\s*"([^"]+)"[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"effect":\s*"([^"]*)"/g,
    item: (m) => ({ id: m[1], name: m[2], text: m[3] })
  }
];

const htmlTargets = [
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_do_Mestre.html")
];

function normalize(value) {
  return value
    .replace(/\\[nr]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/^[^:]{1,90}:\s*/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function duplicateGroups(items) {
  const groups = new Map();
  for (const item of items) {
    const key = normalize(item.text);
    if (!key) continue;
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  return [...groups.values()].filter(group => group.length > 1);
}

function parseTarget(target) {
  const text = fs.readFileSync(target.file, "utf8");
  const items = [];
  let m;
  while ((m = target.re.exec(text))) items.push(target.item(m));
  return items;
}

function auditHtmlRows(file) {
  if (!fs.existsSync(file)) return [];
  const html = fs.readFileSync(file, "utf8");
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m, index) => ({
    id: `${path.basename(file)}#row-${index + 1}`,
    name: `linha ${index + 1}`,
    text: m[1]
  }));
  return duplicateGroups(rows);
}

fs.mkdirSync(reportsDir, { recursive: true });
const lines = ["# Auditoria de duplicação de características e tabelas", ""];
let totalGroups = 0;

for (const target of targets) {
  const groups = duplicateGroups(parseTarget(target));
  totalGroups += groups.length;
  lines.push(`## ${target.label}`);
  lines.push(`Grupos duplicados encontrados: **${groups.length}**.`);
  if (groups.length) {
    for (const group of groups.slice(0, 20)) {
      lines.push(`- ${group.map(item => `${item.name} (${item.id})`).join("; ")}`);
    }
  }
  lines.push("");
}

lines.push("## Linhas duplicadas em tabelas HTML");
for (const file of htmlTargets) {
  const groups = auditHtmlRows(file);
  lines.push(`- ${path.relative(root, file)}: **${groups.length}** grupos estruturais repetidos, geralmente cabeçalhos, linhas vazias ou progressões de nível equivalentes.`);
}
lines.push("");
lines.push(`Resultado geral: **${totalGroups === 0 ? "sem duplicatas exatas detectadas" : `${totalGroups} grupos para revisar`}**.`);

fs.writeFileSync(path.join(reportsDir, "auditoria_duplicatas_caracteristicas.md"), lines.join("\n"), "utf8");
console.log(JSON.stringify({ duplicateGroups: totalGroups, report: "reports/auditoria_duplicatas_caracteristicas.md" }, null, 2));
