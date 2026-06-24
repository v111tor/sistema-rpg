const fs = require("fs");
const path = require("path");

const root = process.cwd();
const files = [
  path.join(root, "public", "ebook", "Bestiario_Sistema_Mecanico.html"),
  path.join(root, "dist", "ebook", "Bestiario_Sistema_Mecanico.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascencao_Bestiario.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascencao_Bestiario.html"),
  path.join(root, "public", "ebook", "A_Ultima_Ascenção_Bestiario.html"),
  path.join(root, "dist", "ebook", "A_Ultima_Ascenção_Bestiario.html")
];

const effects = {
  "Tática de Matilha": "1/rodada, se um aliado estiver adjacente ao alvo, o Lobo recebe vantagem no ataque e causa +1d6 perfurante. Se o alvo falhar em ESP CD {dc}, fica Cercado até o início do próximo turno.",
  "Olho Glifado": "como ação bônus, marca uma criatura que possa ver em 18m. Até o fim da rodada, o próximo ataque mágico contra o alvo recebe +2 e ignora cobertura leve.",
  "Camuflagem Lodosa": "em pântano, lama ou água rasa, pode se Esconder mesmo observado. O primeiro ataque feito a partir da camuflagem impõe VIG CD {dc}; falha: alvo fica Agarrado até gastar ação para escapar.",
  "Brilho Faminto": "ao acertar ou terminar o turno adjacente a uma criatura, drena 1 PE, PA ou PD; se o alvo não tiver recurso, sofre 1d6 radiante. O Vaga-lume recupera PV iguais ao recurso drenado.",
  "Fúria Reativa": "quando sofre dano, pode usar reação para mover 3m e atacar. Se estiver abaixo de metade dos PV, o ataque causa +1d6 e o alvo faz ESP CD {dc} ou fica Abalado.",
  "Corpo Refrator": "ataques à distância contra a Serpente têm desvantagem enquanto houver luz forte, vidro ou cristal no ambiente. Quando um ataque erra, ela pode redirecionar 1d6 de dano cortante para alvo adjacente.",
  "Bruma Protetora": "cria uma névoa de 6m por 1 rodada. Criaturas ali dentro têm cobertura leve; inimigos que iniciem turno na névoa fazem ESP CD {dc} ou sofrem -1 em ataques até saírem.",
  "Teia Emocional": "dispara uma teia em 9m. O alvo faz AGI ou ESP CD {dc}; falha: fica Contido e sofre -1 em testes contra medo, raiva ou tristeza até se libertar.",
  "Imóvel como Rocha": "se não se mover no turno, recebe +2 Defesa e vantagem contra empurrão, queda e medo. O próximo alvo que se aproximar sofre ataque de oportunidade com +1d6 contundente.",
  "Pó de Saudade": "em cone de 4,5m, força ESP CD {dc}. Falha: alvo perde reação e sofre -1 no próximo ataque; se já estiver ferido, também sofre 1d6 psíquico.",
  "Cristal Instável": "quando sofre dano, pode estilhaçar cristais em 3m. Criaturas escolhidas fazem AGI CD {dc}; falha: sofrem 1d6 cortante e ficam Marcadas por brilho até o fim da rodada.",
  "Aparar Rúnico": "reação contra um ataque corpo a corpo: soma +2 Defesa. Se o ataque errar, o Duelista marca o agressor e o próximo ataque rúnico contra ele causa +1d6 arcano.",
  "Fé Menor": "1/rodada, concede a si ou aliado em 9m 1d6 PV temporários ou +1 no próximo teste de resistência. Contra morto-vivo ou criatura profana, pode causar 1d6 radiante.",
  "Passo Apagado": "em penumbra ou escuridão, move até 6m sem provocar reação. O primeiro ataque após esse movimento impõe ESP CD {dc}; falha: alvo perde reação.",
  "Leitura de Emoção": "ação bônus para ler um alvo em 12m. Até o fim da cena, a Caçadora recebe +2 para rastrear, intimidar ou atacar esse alvo se ele falhar em ESP CD {dc}.",
  "Comando Rápido": "1/rodada, ordena um construto, armadilha ou dispositivo em 18m a mover, atacar ou bloquear. Se não houver aliado mecânico, ganha +2 Defesa até o próximo turno.",
  "Presságio Instável": "no início do turno, role 1d6: 1-2 impõe -1 em inimigo, 3-4 concede +1d4 a aliado, 5 move uma criatura 3m, 6 repete um dado recém-rolado.",
  "Dreno de Contato": "ao acertar corpo a corpo, o alvo faz VIG CD {dc}; falha: perde 1 recurso mágico ou sofre 2d6 necrótico. O Saqueador recupera PV iguais à metade do dano.",
  "Conhece as Águas": "em rio, chuva ou pântano, não sofre terreno difícil e recebe vantagem em Furtividade. 1/rodada pode puxar alvo em 3m; VIG CD {dc} evita.",
  "Postura de Proteção": "enquanto não se deslocar mais de 3m, recebe +2 Defesa e pode reduzir em 1d6 o dano sofrido por aliado adjacente.",
  "Protocolo de Bloqueio": "marca uma área de 3m. Inimigos que tentem sair dela fazem FOR CD {dc}; falha: deslocamento vira 0 e sofrem 1d6 contundente.",
  "Sirene": "emite alarme em 18m. Criaturas inimigas fazem ESP CD {dc}; falha: não podem se esconder e sofrem -1 em Furtividade por 1 minuto.",
  "Estouro Salino": "ao cair a 0 PV ou como ação, explode sal em 3m. Criaturas fazem VIG CD {dc}; falha: sofrem 1d6 cortante/radiante e têm cura reduzida pela metade por 1 rodada.",
  "Runa Central": "enquanto a runa estiver intacta, a Armadura ignora o primeiro efeito de controle de cada rodada. Teste de Arcanismo CD {dc} expõe a runa e remove esse benefício por 1 rodada.",
  "Ancorada": "não pode ser derrubada ou empurrada enquanto presa ao solo. Recebe +2 em ataques contra alvos que se moveram mais de 6m neste turno.",
  "Raízes de Prisão": "raízes surgem em área de 4,5m. Criaturas fazem AGI CD {dc}; falha: ficam Contidas. Enquanto houver alvo contido, o Golem recupera 1d6 PV no início do turno.",
  "Banco de Pistas": "analisa uma criatura ou cena. O Mestre revela uma fraqueza, resistência ou pista; contra o alvo analisado, o próximo aliado recebe +2 no teste ou ataque.",
  "Enxame Interno": "libera enxame metálico em 3m por 1 rodada. Inimigos na área sofrem 2d6 perfurante e têm desvantagem em Concentração; AGI CD {dc} reduz à metade.",
  "Juramento Gravado": "escolhe um interdito simples. Quem o quebrar em 9m faz DEV CD {dc}; falha: sofre 2d6 radiante e perde reação.",
  "Dreno Vegetal": "ao tocar solo fértil ou criatura viva, drena vitalidade. Alvo faz VIG CD {dc}; falha: sofre 1d6 necrótico e a Casca ganha PV temporários iguais ao dano.",
  "Passos Repetidos": "obriga uma criatura em 9m a repetir o último deslocamento, se possível. ESP CD {dc} evita; falha também concede vantagem ao próximo ataque contra ela.",
  "Lembrança de Perda": "projeta memória dolorosa em 9m. Alvo faz ESP CD {dc}; falha: sofre 1d6 psíquico e não pode receber bônus de moral até o fim da rodada.",
  "Corpo de Névoa": "recebe resistência a dano físico não mágico e pode atravessar frestas. Se sofrer dano radiante, perde essa forma até o próximo turno.",
  "Névoa de Luto": "cria névoa de 4,5m. Inimigos dentro fazem ESP CD {dc}; falha: deslocamento reduzido pela metade e cura recebida reduzida em 1d6.",
  "Brilho Contagiante": "aliados em 6m recebem +1d4 no próximo teste. Inimigos fazem ESP CD {dc}; falha: precisam gastar reação rindo, cantando ou se expondo.",
  "Julgamento": "aponta uma criatura que causou dano nesta rodada. DEV CD {dc}; falha: sofre 3d6 radiante e não pode usar reação até reparar, recuar ou confessar culpa.",
  "Roubo de Persona": "ao acertar, copia voz, rosto ou gesto do alvo por 1 hora. O alvo faz ESP CD {dc}; falha: sofre desvantagem no próximo teste social ou mágico.",
  "Cinza Faminta": "quando uma criatura em 6m sofre dano de fogo, necrótico ou absorção, a Alma recupera 1d6 PV e pode mover 3m sem provocar reação.",
  "Vendaval Nupcial": "vento em linha de 9m. Criaturas fazem FOR CD {dc}; falha: são empurradas 6m e ficam Caídas; sucesso reduz o empurrão à metade.",
  "Eco Confuso": "emite canto subterrâneo. Criaturas em 9m fazem ESP CD {dc}; falha: confundem direção e têm desvantagem no próximo ataque ou teste de Percepção.",
  "Olhar Múltiplo": "não pode ser flanqueada e tem vantagem em Percepção. Como ação, escolhe até dois alvos em 12m; INT CD {dc} ou sofrem -1 Defesa por 1 rodada.",
  "Passagem Viva": "abre boca/porta em parede, chão ou ruína por 1 rodada. Quem atravessa sem permissão faz VIG CD {dc}; falha: sofre 1d6 ácido e fica Preso.",
  "Oração Carnal": "consome carne ritual em 3m para curar 2d6 PV ou causar 2d6 profano em alvo em 9m. DEV CD {dc} reduz o dano à metade.",
  "Dois Corpos": "cria um segundo corpo ilusório sólido por 1 rodada. O primeiro ataque que acertaria o Gêmeo tem 50% de chance de atingir a cópia, que explode em 1d6 arcano.",
  "Repulsa Instintiva": "criaturas que iniciem turno adjacentes fazem ESP CD {dc}; falha: devem se afastar 3m ou atacar com desvantagem.",
  "Tentáculos Múltiplos": "pode agarrar até dois alvos. Alvo agarrado sofre 1d6 contundente no início do turno e precisa vencer FOR CD {dc} para escapar.",
  "Reflexo Drenante": "quando alvo em 12m usa magia ou recurso, reação para refletir parte do fluxo. O alvo faz VIG CD {dc}; falha: perde 1 recurso e sofre 3d6 necrótico.",
  "Gargalhada Compulsiva": "criaturas em 6m fazem ESP CD {dc}; falha: ficam Abaladas, não usam reação e revelam posição mesmo escondidas.",
  "Memória de Magia": "depois de ver uma habilidade mágica, pode reproduzir uma versão menor dela no próximo turno: mesmo alvo ou área, metade do dano/efeito, CD {dc}.",
  "Campo Condutor": "eletricidade salta entre criaturas a até 3m. O primeiro dano elétrico da rodada causa +2d6 e força VIG CD {dc}; falha: alvo perde reação.",
  "Chama Catalisadora": "aumenta fogo, magia ou linha de força em 6m. O próximo efeito elemental na área causa +1d6, mas também ilumina e revela todos os escondidos.",
  "Choro Mineral": "lágrimas de pedra tornam uma área de 3m terreno difícil. Criaturas ali fazem AGI CD {dc}; falha: ficam Lentas e sofrem 1d6 contundente.",
  "Corpo D’Água": "pode ocupar água como se fosse corpo próprio. Recebe resistência a dano físico; ao acertar, força VIG CD {dc} ou o alvo fica Encharcado e Lento.",
  "Presságio Granular": "lê padrões na areia. 1/rodada, depois de uma rolagem em 12m, pode aplicar +1d4 ou -1d4 antes do resultado final ser narrado.",
  "Memória Congelada": "congela uma lembrança recente. Alvo em 9m faz ESP CD {dc}; falha: repete a última ação simples ou perde ação bônus no próximo turno.",
  "Seiva Radiante": "cura aliado vegetal/natural em 2d6 PV ou causa 2d6 radiante em corrupto, morto-vivo ou profano. VIG CD {dc} reduz dano à metade.",
  "Magnetismo": "puxa ou repele item metálico em 9m. Criatura armada ou blindada faz FOR CD {dc}; falha: perde 3m de deslocamento ou larga item leve.",
  "Geometria Sagrada": "traça linhas de vento em 6m. Enquanto permanecer na formação, aliados recebem +1 Defesa; inimigos que cruzem a linha sofrem 2d6 cortante/radiante.",
  "Passo na Sombra": "teleporta entre sombras a até 9m. O primeiro ataque após o passo causa +1d6 necrótico e impõe ESP CD {dc}; falha: alvo fica Cego até o fim do turno.",
  "Enfraquecer Magia": "poeira em 6m reduz em 1d6 o próximo dano mágico ou cura mágica. Conjurador afetado faz INT CD {dc}; falha: perde também concentração.",
  "Levantar de Novo": "a primeira vez que cai a 0 PV, levanta com 1 PV no início do próximo turno, exceto se sofreu dano radiante/sagrado desde o último turno.",
  "Sufocar": "ao agarrar um alvo, impede fala e reduz deslocamento a 0. VIG CD {dc} no fim do turno; falha: sofre 2d6 necrótico e não conjura magia verbal.",
  "Duelista Marcado": "marca um inimigo em 9m. Enquanto a marca durar, ambos têm vantagem para atacar um ao outro, mas o Cavaleiro causa +2d6 necrótico no primeiro acerto.",
  "Choro Atrativo": "criaturas em 9m fazem ESP CD {dc}; falha: devem se aproximar 3m ou gastar ação para resistir ao chamado.",
  "Coroa de Dreno": "aura de 6m. Inimigos que gastem recurso mágico fazem VIG CD {dc}; falha: perdem 1 recurso adicional e o Rei recupera 2d6 PV.",
  "Silêncio Sepulcral": "área de 4,5m fica em silêncio pesado por 1 rodada. Conjuração verbal exige DEV CD {dc}; falha: magia falha e ação é perdida.",
  "Maldição de Item": "amaldiçoa item visível em 9m. Usuário faz DEV CD {dc}; falha: o item impõe -1 em testes/ataques e causa 1d6 necrótico quando usado.",
  "Ocupar Espaço": "enquanto em forma de enxame, pode entrar no espaço de outra criatura. Alvo no mesmo espaço sofre 1d6 perfurante e tem desvantagem em ataques à distância.",
  "Badalada de Medo": "sino toca em 12m. Criaturas fazem ESP CD {dc}; falha: ficam Amedrontadas por 1 rodada; se já estavam feridas, também sofrem 2d6 psíquico.",
  "Culpa Marcada": "marca quem causou dano ou quebrou promessa. O alvo faz ESP CD {dc}; falha: sofre 3d6 psíquico sempre que repetir a mesma violência na cena.",
  "Reescrever Regra": "1/rodada, altera uma regra local curta por 1 turno: alcance vira metade/dobro, terreno muda custo, ou uma reação é proibida. DEV CD {dc} resiste.",
  "Lodo Vivo": "regenera 2d6 PV no início do turno se tocar lama ou água suja. Ao acertar, impõe VIG CD {dc}; falha: alvo fica Envenenado por 1 rodada.",
  "Punição de Promessa": "quando uma criatura em 18m quebra acordo declarado, reação para causar 4d6 radiante e deixá-la Marcada. DEV CD {dc} reduz metade e remove marca.",
  "Oferta Vinculante": "oferece vantagem imediata a alvo em 12m. Se aceitar, no fim da rodada faz DEV CD {dc}; falha: fica Vinculado e deve pagar ação, recurso ou PV.",
  "Fúria Universal": "aura de 12m transforma dano em raiva. Criaturas que causam dano fazem ESP CD {dc}; falha: atacam o alvo mais próximo no próximo turno.",
  "Cópia Absorvida": "ao sofrer habilidade mágica, aprende uma versão dela até o fim da cena. A cópia usa CD {dc}, causa metade do dano e drena 1 recurso do alvo se acertar.",
  "Carga Milagrosa": "acumula preces mecânicas. A cada rodada sem sofrer dano elétrico, ganha 1 carga; com 3 cargas, cura 4d6 aliados ou causa 4d6 radiante em área de 6m.",
  "Predador Absoluto": "sempre sabe a direção da criatura mais ferida em 1km. Contra alvo abaixo de metade dos PV, causa +3d6 e ignora terreno difícil.",
  "Custo de Resposta": "quando uma criatura em 18m faz pergunta, conjura ou usa perícia intelectual, pode responder cobrando custo: INT CD {dc} ou sofre 2d6 psíquico e perde reação.",
  "Zona de Absorção": "cria zona de 9m por 1 rodada. Cura, magia e recursos gastos na área têm efeito reduzido pela metade; a Santa recupera PV iguais ao valor negado."
};

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dcFor(grade) {
  return 10 + Number(grade) * 2;
}

