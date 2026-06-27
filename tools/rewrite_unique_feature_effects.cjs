const fs = require("fs");
const path = require("path");

const root = process.cwd();
const abilitiesPath = path.join(root, "src", "data", "abilities.ts");
const startMarker = "  // BEGIN EXPANSAO SENSIENTE DEVOTO";
const endMarker = "  // END EXPANSAO SENSIENTE DEVOTO";

const sens = {
  raiva: {
    label: "Raiva",
    attr: "ESP",
    damage: "fogo emocional",
    condition: "Abalado",
    image: "pressão quente",
    skill: "Intimidação",
    terrain: "zona de ameaça",
    bond: "inimigo que provocou a cena",
  },
  amor: {
    label: "Amor",
    attr: "ESP",
    damage: "luminoso afetivo",
    condition: "Vinculado",
    image: "calor protetor",
    skill: "Persuasão",
    terrain: "círculo de proteção",
    bond: "aliado ferido ou assustado",
  },
  medo: {
    label: "Medo",
    attr: "ESP",
    damage: "psíquico",
    condition: "Assustado",
    image: "sombra instintiva",
    skill: "Furtividade",
    terrain: "rota de fuga",
    bond: "ameaça mais próxima",
  },
  alegria: {
    label: "Alegria",
    attr: "ESP",
    damage: "sonoro emocional",
    condition: "Distraído",
    image: "faísca viva",
    skill: "Persuasão",
    terrain: "ritmo de movimento",
    bond: "aliado que aceitar o impulso",
  },
  tristeza: {
    label: "Tristeza",
    attr: "ESP",
    damage: "frio emocional",
    condition: "Lento",
    image: "peso silencioso",
    skill: "Intuição",
    terrain: "véu de luto",
    bond: "criatura que causou perda",
  },
  determinacao: {
    label: "Determinação",
    attr: "ESP",
    damage: "impacto espiritual",
    condition: "Impedido",
    image: "voto endurecido",
    skill: "Atletismo",
    terrain: "linha de resistência",
    bond: "objetivo declarado",
  },
};

const dev = {
  luz: {
    label: "Luz",
    attr: "DEV",
    damage: "radiante",
    condition: "Cegado",
    image: "clarão sagrado",
    skill: "Religião",
    terrain: "área iluminada",
    bond: "criatura corrompida",
  },
  sombra: {
    label: "Sombra",
    attr: "DEV",
    damage: "necrótico suave",
    condition: "Oculto",
    image: "véu escuro",
    skill: "Furtividade",
    terrain: "penumbra consagrada",
    bond: "segredo revelado",
  },
  natureza: {
    label: "Natureza",
    attr: "DEV",
    damage: "veneno ou espinhos",
    condition: "Enredado",
    image: "seiva e raízes",
    skill: "Natureza",
    terrain: "terreno vivo",
    bond: "solo natural",
  },
  morte: {
    label: "Morte",
    attr: "DEV",
    damage: "necrótico",
    condition: "Silenciado",
    image: "porta fria",
    skill: "Medicina",
    terrain: "limiar funerário",
    bond: "alma ou nome lembrado",
  },
  caos: {
    label: "Caos",
    attr: "DEV",
    damage: "energia instável",
    condition: "Desorientado",
    image: "espiral torta",
    skill: "Enganação",
    terrain: "zona instável",
    bond: "evento improvável",
  },
  ordem: {
    label: "Ordem",
    attr: "DEV",
    damage: "força axiômica",
    condition: "Contido",
    image: "selo geométrico",
    skill: "História",
    terrain: "jurisdição sagrada",
    bond: "lei declarada",
  },
  demonio: {
    label: "Demônio",
    attr: "DEV",
    damage: "profano ou fogo",
    condition: "Marcado",
    image: "selo quebrado",
    skill: "Intimidação",
    terrain: "círculo de pacto",
    bond: "dívida assumida",
  },
};

function cost(cls, level, slot) {
  const resource = cls === "Sensiente" ? "PE" : "PD";
  if (slot >= 19) return `4 ${resource}`;
  if (level >= 15) return `3 ${resource}`;
  if (level >= 5) return `2 ${resource}`;
  return `1 ${resource}`;
}

function dc(cls, theme) {
  const kind = cls === "Sensiente" ? "Emoção" : "Fé";
  return `CD de ${kind} (8 + Bônus de Proficiência + Mod.${theme.attr})`;
}

function req(level) {
  return level > 1 ? ` Requer nível ${level}+. ` : " ";
}

