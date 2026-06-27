const fs = require("fs");
const path = require("path");

const root = process.cwd();
const rulebookFiles = [
  path.join(root, "public", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "Sistema_Mecanico_RPG.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Livro_de_Regras.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Livro_de_Regras.html")
];

const creationStart = '<h3 id="passo-4-distribua-os-atributos">Passo 4';
const creationEnd = '<h3 id="passo-5-calcule-os-valores-derivados">Passo 5';
const baseStart = '<h3 id="rolagem-base">Rolagem Base</h3>';
const baseEnd = '<h3 id="classes-de-dificuldade-cd">Classes de Dificuldade (CD)</h3>';
const skillsStart = '<h2 id="parte-iii-per';
const skillsEnd = '<h2 id="parte-iv-sistema-de-aura">PARTE IV';

const creationSection = `<h3 id="passo-4-distribua-os-atributos">Passo 4 — Distribua os
Atributos</h3>
<p>Todos os seis atributos começam em <strong>d4</strong>. A raça
escolhida pode elevar alguns automaticamente.</p>
<p><strong>Método padrão heroico:</strong> você tem <strong>5 avanços de
atributo</strong> para distribuir livremente entre os seis atributos
(cada avanço sobe um atributo um passo: d4→d6, d6→d8 etc.). Máximo
<strong>d10</strong> na criação com este método.</p>
<blockquote>
<p><strong>Balanceamento:</strong> 5 avanços permitem começar com
<strong>d10/d8</strong> ou <strong>d8/d8/d6</strong>, dando ao personagem
um foco forte e uma segunda opção útil. Esse é o novo padrão do sistema.
Use 3 avanços apenas para campanhas severas e 4 avanços para campanhas
mais contidas.</p>
</blockquote>
<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr>
<th>Atributo</th>
<th>Abrev</th>
<th>O que governa</th>
</tr>
</thead>
<tbody>
<tr>
<td>Força</td>
<td>FOR</td>
<td>Ataques corpo a corpo, carga, atletismo</td>
</tr>
<tr>
<td>Agilidade</td>
<td>AGI</td>
<td>Ataques à distância, Aparar, iniciativa</td>
</tr>
<tr>
<td>Vigor</td>
<td>VIG</td>
<td>PV, resistência a doenças/venenos</td>
</tr>
<tr>
<td>Intelecto</td>
<td>INT</td>
<td>Perícias de conhecimento, Arcanismo, bônus de magia arcana</td>
</tr>
<tr>
<td>Espírito</td>
<td>ESP</td>
<td>Perícias sociais e percepção, bônus de magia emocional</td>
</tr>
<tr>
<td>Devoção</td>
<td>DEV</td>
<td>Religião, proteção divina, bônus de magia de fé</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>Foco:</strong> Pense na classe escolhida. Um Guerreiro se
beneficia de FOR e VIG. Um Arcanista se beneficia de INT. Um Sensiente
se beneficia de ESP. Invista primeiro no que sua classe usa.</p>
</blockquote>
<hr />
`;

const baseSection = `<h3 id="rolagem-base">Rolagem Base</h3>
<p>Sempre que um personagem tenta algo com chance de falha fora das
perícias, o jogador rola o <strong>dado do atributo</strong> relevante.
Personagens jogadores também rolam um <strong>Dado Selvagem
(d6)</strong> junto e ficam com o <strong>maior resultado</strong>.</p>
<blockquote>
<p><strong>Regra:</strong> Role [Dado do Atributo] + [Dado Selvagem d6].
Tome o maior valor. Some o <strong>Modificador do Atributo</strong>.
Compare com a CD.</p>
</blockquote>
<blockquote>
<p><strong>Exceção — Perícias:</strong> perícias usam a regra própria da
Parte III. Sem proficiência, role apenas o dado do atributo ligado à
perícia. Com proficiência, role o dado do atributo e some o
<strong>Bônus de Proficiência</strong> do seu nível, não o Modificador do
Atributo.</p>
</blockquote>
<p>NPCs e monstros <strong>não</strong> rolam o Dado Selvagem — somente
personagens jogadores.</p>
`;

