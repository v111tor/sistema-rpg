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

const startToken = "<p>Sistema de Quimera</p>";
const endToken = '<h2 id="parte-vi-classes">PARTE VI';

function rows(items) {
  return items.map((item) => `<tr>
<td>${item.part}</td>
<td>${item.cost}</td>
<td>${item.activation}</td>
<td>${item.effect}</td>
</tr>`).join("\n");
}

function table(items) {
  return `<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 12%" />
<col style="width: 24%" />
<col style="width: 42%" />
</colgroup>
<thead>
<tr>
<th>Parte</th>
<th>Custo</th>
<th>Ativação</th>
<th>Efeito manifestado</th>
</tr>
</thead>
<tbody>
${rows(items)}
</tbody>
</table>`;
}

const heads = [
  {
    part: "Presas / Mordida",
    cost: "1 pt",
    activation: "1 Energia da Floresta; ação bônus após ataque de arma",
    effect: "As presas brilham com seiva primal. Faça uma mordida d6 perfurante."
  },
  {
    part: "Focinho",
    cost: "1 pt",
    activation: "1 Energia da Floresta; ação bônus; dura 10 minutos",
    effect: "O faro desperta. Receba vantagem em Percepção por olfato e detecte sangue, medo ou rastro fresco em até 9m."
  },
  {
    part: "Bico",
    cost: "1 pt",
    activation: "1 Energia da Floresta; ação bônus após ataque de arma",
    effect: "O bico endurece como madeira encantada. Faça uma bicada d4 perfurante; contra penas, escamas ou couro natural, ignore 1 ponto de Defesa."
  },
  {
    part: "Orelhas de Presa",
    cost: "1 pt",
    activation: "1 Energia da Floresta; reação ao rolar iniciativa ou Percepção",
    effect: "As orelhas captam vibrações da mata. Ganhe vantagem em Percepção por audição; se ativar na iniciativa, não fica Surpreso."
  },
  {
    part: "Olhos de Predador",
    cost: "2 pts",
    activation: "1 Energia da Floresta; ação bônus; dura 1 minuto",
    effect: "Os olhos refletem verde profundo. Ignore penalidade de alcance em ataques à distância e receba +2 em Percepção visual."
  },
  {
    part: "Visão Noturna",
    cost: "2 pts",
    activation: "1 Energia da Floresta; ação bônus; dura 10 minutos",
    effect: "A pupila abre como lua entre folhas. Ignore penalidades de penumbra e escuridão total em até 18m."
  },
  {
    part: "Mandíbula Reforçada",
    cost: "2 pts",
    activation: "1 Energia da Floresta; livre ao acertar Presas/Mordida ou Bico",
    effect: "A mandíbula recebe força de raiz. O ataque natural causa +1 dado de dano e você pode tentar Agarrar como parte da mesma ativação."
  }
];

const limbs = [
  {
    part: "Garras",
    cost: "1 pt",
    activation: "1 Energia da Floresta; ação bônus; dura 1 minuto",
    effect: "As unhas crescem em lâminas vegetais. Ataques desarmados causam d6 cortante e você escala superfícies verticais com metade do movimento."
  },
  {
    part: "Cauda",
    cost: "1 pt",
    activation: "1 Energia da Floresta; reação ao ser derrubado, empurrado ou atacado",
    effect: "A cauda se move como cipó. Receba +1 Aparar contra o ataque ou vantagem no teste para não cair/ser derrubado."
  },
  {
    part: "Patas de Saltador",
    cost: "1 pt",
    activation: "1 Energia da Floresta; ação bônus; dura 1 rodada",
    effect: "As pernas comprimem energia da mata. Deslocamento +3m e distância de salto horizontal/vertical dobrada até o fim do turno."
  },
  {
    part: "Tentáculos",
    cost: "2 pts",
    activation: "1 Energia da Floresta; ação bônus; dura 1 minuto",
    effect: "Apêndices de carne e cipó se alongam. Alcance +1,5m em ataques corpo a corpo e você pode Agarrar como ação bônus uma vez durante a duração."
  },
  {
    part: "Asas Vestigiais",
    cost: "2 pts",
    activation: "1 Energia da Floresta; reação ao cair ou ação bônus",
    effect: "Membranas se abrem com folhas luminosas. Plane por 3m horizontais para cada 1m de queda e ignore dano de queda durante a ativação."
  },
  {
    part: "Asas Funcionais",
    cost: "3 pts",
    activation: "2 Energia da Floresta; ação bônus; dura 1 minuto",
    effect: "As asas se completam com vento da floresta. Receba voo igual ao deslocamento terrestre; substitui Asas Vestigiais enquanto ativa."
  },
  {
    part: "Membro Extra",
    cost: "3 pts",
    activation: "1 Energia da Floresta; ação bônus; dura 1 minuto",
    effect: "Um braço, pata ou cipó corporal emerge. Você pode realizar 1 interação com objeto ou ambiente por rodada sem gastar a ação principal."
  }
];