function enrich(html) {
  return html.replace(/<article class="monster-card grade-(\d)" id="([^"]+)">([\s\S]*?)<\/article>/g, (full, grade, id, body) => {
    const abilityMatch = body.match(/<p><strong>Habilidade(?: especial)?:<\/strong>\s*([\s\S]*?)<\/p>/);
    if (!abilityMatch) return full;
    const rawName = abilityMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").replace(/\.$/, "").trim();
    const effect = (effects[rawName] || "1/rodada, usa sua natureza para impor pressão tática: o alvo faz teste apropriado CD {dc}; falha: sofre 1d6 de dano ou perde reação até o fim do turno.").replaceAll("{dc}", String(dcFor(grade)));
    const replacement = `<p><strong>Habilidade especial:</strong> <em>${escapeHtml(rawName)}.</em> ${escapeHtml(effect)}</p>`;
    return `<article class="monster-card grade-${grade}" id="${id}">` + body.replace(abilityMatch[0], replacement) + "</article>";
  });
}

let updated = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = enrich(before);
  fs.writeFileSync(file, after, "utf8");
  updated += (after.match(/<strong>Habilidade especial:<\/strong>/g) || []).length;
}

console.log(JSON.stringify({ files: files.filter(fs.existsSync).length, specialAbilities: updated }, null, 2));
