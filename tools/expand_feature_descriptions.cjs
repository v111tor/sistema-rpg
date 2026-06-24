const fs = require("fs");
const path = require("path");

const root = process.cwd();
const abilitiesPath = path.join(root, "src", "data", "abilities.ts");
const books = [
  path.join(root, "public", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "dist", "ebook", "Sistema_Mecanico_RPG.html")
];

const start = "  // BEGIN EXPANSAO SENSIENTE DEVOTO";
const end = "  // END EXPANSAO SENSIENTE DEVOTO";
const legacyStart = "<!-- BEGIN EXPANSAO SENSIENTE DEVOTO -->";
const legacyEnd = "<!-- END EXPANSAO SENSIENTE DEVOTO -->";
const sensStart = "<!-- BEGIN CARACTERISTICAS EXPANDIDAS SENSIENTE -->";
const sensEnd = "<!-- END CARACTERISTICAS EXPANDIDAS SENSIENTE -->";
const devStart = "<!-- BEGIN CARACTERISTICAS EXPANDIDAS DEVOTO -->";
const devEnd = "<!-- END CARACTERISTICAS EXPANDIDAS DEVOTO -->";

const sens = {
  raiva: ["Raiva", "A emoção vira impulso, calor e pressão física.", "Gaste {cost} ou ative ao sofrer/causar dano. Até o fim do próximo turno, receba +1 em ataque ou dano; em Aumento, o alvo faz ESP CD 8 + Mod.ESP ou fica Abalado."],
  amor: ["Amor", "O vínculo protege, cura e mantém aliados de pé.", "Gaste {cost} ao tocar ou ver aliado em 9m. Cure 1d6 PV, conceda PV temporários iguais ao Mod.ESP ou dê +1 no próximo salvamento contra medo, dor ou controle."],
  medo: ["Medo", "O instinto de sobrevivência vira leitura de ameaça e controle.", "Gaste {cost} quando uma criatura se aproxima ou ameaça. Ela faz ESP CD 8 + Mod.ESP; em falha perde reação, não pode se aproximar 3m ou sofre -1 no próximo ataque."],
  alegria: ["Alegria", "A emoção acelera o grupo e transforma risco em movimento.", "Gaste {cost} como ação bônus. Você ou aliado em 9m ganha +1d4 no próximo teste ou ataque e pode mover 3m sem provocar reação se agir com ousadia."],
  tristeza: ["Tristeza", "O luto pesa o campo, reduz ímpeto e corta excessos.", "Gaste {cost} ao ver dano, perda ou falha. Inimigo em 9m faz ESP CD 8 + Mod.ESP; em falha sofre -1 em ataque, defesa ou cura recebida até o fim da rodada."],
  determinacao: ["Determinação", "A vontade endurece corpo, foco e promessa.", "Gaste {cost} quando falhar por 2 ou menos, sofrer dano ou proteger alguém. Ganhe +1 no teste, 1d6 PV temporários ou resistência ao próximo dano físico."]
};

const dev = {
  luz: ["Luz", "A fé revela, purifica e sustenta presença sagrada.", "Gaste {cost} para iluminar 9m, curar 1d6 PV ou causar +1d6 radiante contra morto-vivo, demônio ou criatura corrompida. Também remove uma penalidade de escuridão comum."],
  sombra: ["Sombra", "O domínio protege segredos, silêncio e passagens ocultas.", "Gaste {cost} para ganhar vantagem em Furtividade, impor -1 em Percepção contra você ou negar reação de alvo em penumbra com DEV CD 8 + Mod.DEV."],
  natureza: ["Natureza", "A devoção chama raiz, fera, clima e veneno vivo.", "Gaste {cost} para criar terreno difícil de 3m, conceder +1 em Sobrevivência/Natureza ou impor VIG CD 8 + Mod.DEV contra veneno, espinhos ou agarrão natural."],
  morte: ["Morte", "O domínio governa passagem, ancestralidade e fim inevitável.", "Gaste {cost} ao lidar com cadáver, espírito ou alvo ferido. Cause 1d6 necrótico, impeça cura por 1 rodada ou faça uma pergunta a eco ancestral recente."],
  caos: ["Caos", "A fé distorce probabilidade e quebra padrões rígidos.", "Gaste {cost} e role 1d6: 1-2 +1d4 em aliado, 3-4 -1 no teste inimigo, 5 mova alvo 3m, 6 repita um dado recém-rolado. Efeito hostil permite DEV CD 8 + Mod.DEV."],
  ordem: ["Ordem", "O domínio impõe lei, juramento, hierarquia e punição.", "Gaste {cost} para declarar uma regra curta até o fim da rodada. Quem a quebrar faz DEV CD 8 + Mod.DEV ou perde reação e sofre 1d6 radiante/psíquico."],
  demonio: ["Demônio", "O pacto oferece poder imediato por marca, dívida e tentação.", "Gaste {cost} para marcar alvo em 9m. O próximo acerto contra ele causa +1d6 profano/fogo; se o alvo cair, você pode recuperar 1 PD, mas recebe sinal profano visível."]
};