const covering = [
  {
    part: "Pelagem Espessa",
    cost: "1 pt",
    activation: "1 Energia da Floresta; reação ao sofrer frio ou entrar em frio extremo",
    effect: "A pelagem se ergue como musgo vivo. Receba resistência a frio e +1 Aparar em ambiente de frio extremo por 1 minuto."
  },
  {
    part: "Plumagem",
    cost: "1 pt",
    activation: "1 Energia da Floresta; reação contra ataque à distância ou queda",
    effect: "Penas espirituais desviam impacto. Receba +1 Aparar contra o ataque ou reduza a queda como se fosse 1,5m menor."
  },
  {
    part: "Escamas Rígidas",
    cost: "2 pts",
    activation: "1 Energia da Floresta; reação ao sofrer dano cortante",
    effect: "Escamas endurecem como casca. Receba +1 Aparar até o início do próximo turno e resistência ao dano cortante que ativou a característica."
  },
  {
    part: "Couro Grosso",
    cost: "2 pts",
    activation: "1 Energia da Floresta; reação ao sofrer dano contundente",
    effect: "A pele engrossa com seiva densa. Reduza o dano em 1d6 + Bônus de Proficiência; se o dano era contundente, reduza em 2d6 + Bônus de Proficiência."
  },
  {
    part: "Pele Camaleônica",
    cost: "2 pts",
    activation: "1 Energia da Floresta; ação bônus; dura 1 minuto ou até atacar",
    effect: "A pele copia folha, pedra e sombra. Receba vantagem em Furtividade enquanto estiver imóvel ou em cobertura natural compatível."
  },
  {
    part: "Espinhos Defensivos",
    cost: "2 pts",
    activation: "1 Energia da Floresta; reação ao ser atingido corpo a corpo",
    effect: "Espinhos brotam e recolhem. O atacante sofre 1d4 cortante + Bônus de Proficiência."
  }
];

const nature = [
  {
    part: "Camuflagem",
    cost: "2 pts",
    activation: "1 Energia da Floresta; ação; dura 1 rodada",
    effect: "A floresta cobre sua presença. Fique visualmente indetectável enquanto permanecer imóvel contra observadores que não soubessem sua posição."
  },
  {
    part: "Veneno Natural",
    cost: "2 pts",
    activation: "1 Energia da Floresta; livre ao acertar mordida ou garra; 1/descanso curto",
    effect: "A seiva amarga entra no ferimento. O alvo faz VIG CD 13; falha sofre 2d4 veneno por 2 rodadas."
  },
  {
    part: "Sentido de Manada",
    cost: "2 pts",
    activation: "1 Energia da Floresta; reação quando você ou aliado adjacente faz resistência mental",
    effect: "O instinto tribal pulsa entre vocês. Ambos recebem +1 no teste contra Medo, Charme, Intimidação ou controle emocional."
  },
  {
    part: "Regeneração Menor",
    cost: "3 pts",
    activation: "2 Energia da Floresta; ação bônus; dura 1 minuto; 1/descanso curto",
    effect: "Raízes invisíveis costuram a carne. No início de cada turno, enquanto tiver pelo menos 1 PV, recupere PV iguais ao seu Bônus de Proficiência + 1d4. Se estiver em solo natural, floresta, lama ou chuva, aumente para 1d6. Dano de fogo, ácido ou necrótico recebido desde seu turno anterior suspende essa cura por 1 rodada."
  },
  {
    part: "Sopro Elemental",
    cost: "3 pts",
    activation: "2 Energia da Floresta; ação; 1/descanso longo",
    effect: "A energia da floresta sai em cone de 6m. Cause 3d6 fogo, ácido ou frio; AGI CD 13 reduz à metade."
  },
  {
    part: "Metamorfose Parcial",
    cost: "3 pts",
    activation: "2 Energia da Floresta; ação bônus; dura 1 minuto; 1/descanso longo",
    effect: "O animal-totem assume o corpo por instantes. Deslocamento +3m e +1 passo em FOR; você perde acesso a itens que exijam mãos humanoides durante a duração."
  }
];

