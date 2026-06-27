const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "reports");
const outFile = path.join(outDir, "stress_test_avancos_criacao.md");

const dice = [
  { label: "d4", steps: 0, sides: 4, mod: 0 },
  { label: "d6", steps: 1, sides: 6, mod: 1 },
  { label: "d8", steps: 2, sides: 8, mod: 2 },
  { label: "d10", steps: 3, sides: 10, mod: 3 },
  { label: "d12", steps: 4, sides: 12, mod: 4 }
];

const creationCap = 3;
const normalCap = 4;
const levelImprovements = 5;

function die(step) {
  return dice[step];
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function outcomes(step) {
  const attr = die(step);
  const values = [];
  for (let a = 1; a <= attr.sides; a += 1) {
    for (let w = 1; w <= 6; w += 1) {
      values.push(Math.max(a, w) + attr.mod);
    }
  }
  return values;
}

const chanceCache = new Map();
function chance(step, cd) {
  const key = `${step}:${cd}`;
  if (!chanceCache.has(key)) {
    const values = outcomes(step);
    chanceCache.set(key, values.filter((value) => value >= cd).length / values.length);
  }
  return chanceCache.get(key);
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`)
  ].join("\n");
}

function formatBuild(steps) {
  return [...steps]
    .sort((a, b) => b - a)
    .map((step) => die(step).label)
    .join(" / ");
}

function summarizeBuild(steps) {
  const sorted = [...steps].sort((a, b) => b - a);
  return {
    build: formatBuild(sorted),
    competent: sorted.filter((step) => step >= 2).length,
    specialist: sorted.filter((step) => step >= 3).length,
    capped: sorted.filter((step) => step >= 4).length,
    d4: sorted.filter((step) => step === 0).length,
    top1Cd8: chance(sorted[0], 8),
    top2Cd8: mean(sorted.slice(0, 2).map((step) => chance(step, 8))),
    top3Cd8: mean(sorted.slice(0, 3).map((step) => chance(step, 8))),
    top1Cd12: chance(sorted[0], 12),
    top2Cd12: mean(sorted.slice(0, 2).map((step) => chance(step, 12))),
    top3Cd12: mean(sorted.slice(0, 3).map((step) => chance(step, 12)))
  };
}

function spendFocused(total, cap) {
  const steps = [0, 0, 0, 0, 0, 0];
  let remaining = total;
  for (let index = 0; index < steps.length && remaining > 0; index += 1) {
    const add = Math.min(cap - steps[index], remaining);
    steps[index] += add;
    remaining -= add;
  }
  return steps;
}

function spendTwoCore(total, cap) {
  const steps = [0, 0, 0, 0, 0, 0];
  let remaining = total;

  while (remaining > 0 && (steps[0] < 2 || steps[1] < 2)) {
    const target = steps[0] <= steps[1] ? 0 : 1;
    if (steps[target] < Math.min(2, cap)) {
      steps[target] += 1;
      remaining -= 1;
    } else {
      break;
    }
  }

  for (const target of [0, 1, 2, 3, 4, 5]) {
    while (remaining > 0 && steps[target] < cap) {
      steps[target] += 1;
      remaining -= 1;
    }
  }

  return steps;
}

function spendThreeCore(total, cap) {
  const steps = [0, 0, 0, 0, 0, 0];
  let remaining = total;

  while (remaining > 0) {
    const core = [0, 1, 2];
    const target = core
      .filter((index) => steps[index] < cap)
      .sort((a, b) => steps[a] - steps[b] || a - b)[0];

    if (target === undefined) break;
    steps[target] += 1;
    remaining -= 1;
  }

  return steps;
}

function metricRows(totals, cap, spender) {
  return totals.map((total) => {
    const item = summarizeBuild(spender(total, cap));
    return [
      total,
      item.build,
      item.competent,
      item.specialist,
      item.d4,
      pct(item.top1Cd8),
      pct(item.top2Cd8),
      pct(item.top3Cd8),
      pct(item.top1Cd12)
    ];
  });
}

function effectiveRows(initialAdvances) {
  return initialAdvances.map((advances) => {
    const base = summarizeBuild(spendTwoCore(advances, creationCap));
    const racialOne = summarizeBuild(spendTwoCore(advances + 1, creationCap));
    const racialTwo = summarizeBuild(spendTwoCore(advances + 2, creationCap));
    return [
      advances,
      base.build,
      racialOne.build,
      racialTwo.build,
      `${base.competent} / ${racialOne.competent} / ${racialTwo.competent}`,
      `${base.specialist} / ${racialOne.specialist} / ${racialTwo.specialist}`
    ];
  });
}

function breakpointRows(initialAdvances) {
  return initialAdvances.map((advances) => {
    const focused = summarizeBuild(spendFocused(advances, creationCap));
    const twoCore = summarizeBuild(spendTwoCore(advances, creationCap));
    const threeCore = summarizeBuild(spendThreeCore(advances, creationCap));
    return [
      advances,
      focused.build,
      twoCore.build,
      threeCore.build,
      focused.competent,
      twoCore.competent,
      threeCore.competent
    ];
  });
}

const initialAdvances = [3, 4, 5, 6];
const longTermTotals = initialAdvances.map((advances) => advances + levelImprovements);

const report = `# Relatorio de Stress Test - Avancos de Atributo na Criacao

Data: ${new Date().toISOString().slice(0, 10)}

## Escopo

Este teste avalia se os **3 avancos de atributo na criacao** sao suficientes a curto e longo prazo. O modelo usa as regras atuais do Livro de Regras:

- Todos os seis atributos comecam em \`d4\`.
- Cada avanco sobe um atributo em 1 passo: \`d4 -> d6 -> d8 -> d10 -> d12\`.
- Na criacao pelo metodo padrao, o teto e \`d10\`.
- Por progressao normal, o teto e \`d12\`.
- Melhorias de Atributo por nivel: niveis 4, 8, 12, 16 e 20, totalizando 5 melhorias ate o nivel 20.
- \`d20\` foi excluido do calculo porque e Ascensao narrativa, nao progressao comum.

As chances usam o teste base de personagem: maior entre dado do atributo e Dado Selvagem d6, somando o modificador do atributo.

## Chances Individuais Relevantes

${table(
  ["Dado", "CD 4 Rotina", "CD 8 Competente", "CD 12 Especialista", "Leitura"],
  dice.map((item) => [
    item.label,
    pct(chance(item.steps, 4)),
    pct(chance(item.steps, 8)),
    pct(chance(item.steps, 12)),
    item.steps <= 1
      ? "comum/improviso"
      : item.steps === 2
        ? "competente"
        : item.steps === 3
          ? "especialista inicial"
          : "teto natural"
  ])
)}

## Nivel 1 - Perfis de Distribuicao

**Focado** maximiza o atributo principal primeiro. **Dois nucleos** tenta deixar dois atributos de conceito em d8+. **Tres nucleos** distribui entre atributo principal, defesa/secundario e Vigor.

${table(
  ["Avancos", "Focado", "Dois nucleos", "Tres nucleos", "Comp. focado", "Comp. dois", "Comp. tres"],
  breakpointRows(initialAdvances)
)}

## Nivel 1 - Desempenho do Perfil Focado

${table(
  ["Avancos", "Atributos", "Attrs d8+", "Attrs d10+", "Attrs d4", "Top 1 CD8", "Top 2 CD8", "Top 3 CD8", "Top 1 CD12"],
  metricRows(initialAdvances, creationCap, spendFocused)
)}

## Nivel 1 - Desempenho do Perfil de Dois Nucleos

${table(
  ["Avancos", "Atributos", "Attrs d8+", "Attrs d10+", "Attrs d4", "Top 1 CD8", "Top 2 CD8", "Top 3 CD8", "Top 1 CD12"],
  metricRows(initialAdvances, creationCap, spendTwoCore)
)}

## Nivel 1 - Desempenho do Perfil de Tres Nucleos

${table(
  ["Avancos", "Atributos", "Attrs d8+", "Attrs d10+", "Attrs d4", "Top 1 CD8", "Top 2 CD8", "Top 3 CD8", "Top 1 CD12"],
  metricRows(initialAdvances, creationCap, spendThreeCore)
)}

## Impacto do Bonus Racial

O livro ja concede bonus raciais que frequentemente equivalem a +1 ou +2 passos de atributo. Esta tabela mostra como cada valor de avanco inicial se comporta se a raca reforcar atributos relevantes.

${table(
  ["Avancos base", "Sem bonus racial", "+1 passo racial", "+2 passos raciais", "Attrs d8+", "Attrs d10+"],
  effectiveRows(initialAdvances)
)}

## Longo Prazo - Ate o Nivel 20

Cada personagem recebe mais 5 Melhorias de Atributo por nivel. A tabela abaixo soma os avancos iniciais com essas 5 melhorias e aplica uma progressao focada ate o teto natural d12.

${table(
  ["Avancos iniciais", "Total ate N20", "Atributos finais focados", "Attrs d8+", "Attrs d10+", "Attrs d12", "Top 1 CD12", "Top 2 CD12", "Top 3 CD12"],
  initialAdvances.map((advances) => {
    const item = summarizeBuild(spendFocused(advances + levelImprovements, normalCap));
    return [
      advances,
      advances + levelImprovements,
      item.build,
      item.competent,
      item.specialist,
      item.capped,
      pct(item.top1Cd12),
      pct(item.top2Cd12),
      pct(item.top3Cd12)
    ];
  })
)}

## Diagnostico

1. **3 avancos e jogavel, mas apertado.** Ele cria escolhas claras, porem obriga o jogador a escolher entre ter um atributo forte (\`d10\`) ou ter dois atributos minimamente competentes (\`d8/d6\` ou \`d8/d8\` apenas se houver bonus racial).
2. **Com 3 avancos sem bonus racial, a ficha tende a ficar estreita.** Um personagem focado fica com \`d10/d4/d4/d4/d4/d4\`: excelente em uma coisa, mas sem segunda opcao mecanica relevante.
3. **4 avancos e o melhor ponto de equilibrio para a criacao padrao.** Ele permite \`d8/d8\` para personagens de dois nucleos ou \`d10/d6\` para especialistas, sem permitir excesso de atributos altos.
4. **5 avancos deixa o nivel 1 mais heroico.** O personagem pode iniciar com \`d10/d8\`, o que e muito confortavel para classes que dependem de atributo principal + defesa/secundario.
5. **6 avancos acelera demais a curva inicial.** Ele permite \`d10/d10\` ou \`d8/d8/d8\`; isso e bom para campanhas de poder alto, mas reduz a importancia das primeiras Melhorias de Atributo.
6. **A longo prazo, 3 avancos nao quebra o jogo, mas atrasa a versatilidade.** Ate o nivel 20, 3 avancos + 5 melhorias permitem dois atributos em d12 se o jogador investir tudo neles, mas deixam pouco espaco para um terceiro atributo.
7. **O bonus racial muda bastante o veredito.** Se a maioria das racas concede +1 ou +2 passos relevantes, entao 3 avancos base se comportam como 4 ou 5 avancos efetivos. Se os bonus raciais forem desiguais, algumas escolhas de raca vao parecer mecanicamente obrigatorias.

## Recomendacao Aplicada

O teste mostrou que 4 avancos e o ponto de equilibrio mais conservador, mas a nova direcao do sistema e uma fantasia mais heroica. Portanto, a recomendacao aplicada e **aumentar de 3 para 5 avancos iniciais** e rebalancear bestiario, CDs de criaturas e proficiencia ao redor desse novo piso.

Use:

- **3 avancos** para campanhas mais duras, personagens mais comuns, ou quando todo personagem tambem recebe bonus racial relevante de +1 ou +2 passos.
- **4 avancos** para campanhas mais contidas: suficiente para dois atributos competentes ou um especialista com apoio secundario.
- **5 avancos** como novo padrao: campanha heroica, personagens mais capazes e menos limitados na criacao.
- **6 avancos** apenas para fantasia de alto poder, one-shots heroicos ou campanhas em que os personagens ja comecam como elites.

## Situacao Final

O numero antigo de **3 avancos** nao estava errado, mas era restritivo. Como o objetivo atual e evitar que jogadores sintam opcoes limitadas nos atributos, o sistema passa a adotar **5 avancos iniciais como padrao heroico**. Isso exige bestiario mais resistente, ataques/CDs um pouco mais fortes e proficiencia progressiva por nivel.
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, report, "utf8");

console.log(JSON.stringify({
  report: path.relative(root, outFile),
  creationAdvances: initialAdvances,
  levelImprovements,
  recommendation: "5 avancos iniciais como padrao aplicado"
}, null, 2));
