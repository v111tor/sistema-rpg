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

const start = '<h3 id="classes-de-dificuldade-cd">Classes de Dificuldade (CD)</h3>';
const end = '<h3 id="aumentos">Aumentos</h3>';

const replacement = `<h3 id="classes-de-dificuldade-cd">Classes de Dificuldade (CD)</h3>
<p>O stress test dos atributos mostrou que a escala de CDs deve ser usada como uma régua de competência, não como uma escala genérica de dificuldade narrativa. Personagens com d4 ou d6 resolvem bem tarefas simples, mas não alcançam CD 8 no teste base; CD 8 deve marcar ações que exigem atributo competente, preparo, vantagem ou recurso.</p>
<table>
<thead>
<tr>
<th>Patamar</th>
<th>CD</th>
<th>Uso recomendado</th>
</tr>
</thead>
<tbody>
<tr>
<td>Trivial</td>
<td>2</td>
<td>Qualquer personagem pode tentar; falha só importa sob pressão.</td>
</tr>
<tr>
<td>Rotina arriscada</td>
<td>4</td>
<td>Tarefa comum com risco real; d4 e d6 ainda participam bem.</td>
</tr>
<tr>
<td>Competente</td>
<td>8</td>
<td>Primeira barreira de competência; d8 começa a ter chance real.</td>
</tr>
<tr>
<td>Especialista</td>
<td>12</td>
<td>Desafio para d10/d12, ou para quem recebe ajuda, vantagem ou recurso.</td>
</tr>
<tr>
<td>Épico</td>
<td>16</td>
<td>Raro sem preparo; use para cenas decisivas, magia forte e feitos extremos.</td>
</tr>
<tr>
<td>Lendário</td>
<td>20</td>
<td>Feito de Ascensão, criatura lendária ou personagem com d20 ativo.</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>Ajuste de Mestre:</strong> se uma tarefa deve ser média para qualquer aventureiro, use <strong>CD 6</strong> em vez de CD 8. Reserve CD 8 para ações que exigem atributo em d8+, vantagem, preparo, ajuda ou gasto de recurso.</p>
</blockquote>
<blockquote>
<p><strong>Leitura rápida dos atributos:</strong> d4-d6 representam improviso ou capacidade comum; d8 é competência inicial; d10-d12 são especialização; d20 é Ascensão e não deve virar progressão comum.</p>
</blockquote>
`;

let updated = 0;
const missing = [];

for (const file of rulebookFiles) {
  if (!fs.existsSync(file)) {
    missing.push(path.relative(root, file));
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end, startIndex);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Nao foi possivel localizar a secao de CDs em ${path.relative(root, file)}`);
  }

  const next = `${html.slice(0, startIndex)}${replacement}${html.slice(endIndex)}`;
  if (next !== html) {
    fs.writeFileSync(file, next, "utf8");
    updated += 1;
  }
}

console.log(JSON.stringify({
  updated,
  checked: rulebookFiles.length,
  missing
}, null, 2));
