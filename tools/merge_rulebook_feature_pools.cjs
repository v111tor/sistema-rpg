const fs = require("fs");
const path = require("path");

const root = process.cwd();
const fallbackAdditions = require("./rulebook_feature_pool_additions.json");
const abilitiesPath = path.join(root, "src", "data", "abilities.ts");
const files = [
  path.join(root, "public", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "dist", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html")
];

const classes = [
  { key: "guerreiro", label: "Guerreiro" },
  { key: "arcanista", label: "Arcanista" },
  { key: "sensiente", label: "Sensiente" },
  { key: "devoto", label: "Devoto" },
  { key: "artifice", label: "Artífice" },
  { key: "explorador", label: "Explorador" }
];

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripTags(value) {
  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n")
    .replace(/<\/h5>\s*<p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function removeManagedBlocks(html) {
  for (const cls of classes) {
    const start = `<!-- BEGIN CARACTERISTICAS 31-40 ${cls.key} -->`;
    const end = `<!-- END CARACTERISTICAS 31-40 ${cls.key} -->`;
    const re = new RegExp(`${escapeRe(start)}[\\s\\S]*?${escapeRe(end)}\\n?`, "g");
    html = html.replace(re, "");
  }
  html = html.replace(/<!-- BEGIN CARACTERISTICAS POR EMOCAO SENSIENTE -->[\s\S]*?<!-- END CARACTERISTICAS POR EMOCAO SENSIENTE -->\n?/g, "");
  html = html.replace(/<!-- BEGIN CARACTERISTICAS POR DIVINDADE DEVOTO -->[\s\S]*?<!-- END CARACTERISTICAS POR DIVINDADE DEVOTO -->\n?/g, "");
  return html;
}

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractExpansion(html, cls) {
  const header = new RegExp(`<h4 id="pool-de-30-40-${cls.key}-10-novas-caracteristicas">[\\s\\S]*?<\\/h4>`);
  const match = header.exec(html);
  if (!match) return [];
  const start = match.index + match[0].length;
  const rest = html.slice(start);
  const endMatch = /<p>---<\/p>|<hr \/>\s*<h2 id="parte-vii-multiclasse">/.exec(rest);
  const block = rest.slice(0, endMatch ? endMatch.index : rest.length);
  const text = stripTags(block);
  const matches = [...text.matchAll(/(?:^|\n)(3[1-9]|40)\.\s+([\s\S]*?)(?=\n(?:3[1-9]|40)\.\s+|$)/g)];
  return matches.map((item) => {
    const number = Number(item[1]);
    const lines = item[2].split("\n").map((line) => line.trim()).filter(Boolean);
    const heading = lines.shift() ?? "";
    const titleMatch = heading.match(/^(.+?)(?:\s+\(([^)]*)\))?$/);
    return {
      number,
      name: titleMatch ? titleMatch[1].trim() : heading,
      tag: titleMatch?.[2]?.trim() ?? "",
      body: lines.join(" ")
    };
  });
}

function extractManaged(html, cls) {
  const start = `<!-- BEGIN CARACTERISTICAS 31-40 ${cls.key} -->`;
  const end = `<!-- END CARACTERISTICAS 31-40 ${cls.key} -->`;
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);
  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) return [];
  const block = html.slice(startIndex + start.length, endIndex);
  const text = stripTags(block);
  const matches = [...text.matchAll(/(?:^|\n)(3[1-9]|40)\.\s+([\s\S]*?)(?=\n(?:3[1-9]|40)\.\s+|$)/g)];
  return matches.map((item) => {
    const number = Number(item[1]);
    const lines = item[2].split("\n").map((line) => line.trim()).filter(Boolean);
    const heading = lines.shift() ?? "";
    const titleMatch = heading.match(/^(.+?)(?:\s+\(([^)]*)\))?$/);
    return {
      number,
      name: titleMatch ? titleMatch[1].trim() : heading,
      tag: titleMatch?.[2]?.trim() ?? "",
      body: lines.join(" ")
    };
  });
}

function additionsFor(html, cls) {
  const expansion = extractExpansion(html, cls);
  if (expansion.length) return expansion;
  const managed = extractManaged(html, cls);
  if (managed.length) return managed;
  return fallbackAdditions[cls.key] ?? [];
}