const replacement = `<p>Sistema de Quimera</p>
<p>Na criação, todo Homem-fera recebe <strong>8 Pontos de Fera</strong>
para comprar partes bestiais nas categorias abaixo, montando sua composição
única. As partes existem no corpo do personagem, mas seus benefícios
mecânicos não ficam ligados permanentemente: eles são <strong>ativados</strong>
quando a Energia da Floresta atravessa aquela parte e a expressa no mundo.</p>
<p><strong>Energia da Floresta:</strong> você possui uma reserva igual a
<strong>2 + seu Bônus de Proficiência</strong>. Recupera toda a reserva ao
final de um descanso curto ou longo. Se uma característica não indicar uso
por descanso, ela pode ser ativada enquanto houver Energia da Floresta
disponível.</p>
<p><strong>Limite por categoria:</strong> máx. 3 partes da mesma categoria
(exceto Natureza Especial: máx. 1). Uma mesma parte pode existir sempre na
aparência, mas seu efeito de regra só acontece durante a ativação.</p>
<blockquote>
<p><strong>Leitura narrativa:</strong> presas, asas, cauda, escamas e outras
marcas são reais, mas ficam em estado latente. Quando ativadas, folhas
luminosas, seiva, vento verde, musgo espiritual ou sombras de árvores
correm pelo corpo, mostrando que a floresta está usando aquela parte como
canal.</p>
</blockquote>
<hr />
<h4 id="i.-cabeça-sentidos">I. Cabeça &amp; Sentidos</h4>
${table(heads)}
<hr />
<h4 id="ii.-membros-movimento">II. Membros &amp; Movimento</h4>
${table(limbs)}
<hr />
<h4 id="iii.-cobertura-corporal">III. Cobertura Corporal</h4>
${table(covering)}
<hr />
<h4 id="iv.-natureza-especial-máximo-1-parte-desta-categoria">IV.
Natureza Especial <em>(máximo 1 parte desta categoria)</em></h4>
${table(nature)}
<hr />
<p>Exemplos de Homens-fera</p>
<blockquote>
<p><strong>Homem-fera Felino (8 pts):</strong></p>
</blockquote>
<blockquote>
<p>Presas (1) + Focinho (1) — <em>Cabeça</em></p>
</blockquote>
<blockquote>
<p>Garras (1) + Cauda (1) + Patas de Saltador (1) — <em>Membros</em></p>
</blockquote>
<blockquote>
<p>Pelagem Espessa (1) — <em>Cobertura</em></p>
</blockquote>
<blockquote>
<p>Camuflagem (2) — <em>Natureza</em></p>
</blockquote>
<blockquote>
<p><strong>Resultado:</strong> Predador silencioso que expressa a energia da
floresta em saltos, faro, garras e camuflagem momentânea.</p>
</blockquote>
<blockquote>
<p><strong>Homem-fera Águia (8 pts):</strong></p>
</blockquote>
<blockquote>
<p>Bico (1) + Olhos de Predador (2) — <em>Cabeça</em></p>
</blockquote>
<blockquote>
<p>Garras (1) + Asas Funcionais (3) — <em>Membros</em></p>
</blockquote>
<blockquote>
<p>Plumagem (1) — <em>Cobertura</em></p>
</blockquote>
<blockquote>
<p><strong>Resultado:</strong> Combatente aéreo que ativa voo, visão
predatória e defesas de plumagem quando a floresta sopra através dele.</p>
</blockquote>
<blockquote>
<p><strong>Homem-fera Urso (8 pts):</strong></p>
</blockquote>
<blockquote>
<p>Presas (1) + Focinho (1) + Orelhas de Presa (1) — <em>Cabeça</em></p>
</blockquote>
<blockquote>
<p>Garras (1) + Cauda (1) — <em>Membros</em></p>
</blockquote>
<blockquote>
<p>Couro Grosso (2) + Pelagem Espessa (1) — <em>Cobertura</em></p>
</blockquote>
<blockquote>
<p><strong>Resultado:</strong> Guardião físico que ativa resistência, faro,
equilíbrio e ataques naturais conforme a energia primal sobe pela pele.</p>
</blockquote>
<hr />
`;

let updated = 0;

for (const file of rulebookFiles) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const start = html.indexOf(startToken);
  const end = html.indexOf(endToken, start);
  if (start === -1 || end === -1) {
    throw new Error(`Nao encontrei a secao de Quimera em ${path.relative(root, file)}`);
  }
  const next = `${html.slice(0, start)}${replacement}${html.slice(end)}`;
  if (next !== html) {
    fs.writeFileSync(file, next, "utf8");
    updated += 1;
  }
}

console.log(JSON.stringify({ updated, checked: rulebookFiles.length }, null, 2));
