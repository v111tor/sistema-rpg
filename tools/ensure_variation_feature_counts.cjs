const fs = require("fs");
const path = require("path");

const root = process.cwd();
const abilitiesPath = path.join(root, "src", "data", "abilities.ts");
const startMarker = "  // BEGIN EXPANSAO SENSIENTE DEVOTO";
const endMarker = "  // END EXPANSAO SENSIENTE DEVOTO";

const configs = {
  Sensiente: {
    prefix: "sen",
    resource: "PE",
    cdName: "Emoção",
    attr: "ESP",
    variations: {
      raiva: {
        label: "Raiva",
        damage: "fogo emocional",
        condition: "Abalado",
        image: "pressão quente",
        skill: "Intimidação",
        terrain: "zona de ameaça",
        bond: "inimigo que provocou a cena",
        names: [
          "Sangue Quente", "Olhar de Desafio", "Folego de Combate", "Revidar Dor", "Aparar Agressivo",
          "Grito de Pressao", "Furia Controlada", "Chama no Pulso", "Marcha Implacavel", "Ataque de Abertura",
          "Resistencia a Provocacao", "Punho de Resposta", "Ira Canalizada", "Forca no Ferimento", "Ardor Defensivo",
          "Vontade de Confronto", "Golpe de Ruptura", "Coracao Vulcanico", "Presenca Intimidante", "Avatar da Ira",
          "Combustao de Orgulho", "Promessa de Sangue", "Choque de Temperamento", "Fornalha no Peito", "Rugido de Quebra",
          "Punho Incandescente", "Furia Guardada", "Estouro de Coragem", "Mandato da Ira", "Coroa Rubra"
        ],
      },
      amor: {
        label: "Amor",
        damage: "luminoso afetivo",
        condition: "Vinculado",
        image: "calor protetor",
        skill: "Persuasão",
        terrain: "círculo de proteção",
        bond: "aliado ferido ou assustado",
        names: [
          "Mao Cuidadosa", "Defesa Afetiva", "Escuta de Dor", "Presenca Calmante", "Sangue Partilhado",
          "Guarda do Vinculo", "Palavra de Consolo", "Cura em Cadeia", "Protecao de Lar", "Afeto Persistente",
          "Voto de Resgate", "Interpor Coracao", "Empatia Curativa", "Aliado Essencial", "Pulso de Abrigo",
          "Refazer Lacoes", "Compromisso Vivo", "Manto de Carinho", "Milagre Pequeno", "Avatar do Amor",
          "Laço Inquebrável", "Abraço de Campo", "Nome Protegido", "Promessa Partilhada", "Escudo de Ternura",
          "Fio Vermelho", "Coração-Âncora", "Mesa de Paz", "Véu do Cuidado", "Coroa do Afeto"
        ],
      },
      medo: {
        label: "Medo",
        damage: "psíquico",
        condition: "Assustado",
        image: "sombra instintiva",
        skill: "Furtividade",
        terrain: "rota de fuga",
        bond: "ameaça mais próxima",
        names: [
          "Instinto de Alarme", "Olhar Predador", "Passo Silencioso", "Ameaça Calculada", "Fuga Perfeita",
          "Pressao Psicologica", "Sombra Defensiva", "Controle do Panico", "Medo Emprestado", "Rastro Inquietante",
          "Foco em Perigo", "Paralisia Breve", "Esquiva Fantasma", "Esquiva Nervosa", "Alarme no Sangue",
          "Escuridão Interna", "Pele de Arrepio", "Autoridade Sombria", "Caçada Mental", "Avatar do Medo",
          "Mapa de Perigo", "Susto Preparado", "Reflexo de Sobrevivência", "Olhos na Nuca", "Pânico Dirigido",
          "Salto do Precipício", "Covil Imaginado", "Silêncio de Presa", "Grito Contido", "Coroa do Pavor"
        ],
      },
      alegria: {
        label: "Alegria",
        damage: "sonoro emocional",
        condition: "Distraído",
        image: "faísca viva",
        skill: "Persuasão",
        terrain: "ritmo de movimento",
        bond: "aliado que aceitar o impulso",
        names: [
          "Sorriso de Combate", "Ritmo do Grupo", "Passo Leve", "Otimismo Teimoso", "Celebrar Acerto",
          "Brilho Social", "Recuperar Folego", "Danca Defensiva", "Improviso Feliz", "Animo Inabalavel",
          "Riso Desarmante", "Sorte Compartilhada", "Coro de Incentivo", "Festa na Adversidade", "Pulso de Celebracao",
          "Euforia Taticamente", "Alegria Antimedos", "Vitoria Antecipada", "Luz Interior", "Avatar da Alegria",
          "Brinde Impossível", "Riso de Virada", "Tambor no Passo", "Estrela no Olhar", "Festa Contra a Dor",
          "Faísca de Plateia", "Dança do Recomeço", "Canto de Fôlego", "Triunfo Contagioso", "Coroa do Júbilo"
        ],
      },
      tristeza: {
        label: "Tristeza",
        damage: "frio emocional",
        condition: "Lento",
        image: "peso silencioso",
        skill: "Intuição",
        terrain: "véu de luto",
        bond: "criatura que causou perda",
        names: [
          "Calma Sombria", "Olhar de Luto", "Resistencia a Perda", "Silencio Tatico", "Peso Compartilhado",
          "Negar Euforia", "Lagrima Precisa", "Escudo Melancolico", "Desacelerar Inimigo", "Memoria Dolorosa",
          "Presenca Funebre", "Frieza Emocional", "Foco no Vazio", "Aceitar Ferida", "Luto Transformado",
          "Voz Baixa", "Eco de Ausencia", "Cansaço Imposto", "Tristeza Serena", "Avatar da Tristeza",
          "Chuva Interior", "Nome que Dói", "Cinza na Voz", "Peso da Memória", "Véu de Saudade",
          "Silêncio Que Afunda", "Última Lágrima", "Rito do Adeus", "Maré de Luto", "Coroa Melancólica"
        ],
      },
      determinacao: {
        label: "Determinação",
        damage: "impacto espiritual",
        condition: "Impedido",
        image: "voto endurecido",
        skill: "Atletismo",
        terrain: "linha de resistência",
        bond: "objetivo declarado",
        names: [
          "Postura Inflexivel", "Voto de Persistencia", "Levantar de Novo", "Defesa Obstinada", "Caminho Ate o Fim",
          "Foco sob Dor", "Recusar Queda", "Passo Seguro", "Vontade em Camadas", "Ultima Linha",
          "Respirar Fundo", "Parede Viva", "Sem Recuo", "Concentracao Rija", "Promessa de Ferro",
          "Atrito Vencido", "Escudo Moral", "Pressao Sustentada", "Vitoria por Teimosia", "Avatar da Determinacao",
          "Juramento de Pedra", "Passo Inevitável", "Punho de Propósito", "Coluna da Alma", "Olhar Sem Volta",
          "Ferro no Fôlego", "Muralha Interior", "Ritmo de Marcha", "Último Juramento", "Coroa da Vontade"
        ],
      },
    },
  },
  Devoto: {
    prefix: "dev",
    resource: "PD",
    cdName: "Fé",
    attr: "DEV",
    variations: {
      luz: {
        label: "Luz",
        damage: "radiante",
        condition: "Cegado",
        image: "clarão sagrado",
        skill: "Religião",
        terrain: "área iluminada",
        bond: "criatura corrompida",
        names: [
          "Benção Clara", "Mandato Radiante", "Toque de Aurora", "Voto da Claridade", "Exilio das Trevas",
          "Palma Solar", "Teto de Aurora", "Expulsar Trevas", "Selo Luminoso", "Vigilia Branca",
          "Palavra Clara", "Cura da Manha", "Revelar Impuro", "Selo da Manha", "Fulgor de Protecao",
          "Escudo Solar", "Verdade Incandescente", "Exilio das Trevas Maior", "Trono Solar", "Avatar da Luz",
          "Lâmpada do Juramento", "Clarim do Amanhecer", "Rastro Purificador", "Janela Celeste", "Círculo de Alba",
          "Mão do Meio-Dia", "Voz sem Sombra", "Aurora de Batalha", "Estrela de Misericórdia", "Coroa Solar"
        ],
      },
      sombra: {
        label: "Sombra",
        damage: "necrótico suave",
        condition: "Oculto",
        image: "véu escuro",
        skill: "Furtividade",
        terrain: "penumbra consagrada",
        bond: "segredo revelado",
        names: [
          "Manto Escuro", "Sussurro Seguro", "Passo Encoberto", "Olhos Noturnos", "Mao Velada",
          "Segredo Guardado", "Sombra Compartilhada", "Ocultar Marca", "Voz Baixa", "Refugio de Penumbra",
          "Oracao Sussurrada", "Caminho Sem Eco", "Esconder Pecado", "Refugio Escuro", "Verdade Velada",
          "Noite Aliada", "Porta sem Luz", "Manto do Esquecimento", "Silencio Profundo", "Avatar da Sombra",
          "Máscara de Breu", "Selo do Segredo", "Passagem Sem Pegadas", "Língua da Penumbra", "Tinta da Noite",
          "Esconderijo Sagrado", "Olho Atrás do Véu", "Noite de Guarda", "Segredo Vivo", "Coroa Sombria"
        ],
      },
      natureza: {
        label: "Natureza",
        damage: "veneno ou espinhos",
        condition: "Enredado",
        image: "seiva e raízes",
        skill: "Natureza",
        terrain: "terreno vivo",
        bond: "solo natural",
        names: [
          "Raiz de Guarda", "Seiva Curativa", "Espinho Justo", "Semente de Cura", "Chamado Animal",
          "Casca Protetora", "Chuva Repentina", "Passo de Musgo", "Faro Selvagem", "Cipo de Contencao",
          "Faro Selvagem Maior", "Pele de Casca", "Mordida da Terra", "Aliado Animal", "Rito da Estacao",
          "Pulso de Floresta", "Raiz Profunda", "Veneno Sagrado", "Tempestade Verde", "Avatar da Natureza",
          "Folha Sentinela", "Semente de Retorno", "Galho Interposto", "Coro de Grilos", "Lama Protetora",
          "Mandíbula de Cipó", "Olho do Bosque", "Estação Antecipada", "Selva no Sangue", "Coroa Verde"
        ],
      },
      morte: {
        label: "Morte",
        damage: "necrótico",
        condition: "Silenciado",
        image: "porta fria",
        skill: "Medicina",
        terrain: "limiar funerário",
        bond: "alma ou nome lembrado",
        names: [
          "Voz do Tumulo", "Toque do Limiar", "Nome Registrado", "Sopro Necrotico", "Olhar de Velorio",
          "Passagem Serena", "Cinza Protetora", "Negar Ressurgimento", "Velar Aliado", "Porta Entreaberta",
          "Sangue Frio", "Memoria Ancestral", "Luto Armado", "Voz dos Ancestrais", "Ultimo Registro",
          "Sepultura Breve", "Eco do Fim", "Rito de Retorno", "Silencio do Mausoleu", "Avatar da Morte",
          "Livro dos Nomes", "Chave do Limiar", "Moeda dos Mortos", "Véu Funerário", "Cinza no Peito",
          "Passo do Ossário", "Sino Final", "Memória que Guarda", "Porta do Depois", "Coroa Cinzenta"
        ],
      },
      caos: {
        label: "Caos",
        damage: "energia instável",
        condition: "Desorientado",
        image: "espiral torta",
        skill: "Enganação",
        terrain: "zona instável",
        bond: "evento improvável",
        names: [
          "Riso Quebrado", "Sorte Torta", "Passo Impossivel", "Quebra de Padrao", "Centelha Erratica",
          "Voz Inconstante", "Caminho Aleatorio", "Troca Repentina", "Dado Vivo", "Reacao Improvavel",
          "Custo Variavel", "Ataque Desalinhado", "Fuga Surpresa", "Ritual Instavel", "Favor do Acaso",
          "Mudanca de Rota", "Explodir Probabilidade", "Negar Previsao", "Juizo do Caos", "Avatar do Caos",
          "Moeda no Ar", "Mapa Rasgado", "Roda de Acasos", "Passo Contrário", "Canto Desafinado",
          "Sorte Emprestada", "Vórtice Pequeno", "Falha Bendita", "Relâmpago Torto", "Coroa Improvável"
        ],
      },
      ordem: {
        label: "Ordem",
        damage: "força axiômica",
        condition: "Contido",
        image: "selo geométrico",
        skill: "História",
        terrain: "jurisdição sagrada",
        bond: "lei declarada",
        names: [
          "Postura Ritual", "Voz de Comando", "Selo de Conduta", "Disciplina Sagrada", "Juramento Fiscalizado",
          "Marcha Ordenada", "Defesa em Fileira", "Punir Desvio", "Regra de Combate", "Clareza de Hierarquia",
          "Mandato Curto", "Rito Impecavel", "Ordem de Retirada", "Lei de Protecao", "Calculo Devocional",
          "Tribunal Interior", "Sentenca Marcada", "Pacto Registrado", "Juizo Absoluto", "Avatar da Ordem",
          "Compasso do Dever", "Linha de Lei", "Selo de Guarda", "Arquivo Vivo", "Mandato de Campo",
          "Sentença Suspensa", "Muralha de Norma", "Círculo do Juiz", "Destino Registrado", "Coroa da Lei"
        ],
      },
      demonio: {
        label: "Demônio",
        damage: "profano ou fogo",
        condition: "Marcado",
        image: "selo quebrado",
        skill: "Intimidação",
        terrain: "círculo de pacto",
        bond: "dívida assumida",
        names: [
          "Marca do Pacto", "Sangue Quente Infernal", "Olhar Tentador", "Garra de Divida", "Resistencia Profana",
          "Contrato Pequeno", "Dor Como Moeda", "Chama do Abismo", "Asas Breves", "Mentira Sedutora",
          "Fome de Alma", "Servo Menor", "Pele Rubra", "Corrente do Pacto", "Dizimo Vital",
          "Autoridade Inferior", "Dente Profano", "Trapaça Ritual", "Juizo Infernal", "Avatar Demoníaco",
          "Assinatura em Sangue", "Preço Antecipado", "Chave do Contrato", "Dívida de Ferro", "Selo da Tentação",
          "Moeda de Dor", "Olho do Intermediário", "Cláusula Oculta", "Trono de Cinzas", "Coroa do Pacto"
        ],
      },
    },
  },
};

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function levelFor(slot) {
  if (slot >= 26) return 15;
  if (slot >= 21) return 10;
  if (slot >= 16) return 15;
  if (slot >= 11) return 10;
  if (slot >= 7) return 5;
  return 1;
}