function effectFor(item) {
  const parts = item.id.split("-");
  const cls = item.className;
  const slug = parts[1];
  const slot = Number(parts[2]);
  const theme = cls === "Sensiente" ? sens[slug] : dev[slug];
  if (!theme || !Number.isFinite(slot)) return item.effect;
  const resource = cost(cls, item.level, slot);
  const test = dc(cls, theme);
  const target = cls === "Sensiente" ? "emoção" : "fé";
  const lines = [
    `Gaste ${resource} como ação bônus.${req(item.level)}Manifeste ${theme.image}; até o fim do próximo turno, seu próximo teste de ${theme.skill} ou ataque ligado a ${target} soma +1d4. Se o teste tiver Aumento, recupere 1 ${resource.slice(-2)}.`,
    `Gaste ${resource} como reação quando ${theme.bond} agir contra você ou aliado. Reduza o resultado dele em 1d4; se isso causar falha, ele sofre ${theme.condition} até o início do próximo turno.`,
    `Gaste ${resource} como ação. Um alvo em 9m faz ${theme.attr} ${test}; em falha sofre 1d6 de dano ${theme.damage} e perde 3m de deslocamento nesta rodada.`,
    `Gaste ${resource} ao sofrer dano ligado a ${theme.bond}. ${theme.image} envolve seu corpo: receba PV temporários iguais a 1d6 + Bônus de Proficiência e vantagem no próximo teste de resistência de ${theme.attr}.`,
    `Gaste ${resource} ao acertar ataque ou magia. Some +1d6 de dano ${theme.damage}; se o alvo já estava sob uma condição, aumente o dano para +1d8.`,
    `Gaste ${resource} durante interação social. Por 10 minutos, quando usar ${theme.skill} para defender ${theme.bond}, trate resultado 1 ou 2 no dado do atributo como 3.`,
    `Gaste ${resource} como ação para criar ${theme.terrain} de 3m até o fim da cena. Uma vez por rodada, criatura à sua escolha na área recebe +1 em defesa ou -1 em ataque.`,
    `Gaste ${resource} como reação a uma falha em cena marcada por ${theme.label}. Role novamente o dado do atributo; se ainda falhar, transforme uma consequência grave em custo narrativo ligado a ${theme.bond}.`,
    `Gaste ${resource} e marque uma criatura em 12m por 1 minuto. A primeira vez que ela atacar alguém além de você, sofre 1d4 de dano ${theme.damage} e revela intenção hostil.`,
    `Gaste ${resource} ao iniciar descanso curto. Você e até dois aliados removem 1 nível narrativo de tensão, medo, culpa ou exaustão leve ligado a ${theme.label}.`,
    `Gaste ${resource} como reação quando aliado em 9m fizer teste de resistência contra ameaça ligada a ${theme.label}. Ele soma +1d4; se passar por 4 ou mais, ${theme.image} concede a você +1 no próximo teste da cena.`,
    `Gaste ${resource} como ação. Vincule-se a ${theme.bond} por 1 minuto; enquanto o vínculo existir, uma vez por rodada você pode saber direção, estado emocional e condição física aproximada dele.`,
    `Gaste ${resource} para atravessar ${theme.terrain}. Até o fim do turno, você ignora terreno difícil e não provoca reação do primeiro inimigo que deixar para trás.`,
    `Gaste ${resource} como ação bônus e estabeleça ${theme.terrain}. Até três aliados que possam ver você escolhem: mover 3m, ganhar +1 Aparar até o próximo turno ou receber +1d4 no próximo teste fora de dano.`,
    `Gaste ${resource} como ação. Alvos hostis em cone de 6m fazem ${theme.attr} ${test}; em falha sofrem ${theme.condition} por 1 rodada, em sucesso sofrem -1 no próximo teste.`,
    `Gaste ${resource} no começo da cena. Por 1 minuto, sua aparência expressa ${theme.image}; você ganha resistência ao primeiro dano ${theme.damage} ou psíquico sofrido por rodada.`,
    `Gaste ${resource} ao ver uma criatura cair a 0 PV. Escolha curar 1d6 PV de um aliado em 9m ou causar 1d6 ${theme.damage} ao agressor responsável.`,
    `Gaste ${resource} quando uma condição afetar você. Suspenda essa condição até o fim do próximo turno; se cumprir ${theme.bond} antes disso, encerre-a de vez.`,
    `Gaste ${resource} como ação. Até quatro criaturas em 9m fazem ${theme.attr} ${test}; quem falhar sofre 2d6 ${theme.damage} e não pode receber vantagem até o início do seu próximo turno.`,
    `Gaste ${resource} uma vez por descanso longo. Por 1 minuto, torne-se avatar de ${theme.label}: no início de cada turno escolha causar 1d8 ${theme.damage}, curar 1d8 PV de aliado em 9m ou impor ${theme.condition} a um alvo que falhe em ${theme.attr} ${test}.`,
  ];
  return `${item.name}: ${lines[slot - 1]}`;
}

const source = fs.readFileSync(abilitiesPath, "utf8");
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker);
if (start < 0 || end < 0 || end <= start) {
  throw new Error("Bloco de expansão Sensiente/Devoto não encontrado.");
}

const before = source.slice(0, start);
const block = source.slice(start, end);
const after = source.slice(end);

const objectRe = /\{ id:"([^"]+)", class:"([^"]+)", level:(\d+), name:"([^"]+)", effect:"([^"]*)" \}/g;
let changed = 0;
const nextBlock = block.replace(objectRe, (full, id, className, level, name, effect) => {
  const item = { id, className, level: Number(level), name, effect };
  const nextEffect = effectFor(item);
  if (nextEffect === effect) return full;
  changed++;
  return `{ id:${JSON.stringify(id)}, class:${JSON.stringify(className)}, level:${level}, name:${JSON.stringify(name)}, effect:${JSON.stringify(nextEffect)} }`;
});

fs.writeFileSync(abilitiesPath, before + nextBlock + after, "utf8");
console.log(JSON.stringify({ changed }, null, 2));
