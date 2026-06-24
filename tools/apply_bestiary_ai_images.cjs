const fs = require("fs");
const path = require("path");

const root = process.cwd();
const prompts = JSON.parse(fs.readFileSync(path.join(root, "tools", "bestiary_ai_prompts.json"), "utf8"));
const htmlFiles = [
  path.join(root, "public", "ebook", "Bestiario_Sistema_Mecanico.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Bestiario.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Bestiario.html"),
  path.join(root, "dist", "ebook", "Bestiario_Sistema_Mecanico.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Bestiario.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Bestiario.html")
];

function existingAiImages(baseDir) {
  const dir = path.join(baseDir, "assets", "bestiary");
  const set = new Set();
  if (!fs.existsSync(dir)) return set;
  for (const item of prompts) {
    if (fs.existsSync(path.join(dir, item.target))) set.add(item.slug);
  }
  return set;
}

let updatedFiles = 0;
let aiRefs = 0;

for (const file of htmlFiles) {
  if (!fs.existsSync(file)) continue;
  const base = path.dirname(file);
  const available = existingAiImages(base);
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  for (const item of prompts) {
    if (!available.has(item.slug)) continue;
    const re = new RegExp(`assets/bestiary/${item.slug}(?:-sprite)?\\.(?:png|svg)|assets/bestiary/${item.slug}\\.png`, "g");
    html = html.replace(re, `assets/bestiary/${item.target}`);
  }

  fs.writeFileSync(file, html, "utf8");
  if (html !== before) updatedFiles++;
  aiRefs += (html.match(/assets\/bestiary\/[^"]+-ai\.png/g) || []).length;
}

console.log(JSON.stringify({ updatedFiles, aiRefs }, null, 2));