const skillsSection = `<h2 id="parte-iii-perícias">PARTE III — PERÍCIAS</h2>
<p>Cada perícia está ligada a um atributo. Perícias medem treinamento
aplicado: um personagem ainda pode tentar uma ação sem treino, mas não
recebe o refinamento que vem da proficiência.</p>
<p><strong>Sem proficiência:</strong> role somente o dado do atributo
correspondente. Não role Dado Selvagem, não some Modificador do Atributo
e não aplique bônus adicional.</p>
<p><strong>Com proficiência:</strong> role o dado do atributo
correspondente e some o <strong>Bônus de Proficiência</strong> indicado
pelo seu nível. Esse bônus substitui o antigo uso do Modificador do
Atributo em perícias proficientes.</p>
<table>
<thead>
<tr>
<th>Nível</th>
<th>Bônus de Proficiência</th>
</tr>
</thead>
<tbody>
<tr><td>1-4</td><td>+2</td></tr>
<tr><td>5-8</td><td>+3</td></tr>
<tr><td>9-12</td><td>+4</td></tr>
<tr><td>13-16</td><td>+5</td></tr>
<tr><td>17-20</td><td>+6</td></tr>
</tbody>
</table>
<blockquote>
<p><strong>Exemplo sem proficiência:</strong> Personagem com AGI d8
tentando Furtividade sem treinamento. Rola apenas d8. Sai 5 → total
<strong>5</strong> vs CD 8.</p>
</blockquote>
<blockquote>
<p><strong>Exemplo com proficiência:</strong> O mesmo personagem é
proficiente em Furtividade no nível 1. Rola d8. Sai 5. Soma Bônus de
Proficiência +2 → total <strong>7</strong> vs CD 8.</p>
</blockquote>
<p>A rolagem final portanto é:</p>
<table>
<thead>
<tr>
<th>Situação</th>
<th>Rolagem</th>
</tr>
</thead>
<tbody>
<tr>
<td>Sem proficiência</td>
<td>Dado do atributo</td>
</tr>
<tr>
<td>Com proficiência</td>
<td>Dado do atributo + Bônus de Proficiência</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>Perícia</th>
<th>Atributo</th>
</tr>
</thead>
<tbody>
<tr><td>Acrobacia</td><td>AGI</td></tr>
<tr><td>Arcanismo</td><td>INT</td></tr>
<tr><td>Atletismo</td><td>FOR</td></tr>
<tr><td>Enganação</td><td>ESP</td></tr>
<tr><td>Furtividade</td><td>AGI</td></tr>
<tr><td>História</td><td>INT</td></tr>
<tr><td>Intimidação</td><td>FOR/ESP</td></tr>
<tr><td>Intuição</td><td>ESP</td></tr>
<tr><td>Medicina</td><td>INT</td></tr>
<tr><td>Natureza</td><td>INT</td></tr>
<tr><td>Percepção</td><td>ESP</td></tr>
<tr><td>Persuasão</td><td>ESP</td></tr>
<tr><td>Prestidigitação</td><td>AGI</td></tr>
<tr><td>Religião</td><td>DEV</td></tr>
<tr><td>Sobrevivência</td><td>VIG</td></tr>
<tr><td>Tecnologia</td><td>INT</td></tr>
</tbody>
</table>
<hr />
`;

function replaceRange(html, startToken, endToken, replacement, label, keepEnd = true) {
  const start = html.indexOf(startToken);
  if (start === -1) throw new Error(`Nao encontrei inicio de ${label}`);
  const end = html.indexOf(endToken, start);
  if (end === -1) throw new Error(`Nao encontrei fim de ${label}`);
  return `${html.slice(0, start)}${replacement}${html.slice(keepEnd ? end : end + endToken.length)}`;
}

function applyGenericRewrites(html) {
  return html
    .replace(/<p>Para cada perícia em que é <strong>proficiente<\/strong>:[\s\S]*?sem bônus\s+adicional\.<\/p>/, `<p>Para cada perícia em que é <strong>proficiente</strong>: role o dado
do atributo correspondente e some o <strong>Bônus de Proficiência</strong>
do seu nível. Para perícias <strong>sem proficiência</strong>: role
somente o dado do atributo correspondente, sem Dado Selvagem, sem Mod.
do atributo e sem bônus adicional.</p>`)
    .replace(/<p>Para cada perÃ­cia em que Ã© <strong>proficiente<\/strong>:[\s\S]*?sem bÃ´nus\s+adicional\.<\/p>/, `<p>Para cada perícia em que é <strong>proficiente</strong>: role o dado
do atributo correspondente e some o <strong>Bônus de Proficiência</strong>
do seu nível. Para perícias <strong>sem proficiência</strong>: role
somente o dado do atributo correspondente, sem Dado Selvagem, sem Mod.
do atributo e sem bônus adicional.</p>`)
    .replaceAll("Com proficiência, some Mod. INT. Sem proficiência, role apenas INT.", "Com proficiência, some o Bônus de Proficiência. Sem proficiência, role apenas INT.")
    .replaceAll("Com proficiÃªncia, some Mod. INT. Sem proficiÃªncia, role apenas INT.", "Com proficiência, some o Bônus de Proficiência. Sem proficiência, role apenas INT.")
    .replaceAll("some Mod. INT. Sem proficiência, role apenas INT.", "some o Bônus de Proficiência. Sem proficiência, role apenas INT.")
    .replaceAll("some Mod. INT. Sem proficiÃªncia, role apenas INT.", "some o Bônus de Proficiência. Sem proficiência, role apenas INT.")
    .replaceAll("some o Modificador do Atributo duas vezes", "some o dobro do Bônus de Proficiência")
    .replaceAll("some o Modificador do\r\nAtributo duas vezes", "some o dobro do Bônus de Proficiência")
    .replaceAll("Dobra o Modificador do Atributo em 2 perícias adicionais", "Dobra o Bônus de Proficiência em 2 perícias adicionais")
    .replaceAll("Dobra o Modificador do Atributo em 2 perÃ­cias adicionais", "Dobra o Bônus de Proficiência em 2 perícias adicionais")
    .replaceAll("Dobra bônus em 2 perícias", "Dobra o Bônus de Proficiência em 2 perícias")
    .replaceAll("Dobra bÃ´nus em 2 perÃ­cias", "Dobra o Bônus de Proficiência em 2 perícias")
    .replaceAll("dobra bônus em 2 perícias", "dobra o Bônus de Proficiência em 2 perícias")
    .replaceAll("dobra bÃ´nus em 2 perÃ­cias", "dobra o Bônus de Proficiência em 2 perícias");
}

let updated = 0;

for (const file of rulebookFiles) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  html = replaceRange(html, creationStart, creationEnd, creationSection, "criacao de atributos");
  html = replaceRange(html, baseStart, baseEnd, baseSection, "rolagem base");
  html = replaceRange(html, skillsStart, skillsEnd, skillsSection, "pericias");
  html = applyGenericRewrites(html);

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    updated += 1;
  }
}

console.log(JSON.stringify({ updated, checked: rulebookFiles.length }, null, 2));
