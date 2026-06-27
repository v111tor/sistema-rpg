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

function insertBeforeSubclasses(html, cls, content) {
  if (!content) return html;
  const marker = `<div class="class-subclasses" id="${cls.key}-subclasses">`;
  const index = html.indexOf(marker);
  if (index < 0) return html;
  return `${html.slice(0, index)}${content}\n${html.slice(index)}`;
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
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const expansions = new Map(classes.map((cls) => [cls.key, extractExpansion(before, cls)]));
  let after = removeManagedBlocks(before);
  for (const cls of classes) {
    after = insertBeforeSubclasses(after, cls, renderAdditions(cls, expansions.get(cls.key) ?? []));
  }
  after = removeExpansionSection(after);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    updated++;
  }
}

console.log(JSON.stringify({ updated, classes: classes.length }, null, 2));
