const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];

const sourceHtml = path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html");
const outDir = path.join(root, ".tmp-pdf");
const generatedPdf = path.join(outDir, "A_Ultima_Ascencao_Livro_de_Regras.pdf");
const pdfTargets = [
  path.join(root, "public", "ebook", "Sistema_Mecanico_RPG.pdf"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.pdf"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.pdf"),
  path.join(root, "dist", "ebook", "Sistema_Mecanico_RPG.pdf"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.pdf"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.pdf")
];

function fileUrl(file) {
  return `file:///${file.replace(/\\/g, "/").replace(/ /g, "%20")}`;
}

const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (!chrome) {
  console.error("Chrome ou Edge nao encontrado para gerar PDF.");
  process.exit(1);
}

if (!fs.existsSync(sourceHtml)) {
  console.error(`HTML fonte nao encontrado: ${sourceHtml}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(generatedPdf)) fs.rmSync(generatedPdf, { force: true });

const result = spawnSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--no-sandbox",
  "--allow-file-access-from-files",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=5000",
  "--print-to-pdf-no-header",
  `--print-to-pdf=${generatedPdf}`,
  fileUrl(sourceHtml)
], {
  cwd: root,
  encoding: "utf8"
});

if (result.status !== 0 || !fs.existsSync(generatedPdf)) {
  console.error(result.stderr || result.stdout || "Falha desconhecida ao gerar PDF.");
  process.exit(result.status || 1);
}

for (const target of pdfTargets) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(generatedPdf, target);
}

console.log(JSON.stringify({
  source: path.relative(root, sourceHtml),
  generated: path.relative(root, generatedPdf),
  bytes: fs.statSync(generatedPdf).size,
  targets: pdfTargets.map((target) => path.relative(root, target))
}, null, 2));