function costFor(level, cls) {
  const base = cls === "Sensiente" ? "PE" : "PD";
  if (level >= 15) return `3 ${base}`;
  if (level >= 10) return `2 ${base}`;
  if (level >= 5) return `2 ${base}`;
  return `1 ${base}`;
}

function parseExpansion(text) {
  const block = text.slice(text.indexOf(start), text.indexOf(end));
  const re = /\{ id:"([^"]+)", class:"([^"]+)", level:(\d+), name:"([^"]+)", effect:"([^"]*)" \}/g;
  const out = [];
  let m;
  while ((m = re.exec(block))) out.push({ id: m[1], cls: m[2], level: Number(m[3]), name: m[4] });
  return out;
}

function detail(item) {
  const slug = item.id.split("-")[1];
  const map = item.cls === "Sensiente" ? sens : dev;
  const [variation, description, effect] = map[slug] || [slug, "Variação especializada.", "Aplique o efeito descrito pelo Mestre."];
  const cost = costFor(item.level, item.cls);
  const req = item.level > 1 ? ` Requer nível ${item.level}+. ` : " ";
  return {
    ...item,
    variation,
    description: `${item.name}: ${description}`,
    effect: `${item.name}.${req}${effect.replace("{cost}", cost)}`,
    cost
  };
}

function objectLine(item) {
  const e = `${item.description} Efeito: ${item.effect}`;
  return `  { id:"${item.id}", class:"${item.cls}", level:${item.level}, name:"${item.name}", effect:"${e}" }`;
}

function updateAbilities() {
  const text = fs.readFileSync(abilitiesPath, "utf8");
  const items = parseExpansion(text).map(detail);
  const a = text.indexOf(start);
  const b = text.indexOf(end);
  const before = text.slice(0, a);
  const after = text.slice(b + end.length);
  const block = `${start}\n${items.map(objectLine).join(",\n")}\n${end}`;
  fs.writeFileSync(abilitiesPath, before + block + after, "utf8");
  return items;
}

function row(item, index) {
  return `<tr><td>${item.variation}</td><td>${index}</td><td>${item.name}</td><td>${item.level}+</td><td>${item.cost}</td><td>${item.description}</td><td>${item.effect}</td></tr>`;
}

function table(title, items) {
  const grouped = new Map();
  for (const item of items) {
    if (!grouped.has(item.variation)) grouped.set(item.variation, []);
    grouped.get(item.variation).push(item);
  }
  const rows = [];
  for (const list of grouped.values()) list.forEach((item, i) => rows.push(row(item, i + 1)));
  return `<h4>${title}</h4>\n<table>\n<thead><tr><th>Variação</th><th>#</th><th>Nome</th><th>Nível</th><th>Custo</th><th>Descrição</th><th>Efeito</th></tr></thead>\n<tbody>\n${rows.join("\n")}\n</tbody>\n</table>`;
}

function updateBook(file, items) {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, "utf8");
  const sensTable = table("Sensiente - 20 características por estado emocional", items.filter(i => i.cls === "Sensiente"));
  const devTable = table("Devoto - 20 características por domínio", items.filter(i => i.cls === "Devoto"));
  html = html.replace(/<h4>Sensiente - 20 caracter(?:i|í)sticas por estado emocional<\/h4>\s*<table>[\s\S]*?<\/table>/, sensTable);
  html = html.replace(/<h4>Devoto - 20 caracter(?:i|í)sticas por dom(?:i|í)nio<\/h4>\s*<table>[\s\S]*?<\/table>/, devTable);
  fs.writeFileSync(file, html, "utf8");
}

const items = updateAbilities();
for (const book of books) updateBook(book, items);
console.log(JSON.stringify({
  sensiente: items.filter(i => i.cls === "Sensiente").length,
  devoto: items.filter(i => i.cls === "Devoto").length
}, null, 2));
