const fs = require("fs");
const path = require("path");

const root = process.cwd();
const files = [
  path.join(root, "public", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html")
];

const classes = [
  { key: "guerreiro", label: "Guerreiro", next: '<h3 id="arcanista">Arcanista</h3>' },
  { key: "arcanista", label: "Arcanista", next: '<h3 id="sensiente">Sensiente</h3>' },
  { key: "sensiente", label: "Sensiente", next: '<h3 id="devoto">Devoto</h3>' },
  { key: "devoto", label: "Devoto", next: '<h3 id="artífice">Artífice</h3>' },
  { key: "artifice", label: "Artífice", next: '<h3 id="explorador">Explorador</h3>' },
  { key: "explorador", label: "Explorador", next: '<h3 id="expansao-subclasses-e-pools-de-caracteristicas">' }
];

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractExpansion(html) {
  const start = html.indexOf('<h3 id="expansao-subclasses-e-pools-de-caracteristicas">');
  if (start < 0) return null;
  const end = html.indexOf('<h2 id="parte-vii-multiclasse">', start);
  if (end < 0) return null;
  return { start, end, block: html.slice(start, end) };
}

function splitExpansionClasses(block) {
  const classRe = /<h3 id="(guerreiro|arcanista|sensiente|devoto|artifice|explorador)">[\s\S]*?(?=<h3 id="(?:guerreiro|arcanista|sensiente|devoto|artifice|explorador)">|$)/g;
  const chunks = new Map();
  let match;
  while ((match = classRe.exec(block))) chunks.set(match[1], match[0]);
  return chunks;
}

function subclassTitle(subclassHtml) {
  const title = subclassHtml.match(/<h4[^>]*>([\s\S]*?)<\/h4>/)?.[1] || "Subclasse";
  return title
    .replace(/<[^>]+>/g, "")
    .replace(/^Subclasse\s+\d+\s+—\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSubclassBlocks(subclassesHtml) {
  const blocks = subclassesHtml.match(/<h4 id="subclasse[\s\S]*?(?=<h4 id="subclasse|$)/g) || [];
  return blocks.map((block) => {
    const title = subclassTitle(block);
    return `<hr class="subclass-break" />
<div class="subclass-block">
<p class="subclass-boundary">Início da subclasse — ${title}</p>
${block.trim()}
<p class="subclass-boundary">Fim da subclasse — ${title}</p>
</div>`;
  }).join("\n");
}

function extractClassParts(chunk, cls) {
  const firstSubclass = chunk.indexOf('<h4 id="subclasse');
  const poolMatch = chunk.match(/<h4 id="pool-de-30-40-[^"]+">/);
  if (firstSubclass < 0 || !poolMatch || poolMatch.index == null) return null;

  const subclassesHtml = chunk.slice(firstSubclass, poolMatch.index).trim();
  const poolHtml = chunk.slice(poolMatch.index).trim();
  const renamedHeader = `<h3 id="${cls.key}-pools-adicionais">${cls.label} — Características Adicionais</h3>`;

  return {
    subclasses: `<div class="class-subclasses" id="${cls.key}-subclasses">
<hr class="subclass-break" />
<h4>Subclasses de ${cls.label}</h4>
<p class="subclass-note">Estas opções pertencem à classe ${cls.label}. Escolha uma no nível 5; ela concede características nos níveis 5, 9, 13 e 17.</p>
${splitSubclassBlocks(subclassesHtml)}
<hr class="subclass-break" />
<p class="subclass-boundary">Fim das subclasses de ${cls.label}</p>
</div>`,
    pools: `${renamedHeader}\n${poolHtml}`
  };
}

function replaceFirstBefore(html, marker, insertion) {
  const index = html.indexOf(marker);
  if (index < 0) return html;
  return `${html.slice(0, index)}${insertion}\n${html.slice(index)}`;
}

function organize(html) {
  const expansion = extractExpansion(html);
  if (!expansion) return html;

  const chunks = splitExpansionClasses(expansion.block);
  const moved = new Map();
  const poolSections = [];

  for (const cls of classes) {
    const chunk = chunks.get(cls.key);
    if (!chunk) continue;
    const parts = extractClassParts(chunk, cls);
    if (!parts) continue;
    moved.set(cls.key, parts.subclasses);
    poolSections.push(parts.pools);
  }

  if (moved.size === 0) return html;

  const expansionTitle = '<h3 id="expansao-subclasses-e-pools-de-caracteristicas">Expansão: Pools de Características</h3>';
  const newExpansion = `${expansionTitle}\n${poolSections.join('\n<p>---</p>\n')}\n`;
  let next = html.slice(0, expansion.start) + newExpansion + html.slice(expansion.end);

  for (const cls of [...classes].reverse()) {
    const block = moved.get(cls.key);
    if (!block) continue;
    next = replaceFirstBefore(next, cls.next, `${block}\n`);
  }

  return next.replace(/<p>---<\/p>\s*<p>---<\/p>/g, "<p>---</p>");
}

let updated = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = organize(before);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    updated++;
  }
}

console.log(JSON.stringify({ updated }, null, 2));