function cost(config, level, slot) {
  if (slot >= 29) return `5 ${config.resource}`;
  if (slot >= 26 || level >= 15) return `4 ${config.resource}`;
  if (level >= 10) return `3 ${config.resource}`;
  if (level >= 5) return `2 ${config.resource}`;
  return `1 ${config.resource}`;
}

function effectFor(config, variation, slot, name) {
  const resource = cost(config, levelFor(slot), slot);
  const cd = `${config.attr} CD de ${config.cdName} (8 + Bônus de Proficiência + Mod.${config.attr})`;
  const target = config.resource === "PE" ? "emoção" : "fé";
  const effects = [
    `Gaste ${resource} como ação bônus. Manifeste ${variation.image}; até o fim do próximo turno, seu próximo teste de ${variation.skill} ou ataque ligado a ${target} soma +1d4. Se o teste tiver Aumento, recupere 1 ${config.resource}.`,
    `Gaste ${resource} como reação quando ${variation.bond} agir contra você ou aliado. Reduza o resultado dele em 1d4; se isso causar falha, ele sofre ${variation.condition} até o início do próximo turno.`,
    `Gaste ${resource} como ação. Um alvo em 9m faz ${cd}; em falha sofre 1d6 de dano ${variation.damage} e perde 3m de deslocamento nesta rodada.`,
    `Gaste ${resource} ao sofrer dano ligado a ${variation.bond}. ${variation.image} envolve seu corpo: receba PV temporários iguais a 1d6 + Bônus de Proficiência e vantagem no próximo teste de resistência de ${config.attr}.`,
    `Gaste ${resource} ao acertar ataque ou magia. Some +1d6 de dano ${variation.damage}; se o alvo já estava sob uma condição, aumente o dano para +1d8.`,
    `Gaste ${resource} durante interação social. Por 10 minutos, quando usar ${variation.skill} para defender ${variation.bond}, trate resultado 1 ou 2 no dado do atributo como 3.`,
    `Gaste ${resource} como ação para criar ${variation.terrain} de 3m até o fim da cena. Uma vez por rodada, criatura à sua escolha na área recebe +1 em defesa ou -1 em ataque.`,
    `Gaste ${resource} como reação a uma falha em cena marcada por ${variation.label}. Role novamente o dado do atributo; se ainda falhar, transforme uma consequência grave em custo narrativo ligado a ${variation.bond}.`,
    `Gaste ${resource} e marque uma criatura em 12m por 1 minuto. A primeira vez que ela atacar alguém além de você, sofre 1d4 de dano ${variation.damage} e revela intenção hostil.`,
    `Gaste ${resource} ao iniciar descanso curto. Você e até dois aliados removem 1 nível narrativo de tensão, medo, culpa ou exaustão leve ligado a ${variation.label}.`,
    `Gaste ${resource} como reação quando aliado em 9m fizer teste de resistência contra ameaça ligada a ${variation.label}. Ele soma +1d4; se passar por 4 ou mais, ${variation.image} concede a você +1 no próximo teste da cena.`,
    `Gaste ${resource} como ação. Vincule-se a ${variation.bond} por 1 minuto; enquanto o vínculo existir, uma vez por rodada você pode saber direção, estado emocional e condição física aproximada dele.`,
    `Gaste ${resource} para atravessar ${variation.terrain}. Até o fim do turno, você ignora terreno difícil e não provoca reação do primeiro inimigo que deixar para trás.`,
    `Gaste ${resource} como ação bônus e estabeleça ${variation.terrain}. Até três aliados que possam ver você escolhem: mover 3m, ganhar +1 Aparar até o próximo turno ou receber +1d4 no próximo teste fora de dano.`,
    `Gaste ${resource} como ação. Alvos hostis em cone de 6m fazem ${cd}; em falha sofrem ${variation.condition} por 1 rodada, em sucesso sofrem -1 no próximo teste.`,
    `Gaste ${resource} no começo da cena. Por 1 minuto, sua aparência expressa ${variation.image}; você ganha resistência ao primeiro dano ${variation.damage} ou psíquico sofrido por rodada.`,
    `Gaste ${resource} ao ver uma criatura cair a 0 PV. Escolha curar 1d6 PV de um aliado em 9m ou causar 1d6 ${variation.damage} ao agressor responsável.`,
    `Gaste ${resource} quando uma condição afetar você. Suspenda essa condição até o fim do próximo turno; se cumprir ${variation.bond} antes disso, encerre-a de vez.`,
    `Gaste ${resource} como ação. Até quatro criaturas em 9m fazem ${cd}; quem falhar sofre 2d6 ${variation.damage} e não pode receber vantagem até o início do seu próximo turno.`,
    `Gaste ${resource} uma vez por descanso longo. Por 1 minuto, torne-se avatar de ${variation.label}: no início de cada turno escolha causar 1d8 ${variation.damage}, curar 1d8 PV de aliado em 9m ou impor ${variation.condition} a um alvo que falhe em ${cd}.`,
    `Gaste ${resource} como ação bônus. Escolha uma criatura em 12m; até o fim da cena, quando ela agir conforme ${variation.bond}, você pode mover 3m e receber +1 no próximo teste de ${variation.skill}.`,
    `Gaste ${resource} como reação quando uma criatura em ${variation.terrain} causar dano. Ela faz ${cd}; em falha, metade do dano causado é convertida em PV temporários para um aliado em 9m.`,
    `Gaste ${resource} como ação. Revele a fissura emocional ou espiritual de um alvo em 9m; o próximo aliado que o atingir ignora resistência ao dano ${variation.damage} nesse ataque.`,
    `Gaste ${resource} durante descanso curto. Você cria um sinal ligado a ${variation.image}; até o próximo descanso, o primeiro aliado que tocar esse sinal remove ${variation.condition} ou ganha +1d4 em um teste de resistência.`,
    `Gaste ${resource} como ação. Transforme ${variation.terrain} em proteção ativa por 1 minuto; inimigos que entrem nele perdem 3m de deslocamento e aliados recuperam 1 PV ao começar o turno ali.`,
    `Gaste ${resource} ao causar dano ${variation.damage}. Se o alvo falhar em ${cd}, escolha: ele cai, larga um item ou não pode usar reação até o fim do próximo turno.`,
    `Gaste ${resource} como reação quando você ou aliado receber ${variation.condition}. Cancele a condição e cause 1d6 ${variation.damage} em uma criatura envolvida na origem do efeito.`,
    `Gaste ${resource} como ação bônus. Marque ${variation.bond}; por 1 minuto, a primeira vez por rodada que você se aproximar desse vínculo, ganha +2 Aparar até o início do próximo turno.`,
    `Gaste ${resource} como reação a uma falha crítica sua ou de aliado em 9m. Transforme a falha em falha comum e libere ${variation.image}: uma criatura hostil em 9m faz ${cd} ou sofre ${variation.condition}.`,
    `Gaste ${resource} uma vez por descanso longo. Erga a Coroa de ${variation.label}: por 1 minuto, suas características desta variação custam -1 ${config.resource} (mínimo 1) e uma vez por rodada você pode impor ${variation.condition} ou curar 2d6 PV de aliado em 9m.`,
  ];
  return `${name}: ${effects[slot - 1]}`;
}

