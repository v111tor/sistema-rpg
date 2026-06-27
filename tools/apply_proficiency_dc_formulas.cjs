const fs = require("fs");
const path = require("path");

const root = process.cwd();
const files = [
  path.join(root, "src", "data", "abilities.ts"),
  path.join(root, "src", "data", "magic.ts"),
  path.join(root, "public", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "dist", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html"),
  path.join(root, "public", "ebook", "Livro_do_Mestre_Sistema_Mecanico.html"),
  path.join(root, "dist", "ebook", "Livro_do_Mestre_Sistema_Mecanico.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_do_Mestre.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Livro_do_Mestre.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Livro_do_Mestre.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Livro_do_Mestre.html")
];

function update(text) {
  let next = text;
  next = next.replace(/CD\s*\((\d+)\s*\+\s*Mod\.?\s*([A-Z]{3})\)/g, "CD ($1 + Bônus de Proficiência + Mod.$2)");
  next = next.replace(/CD\s+(\d+)\s*\+\s*Mod\.?\s*([A-Z]{3})/g, "CD $1 + Bônus de Proficiência + Mod.$2");
  next = next.replace(/CD\s*\((\d+)\s*\+\s*n[íi]vel\s*÷\s*3\s*\+\s*Mod\.?\s*([A-Z]{3})\)/g, "CD ($1 + Bônus de Proficiência + Mod.$2)");
  next = next.replace(/CD\s*\((\d+)\s*\+\s*nivel\s*÷\s*3\s*\+\s*Mod\.?\s*([A-Z]{3})\)/g, "CD ($1 + Bônus de Proficiência + Mod.$2)");

  next = next.replace(/PV iguais ao Mod\.ESP/g, "PV iguais ao Bônus de Proficiência + Mod.ESP");
  next = next.replace(/1d8 \+ Mod\.ESP/g, "1d8 + Bônus de Proficiência + Mod.ESP");
  next = next.replace(/1d6\+Mod\.ESP/g, "1d6 + Bônus de Proficiência + Mod.ESP");
  next = next.replace(/2d6\+Mod\.ESP/g, "2d6 + Bônus de Proficiência + Mod.ESP");
  return next;
}

let updated = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = update(before);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    updated++;
  }
}

console.log(JSON.stringify({ updated, checked: files.length }, null, 2));
