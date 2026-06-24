const fs = require("fs");
const path = require("path");

const root = process.cwd();
const source = "C:\\Users\\presi\\Downloads\\Bestiario_Prompts_IA.md";
const out = path.join(root, "tools", "bestiary_ai_prompts.json");

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function decodeMojibake(value) {
  return Buffer.from(value, "latin1").toString("utf8");
}

function clean(value) {
  const decoded = decodeMojibake(value);
  return decoded.includes("�") ? value : decoded;
}

const raw = fs.readFileSync(source, "utf8");
const text = clean(raw);
const styleMatch = text.match(/## Sufixo de estilo[\s\S]*?```([\s\S]*?)```/);
const style = (styleMatch?.[1] ?? "").trim().replace(/\s+/g, " ");
const re = /^###\s+(\d+)\.\s+(.+?)\s*```([\s\S]*?)```/gm;
const prompts = [];
let match;

while ((match = re.exec(text))) {
  const number = Number(match[1]);
  const name = match[2].trim();
  const specific = match[3].trim().replace(/\s+/g, " ");
  prompts.push({
    number,
    name,
    slug: slugify(name),
    target: `${slugify(name)}-ai.png`,
    prompt: `${specific}\n\n${style}`
  });
}

if (!prompts.some((item) => item.name === "Casca Andante")) {
  const name = "Casca Andante";
  const specific = "Casca Andante, construto natural de porte médio formado por uma casca oca de árvore antiga, musgo e raízes finas, movendo-se como armadura vegetal vazia. O tronco rachado no peito drena energia vital de plantas e criaturas próximas (Dreno Vegetal), com seiva escura brilhando nas fissuras. Cenário: floresta úmida com raízes expostas e folhas mortas no chão. Pose: caminhando lentamente com braços longos de galhos retorcidos, cabeça oca inclinada, raízes saindo dos pés e tocando o solo.";
  prompts.splice(29, 0, {
    number: 30,
    name,
    slug: slugify(name),
    target: `${slugify(name)}-ai.png`,
    prompt: `${specific}\n\n${style}`
  });
}

fs.writeFileSync(out, JSON.stringify(prompts, null, 2), "utf8");
console.log(JSON.stringify({ prompts: prompts.length, out: path.relative(root, out) }, null, 2));