function renderAdditions(cls, items) {
  if (!items.length) return "";
  const rows = items
    .sort((a, b) => a.number - b.number)
    .map((item) => {
      const tag = item.tag ? ` <em>(${escapeHtml(item.tag)})</em>` : "";
      return `<p><strong>${item.number}. ${escapeHtml(item.name)}</strong>${tag}</p>\n<p>${escapeHtml(item.body)}</p>`;
    })
    .join("\n");
  return `<!-- BEGIN CARACTERISTICAS 31-40 ${cls.key} -->\n${rows}\n<!-- END CARACTERISTICAS 31-40 ${cls.key} -->\n`;
}

function labelFor(className, slug) {
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
  return (className === "Sensiente" ? sens : dev)[slug] ?? slug;
}

function parseVariationFeatures() {
  if (!fs.existsSync(abilitiesPath)) return { Sensiente: new Map(), Devoto: new Map() };
  const text = fs.readFileSync(abilitiesPath, "utf8");
  const re = /\{ id:"([^"]+)", class:"(Sensiente|Devoto)", level:(\d+), name:"([^"]+)", effect:"([^"]*)" \}/g;
  const groups = { Sensiente: new Map(), Devoto: new Map() };
  let m;
  while ((m = re.exec(text))) {
    const id = m[1];
    const className = m[2];
    const parts = id.split("-");
    const slug = parts[1];
    const number = Number(parts[2]);
    if (!slug || !Number.isFinite(number)) continue;
    const list = groups[className].get(slug) ?? [];
    list.push({
      number,
      level: Number(m[3]),
      name: m[4],
      effect: m[5]
    });
    groups[className].set(slug, list);
  }
  return groups;
}

function renderVariationBlock(className, groups) {
  const map = groups[className];
  if (!map?.size) return "";
  const marker = className === "Sensiente" ? "CARACTERISTICAS POR EMOCAO SENSIENTE" : "CARACTERISTICAS POR DIVINDADE DEVOTO";
  const noun = className === "Sensiente" ? "emoção" : "divindade";
  const order = className === "Sensiente"
    ? ["raiva", "amor", "medo", "alegria", "tristeza", "determinacao"]
    : ["luz", "sombra", "natureza", "morte", "caos", "ordem", "demonio"];
  const sections = order.map((slug) => {
    const items = [...(map.get(slug) ?? [])].sort((a, b) => a.number - b.number);
    if (!items.length) return "";
    const rows = items.map((item) => `<p><strong>${item.number}. ${escapeHtml(item.name)}</strong> <em>(Nível ${item.level}+)</em></p>\n<p>${escapeHtml(item.effect)}</p>`).join("\n");
    return `<p><strong>Características por ${noun} — ${labelFor(className, slug)}</strong></p>\n${rows}`;
  }).filter(Boolean);
  if (!sections.length) return "";
  return `<!-- BEGIN ${marker} -->\n${sections.join("\n")}\n<!-- END ${marker} -->\n`;
}

function insertBeforeSubclasses(html, cls, content) {
  if (!content) return html;
  const marker = `<div class="class-subclasses" id="${cls.key}-subclasses">`;
  const index = html.indexOf(marker);
  if (index < 0) return html;
  return `${html.slice(0, index).replace(/\s+$/, "\n")}${content}\n${html.slice(index)}`;
}

function removeExpansionSection(html) {
  const start = html.indexOf('<h3 id="expansao-subclasses-e-pools-de-caracteristicas">');
  if (start < 0) return html;
  const tail = html.slice(start);
  const endMatch = /<hr \/>\s*<h2 id="parte-vii-multiclasse">/.exec(tail);
  if (!endMatch) return html;
  return html.slice(0, start) + tail.slice(endMatch.index);
}

let updated = 0;
const variationGroups = parseVariationFeatures();
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const expansions = new Map(classes.map((cls) => [cls.key, additionsFor(before, cls)]));
  let after = removeManagedBlocks(before);
  for (const cls of classes) {
    let content = renderAdditions(cls, expansions.get(cls.key) ?? []);
    if (cls.key === "sensiente") content += renderVariationBlock("Sensiente", variationGroups);
    if (cls.key === "devoto") content += renderVariationBlock("Devoto", variationGroups);
    after = insertBeforeSubclasses(after, cls, content);
  }
  after = removeExpansionSection(after);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    updated++;
  }
}

console.log(JSON.stringify({ updated, classes: classes.length }, null, 2));