function recordFor(className, slug, slot) {
  const config = configs[className];
  const variation = config.variations[slug];
  const name = variation.names[slot - 1];
  const id = `${config.prefix}-${slug}-${String(slot).padStart(2, "0")}-${slugify(name)}`;
  const level = levelFor(slot);
  const effect = effectFor(config, variation, slot, name);
  return { id, className, level, name, effect };
}

function renderRecord(record) {
  return `  { id:${JSON.stringify(record.id)}, class:${JSON.stringify(record.className)}, level:${record.level}, name:${JSON.stringify(record.name)}, effect:${JSON.stringify(record.effect)} },`;
}

const source = fs.readFileSync(abilitiesPath, "utf8");
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker);
if (start < 0 || end < 0 || end <= start) throw new Error("Bloco de expansão Sensiente/Devoto não encontrado.");

const records = [];
for (const className of ["Sensiente", "Devoto"]) {
  for (const slug of Object.keys(configs[className].variations)) {
    for (let slot = 1; slot <= 30; slot++) records.push(recordFor(className, slug, slot));
  }
}

const nextBlock = `${startMarker}\n${records.map(renderRecord).join("\n")}\n`;
fs.writeFileSync(abilitiesPath, source.slice(0, start) + nextBlock + source.slice(end), "utf8");
console.log(JSON.stringify({
  sensiente: records.filter(item => item.className === "Sensiente").length,
  devoto: records.filter(item => item.className === "Devoto").length,
  total: records.length
}, null, 2));
