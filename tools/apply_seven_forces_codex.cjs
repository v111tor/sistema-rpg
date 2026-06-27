const fs = require("fs");
const path = require("path");

const root = process.cwd();
const ebookDirs = [
  path.join(root, "public", "ebook"),
  path.join(root, "dist", "ebook")
];
const rulebooks = [
  path.join(root, "public", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "dist", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html")
];

const codexSource = path.join(root, "public", "ebook", "Codex_das_Sete_Forcas.html");
const codexTargets = [
  "A_Ultima_Ascencao_Codex_das_Sete_Forcas.html",
  "A_Ultima_Ascenção_Codex_das_Sete_Forças.html"
];

const deities = [
  {
    name: "Luz",
    symbol: "Um círculo aberto, como um sol sem raios desenhados",
    nature: "Benígna",
    domain: "Cura, revelação, exorcismo, proteção"
  },
  {
    name: "Sombra",
    symbol: "Uma silhueta sem contorno definido, quase borrada de propósito",
    nature: "Neutra",
    domain: "Segredos, ilusões, passagem, morte suave"
  },
  {
    name: "Natureza",
    symbol: "Um ramo brotando de um círculo de raízes entrelaçadas",
    nature: "Neutra",
    domain: "Plantas, animais, clima, venenos naturais"
  },
  {
    name: "Morte",
    symbol: "Uma porta entreaberta, desenhada de perfil",
    nature: "Neutra",
    domain: "Ancestrais, ciclos, ressurreição, passagem"
  },
  {
    name: "Caos",
    symbol: "Uma espiral que não se fecha, desenhada sempre um pouco torta",
    nature: "Maligna",
    domain: "Destruição, mutação, imprevisibilidade"
  },
  {
    name: "Ordem",
    symbol: "Um compasso fechado sobre um círculo duplo",
    nature: "Benígna",
    domain: "Lei, destino, proteção, profecia"
  },
  {
    name: "Demônio",
    symbol: "Um selo de cera quebrado pela metade",
    nature: "Maligna",
    domain: "Poder, medo, controle, pactos"
  }
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function deityTable() {
  const rows = deities.map((deity) => `<tr>
<td>${escapeHtml(deity.name)}</td>
<td>${escapeHtml(deity.symbol)}</td>
<td>${escapeHtml(deity.nature)}</td>
<td>${escapeHtml(deity.domain)}</td>
</tr>`).join("\n");
  return `<p>Escolha de Divindade</p>
<p>Na <strong>criação do personagem</strong>, o Devoto escolhe sua
divindade:</p>
<table>
<thead>
<tr>
<th>Divindade</th>
<th>Símbolo</th>
<th>Natureza</th>
<th>Domínio de Poder</th>
</tr>
</thead>
<tbody>
${rows}
</tbody>
</table>`;
}

function updateRulebook(file) {
  if (!fs.existsSync(file)) return false;
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(
    /<p>Escolha de Divindade<\/p>\s*<p>Na <strong>cria(?:ç|Ã§)ão do personagem<\/strong>, o Devoto escolhe sua\s*divindade:<\/p>\s*<table>[\s\S]*?<\/table>/,
    deityTable()
  );
  if (after !== before) fs.writeFileSync(file, after, "utf8");
  return after !== before;
}

function publishCodex() {
  if (!fs.existsSync(codexSource)) return 0;
  let written = 0;
  for (const dir of ebookDirs) {
    fs.mkdirSync(dir, { recursive: true });
    for (const target of codexTargets) {
      fs.copyFileSync(codexSource, path.join(dir, target));
      written++;
    }
  }
  return written;
}

const updatedRulebooks = rulebooks.filter(updateRulebook).length;
const codexFiles = publishCodex();
console.log(JSON.stringify({ updatedRulebooks, codexFiles }, null, 2));
