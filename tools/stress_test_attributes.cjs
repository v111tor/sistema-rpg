const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "reports");
const outFile = path.join(outDir, "stress_test_atributos.md");

const dice = [
  { label: "d4", sides: 4, mod: 0 },
  { label: "d6", sides: 6, mod: 1 },
  { label: "d8", sides: 8, mod: 2 },
  { label: "d10", sides: 10, mod: 3 },
  { label: "d12", sides: 12, mod: 4 },
  { label: "d20", sides: 20, mod: 6 }
];

const cds = [2, 4, 8, 12, 16, 20];
const level1Proficiency = 2;
const cdLabels = {
  2: "Trivial",
  4: "Rotina arriscada",
  8: "Competente",
  12: "Especialista",
  16: "Epico",
  20: "Lendario"
};

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function mean(values) {
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function outcomes(attr, mode) {
  const values = [];
  const attrRolls = Array.from({ length: attr.sides }, (_, index) => index + 1);
  const wildRolls = [1, 2, 3, 4, 5, 6];

  if (mode === "player") {
    for (const a of attrRolls) {
      for (const w of wildRolls) values.push(Math.max(a, w) + attr.mod);
    }
  } else if (mode === "player-adv") {
    for (const a1 of attrRolls) {
      for (const a2 of attrRolls) {
        for (const w of wildRolls) values.push(Math.max(a1, a2, w) + attr.mod);
      }
    }
  } else if (mode === "player-dis") {
    for (const a1 of attrRolls) {
      for (const a2 of attrRolls) {
        for (const w of wildRolls) values.push(Math.max(Math.min(a1, a2), w) + attr.mod);
      }
    }
  } else if (mode === "skill-untrained") {
    for (const a of attrRolls) values.push(a);
  } else if (mode === "skill-trained") {
    for (const a of attrRolls) values.push(a + level1Proficiency);
  } else if (mode === "npc") {
    for (const a of attrRolls) values.push(a + attr.mod);
  }

  return values;
}

function chance(values, cd) {
  return values.filter((value) => value >= cd).length / values.length;
}

function raises(values, cd) {
  return mean(values.map((value) => Math.max(0, Math.floor((value - cd) / 4))));
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`)
  ].join("\n");
}

function profile(mode) {
  return dice.map((attr) => {
    const values = outcomes(attr, mode);
    return {
      ...attr,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: mean(values),
      values
    };
  });
}

const player = profile("player");
const playerAdv = profile("player-adv");
const playerDis = profile("player-dis");
const trained = profile("skill-trained");
const untrained = profile("skill-untrained");
const npc = profile("npc");

function chanceRows(profiles) {
  return profiles.map((item) => [
    item.label,
    `+${item.mod}`,
    `${item.min}-${item.max}`,
    item.avg.toFixed(2),
    ...cds.map((cd) => pct(chance(item.values, cd)))
  ]);
}

function deltaRows(baseProfiles) {
  return baseProfiles.slice(1).map((item, index) => {
    const prev = baseProfiles[index];
    return [
      `${prev.label} → ${item.label}`,
      `+${(item.avg - prev.avg).toFixed(2)}`,
      ...cds.map((cd) => {
        const diff = chance(item.values, cd) - chance(prev.values, cd);
        return `${diff >= 0 ? "+" : ""}${(diff * 100).toFixed(1)} pp`;
      })
    ];
  });
}

function raiseRows(profiles, cd) {
  return profiles.map((item) => [
    item.label,
    item.avg.toFixed(2),
    raises(item.values, cd).toFixed(2),
    pct(item.values.filter((value) => value >= cd + 4).length / item.values.length),
    pct(item.values.filter((value) => value >= cd + 8).length / item.values.length)
  ]);
}

const playerHeaders = ["Dado", "Mod", "Faixa", "Média", ...cds.map((cd) => `${cdLabels[cd]} CD ${cd}`)];
const deltaHeaders = ["Salto", "Média", ...cds.map((cd) => `CD ${cd}`)];

const recommendations = [
  "A tabela oficial de CDs deve tratar CD 8 como desafio de competencia, nao como teste medio universal: d4 e d6 nao alcancam CD 8 no teste base atual.",
  "Para tarefas medias que qualquer aventureiro deveria poder tentar, use CD 6 como ajuste de Mestre em vez de CD 8.",
  "CD 12 funciona como parede real para especialistas: d4, d6 e d8 não alcançam; d10 tem 20,0% e d12 tem 41,7%.",
  "CD 16 deve ser rara sem ajuda, vantagem, preparo ou recurso: apenas d12 tem chance natural relevante antes de Ascensão, com 8,3%.",
  "d20 é um salto de Ascensão, não de progressão normal: ele abre CD 20 com 35,0% e transforma CD 16 em teste confortável com 55,0%.",
  "A diferença d12 → d20 é maior que qualquer outro salto: +5,80 de média no teste base e +35 pp em CD 20. A regra de 1 atributo em d20 por vez está correta e deve permanecer.",
  "Vantagem é forte, mas não resolve impossíveis: d4 e d6 ainda não passam CD 12 no teste base porque o teto total fica em 6 e 7. Para permitir milagres de azar/sorte, seria preciso regra opcional de explosão ou aumento temporário do dado.",
  "Perícias proficientes sem Dado Selvagem têm progressão mais linear e menos heroica. O Bônus de Proficiência melhora no longo prazo, mas CD 16 ainda pede atributo alto, preparo ou recurso."
];

const report = `# Relatório de Stress Test — Atributos d4 a d20

Data: ${new Date().toISOString().slice(0, 10)}

## Escopo

Este teste avalia a diferença matemática entre os atributos \`d4\`, \`d6\`, \`d8\`, \`d10\`, \`d12\` e \`d20\`, usando as regras atuais do Livro de Regras:

- Teste base de personagem: \`maior entre Dado do Atributo e Dado Selvagem d6 + Modificador\`.
- Vantagem/desvantagem: duplica apenas o dado do atributo; o Dado Selvagem não duplica.
- Perícia sem proficiência: rola apenas o dado do atributo.
- Perícia com proficiência no nível 1: rola o dado do atributo e soma Bônus de Proficiência +2.
- CDs testadas: 2, 4, 8, 12, 16 e 20.

## Teste Base de Personagem

${table(playerHeaders, chanceRows(player))}

## Diferença Entre Cada Passo de Atributo

Valores em pontos percentuais de chance de sucesso.

${table(deltaHeaders, deltaRows(player))}

## Teste Base Com Vantagem

${table(playerHeaders, chanceRows(playerAdv))}

## Teste Base Com Desvantagem

${table(playerHeaders, chanceRows(playerDis))}

## Perícias Proficientes no Nível 1

${table(playerHeaders, chanceRows(trained))}

## Perícias Sem Proficiência

${table(["Dado", "Mod", "Faixa", "Média", ...cds.map((cd) => `CD ${cd}`)], chanceRows(untrained))}

## Aumentos Em CD 8

${table(["Dado", "Média", "Aumentos médios", "Chance de 1+ aumento", "Chance de 2+ aumentos"], raiseRows(player, 8))}

## Aumentos Em CD 12

${table(["Dado", "Média", "Aumentos médios", "Chance de 1+ aumento", "Chance de 2+ aumentos"], raiseRows(player, 12))}

## Diagnóstico

1. A escala \`d4 → d12\` funciona, mas é mais dura do que a nomenclatura das CDs sugere. O Dado Selvagem suaviza tarefas fáceis, mas não permite que atributos baixos alcancem CDs médias.
2. \`d4\` e \`d6\` não conseguem passar CD 8 no teste base atual. Isso torna a CD 8 uma barreira de competência, não uma dificuldade média universal.
3. \`d8\` é o primeiro patamar que participa de CD 8, com 47,9%. Ainda não alcança CD 12.
4. \`d10\` e \`d12\` são os patamares de especialista. A diferença aparece principalmente em CD 12 e na frequência de Aumentos.
5. \`d20\` é explosivo. Ele não apenas aumenta a média; ele muda o tipo de desafio que o personagem consegue enfrentar. CD 16 vira 55,0% e CD 20 vira 35,0%.
6. As CDs 16 e 20 estão corretas como barreiras épicas/lendárias, desde que o Mestre não peça essas CDs para tarefas comuns de personagens sem Ascensão.

## Alertas de Design

- O salto \`d12 → d20\` é grande demais para ser tratado como melhoria comum. Se \`d20\` fosse obtido por nível, quebraria a curva.
- CD 8 é impossível para \`d4\` e \`d6\` no teste base, mesmo com Dado Selvagem, porque o teto é 6 ou 7. Isso precisa ser intencional ou corrigido.
- CD 12 é impossível para \`d4\`, \`d6\` e \`d8\` no teste base. Para cenas difíceis, peça preparo, vantagem, recurso, ajuda ou atributo especializado.
- Com vantagem, \`d8\` sobe em CD 8 de 47,9% para 67,4%, mas continua sem alcançar CD 12. Vantagem é um benefício relevante, mas ainda não substitui atributo alto.
- Desvantagem pune mais atributos altos do que baixos em tarefas médias, porque reduz o dado principal e força dependência do Dado Selvagem.
- Perícias sem proficiência ficam duras e pouco heroicas. Em cenas de aventura, o Mestre deve preferir teste base com Dado Selvagem quando a ação não for uma perícia técnica formal.

## Recomendações

${recommendations.map((item) => `- ${item}`).join("\n")}

## Situação Final

O sistema de atributos está funcional e tem uma curva clara:

- \`d4-d6\`: personagem comum ou improvisando; ótimo em CD 2-4, sem chance em CD 8+ no teste base.
- \`d8\`: competente inicial; começa a enfrentar CD 8.
- \`d10-d12\`: especialista forte; começa a enfrentar CD 12 e gerar Aumentos.
- \`d20\`: estado lendário/Ascensão.

Conclusão: a regra atual está jogável, mas é severa. A recomendação aplicada ao livro foi tratar CD 4 como rotina arriscada, CD 8 como teste para personagens competentes, CD 12 como desafio de especialista, CD 16 como épico e CD 20 apenas para feitos lendários ou personagens Ascendidos. Para uma tarefa media que qualquer aventureiro deveria poder tentar, o Mestre pode usar CD 6 como ajuste pontual.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, report, "utf8");

console.log(JSON.stringify({
  report: path.relative(root, outFile),
  dice: dice.length,
  cds,
  rows: {
    player: player.length,
    advantage: playerAdv.length,
    disadvantage: playerDis.length,
    trained: trained.length,
    untrained: untrained.length
  }
}, null, 2));
