const fs = require("fs");
const path = require("path");

const root = process.cwd();
const bestiaryFiles = [
  path.join(root, "public", "ebook", "Bestiario_Sistema_Mecanico.html"),
  path.join(root, "dist", "ebook", "Bestiario_Sistema_Mecanico.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Bestiario.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Bestiario.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Bestiario.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Bestiario.html")
];

const gradeMath = {
  0: { hp: [8, 14], defense: [11, 14], atk: 3, dc: 11, damage: "1d4+1" },
  1: { hp: [22, 34], defense: [13, 16], atk: 4, dc: 13, damage: "1d8+2" },
  2: { hp: [45, 65], defense: [15, 18], atk: 5, dc: 15, damage: "2d6+3" },
  3: { hp: [78, 105], defense: [17, 20], atk: 7, dc: 16, damage: "3d6+4" },
  4: { hp: [125, 165], defense: [19, 22], atk: 8, dc: 18, damage: "4d8+5" },
  5: { hp: [190, 250], defense: [21, 24], atk: 10, dc: 20, damage: "6d8+6" }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function numberFrom(body) {
  const match = body.match(/<p class="monster-number">#(\d+)<\/p>/);
  return match ? Number(match[1]) : 1;
}

function balancedStats(grade, number) {
  const config = gradeMath[grade];
  const hpRange = config.hp[1] - config.hp[0];
  const defRange = config.defense[1] - config.defense[0];
  return {
    hp: config.hp[0] + ((number * 7) % (hpRange + 1)),
    defense: config.defense[0] + ((number * 3) % (defRange + 1)),
    attack: config.atk + (number % 5 === 0 ? 1 : 0),
    dc: config.dc,
    damage: config.damage,
    hpRange: `${config.hp[0]}-${config.hp[1]}`,
    defenseRange: `${config.defense[0]}-${config.defense[1]}`
  };
}

function updateAttackText(text, stats) {
  return text
    .replace(/Ataque corpo a corpo \+\d+/g, `Ataque corpo a corpo +${stats.attack}`)
    .replace(/Ataque \+\d+/g, `Ataque +${stats.attack}`)
    .replace(/Dano [^.;<]+/g, `Dano ${stats.damage}`)
    .replace(/(falha sofre )\d+d\d+(?:\+\d+)?/gi, `$1${stats.damage}`)
    .replace(/CD \d+/g, `CD ${stats.dc}`);
}

function sourceFrom(body) {
  const tags = body.match(/<p class="monster-tags">([\s\S]*?)<\/p>/)?.[1] || "";
  const spans = [...tags.matchAll(/<span>([^<]+)<\/span>/g)].map((match) => match[1].replace(/^Tipo:\s*/, "").trim());
  return spans[4] || "";
}

function weaknessFor(source, stats) {
  const sourceKey = source.toLowerCase();
  if (sourceKey.includes("arcana")) {
    return `Dano tecnológico, anti-magia, dissipação ou runa quebrada causa +1 dado de dano. Se falhar em INT CD ${stats.dc}, perde reação e fica com -2 Defesa até o fim do próximo turno.`;
  }
  if (sourceKey.includes("tecnologia")) {
    return `Dano elétrico, água condutiva, magnetismo ou sabotagem causa +1 dado de dano. Um acerto crítico desse tipo desativa reação, escudo ou módulo especial por 1 rodada.`;
  }
  if (sourceKey.includes("absor")) {
    return `Dano radiante, sagrado ou energia purificada causa +1 dado de dano. Se receber cura mágica ou excesso de energia, faz VIG CD ${stats.dc}; falha: não pode drenar recursos até o fim do próximo turno.`;
  }
  if (sourceKey.includes("f")) {
    return `Dano sagrado/profano oposto, símbolo quebrado ou profanação do local causa +1 dado de dano. Se falhar em DEV CD ${stats.dc}, perde bênçãos, aura ou reação divina por 1 rodada.`;
  }
  if (sourceKey.includes("natural")) {
    return `Fogo, sal ou dano que altere o terreno do habitat causa +1d6 de dano no primeiro acerto da rodada e cancela camuflagem, regeneração ou agarrão até o próximo turno.`;
  }
  return `Dano psíquico de calma, frio controlado ou efeito que remova Medo/Raiva causa +1 dado de dano. Se falhar em ESP CD ${stats.dc}, perde a habilidade especial por 1 rodada.`;
}

function rebalanceHtml(html) {
  html = html.replace(
    /<section class="bestiary-summary">[\s\S]*?<\/section>/,
    `<section class="bestiary-summary">
<h2>Cat&aacute;logo</h2>
<p>80 criaturas em fichas compactas. Esta vers&atilde;o foi rebalanceada para personagens que come&ccedil;am com 5 avan&ccedil;os de atributo e usam B&ocirc;nus de Profici&ecirc;ncia por n&iacute;vel. As fichas priorizam o que o Mestre consulta em jogo: grau, estat&iacute;sticas, ataque, CD, habilidade, fraqueza, resist&ecirc;ncias, t&aacute;tica e recompensa.</p>
<table>
<thead><tr><th>Grau</th><th>PV alvo</th><th>Defesa alvo</th><th>Ataque/CD</th><th>Dano base</th></tr></thead>
<tbody>
<tr><td>0</td><td>8-14</td><td>11-14</td><td>+3 / CD 11</td><td>1d4+1</td></tr>
<tr><td>1</td><td>22-34</td><td>13-16</td><td>+4 / CD 13</td><td>1d8+2</td></tr>
<tr><td>2</td><td>45-65</td><td>15-18</td><td>+5 / CD 15</td><td>2d6+3</td></tr>
<tr><td>3</td><td>78-105</td><td>17-20</td><td>+7 / CD 16</td><td>3d6+4</td></tr>
<tr><td>4</td><td>125-165</td><td>19-22</td><td>+8 / CD 18</td><td>4d8+5</td></tr>
<tr><td>5</td><td>190-250</td><td>21-24</td><td>+10 / CD 20</td><td>6d8+6</td></tr>
</tbody>
</table>
</section>`
  );

  return html.replace(/<article class="monster-card grade-(\d)" id="([^"]+)">([\s\S]*?)<\/article>/g, (full, gradeText, id, body) => {
    const grade = Number(gradeText);
    const number = numberFrom(body);
    const stats = balancedStats(grade, number);
    const source = sourceFrom(body);

    let next = body
      .replace(/<div><dt>PV<\/dt><dd>[^<]+<\/dd><\/div>/, `<div><dt>PV</dt><dd>${stats.hp} (faixa do Grau ${grade}: ${stats.hpRange})</dd></div>`)
      .replace(/<div><dt>Defesa<\/dt><dd>[^<]+<\/dd><\/div>/, `<div><dt>Defesa</dt><dd>${stats.defense} (faixa do Grau ${grade}: ${stats.defenseRange})</dd></div>`)
      .replace(/<div><dt>Ataque\/CD<\/dt><dd>[^<]+<\/dd><\/div>/, (match) => {
        const current = match.replace(/<[^>]+>/g, " ");
        const label = current.includes("sem ataque direto") ? `sem ataque direto / CD ${stats.dc}` : `+${stats.attack} / CD ${stats.dc}`;
        return `<div><dt>Ataque/CD</dt><dd>${label}</dd></div>`;
      })
      .replace(/<p><strong>Ataques:<\/strong>[\s\S]*?<\/p>/, (attackBlock) => updateAttackText(attackBlock, stats))
      .replace(/<p><strong>Habilidade especial:<\/strong>[\s\S]*?<\/p>/, (abilityBlock) => updateAttackText(abilityBlock, stats))
      .replace(/<p><strong>Fraqueza mecânica:<\/strong>[\s\S]*?<\/p>/, `<p><strong>Fraqueza mecânica:</strong> ${weaknessFor(source, stats)}</p>`)
      .replace(/<p><strong>Fraqueza mecÃ¢nica:<\/strong>[\s\S]*?<\/p>/, `<p><strong>Fraqueza mecânica:</strong> ${weaknessFor(source, stats)}</p>`);

    next = next.replace(/<p><strong>Balanceamento 5 avanços:<\/strong>[\s\S]*?<\/p>\s*/g, "");
    next = next.replace(/<p><strong>Balanceamento 5 avanÃ§os:<\/strong>[\s\S]*?<\/p>\s*/g, "");

    return `<article class="monster-card grade-${grade}" id="${id}">${next}</article>`;
  });
}

function rebalanceTs(file) {
  if (!fs.existsSync(file)) return false;
  let index = 0;
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(/grade: (\d), type: '([^']+)', source: '([^']+)', environment: '([^']+)', hp: \d+, ac: \d+/g, (full, gradeText, type, source, environment) => {
    index += 1;
    const stats = balancedStats(Number(gradeText), index);
    return `grade: ${gradeText}, type: '${type}', source: '${source}', environment: '${environment}', hp: ${stats.hp}, ac: ${stats.defense}`;
  });
  if (after !== before) fs.writeFileSync(file, after, "utf8");
  return after !== before;
}

let updated = 0;
let cards = 0;

for (const file of bestiaryFiles) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = rebalanceHtml(before);
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    updated += 1;
  }
  cards += (after.match(/<article class="monster-card/g) || []).length;
}

const tsUpdated = rebalanceTs(path.join(root, "src", "data", "bestiary.ts"));

console.log(JSON.stringify({
  updated,
  cards,
  tsUpdated,
  profile: "5 avancos + bonus de proficiencia"
}, null, 2));
