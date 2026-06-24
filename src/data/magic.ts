// Auto-migrado de 01-dados-sistema.js
export const SYSTEM_MAGIC_CATALOG = [
  {
    "source": "arcana",
    "name": "Dardo Arcano",
    "cost": "2 PA",
    "range": "18m / Instantaneo",
    "effect": "Projeta forca pura. Causa 1d6+Mod.INT; alvo com cobertura recebe AGI CD 12 para reduzir metade.",
    "type": "Ataque",
    "duration": "Instantaneo",
    "number": 1
  },
  {
    "source": "arcana",
    "name": "Escudo de Forca",
    "cost": "2 PA",
    "range": "Pessoal ou 9m / 1 minuto",
    "effect": "Reacao; uma placa de forca concede +2 Aparar contra um ataque. Em aliado a 9m, concede +1 Aparar. 1 rodada.",
    "type": "Protecao",
    "duration": "1 minuto",
    "number": 2
  },
  {
    "source": "arcana",
    "name": "Detectar Magia",
    "cost": "2 PA",
    "range": "18m / 1 minuto",
    "effect": "Detecta magia ativa em 18m, revela fonte geral e intensidade. Efeito oculto exige Arcanismo CD 12 para identificar.",
    "type": "Utilitario/Ritual",
    "duration": "1 minuto",
    "number": 3
  },
  {
    "source": "arcana",
    "name": "Mao Magica",
    "cost": "2 PA",
    "range": "18m / 1 minuto",
    "effect": "Move objeto solto de ate 5 kg em 18m. Nao causa dano; desarmar, abrir trava simples ou acionar alavanca exige Arcanismo CD 12.",
    "type": "Utilitario/Ritual",
    "duration": "1 minuto",
    "number": 4
  },
  {
    "source": "arcana",
    "name": "Queima Arcana",
    "cost": "2 PA",
    "range": "18m / Instantaneo",
    "effect": "Explode calor arcano em 1 alvo. Causa 2d6 fogo ou forca; VIG CD 12 reduz metade e evita ficar Em Chamas.",
    "type": "Ataque/Area",
    "duration": "Instantaneo",
    "number": 5
  },
  {
    "source": "arcana",
    "name": "Levitacao",
    "cost": "2 PA",
    "range": "Pessoal ou toque / 1 minuto",
    "effect": "Alvo tocado sobe ate 6m e se move 3m por rodada. Criatura involuntaria faz FOR CD 12 para negar.",
    "type": "Movimento/Furtividade",
    "duration": "1 minuto",
    "number": 6
  },
  {
    "source": "arcana",
    "name": "Sono Arcano",
    "cost": "2 PA",
    "range": "9m a 18m / 1 rodada",
    "effect": "Altera acao, movimento ou posicao do alvo. INT, FOR ou ESP CD 12 nega ou permite novo teste no fim do turno.",
    "type": "Controle",
    "duration": "1 rodada",
    "number": 7
  },
  {
    "source": "arcana",
    "name": "Relampago Linear",
    "cost": "2 PA",
    "range": "Linha 15m / Instantaneo",
    "effect": "Linha de 15m causa 2d6 raio. AGI CD 12 reduz metade; alvo com armadura metalica perde reacao ate o proximo turno.",
    "type": "Ataque/Area",
    "duration": "Instantaneo",
    "number": 8
  },
  {
    "source": "arcana",
    "name": "Invisibilidade",
    "cost": "2 PA",
    "range": "Pessoal ou toque / 1 minuto",
    "effect": "Alvo fica invisivel por 1 minuto ou ate atacar/lancar habilidade. Percepcao CD 13 percebe rastros, som ou distorcao.",
    "type": "Movimento/Furtividade",
    "duration": "1 minuto",
    "number": 9
  },
  {
    "source": "arcana",
    "name": "Dissipar Magia",
    "cost": "3 PA",
    "range": "Variavel / Variavel",
    "effect": "Teste Arcanismo contra CD 10 + custo do efeito. Em sucesso, encerra magia ativa; em falha, gasta PA sem dissipar.",
    "type": "Especial",
    "duration": "Variavel",
    "number": 10
  },
  {
    "source": "arcana",
    "name": "Bola de Fogo",
    "cost": "4 PA",
    "range": "24m / Instantaneo",
    "effect": "Causa 3d6+Mod.INT do tipo apropriado. AGI ou VIG CD 13 reduz a metade e evita empurrao, queda ou perda de recurso.",
    "type": "Ataque/Area",
    "duration": "Instantaneo",
    "number": 11
  },
  {
    "source": "arcana",
    "name": "Telecinese",
    "cost": "4 PA",
    "range": "9m a 18m / 1 minuto",
    "effect": "Move criatura ou objeto medio ate 6m. FOR CD 13 resiste; se atingir parede ou queda, sofre 1d6 dano adicional.",
    "type": "Controle",
    "duration": "1 minuto",
    "number": 12
  },
  {
    "source": "arcana",
    "name": "Muralha de Forca",
    "cost": "4 PA",
    "range": "Pessoal ou 9m / 10 minutos",
    "effect": "Cria muralha de forca de ate 6m por 3m, CA 13 e 20 PV. Bloqueia passagem e linha de efeito enquanto durar.",
    "type": "Protecao",
    "duration": "10 minutos",
    "number": 13
  },
  {
    "source": "arcana",
    "name": "Visao Arcana",
    "cost": "4 PA",
    "range": "9m / 10 minutos",
    "effect": "Por 10 min, enxerga auras, ilusoes e escolas magicas em 9m. Identificar efeito complexo exige Arcanismo CD 13.",
    "type": "Utilitario/Ritual",
    "duration": "10 minutos",
    "number": 14
  },
  {
    "source": "arcana",
    "name": "Runa de Alarme",
    "cost": "4 PA",
    "range": "9m / 10 minutos",
    "effect": "Marca uma area de 3m. Quando alguem cruza, voce recebe alerta mental e o intruso fica iluminado por 1 rodada.",
    "type": "Utilitario/Ritual",
    "duration": "10 minutos",
    "number": 15
  },
  {
    "source": "arcana",
    "name": "Passo Dimensional",
    "cost": "4 PA",
    "range": "Pessoal ou toque / 10 minutos",
    "effect": "Teleporta voce ate 9m para ponto visivel. Nao provoca reacao; se chegar em terreno instavel, AGI CD 12 evita queda.",
    "type": "Movimento/Furtividade",
    "duration": "10 minutos",
    "number": 16
  },
  {
    "source": "arcana",
    "name": "Armadura Arcana",
    "cost": "4 PA",
    "range": "Pessoal ou 9m / 10 minutos",
    "effect": "Campo pessoal concede +2 Aparar. Depois de bloquear 3 ataques ou ao fim de 10 min, a armadura se desfaz.",
    "type": "Protecao",
    "duration": "10 minutos",
    "number": 17
  },
  {
    "source": "arcana",
    "name": "Selo de Silencio",
    "cost": "4 PA",
    "range": "9m a 18m / 1 minuto",
    "effect": "Cria zona silenciosa de 3m. Quem tentar magia verbal dentro dela faz INT CD 13 ou perde a acao.",
    "type": "Controle",
    "duration": "1 minuto",
    "number": 18
  },
  {
    "source": "arcana",
    "name": "Tranca Mistica",
    "cost": "4 PA",
    "range": "9m / 10 minutos",
    "effect": "Tranca porta, bau ou mecanismo. Abrir sem senha exige Forca/Tecnologia/Arcanismo CD 14.",
    "type": "Utilitario/Ritual",
    "duration": "10 minutos",
    "number": 19
  },
  {
    "source": "arcana",
    "name": "Campo Antimagia Menor",
    "cost": "5 PA",
    "range": "Pessoal ou 9m / 10 minutos",
    "effect": "Campo de 3m enfraquece magia menor. Primeiro efeito magico que entrar exige Arcanismo CD 14 ou e anulado.",
    "type": "Protecao",
    "duration": "10 minutos",
    "number": 20
  },
  {
    "source": "arcana",
    "name": "Temporal Arcano",
    "cost": "7 PA",
    "range": "9m a 18m / 10 minutos",
    "effect": "Distorce tempo de 1 alvo. ESP CD 15 ou perde reacao, tem deslocamento reduzido pela metade e age por ultimo na proxima rodada.",
    "type": "Controle",
    "duration": "10 minutos",
    "number": 21
  },
  {
    "source": "arcana",
    "name": "Gaiola Arcana",
    "cost": "7 PA",
    "range": "9m a 18m / 10 minutos",
    "effect": "Prende alvo em barras de forca. FOR ou INT CD 15 escapa no fim do turno; ataques de fora sofrem cobertura parcial.",
    "type": "Controle",
    "duration": "10 minutos",
    "number": 22
  },
  {
    "source": "arcana",
    "name": "Duplicata Ilusoria",
    "cost": "7 PA",
    "range": "Pessoal / 1 minuto",
    "effect": "Cria copia que confunde ataques. O primeiro ataque contra voce por rodada tem chance de atingir a duplicata.",
    "type": "Ilusao",
    "duration": "1 minuto",
    "number": 23
  },
  {
    "source": "arcana",
    "name": "Olho Errante",
    "cost": "7 PA",
    "range": "Toque / 1 hora",
    "effect": "Cria olho flutuante invisivel que explora ate 30m. Enquanto enxerga por ele, voce fica Desatento ao proprio corpo.",
    "type": "Utilitario/Ritual",
    "duration": "1 hora",
    "number": 24
  },
  {
    "source": "arcana",
    "name": "Flecha Gravitacional",
    "cost": "7 PA",
    "range": "18m / Instantaneo",
    "effect": "Flecha de gravidade causa 5d6 forca e puxa 3m. AGI CD 15 reduz metade e evita o deslocamento.",
    "type": "Ataque/Area",
    "duration": "Instantaneo",
    "number": 25
  },
  {
    "source": "arcana",
    "name": "Circulo de Contencao",
    "cost": "7 PA",
    "range": "Toque / 1 hora",
    "effect": "Desenha circulo de 3m. Criaturas invocadas, espirituais ou corrompidas fazem DEV/ESP CD 15 para atravessar.",
    "type": "Utilitario/Ritual",
    "duration": "1 hora",
    "number": 26
  },
  {
    "source": "arcana",
    "name": "Refracao Mental",
    "cost": "7 PA",
    "range": "Pessoal ou 9m / 10 minutos",
    "effect": "Refrata magia mental ou arcana. Ate 10 min, o primeiro efeito contra voce tem desvantagem ou causa metade do dano.",
    "type": "Protecao",
    "duration": "10 minutos",
    "number": 27
  },
  {
    "source": "arcana",
    "name": "Forma Eterea Breve",
    "cost": "7 PA",
    "range": "Pessoal ou toque / Instantaneo",
    "effect": "Ate o fim do turno, voce atravessa criaturas e uma barreira fina. Se terminar dentro de objeto, e expulso e sofre 2d6.",
    "type": "Movimento/Furtividade",
    "duration": "Instantaneo",
    "number": 28
  },
  {
    "source": "arcana",
    "name": "Ruptura de Mana",
    "cost": "7 PA",
    "range": "18m / Instantaneo",
    "effect": "Rompe magia ativa em 18m. Causa 4d6 forca ao portador do efeito; Arcanismo CD 15 reduz metade e mantem a magia.",
    "type": "Ataque/Area",
    "duration": "Instantaneo",
    "number": 29
  },
  {
    "source": "arcana",
    "name": "Porta Arcana",
    "cost": "7 PA",
    "range": "Pessoal ou toque / Instantaneo",
    "effect": "Abre passagem curta entre dois pontos visiveis a ate 18m. Cada criatura pode atravessar uma vez antes da porta fechar.",
    "type": "Movimento/Furtividade",
    "duration": "Instantaneo",
    "number": 30
  },
  {
    "source": "arcana",
    "name": "Teletransporte",
    "cost": "15 PA",
    "range": "Pessoal ou toque / Instantaneo",
    "effect": "Teleporta voce e ate 3 aliados para local visto ou circulo conhecido. Local desconhecido exige Arcanismo CD 16 ou desvia.",
    "type": "Movimento/Furtividade",
    "duration": "Instantaneo",
    "number": 31
  },
  {
    "source": "arcana",
    "name": "Prisao Dimensional",
    "cost": "15 PA",
    "range": "9m a 18m / 1 hora/concentracao",
    "effect": "Remove alvo da cena por 1 rodada. INT/ESP CD 16 nega; ao voltar, ele fica Desorientado ate o fim do turno.",
    "type": "Controle",
    "duration": "1 hora/concentracao",
    "number": 32
  },
  {
    "source": "arcana",
    "name": "Colosso de Forca",
    "cost": "15 PA",
    "range": "6m / 1 minuto/concentracao",
    "effect": "Cria construto de forca com PV, Aparar e dano proporcionais ao nivel. Comandar exige acao bonus.",
    "type": "Criacao",
    "duration": "1 minuto/concentracao",
    "number": 33
  },
  {
    "source": "arcana",
    "name": "Biblioteca Instantanea",
    "cost": "14 PA",
    "range": "30m / Ritual",
    "effect": "Invoca consulta espectral. Responde 1 pergunta factual sobre historia, magia ou local; nao revela futuro nem vontade divina.",
    "type": "Utilitario/Ritual",
    "duration": "Ritual",
    "number": 34
  },
  {
    "source": "arcana",
    "name": "Chuva de Meteoros Menor",
    "cost": "15 PA",
    "range": "30m / Instantaneo",
    "effect": "Causa 8d6+Mod.INT do tipo apropriado. AGI ou VIG CD 16 reduz a metade e evita empurrao, queda ou perda de recurso.",
    "type": "Ataque/Area",
    "duration": "Instantaneo",
    "number": 35
  },
  {
    "source": "arcana",
    "name": "Reescrever Runa",
    "cost": "14 PA",
    "range": "30m / Ritual",
    "effect": "Altera uma runa, selo ou armadilha magica do mesmo grau. Arcanismo CD 16; falha ativa o efeito original.",
    "type": "Utilitario/Ritual",
    "duration": "Ritual",
    "number": 36
  },
  {
    "source": "arcana",
    "name": "Santuario Geometrico",
    "cost": "14 PA",
    "range": "Pessoal ou 9m / 1 hora",
    "effect": "Domo geometrico de 6m concede +2 Aparar a aliados dentro. Magia hostil para atravessar faz Arcanismo CD 16.",
    "type": "Protecao",
    "duration": "1 hora",
    "number": 37
  },
  {
    "source": "arcana",
    "name": "Clone de Contingencia",
    "cost": "14 PA",
    "range": "Pessoal ou 9m / 1 hora",
    "effect": "Prepara duplicata de contingencia. O proximo ataque que acertaria voce atinge o clone e desloca voce 3m.",
    "type": "Protecao",
    "duration": "1 hora",
    "number": 38
  },
  {
    "source": "arcana",
    "name": "Dobrar Realidade",
    "cost": "14 PA",
    "range": "9m a 18m / 1 hora/concentracao",
    "effect": "Muda uma lei local da cena: gravidade, atrito, peso ou direcao. Alvos resistem com INT/FOR CD 16 a cada rodada.",
    "type": "Controle",
    "duration": "1 hora/concentracao",
    "number": 39
  },
  {
    "source": "arcana",
    "name": "Desejo Arcano",
    "cost": "15 PA",
    "range": "Variavel / Variavel",
    "effect": "Replica uma habilidade arcana de custo menor ou cria milagre narrativo. O Mestre define preco raro, risco ou consequencia.",
    "type": "Especial",
    "duration": "Variavel",
    "number": 40
  },
  {
    "source": "primitive",
    "name": "Brasa da Raiva",
    "cost": "2 PE",
    "range": "15m / Instantaneo",
    "effect": "Projeta brasa emocional em 15m. Causa 1d6+Mod.ESP fogo/psiquico; VIG CD 12 evita ser empurrado 1,5m.",
    "type": "Raiva/Ataque",
    "duration": "Instantaneo",
    "number": 1
  },
  {
    "source": "primitive",
    "name": "Toque Gentil",
    "cost": "3 PE",
    "range": "Toque / Instantaneo",
    "effect": "Toque cura 1d6+Mod.ESP PV. Se o alvo estiver protegendo alguem, tambem recebe +1 Aparar por 1 rodada.",
    "type": "Amor/Cura",
    "duration": "Instantaneo",
    "number": 2
  },
  {
    "source": "primitive",
    "name": "Sussurro do Terror",
    "cost": "1 PE",
    "range": "9m / Instantaneo",
    "effect": "Sussurra uma ameaca intima. ESP CD 12 ou o alvo nao pode se aproximar de voce ate o fim do proximo turno.",
    "type": "Medo/Controle",
    "duration": "Instantaneo",
    "number": 3
  },
  {
    "source": "primitive",
    "name": "Bencao do Riso",
    "cost": "2 PE",
    "range": "9m / Instantaneo",
    "effect": "Aliado em 9m recebe +1d4 no proximo teste ou ataque. Se acertar, ganha 1,5m de deslocamento.",
    "type": "Alegria/Suporte",
    "duration": "Instantaneo",
    "number": 4
  },
  {
    "source": "primitive",
    "name": "Lagrimas do Abismo",
    "cost": "3 PE",
    "range": "12m / Instantaneo",
    "effect": "Lagrimas pesam em area de 3m. ESP CD 12 ou inimigos sofrem -1 em ataques ate o fim da rodada.",
    "type": "Tristeza/Debuff",
    "duration": "Instantaneo",
    "number": 5
  },
  {
    "source": "primitive",
    "name": "Forca Interior",
    "cost": "1 PE",
    "range": "Pessoal / Instantaneo",
    "effect": "Voce ganha 1d6 PV temporarios ou repete 1 save contra medo, queda ou exaustao.",
    "type": "Determinacao/Protecao",
    "duration": "Instantaneo",
    "number": 6
  },
  {
    "source": "primitive",
    "name": "Onda de Chamas",
    "cost": "2 PE",
    "range": "15m / Instantaneo",
    "effect": "Cone curto de chamas emocionais causa 1d6+Mod.ESP em ate 2 alvos adjacentes; AGI CD 12 reduz metade.",
    "type": "Raiva/Ataque",
    "duration": "Instantaneo",
    "number": 7
  },
  {
    "source": "primitive",
    "name": "Cura Emocional",
    "cost": "3 PE",
    "range": "Toque / Instantaneo",
    "effect": "Cura 1d6 PV e remove uma penalidade emocional leve: medo, culpa, hesitacao ou tristeza magica menor.",
    "type": "Amor/Cura",
    "duration": "Instantaneo",
    "number": 8
  },
  {
    "source": "primitive",
    "name": "Campo de Pavor",
    "cost": "1 PE",
    "range": "9m / Instantaneo",
    "effect": "Area de 3m fica opressiva. ESP CD 12 ou inimigos nao podem usar reacao enquanto permanecerem ali.",
    "type": "Medo/Controle",
    "duration": "Instantaneo",
    "number": 9
  },
  {
    "source": "primitive",
    "name": "Extase Coletivo",
    "cost": "2 PE",
    "range": "9m / Instantaneo",
    "effect": "Ate 3 aliados em 9m podem mover 3m sem provocar reacao. Nao concede ataque extra.",
    "type": "Alegria/Suporte",
    "duration": "Instantaneo",
    "number": 10
  },
  {
    "source": "primitive",
    "name": "Tempestade de Cinzas",
    "cost": "6 PE",
    "range": "12m / 1 minuto",
    "effect": "Cinzas cobrem area de 4,5m por 1 minuto. ESP CD 13 ou terreno fica dificil e cura recebida cai pela metade.",
    "type": "Tristeza/Debuff",
    "duration": "1 minuto",
    "number": 11
  },
  {
    "source": "primitive",
    "name": "Barreira de Determinacao",
    "cost": "3 PE",
    "range": "Pessoal / 1 minuto",
    "effect": "Aliado em 9m recebe resistencia ao proximo dano fisico e +1 em save de VIG por 1 minuto.",
    "type": "Determinacao/Protecao",
    "duration": "1 minuto",
    "number": 12
  },
  {
    "source": "primitive",
    "name": "Grito da Fera",
    "cost": "4 PE",
    "range": "15m / 1 minuto",
    "effect": "Grito causa 2d6+Mod.ESP psiquico em cone de 6m; VIG CD 13 reduz metade e evita ficar Abalado.",
    "type": "Raiva/Ataque",
    "duration": "1 minuto",
    "number": 13
  },
  {
    "source": "primitive",
    "name": "Laco Protetor",
    "cost": "5 PE",
    "range": "Toque / 1 minuto",
    "effect": "Cria laco entre voce e aliado. Cura 2d6 PV agora; uma vez na duracao, voce pode sofrer metade do dano dele.",
    "type": "Amor/Cura",
    "duration": "1 minuto",
    "number": 14
  },
  {
    "source": "primitive",
    "name": "Pressagio de Panico",
    "cost": "6 PE",
    "range": "9m / 1 minuto",
    "effect": "Marca pressagio em 1 alvo. ESP CD 13 ou ele tem desvantagem no proximo ataque contra voce ou aliado escolhido.",
    "type": "Medo/Controle",
    "duration": "1 minuto",
    "number": 15
  },
  {
    "source": "primitive",
    "name": "Passos Dancantes",
    "cost": "3 PE",
    "range": "9m / 1 minuto",
    "effect": "Aliado em 9m pode levantar, mover 6m ou sacar item sem gastar acao. Tambem ganha +1 no proximo ataque.",
    "type": "Alegria/Suporte",
    "duration": "1 minuto",
    "number": 16
  },
  {
    "source": "primitive",
    "name": "Peso do Luto",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Alvo em 12m sente peso do luto. ESP CD 13 ou perde 3m de deslocamento e nao pode receber bonus de moral.",
    "type": "Tristeza/Debuff",
    "duration": "1 minuto",
    "number": 17
  },
  {
    "source": "primitive",
    "name": "Juramento Interno",
    "cost": "5 PE",
    "range": "Pessoal / 1 minuto",
    "effect": "Escolha um objetivo. Enquanto agir para cumpri-lo, voce recebe +1 em testes e 1d6 PV temporarios.",
    "type": "Determinacao/Protecao",
    "duration": "1 minuto",
    "number": 18
  },
  {
    "source": "primitive",
    "name": "Inferno da Raiva",
    "cost": "6 PE",
    "range": "15m / 1 minuto",
    "effect": "Explosao de furia atinge 1 alvo por 2d6+Mod.ESP; se voce estiver ferido, causa +1d6 adicional.",
    "type": "Raiva/Ataque",
    "duration": "1 minuto",
    "number": 19
  },
  {
    "source": "primitive",
    "name": "Ressurreicao por Amor",
    "cost": "3 PE",
    "range": "Toque / 1 minuto",
    "effect": "Levanta criatura a 0 PV tocada com 1 PV e cura 2d6. Nao funciona se o corpo estiver destruido.",
    "type": "Amor/Cura",
    "duration": "1 minuto",
    "number": 20
  },
  {
    "source": "primitive",
    "name": "Pesadelo Vivo",
    "cost": "7 PE",
    "range": "9m / 1 rodada",
    "effect": "Cria ilusao de pesadelo. ESP CD 15 ou alvo fica Amedrontado e so pode atacar apos se afastar 3m.",
    "type": "Medo/Controle",
    "duration": "1 rodada",
    "number": 21
  },
  {
    "source": "primitive",
    "name": "Euforia de Batalha",
    "cost": "8 PE",
    "range": "9m / 1 rodada",
    "effect": "Ate 3 aliados ganham +1d4 em ataques por 1 rodada. Quem acertar pode trocar de posicao com aliado adjacente.",
    "type": "Alegria/Suporte",
    "duration": "1 rodada",
    "number": 22
  },
  {
    "source": "primitive",
    "name": "Melancolia da Morte",
    "cost": "9 PE",
    "range": "12m / 1 rodada",
    "effect": "Area de 6m silencia esperanca. ESP CD 15 ou inimigos nao recuperam PV e sofrem -1 Aparar por 1 rodada.",
    "type": "Tristeza/Debuff",
    "duration": "1 rodada",
    "number": 23
  },
  {
    "source": "primitive",
    "name": "Muralha de Vontade",
    "cost": "10 PE",
    "range": "Pessoal / 1 rodada",
    "effect": "Voce e aliados adjacentes ganham resistencia ao primeiro dano da rodada por 1 rodada.",
    "type": "Determinacao/Protecao",
    "duration": "1 rodada",
    "number": 24
  },
  {
    "source": "primitive",
    "name": "Marca da Ira",
    "cost": "6 PE",
    "range": "15m / 1 rodada",
    "effect": "Marca alvo com ira. Seus ataques contra ele causam +1d6 por 1 rodada; VIG CD 15 nega a marca.",
    "type": "Raiva/Ataque",
    "duration": "1 rodada",
    "number": 25
  },
  {
    "source": "primitive",
    "name": "Pulso de Afeto",
    "cost": "7 PE",
    "range": "Toque / 1 rodada",
    "effect": "Pulso em 3m cura 4d6 dividido entre aliados. Quem receber cura pode encerrar uma condicao emocional leve.",
    "type": "Amor/Cura",
    "duration": "1 rodada",
    "number": 26
  },
  {
    "source": "primitive",
    "name": "Olhos do Predador",
    "cost": "8 PE",
    "range": "9m / 1 rodada",
    "effect": "Voce encara 1 alvo. ESP CD 15 ou ele fica marcado como presa: nao pode se esconder de voce por 1 minuto.",
    "type": "Medo/Controle",
    "duration": "1 rodada",
    "number": 27
  },
  {
    "source": "primitive",
    "name": "Cancao de Vitoria",
    "cost": "9 PE",
    "range": "9m / 1 rodada",
    "effect": "Canto concede a ate 3 aliados vantagem no proximo teste de ataque ou save contra medo.",
    "type": "Alegria/Suporte",
    "duration": "1 rodada",
    "number": 28
  },
  {
    "source": "primitive",
    "name": "Silencio do Funeral",
    "cost": "10 PE",
    "range": "12m / 1 rodada",
    "effect": "Area de 6m apaga som e animo. ESP CD 15 ou inimigos nao podem usar habilidade de suporte por 1 rodada.",
    "type": "Tristeza/Debuff",
    "duration": "1 rodada",
    "number": 29
  },
  {
    "source": "primitive",
    "name": "Corpo Inquebravel",
    "cost": "6 PE",
    "range": "Pessoal / 1 rodada",
    "effect": "Seu corpo ignora dor. Ganha 4d6 PV temporarios; enquanto durarem, nao fica Caido por dano.",
    "type": "Determinacao/Protecao",
    "duration": "1 rodada",
    "number": 30
  },
  {
    "source": "primitive",
    "name": "Furia de Milenios",
    "cost": "11 PE",
    "range": "15m / 10 minutos",
    "effect": "Furia ancestral causa 8d6+Mod.ESP em alvo unico. VIG CD 16 reduz metade; em falha tambem fica Marcado.",
    "type": "Raiva/Ataque",
    "duration": "10 minutos",
    "number": 31
  },
  {
    "source": "primitive",
    "name": "Amor Incondicional",
    "cost": "12 PE",
    "range": "Toque / 10 minutos",
    "effect": "Cura 8d6 PV e remove uma condicao emocional ou espiritual grave. Uso repetido no dia exige custo narrativo.",
    "type": "Amor/Cura",
    "duration": "10 minutos",
    "number": 32
  },
  {
    "source": "primitive",
    "name": "Terror Primordial",
    "cost": "13 PE",
    "range": "9m / 10 minutos",
    "effect": "Todos inimigos em 9m fazem ESP CD 16 ou ficam Amedrontados por 1 minuto, com novo teste ao fim do turno.",
    "type": "Medo/Controle",
    "duration": "10 minutos",
    "number": 33
  },
  {
    "source": "primitive",
    "name": "Festival Impossivel",
    "cost": "14 PE",
    "range": "9m / 10 minutos",
    "effect": "Cria festa impossivel em 9m. Aliados ignoram terreno dificil e recebem +1d4 em testes por 1 minuto.",
    "type": "Alegria/Suporte",
    "duration": "10 minutos",
    "number": 34
  },
  {
    "source": "primitive",
    "name": "Mare de Luto",
    "cost": "15 PE",
    "range": "12m / 10 minutos",
    "effect": "Mare emocional cobre 12m. ESP CD 16 ou inimigos sofrem -2 em ataques e nao podem curar por 1 rodada.",
    "type": "Tristeza/Debuff",
    "duration": "10 minutos",
    "number": 35
  },
  {
    "source": "primitive",
    "name": "Vontade Absoluta",
    "cost": "10 PE",
    "range": "Pessoal / 10 minutos",
    "effect": "Por 10 min, uma vez por rodada voce pode transformar falha em save de FOR/VIG/ESP em sucesso parcial.",
    "type": "Determinacao/Protecao",
    "duration": "10 minutos",
    "number": 36
  },
  {
    "source": "primitive",
    "name": "Coracao Compartilhado",
    "cost": "11 PE",
    "range": "15m / 10 minutos",
    "effect": "Une dois aliados. Enquanto ambos estiverem conscientes, dividem cura recebida e podem trocar 3m uma vez por rodada.",
    "type": "Amor/Suporte",
    "duration": "10 minutos",
    "number": 37
  },
  {
    "source": "primitive",
    "name": "Raiva Canalizada",
    "cost": "12 PE",
    "range": "Toque / 10 minutos",
    "effect": "Canaliza raiva sem perder controle. Por 1 minuto, seus ataques causam +2 dano e nao sofrem penalidade por medo.",
    "type": "Raiva/Suporte",
    "duration": "10 minutos",
    "number": 38
  },
  {
    "source": "primitive",
    "name": "Memoria Feliz",
    "cost": "13 PE",
    "range": "9m / 10 minutos",
    "effect": "Recordacao feliz restaura foco. Aliado em 9m recupera 1 recurso gasto de custo 1-2 ou repete um teste social.",
    "type": "Alegria/Suporte",
    "duration": "10 minutos",
    "number": 39
  },
  {
    "source": "primitive",
    "name": "Eu Continuo",
    "cost": "14 PE",
    "range": "9m / 10 minutos",
    "effect": "Quando cair a 0 PV, fica com 1 PV e pode agir uma ultima vez. Depois ganha Exaustao ou custo narrativo.",
    "type": "Determinacao/Protecao",
    "duration": "10 minutos",
    "number": 40
  },
  {
    "source": "faith",
    "name": "Bencao Divina",
    "cost": "3 PD",
    "range": "9m / Instantaneo",
    "effect": "Aliado em 9m recebe +1d4 no proximo teste ou ataque. Contra morto-vivo/demonio, tambem causa 1d6 radiante.",
    "type": "Luz/Suporte",
    "duration": "Instantaneo",
    "number": 1
  },
  {
    "source": "faith",
    "name": "Cura Divina",
    "cost": "4 PD",
    "range": "Toque / Instantaneo",
    "effect": "Toque cura 1d6+Mod.DEV PV e remove sangramento, veneno fraco ou corrupcao menor.",
    "type": "Luz/Cura",
    "duration": "Instantaneo",
    "number": 2
  },
  {
    "source": "faith",
    "name": "Palavra Sagrada",
    "cost": "2 PD",
    "range": "9m raio / Instantaneo",
    "effect": "Declare uma ordem simples de ate 3 palavras. DEV/ESP CD 12 nega; nao obriga autodestruicao.",
    "type": "Ordem/Controle",
    "duration": "Instantaneo",
    "number": 3
  },
  {
    "source": "faith",
    "name": "Obscurecer",
    "cost": "3 PD",
    "range": "18m / Instantaneo",
    "effect": "Area de 4,5m escurece por 1 minuto. Aliados ganham +1 em Furtividade; luz forte dissipa.",
    "type": "Sombra/Utilitario",
    "duration": "Instantaneo",
    "number": 4
  },
  {
    "source": "faith",
    "name": "Comunhao com Animais",
    "cost": "4 PD",
    "range": "Pessoal / Instantaneo",
    "effect": "Conversa com animal por 10 min. Pode pedir ajuda simples; animal hostil exige Natureza ou DEV CD 12.",
    "type": "Natureza/Utilitario",
    "duration": "Instantaneo",
    "number": 5
  },
  {
    "source": "faith",
    "name": "Toque da Morte",
    "cost": "2 PD",
    "range": "12m / Instantaneo",
    "effect": "Toque causa 1d6+Mod.DEV necrotico e impede o alvo de recuperar PV ate o inicio do seu proximo turno.",
    "type": "Morte/Ataque",
    "duration": "Instantaneo",
    "number": 6
  },
  {
    "source": "faith",
    "name": "Explosao Caotica",
    "cost": "3 PD",
    "range": "24m / Instantaneo",
    "effect": "Disparo caotico causa 1d6 de tipo aleatorio. Em 6 no dado de dano, salta para outro alvo a 3m.",
    "type": "Caos/Ataque",
    "duration": "Instantaneo",
    "number": 7
  },
  {
    "source": "faith",
    "name": "Maldicao",
    "cost": "4 PD",
    "range": "9m / Instantaneo",
    "effect": "Alvo faz DEV CD 12 ou sofre -1 em ataques e testes sociais por 1 minuto. Nova falha amplia para -2.",
    "type": "Sombra/Debuff",
    "duration": "Instantaneo",
    "number": 8
  },
  {
    "source": "faith",
    "name": "Raio Sagrado",
    "cost": "2 PD",
    "range": "Toque / Instantaneo",
    "effect": "Raio a 18m causa 1d6+Mod.DEV radiante. Mortos-vivos e demonios nao reduzem esse dano.",
    "type": "Luz/Ataque",
    "duration": "Instantaneo",
    "number": 9
  },
  {
    "source": "faith",
    "name": "Barreira Sagrada",
    "cost": "3 PD",
    "range": "9m raio / Instantaneo",
    "effect": "Barreira em aliado concede +2 Aparar contra o proximo ataque e ilumina criaturas invisiveis adjacentes.",
    "type": "Luz/Protecao",
    "duration": "Instantaneo",
    "number": 10
  },
  {
    "source": "faith",
    "name": "Invocar Aliado Menor",
    "cost": "7 PD",
    "range": "18m / 1 minuto",
    "effect": "Invoca aliado espiritual menor com 10 PV, CA 12 e dano 1d6. Comandar exige acao bonus.",
    "type": "Invocacao/Suporte",
    "duration": "1 minuto",
    "number": 11
  },
  {
    "source": "faith",
    "name": "Tempestade Divina",
    "cost": "4 PD",
    "range": "Pessoal / 1 minuto",
    "effect": "Tempestade em area de 3m causa 2d6 radiante/trovao. AGI CD 13 reduz metade.",
    "type": "Luz/Ataque",
    "duration": "1 minuto",
    "number": 12
  },
  {
    "source": "faith",
    "name": "Decretar",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Decreto fixa uma regra curta na cena. Quem quebrar faz DEV CD 13 ou perde a reacao e sofre 1d6 radiante.",
    "type": "Ordem/Controle",
    "duration": "1 minuto",
    "number": 13
  },
  {
    "source": "faith",
    "name": "Cura em Area",
    "cost": "6 PD",
    "range": "24m / 1 minuto",
    "effect": "Ate 3 aliados em 6m recuperam 2d6 PV divididos como voce escolher.",
    "type": "Luz/Cura",
    "duration": "1 minuto",
    "number": 14
  },
  {
    "source": "faith",
    "name": "Selo de Juramento",
    "cost": "7 PD",
    "range": "9m / 1 minuto",
    "effect": "Sela juramento voluntario. Enquanto cumprir, alvo ganha +1d4; se quebrar, sofre 2d6 psiquico.",
    "type": "Ordem/Suporte",
    "duration": "1 minuto",
    "number": 15
  },
  {
    "source": "faith",
    "name": "Manto de Sombras",
    "cost": "4 PD",
    "range": "Toque / 1 minuto",
    "effect": "Manto concede vantagem em Furtividade e resistencia ao proximo dano radiante ou necrotico.",
    "type": "Sombra/Protecao",
    "duration": "1 minuto",
    "number": 16
  },
  {
    "source": "faith",
    "name": "Espinhos Sagrados",
    "cost": "5 PD",
    "range": "9m raio / 1 minuto",
    "effect": "Espinhos tomam area de 4,5m. AGI CD 13 ou alvo sofre 2d6 perfurante e fica terreno dificil.",
    "type": "Natureza/Controle",
    "duration": "1 minuto",
    "number": 17
  },
  {
    "source": "faith",
    "name": "Riso do Caos",
    "cost": "6 PD",
    "range": "18m / 1 minuto",
    "effect": "Riso perturba alvo. DEV CD 13 ou ele troca de alvo aleatoriamente no proximo ataque.",
    "type": "Caos/Controle",
    "duration": "1 minuto",
    "number": 18
  },
  {
    "source": "faith",
    "name": "Marca Infernal",
    "cost": "7 PD",
    "range": "Pessoal / 1 minuto",
    "effect": "Marca alvo por 1 minuto. Primeiro aliado que o ferir causa +1d6; remover exige DEV CD 13.",
    "type": "Demonio/Debuff",
    "duration": "1 minuto",
    "number": 19
  },
  {
    "source": "faith",
    "name": "Silencio Funerario",
    "cost": "4 PD",
    "range": "12m / 1 minuto",
    "effect": "Silencio funerario em 6m impede cura verbal e comunicacao espiritual. DEV CD 13 permite agir normalmente.",
    "type": "Morte/Controle",
    "duration": "1 minuto",
    "number": 20
  },
  {
    "source": "faith",
    "name": "Forma Divina Menor",
    "cost": "8 PD",
    "range": "24m / 10 minutos",
    "effect": "Por 10 min, voce ganha deslocamento +3m, luz propria e +1 em ataques contra corrupcao.",
    "type": "Luz/Transformacao",
    "duration": "10 minutos",
    "number": 21
  },
  {
    "source": "faith",
    "name": "Praga",
    "cost": "9 PD",
    "range": "9m / 10 minutos",
    "effect": "Praga exige VIG CD 15. Falha causa 4d6 necrotico ao longo de 1 minuto e impede PV temporario.",
    "type": "Morte/Debuff",
    "duration": "10 minutos",
    "number": 22
  },
  {
    "source": "faith",
    "name": "Destruicao Sagrada",
    "cost": "10 PD",
    "range": "Toque / 10 minutos",
    "effect": "Explosao sagrada causa 4d6 radiante em 3m. Demonios/mortos-vivos fazem save com -1.",
    "type": "Luz/Ataque",
    "duration": "10 minutos",
    "number": 23
  },
  {
    "source": "faith",
    "name": "Ressurreicao",
    "cost": "11 PD",
    "range": "9m raio / 10 minutos",
    "effect": "Traz criatura morta ha pouco de volta com 1 PV se o corpo estiver inteiro. Exige componente raro ou promessa.",
    "type": "Luz/Cura",
    "duration": "10 minutos",
    "number": 24
  },
  {
    "source": "faith",
    "name": "Correntes da Ordem",
    "cost": "7 PD",
    "range": "18m / 10 minutos",
    "effect": "Correntes prendem ate 2 alvos em 9m. FOR/DEV CD 15 escapa no fim do turno.",
    "type": "Ordem/Controle",
    "duration": "10 minutos",
    "number": 25
  },
  {
    "source": "faith",
    "name": "Passagem das Almas",
    "cost": "8 PD",
    "range": "Pessoal / 10 minutos",
    "effect": "Permite falar com uma alma recente ou guiar um espirito. Mentiras exigem Intuicao CD 15 para perceber.",
    "type": "Morte/Utilitario",
    "duration": "10 minutos",
    "number": 26
  },
  {
    "source": "faith",
    "name": "Milagre Pequeno",
    "cost": "9 PD",
    "range": "12m / 10 minutos",
    "effect": "Escolha efeito menor impossivel: mover objeto, inverter sorte ou criar coincidencia. Mestre escolhe um custo leve.",
    "type": "Caos/Especial",
    "duration": "10 minutos",
    "number": 27
  },
  {
    "source": "faith",
    "name": "Circulo de Exorcismo",
    "cost": "10 PD",
    "range": "24m / 10 minutos",
    "effect": "Circulo de 6m impede entidade possuidora, demonio ou morto-vivo de entrar sem DEV CD 15.",
    "type": "Luz/Controle",
    "duration": "10 minutos",
    "number": 28
  },
  {
    "source": "faith",
    "name": "Chamado da Matilha",
    "cost": "11 PD",
    "range": "9m / 10 minutos",
    "effect": "Invoca matilha espiritual por 1 min. Uma vez por rodada, um aliado causa +1d6 ao alvo cercado.",
    "type": "Natureza/Invocacao",
    "duration": "10 minutos",
    "number": 29
  },
  {
    "source": "faith",
    "name": "Pacto Sangrento",
    "cost": "7 PD",
    "range": "Toque / 10 minutos",
    "effect": "Voce ganha poder imediato: +2 ataque ou +2 Aparar por 1 min. Depois sofre marca, divida ou dano 2d6.",
    "type": "Demonio/Especial",
    "duration": "10 minutos",
    "number": 30
  },
  {
    "source": "faith",
    "name": "Ressurreicao Total",
    "cost": "16 PD",
    "range": "9m raio / 1 hora",
    "effect": "Ressuscita criatura morta recentemente com metade dos PV. Exige ritual, componente raro e consequencia espiritual.",
    "type": "Luz/Cura",
    "duration": "1 hora",
    "number": 31
  },
  {
    "source": "faith",
    "name": "Avatar Divino Completo",
    "cost": "17 PD",
    "range": "18m / 1 hora",
    "effect": "Avatar por 1 hora: +2 Aparar, luz de 9m e imunidade a medo comum; exige concentracao moral.",
    "type": "Luz/Transformacao",
    "duration": "1 hora",
    "number": 32
  },
  {
    "source": "faith",
    "name": "Juizo Final Menor",
    "cost": "18 PD",
    "range": "Pessoal / 1 hora",
    "effect": "Juizo em area de 9m causa 8d6 radiante; DEV CD 16 reduz metade. Inocentes escolhidos sao poupados.",
    "type": "Luz/Ataque",
    "duration": "1 hora",
    "number": 33
  },
  {
    "source": "faith",
    "name": "Noite Absoluta",
    "cost": "19 PD",
    "range": "12m / 1 hora",
    "effect": "Apaga luz em 18m por 1 hora. Inimigos fazem DEV CD 16 ou ficam Cegos por 1 rodada ao entrar.",
    "type": "Sombra/Controle",
    "duration": "1 hora",
    "number": 34
  },
  {
    "source": "faith",
    "name": "Jardim Sagrado",
    "cost": "20 PD",
    "range": "24m / 1 hora",
    "effect": "Cria jardim sagrado de 9m. Aliados curam 1d6 por rodada se nao atacarem naquele turno.",
    "type": "Natureza/Suporte",
    "duration": "1 hora",
    "number": 35
  },
  {
    "source": "faith",
    "name": "Roleta do Caos",
    "cost": "12 PD",
    "range": "9m / 1 hora",
    "effect": "Role 1d6: cura, dano, teleporte curto, terreno alterado, duplicacao menor ou falha controlada pelo Mestre.",
    "type": "Caos/Especial",
    "duration": "1 hora",
    "number": 36
  },
  {
    "source": "faith",
    "name": "Contrato Maior",
    "cost": "13 PD",
    "range": "Toque / 1 hora",
    "effect": "Contrato concede efeito forte definido pelo pacto. Quebrar clausula causa dano 6d6 ou perda de recurso maximo.",
    "type": "Demonio/Especial",
    "duration": "1 hora",
    "number": 37
  },
  {
    "source": "faith",
    "name": "Ceifador Invisivel",
    "cost": "14 PD",
    "range": "9m raio / 1 hora",
    "effect": "Ceifador invisivel ataca alvo marcado: 8d6 necrotico, DEV CD 16 metade; se derrubar, impede ressurreicao menor.",
    "type": "Morte/Ataque",
    "duration": "1 hora",
    "number": 38
  },
  {
    "source": "faith",
    "name": "Voto Inquebravel",
    "cost": "15 PD",
    "range": "18m / 1 hora",
    "effect": "Voto impede que alvo voluntario seja compelido, possuido ou quebrado por medo enquanto cumprir sua promessa.",
    "type": "Ordem/Suporte",
    "duration": "1 hora",
    "number": 39
  },
  {
    "source": "faith",
    "name": "Graca Impossivel",
    "cost": "16 PD",
    "range": "Pessoal / 1 hora",
    "effect": "Milagre impossivel salva a cena: cura total, purificacao ou protecao coletiva. Exige sacrificio, promessa ou intervencao divina.",
    "type": "Luz/Especial",
    "duration": "1 hora",
    "number": 40
  },
  {
    "source": "tech",
    "name": "Cristal de Arcana",
    "cost": "Grau 1",
    "range": "Variavel / 1 uso",
    "effect": "Armazena 6 PA. Qualquer usuario pode gastar as cargas para ativar habilidade arcana conhecida. Recarrega em descanso longo.",
    "type": "Armazenamento",
    "duration": "1 uso",
    "number": 1
  },
  {
    "source": "tech",
    "name": "Bomba de Fumaca Arcana",
    "cost": "Grau 2",
    "range": "Variavel / 1 uso",
    "effect": "Consumivel; cria nuvem opaca de 6m por 1 minuto. Criaturas dentro ficam Cegas para fora; vento forte dissipa.",
    "type": "Consumivel",
    "duration": "1 uso",
    "number": 2
  },
  {
    "source": "tech",
    "name": "Eletrochoque Portatil",
    "cost": "Grau 1",
    "range": "Variavel / 1 uso",
    "effect": "Arma curta; ataque + Tecnologia ou AGI causa 1d6 raio. Contra alvo metalico causa +1 dano e corta reacao em falha VIG CD 10.",
    "type": "Arma",
    "duration": "1 uso",
    "number": 3
  },
  {
    "source": "tech",
    "name": "Adaga Sifao",
    "cost": "Grau 1",
    "range": "Variavel / 1 uso",
    "effect": "Arma leve +1. Ao acertar criatura com recurso magico, drena 1 ponto uma vez por rodada e armazena ate 3.",
    "type": "Arma",
    "duration": "1 uso",
    "number": 4
  },
  {
    "source": "tech",
    "name": "Bomba Arcana",
    "cost": "Grau 2",
    "range": "Variavel / 1 uso",
    "effect": "Consumivel; explosao de 3m causa 3d6 forca, AGI CD 12 metade. Objetos frageis sofrem dano dobrado.",
    "type": "Consumivel",
    "duration": "1 uso",
    "number": 5
  },
  {
    "source": "tech",
    "name": "Bomba Acida",
    "cost": "Grau 1",
    "range": "Variavel / 1 uso",
    "effect": "Consumivel; area de 3m sofre 2d6 acido, VIG CD 12 metade. Armadura metalica recebe -1 Aparar ate ser reparada.",
    "type": "Consumivel",
    "duration": "1 uso",
    "number": 6
  },
  {
    "source": "tech",
    "name": "Lente de Visao Arcana",
    "cost": "Grau 1",
    "range": "Variavel / 1 uso",
    "effect": "Ferramenta ocular; por 10 min revela magia, fios de energia e runas em 9m. Luz forte causa Desatento 1 rodada.",
    "type": "Ferramenta",
    "duration": "1 uso",
    "number": 7
  },
  {
    "source": "tech",
    "name": "Botas de Velocidade",
    "cost": "Grau 2",
    "range": "Variavel / 1 uso",
    "effect": "Vestimenta; 3 cargas. Gaste 1 para ganhar +6m deslocamento ou salto triplo ate o fim do turno.",
    "type": "Vestimenta",
    "duration": "1 uso",
    "number": 8
  },
  {
    "source": "tech",
    "name": "Capa de Protecao",
    "cost": "Grau 1",
    "range": "Variavel / 1 uso",
    "effect": "Vestimenta; 1 uso por descanso. Reduz 1d8 dano elemental ou arcano recebido; rasga em falha critica defensiva.",
    "type": "Vestimenta",
    "duration": "1 uso",
    "number": 9
  },
  {
    "source": "tech",
    "name": "Sentinela de Pedra",
    "cost": "Grau 1",
    "range": "Variavel / 1 uso",
    "effect": "Construto simples; 12 PV, CA 12, vigia area de 6m e golpeia por 1d6. Desliga com senha ou Tecnologia CD 10.",
    "type": "Construto",
    "duration": "1 uso",
    "number": 10
  },
  {
    "source": "tech",
    "name": "Drone Cartografo",
    "cost": "Grau 3",
    "range": "Variavel / 3 cargas",
    "effect": "Construto voador; mapeia 18m, marca portas e armadilhas mecanicas. Nao luta; faz ruido baixo constante.",
    "type": "Construto",
    "duration": "3 cargas",
    "number": 11
  },
  {
    "source": "tech",
    "name": "Luva de Repulsao",
    "cost": "Grau 2",
    "range": "Variavel / 3 cargas",
    "effect": "Ferramenta; 3 cargas. Empurra criatura/objeto medio 3m. FOR CD 12 nega; pode amortecer queda curta.",
    "type": "Ferramenta",
    "duration": "3 cargas",
    "number": 12
  },
  {
    "source": "tech",
    "name": "Mascara de Filtro Abissal",
    "cost": "Grau 2",
    "range": "Variavel / 3 cargas",
    "effect": "Vestimenta; filtra gas, fumaca e po venenoso por 10 min. Veneno magico exige Tecnologia CD 14 para ajustar.",
    "type": "Vestimenta",
    "duration": "3 cargas",
    "number": 13
  },
  {
    "source": "tech",
    "name": "Braco Hidraulico",
    "cost": "Grau 3",
    "range": "Variavel / 3 cargas",
    "effect": "Protese; trata FOR como um dado maior em teste com o braco. Em falha critica, trava ate reparo CD 14.",
    "type": "Protese",
    "duration": "3 cargas",
    "number": 14
  },
  {
    "source": "tech",
    "name": "Arpao Magnetico",
    "cost": "Grau 2",
    "range": "Variavel / 3 cargas",
    "effect": "Ferramenta; disparo puxa alvo/objeto ate 6m ou leva voce ate ponto fixo. FOR CD 12 resiste alvo vivo.",
    "type": "Ferramenta",
    "duration": "3 cargas",
    "number": 15
  },
  {
    "source": "tech",
    "name": "Granada Congelante",
    "cost": "Grau 2",
    "range": "Variavel / 3 cargas",
    "effect": "Consumivel; area de 3m vira gelo. Causa 2d6 frio e terreno dificil; AGI CD 12 evita cair.",
    "type": "Consumivel",
    "duration": "3 cargas",
    "number": 16
  },
  {
    "source": "tech",
    "name": "Seringa Vital",
    "cost": "Grau 3",
    "range": "Variavel / 3 cargas",
    "effect": "Consumivel; cura 2d6 PV ou estabiliza alvo a 0 PV. Uso repetido no mesmo descanso exige VIG CD 12 ou nausea.",
    "type": "Consumivel",
    "duration": "3 cargas",
    "number": 17
  },
  {
    "source": "tech",
    "name": "Placa Reativa",
    "cost": "Grau 2",
    "range": "Variavel / 3 cargas",
    "effect": "Armadura; 3 cargas. Reacao reduz dano fisico em 1d8 e empurra atacante corpo a corpo 1,5m.",
    "type": "Armadura",
    "duration": "3 cargas",
    "number": 18
  },
  {
    "source": "tech",
    "name": "Projetor de Luz Solar",
    "cost": "Grau 2",
    "range": "Variavel / 3 cargas",
    "effect": "Ferramenta; cone de luz solar 9m revela invisibilidade e causa 1d6 radiante a mortos-vivos ou sombras.",
    "type": "Ferramenta",
    "duration": "3 cargas",
    "number": 19
  },
  {
    "source": "tech",
    "name": "Chave Universal Runica",
    "cost": "Grau 3",
    "range": "Variavel / 3 cargas",
    "effect": "Ferramenta; abre fechaduras comuns automaticamente. Trancas magicas exigem Tecnologia CD 14 e gastam 2 cargas.",
    "type": "Ferramenta",
    "duration": "3 cargas",
    "number": 20
  },
  {
    "source": "tech",
    "name": "Mochila Gravitacional",
    "cost": "Grau 3",
    "range": "Variavel / Permanente",
    "effect": "Equipamento; 3 cargas. Flutua por 1 min ou reduz dano de queda a zero. Carga pesada reduz duracao pela metade.",
    "type": "Equipamento",
    "duration": "Permanente",
    "number": 21
  },
  {
    "source": "tech",
    "name": "Gerador de Barreira",
    "cost": "Grau 3",
    "range": "Variavel / Permanente",
    "effect": "Dispositivo; cria barreira de 3m com 18 PV e CA 13. Quebra ao absorver dano maximo ou apos 1 minuto.",
    "type": "Dispositivo",
    "duration": "Permanente",
    "number": 22
  },
  {
    "source": "tech",
    "name": "Automato Cirurgiao",
    "cost": "Grau 4",
    "range": "Variavel / Permanente",
    "effect": "Construto; auxiliar medico com 16 PV. Em combate, estabiliza ou cura 1d6; fora dele concede +2 Medicina.",
    "type": "Construto",
    "duration": "Permanente",
    "number": 23
  },
  {
    "source": "tech",
    "name": "Armadilha de Bobina",
    "cost": "Grau 3",
    "range": "Variavel / Permanente",
    "effect": "Armadilha; bobina em 3m causa 3d6 raio, AGI CD 14 metade. Pode ser escondida com Furtividade/Tecnologia.",
    "type": "Armadilha",
    "duration": "Permanente",
    "number": 24
  },
  {
    "source": "tech",
    "name": "Mina de Silencio",
    "cost": "Grau 3",
    "range": "Variavel / Permanente",
    "effect": "Armadilha; area de 3m fica silenciosa por 1 min. Criaturas no centro fazem DEV CD 14 para usar magia verbal.",
    "type": "Armadilha",
    "duration": "Permanente",
    "number": 25
  },
  {
    "source": "tech",
    "name": "Oculos de Predicao",
    "cost": "Grau 4",
    "range": "Variavel / Permanente",
    "effect": "Ferramenta; por 10 min antecipa trajetoria. Uma vez por rodada, +1 Aparar ou +1 ataque a distancia.",
    "type": "Ferramenta",
    "duration": "Permanente",
    "number": 26
  },
  {
    "source": "tech",
    "name": "Motor de Ponte Dobravel",
    "cost": "Grau 3",
    "range": "Variavel / Permanente",
    "effect": "Estrutura portatil; cria ponte de ate 9m por 10 min. Suporta 4 criaturas medias; colapso exige AGI CD 14.",
    "type": "Estrutura",
    "duration": "Permanente",
    "number": 27
  },
  {
    "source": "tech",
    "name": "Gaiola de Contencao",
    "cost": "Grau 3",
    "range": "Variavel / Permanente",
    "effect": "Estrutura; prende alvo grande ou menor. FOR CD 14 escapa; criaturas presas sofrem -2 ataques.",
    "type": "Estrutura",
    "duration": "Permanente",
    "number": 28
  },
  {
    "source": "tech",
    "name": "Pistola de Cristal",
    "cost": "Grau 4",
    "range": "Variavel / Permanente",
    "effect": "Arma; tiro cristalino 1d10+INT perfurante/forca, alcance 18m. Superaquece em 1 no d20.",
    "type": "Arma",
    "duration": "Permanente",
    "number": 29
  },
  {
    "source": "tech",
    "name": "Rede Eletrorrunica",
    "cost": "Grau 3",
    "range": "Variavel / Permanente",
    "effect": "Arma; rede em cone curto prende ate 2 alvos. AGI CD 14 evita; alvo preso perde reacao.",
    "type": "Arma",
    "duration": "Permanente",
    "number": 30
  },
  {
    "source": "tech",
    "name": "Coracao Mecanico Auxiliar",
    "cost": "Grau 4",
    "range": "Variavel / Recarga longa",
    "effect": "Protese interna; uma vez por descanso, ao cair a 0 PV fica com 1 PV. Depois exige manutencao CD 16.",
    "type": "Protese",
    "duration": "Recarga longa",
    "number": 31
  },
  {
    "source": "tech",
    "name": "Bateria Prismatica",
    "cost": "Grau 5",
    "range": "Variavel / Recarga longa",
    "effect": "Armazenamento; guarda ate 10 pontos de qualquer recurso magico. Instavel se misturar fontes opostas sem teste CD 16.",
    "type": "Armazenamento",
    "duration": "Recarga longa",
    "number": 32
  },
  {
    "source": "tech",
    "name": "Canhao Portatil",
    "cost": "Grau 4",
    "range": "Variavel / Recarga longa",
    "effect": "Arma pesada; ataque em linha 18m causa 4d6 impacto, AGI CD 16 metade. Recarrega em descanso longo/oficina.",
    "type": "Arma",
    "duration": "Recarga longa",
    "number": 33
  },
  {
    "source": "tech",
    "name": "Campo Estabilizador",
    "cost": "Grau 4",
    "range": "Variavel / Recarga longa",
    "effect": "Dispositivo; por 1 min, aliados em 3m recebem +1 Aparar e vantagem contra empurrao/queda.",
    "type": "Dispositivo",
    "duration": "Recarga longa",
    "number": 34
  },
  {
    "source": "tech",
    "name": "Sonda de Veneno",
    "cost": "Grau 5",
    "range": "Variavel / Recarga longa",
    "effect": "Ferramenta; identifica veneno, doenca ou toxina em 1 rodada. Pode neutralizar veneno grau 2 ou menor com teste CD 16.",
    "type": "Ferramenta",
    "duration": "Recarga longa",
    "number": 35
  },
  {
    "source": "tech",
    "name": "Corda Autonoma",
    "cost": "Grau 4",
    "range": "Variavel / Recarga longa",
    "effect": "Ferramenta; corda move-se sozinha ate 15m, amarra, escala ou resgata. Alvo hostil resiste com AGI CD 16.",
    "type": "Ferramenta",
    "duration": "Recarga longa",
    "number": 36
  },
  {
    "source": "tech",
    "name": "Selo Rastreador",
    "cost": "Grau 4",
    "range": "Variavel / Recarga longa",
    "effect": "Dispositivo; marca alvo/objeto por 24h. Voce sabe direcao e distancia enquanto estiver no mesmo plano/regiao.",
    "type": "Dispositivo",
    "duration": "Recarga longa",
    "number": 37
  },
  {
    "source": "tech",
    "name": "Armadura de Exoesqueleto",
    "cost": "Grau 5",
    "range": "Variavel / Recarga longa",
    "effect": "Armadura; por 1 min, FOR conta um dado maior, +2 Aparar contra fisico e deslocamento -3m.",
    "type": "Armadura",
    "duration": "Recarga longa",
    "number": 38
  },
  {
    "source": "tech",
    "name": "Portal de Oficina",
    "cost": "Grau 4",
    "range": "Variavel / Recarga longa",
    "effect": "Estrutura; abre acesso temporario a uma oficina segura. Permite reparo rapido e recarga de 1 item por descanso longo.",
    "type": "Estrutura",
    "duration": "Recarga longa",
    "number": 39
  },
  {
    "source": "tech",
    "name": "Nucleo de Golem",
    "cost": "Grau 4",
    "range": "Variavel / Recarga longa",
    "effect": "Construto; nucleo anima golem pequeno por 1 hora. Sem comando claro, protege o criador e evita dano colateral.",
    "type": "Construto",
    "duration": "Recarga longa",
    "number": 40
  },
  {
    "source": "aura",
    "name": "Golpe de Aura",
    "cost": "2 AU",
    "range": "Pessoal / Instantaneo",
    "effect": "Ao acertar ataque corpo a corpo, gaste AU para causar +1d6 aura e empurrar 1,5m; FOR CD 12 evita empurrao.",
    "type": "Ataque",
    "duration": "Instantaneo",
    "number": 1
  },
  {
    "source": "aura",
    "name": "Passo de Cacador",
    "cost": "1 AU",
    "range": "9m / Instantaneo",
    "effect": "Move ate 9m por terreno dificil sem provocar reacao. Se terminar oculto, ganha +1 no proximo ataque.",
    "type": "Movimento",
    "duration": "Instantaneo",
    "number": 2
  },
  {
    "source": "aura",
    "name": "Leitura de Aura",
    "cost": "2 AU",
    "range": "6m / Instantaneo",
    "effect": "Le uma assinatura espiritual em 6m: intencao hostil, medo ou rastro recente. Alvo oculto resiste com ESP CD 12.",
    "type": "Percepcao",
    "duration": "Instantaneo",
    "number": 3
  },
  {
    "source": "aura",
    "name": "Pulso de Intencao",
    "cost": "1 AU",
    "range": "3m raio / Instantaneo",
    "effect": "Pulso em 3m revela criaturas escondidas e corta vantagem de emboscada por 1 rodada; ESP CD 12 oculta presenca.",
    "type": "Defesa",
    "duration": "Instantaneo",
    "number": 4
  },
  {
    "source": "aura",
    "name": "Pele de Ferro",
    "cost": "2 AU",
    "range": "12m / Instantaneo",
    "effect": "Reacao; reduz dano fisico em 1d6+VIG e ganha +1 Aparar ate o inicio do proximo turno.",
    "type": "Controle",
    "duration": "Instantaneo",
    "number": 5
  },
  {
    "source": "aura",
    "name": "Aura Protetora",
    "cost": "1 AU",
    "range": "Corpo a corpo / Instantaneo",
    "effect": "Aliado corpo a corpo recebe 1d6 PV temporarios e +1 em save de FOR/VIG ate o fim da rodada.",
    "type": "Suporte",
    "duration": "Instantaneo",
    "number": 6
  },
  {
    "source": "aura",
    "name": "Salto Impossivel",
    "cost": "2 AU",
    "range": "Pessoal / Instantaneo",
    "effect": "Salta ate 6m vertical/horizontal sem provocar reacao. Se cair sobre alvo, AGI CD 12 evita ficar Caido.",
    "type": "Reacao",
    "duration": "Instantaneo",
    "number": 7
  },
  {
    "source": "aura",
    "name": "Foco Marcial",
    "cost": "1 AU",
    "range": "9m / Instantaneo",
    "effect": "Concentra postura. Seu proximo ataque antes do fim do turno recebe +1d6 dano ou ignora cobertura leve.",
    "type": "Especial",
    "duration": "Instantaneo",
    "number": 8
  },
  {
    "source": "aura",
    "name": "Rugido de Guerra",
    "cost": "2 AU",
    "range": "6m / Instantaneo",
    "effect": "Criaturas inimigas em 6m fazem ESP CD 12 ou perdem reacao. Aliados que ouvirem ganham +1 no proximo ataque.",
    "type": "Ataque",
    "duration": "Instantaneo",
    "number": 9
  },
  {
    "source": "aura",
    "name": "Veu de Presenca",
    "cost": "1 AU",
    "range": "3m raio / Instantaneo",
    "effect": "Disfarca sua pressao vital por 1 min. Percepcao espiritual contra voce sofre -2; atacar encerra o efeito.",
    "type": "Movimento",
    "duration": "Instantaneo",
    "number": 10
  },
  {
    "source": "aura",
    "name": "Contra-Ataque",
    "cost": "4 AU",
    "range": "12m / 1 rodada",
    "effect": "Reacao apos inimigo errar corpo a corpo: ataque de resposta causa +2d6 aura se acertar.",
    "type": "Percepcao",
    "duration": "1 rodada",
    "number": 11
  },
  {
    "source": "aura",
    "name": "Marca Animica",
    "cost": "2 AU",
    "range": "Corpo a corpo / 1 rodada",
    "effect": "Marca alvo tocado por 1 rodada. Voce sabe onde ele esta em 18m e seu primeiro ataque contra ele ganha +1.",
    "type": "Defesa",
    "duration": "1 rodada",
    "number": 12
  },
  {
    "source": "aura",
    "name": "Investida de Aura",
    "cost": "3 AU",
    "range": "Pessoal / 1 rodada",
    "effect": "Avanca 9m em linha reta. Primeiro alvo no caminho sofre 2d6 aura e FOR CD 13 ou e empurrado 3m.",
    "type": "Controle",
    "duration": "1 rodada",
    "number": 13
  },
  {
    "source": "aura",
    "name": "Respiracao Profunda",
    "cost": "4 AU",
    "range": "9m / 1 rodada",
    "effect": "Acalma corpo e mente. Recupera 1 AU ou ganha +2 no proximo save; nao pode recuperar AU mais de 1 vez por combate.",
    "type": "Suporte",
    "duration": "1 rodada",
    "number": 14
  },
  {
    "source": "aura",
    "name": "Olhos de Combate",
    "cost": "2 AU",
    "range": "6m / 1 rodada",
    "effect": "Por 1 rodada, voce nao pode ser surpreendido e ganha +2 Aparar contra o primeiro ataque a distancia.",
    "type": "Reacao",
    "duration": "1 rodada",
    "number": 15
  },
  {
    "source": "aura",
    "name": "Postura Inabalavel",
    "cost": "3 AU",
    "range": "3m raio / 1 rodada",
    "effect": "Postura concede +2 Aparar e vantagem contra empurrao/queda por 1 rodada. Voce nao pode correr enquanto mantem.",
    "type": "Especial",
    "duration": "1 rodada",
    "number": 16
  },
  {
    "source": "aura",
    "name": "Lamina Espiritual",
    "cost": "4 AU",
    "range": "12m / 1 rodada",
    "effect": "Sua arma ganha alcance espiritual de 3m e +2d6 aura no proximo acerto. Alvo incorporeo nao ignora o dano.",
    "type": "Ataque",
    "duration": "1 rodada",
    "number": 17
  },
  {
    "source": "aura",
    "name": "Surto de Aura",
    "cost": "2 AU",
    "range": "Corpo a corpo / 1 rodada",
    "effect": "Apos acertar, mova 3m sem provocar reacao e cause +2d6 aura se terminar adjacente a outro inimigo.",
    "type": "Movimento",
    "duration": "1 rodada",
    "number": 18
  },
  {
    "source": "aura",
    "name": "Quebra de Guarda",
    "cost": "3 AU",
    "range": "Pessoal / 1 rodada",
    "effect": "Ataque contra guarda. Se acertar, causa +2d6 aura e o alvo perde bonus de escudo/Aparar ate o proximo turno.",
    "type": "Percepcao",
    "duration": "1 rodada",
    "number": 19
  },
  {
    "source": "aura",
    "name": "Escudo de Espirito",
    "cost": "4 AU",
    "range": "9m / 1 rodada",
    "effect": "Escudo espiritual em aliado a 9m reduz 2d6 dano recebido e impede que seja empurrado nesta rodada.",
    "type": "Defesa",
    "duration": "1 rodada",
    "number": 20
  },
  {
    "source": "aura",
    "name": "Explosao de Chi",
    "cost": "4 AU",
    "range": "6m / 1 minuto",
    "effect": "Explosao em 3m causa 4d6 aura; FOR/VIG CD 15 metade e evita ficar Caido.",
    "type": "Controle",
    "duration": "1 minuto",
    "number": 21
  },
  {
    "source": "aura",
    "name": "Passo Entre Golpes",
    "cost": "5 AU",
    "range": "3m raio / 1 minuto",
    "effect": "Quando inimigo erra voce, mova ate 3m e um aliado adjacente pode mover 3m sem provocar reacao.",
    "type": "Suporte",
    "duration": "1 minuto",
    "number": 22
  },
  {
    "source": "aura",
    "name": "Grito Despertador",
    "cost": "6 AU",
    "range": "12m / 1 minuto",
    "effect": "Aliado em 12m repete um save contra medo, charme ou queda. Se passar, recebe 1d6 PV temporarios.",
    "type": "Reacao",
    "duration": "1 minuto",
    "number": 23
  },
  {
    "source": "aura",
    "name": "Maos que Prendem",
    "cost": "3 AU",
    "range": "Corpo a corpo / 1 minuto",
    "effect": "Ao agarrar alvo, causa 4d6 aura ao longo da tecnica; FOR CD 15 escapa no fim do turno.",
    "type": "Especial",
    "duration": "1 minuto",
    "number": 24
  },
  {
    "source": "aura",
    "name": "Aura Cortante",
    "cost": "4 AU",
    "range": "Pessoal / 1 minuto",
    "effect": "Corte em arco atinge ate 2 alvos adjacentes. Cada um sofre 4d6 aura; AGI CD 15 reduz metade.",
    "type": "Ataque",
    "duration": "1 minuto",
    "number": 25
  },
  {
    "source": "aura",
    "name": "Corpo Sem Peso",
    "cost": "5 AU",
    "range": "9m / 1 minuto",
    "effect": "Por 1 min, ignora terreno dificil, pode andar sobre agua curta e recebe +2 em Acrobacia.",
    "type": "Movimento",
    "duration": "1 minuto",
    "number": 26
  },
  {
    "source": "aura",
    "name": "Instinto de Sobrevivencia",
    "cost": "6 AU",
    "range": "6m / 1 minuto",
    "effect": "Quando cair abaixo de metade dos PV, detecta a criatura mais perigosa em 12m e ganha +2 no proximo save.",
    "type": "Percepcao",
    "duration": "1 minuto",
    "number": 27
  },
  {
    "source": "aura",
    "name": "Punho Sismico",
    "cost": "3 AU",
    "range": "3m raio / 1 minuto",
    "effect": "Golpe no solo causa 4d6 aura em 3m e transforma area em terreno dificil por 1 rodada.",
    "type": "Defesa",
    "duration": "1 minuto",
    "number": 28
  },
  {
    "source": "aura",
    "name": "Corte de Vento",
    "cost": "4 AU",
    "range": "12m / 1 minuto",
    "effect": "Corte a distancia de 12m causa 2d6 aura e permite mover 3m. AGI CD 15 evita o deslocamento forcado.",
    "type": "Controle",
    "duration": "1 minuto",
    "number": 29
  },
  {
    "source": "aura",
    "name": "Determinacao Feroz",
    "cost": "5 AU",
    "range": "Corpo a corpo / 1 minuto",
    "effect": "Por 1 min, enquanto estiver consciente, recebe +2 em saves de VIG e reduz em 1 todo dano recebido.",
    "type": "Suporte",
    "duration": "1 minuto",
    "number": 30
  },
  {
    "source": "aura",
    "name": "Lenda Marcial",
    "cost": "8 AU",
    "range": "Pessoal / 10 minutos",
    "effect": "Por 10 min, uma vez por rodada adicione +8d6 aura a um ataque. Cada uso apos o primeiro causa 1 nivel de Exaustao leve.",
    "type": "Reacao",
    "duration": "10 minutos",
    "number": 31
  },
  {
    "source": "aura",
    "name": "Campo de Duelo",
    "cost": "5 AU",
    "range": "9m / 10 minutos",
    "effect": "Cria zona de duelo de 9m. Voce e o alvo nao sofrem interferencia externa sem FOR/ESP CD 16.",
    "type": "Especial",
    "duration": "10 minutos",
    "number": 32
  },
  {
    "source": "aura",
    "name": "Muralha Humana",
    "cost": "6 AU",
    "range": "6m / 10 minutos",
    "effect": "Aliados atras de voce recebem meia cobertura. Voce absorve ate 8d6 dano distribuido entre eles.",
    "type": "Ataque",
    "duration": "10 minutos",
    "number": 33
  },
  {
    "source": "aura",
    "name": "Impacto Ascendente",
    "cost": "7 AU",
    "range": "3m raio / 10 minutos",
    "effect": "Uppercut espiritual causa 8d6 aura e arremessa alvo 3m para cima; VIG CD 16 reduz metade e evita queda.",
    "type": "Movimento",
    "duration": "10 minutos",
    "number": 34
  },
  {
    "source": "aura",
    "name": "Cacada Perfeita",
    "cost": "8 AU",
    "range": "12m / 10 minutos",
    "effect": "Por 10 min, escolhe uma presa. Contra ela, ganha +2 Percepcao, ignora cobertura leve e move +3m.",
    "type": "Percepcao",
    "duration": "10 minutos",
    "number": 35
  },
  {
    "source": "aura",
    "name": "Anular Dor",
    "cost": "5 AU",
    "range": "Corpo a corpo / 10 minutos",
    "effect": "Reacao; ignora a condicao Caido, Atordoado leve ou dor incapacitante por 1 rodada. Depois sofre -1 em VIG ate descanso.",
    "type": "Defesa",
    "duration": "10 minutos",
    "number": 36
  },
  {
    "source": "aura",
    "name": "Tempestade de Golpes",
    "cost": "6 AU",
    "range": "Pessoal / 10 minutos",
    "effect": "Realiza ate 3 ataques contra alvos diferentes; distribua 8d6 aura entre os acertos.",
    "type": "Controle",
    "duration": "10 minutos",
    "number": 37
  },
  {
    "source": "aura",
    "name": "Espirito Indomavel",
    "cost": "7 AU",
    "range": "9m / 10 minutos",
    "effect": "Por 10 min, quando cair a 0 PV, fica com 1 PV uma vez e emite onda que empurra inimigos 3m.",
    "type": "Suporte",
    "duration": "10 minutos",
    "number": 38
  },
  {
    "source": "aura",
    "name": "Romper Encantamento",
    "cost": "8 AU",
    "range": "6m / 10 minutos",
    "effect": "Ao atingir efeito magico ativo, causa 8d6 aura ao conjurador ou objeto e testa FOR/ESP CD 16 para dissipar.",
    "type": "Reacao",
    "duration": "10 minutos",
    "number": 39
  },
  {
    "source": "aura",
    "name": "Avatar de Aura",
    "cost": "5 AU",
    "range": "3m raio / 10 minutos",
    "effect": "Assume forma de aura por 10 min: +2 Aparar, deslocamento +3m, ataques causam +1d6, e sua presenca e impossivel de ocultar.",
    "type": "Especial",
    "duration": "10 minutos",
    "number": 40
  },
  // BEGIN EXPANSAO SENSIENTE DEVOTO
  {
    "source": "primitive",
    "name": "Impacto Furioso",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Impacto Furioso canaliza furia em alvo no alcance. Causa 2d6+Mod.ESP fogo ou psiquico; VIG CD 14 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno.",
    "type": "Raiva/Ataque",
    "duration": "1 minuto",
    "number": 41
  },
  {
    "source": "primitive",
    "name": "Centelha Vingativa",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Centelha Vingativa canaliza furia em alvo no alcance. Causa 2d6+Mod.ESP fogo ou psiquico; VIG CD 14 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno.",
    "type": "Raiva/Ataque",
    "duration": "1 minuto",
    "number": 42
  },
  {
    "source": "primitive",
    "name": "Ruptura da Furia",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Ruptura da Furia canaliza furia em alvo no alcance. Causa 2d6+Mod.ESP fogo ou psiquico; VIG CD 14 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno.",
    "type": "Raiva/Ataque",
    "duration": "1 minuto",
    "number": 43
  },
  {
    "source": "primitive",
    "name": "Brasa Persistente",
    "cost": "5 PE",
    "range": "18m / 1 rodada",
    "effect": "Brasa Persistente canaliza furia em alvo no alcance. Causa 2d6+Mod.ESP fogo ou psiquico; VIG CD 14 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno.",
    "type": "Raiva/Ataque",
    "duration": "1 rodada",
    "number": 44
  },
  {
    "source": "primitive",
    "name": "Martelo Emocional",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Martelo Emocional canaliza furia em alvo no alcance. Causa 3d6+Mod.ESP fogo ou psiquico; VIG CD 15 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno. Em Aumento, o efeito secundario dura +1 rodada.",
    "type": "Raiva/Ataque",
    "duration": "1 rodada",
    "number": 45
  },
  {
    "source": "primitive",
    "name": "Fagulha de Retorno",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Fagulha de Retorno canaliza furia em alvo no alcance. Causa 3d6+Mod.ESP fogo ou psiquico; VIG CD 15 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno. Em Aumento, o efeito secundario dura +1 rodada.",
    "type": "Raiva/Ataque",
    "duration": "1 rodada",
    "number": 46
  },
  {
    "source": "primitive",
    "name": "Cicatriz Rubra",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Cicatriz Rubra canaliza furia em alvo no alcance. Causa 3d6+Mod.ESP fogo ou psiquico; VIG CD 15 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno. Em Aumento, o efeito secundario dura +1 rodada.",
    "type": "Raiva/Ataque",
    "duration": "1 rodada",
    "number": 47
  },
  {
    "source": "primitive",
    "name": "Avanco Irado",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Avanco Irado canaliza furia em alvo no alcance. Causa 3d6+Mod.ESP fogo ou psiquico; VIG CD 15 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno. Em Aumento, o efeito secundario dura +1 rodada.",
    "type": "Raiva/Ataque",
    "duration": "1 rodada",
    "number": 48
  },
  {
    "source": "primitive",
    "name": "Forno Interior",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Forno Interior canaliza furia em alvo no alcance. Causa 3d6+Mod.ESP fogo ou psiquico; VIG CD 15 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno. Em Aumento, o efeito secundario dura +1 rodada.",
    "type": "Raiva/Ataque",
    "duration": "1 rodada",
    "number": 49
  },
  {
    "source": "primitive",
    "name": "Quebra de Guarda",
    "cost": "7 PE",
    "range": "24m / 10 minutos",
    "effect": "Quebra de Guarda canaliza furia em alvo no alcance. Causa 3d6+Mod.ESP fogo ou psiquico; VIG CD 15 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno. Em Aumento, o efeito secundario dura +1 rodada.",
    "type": "Raiva/Ataque",
    "duration": "10 minutos",
    "number": 50
  },
  {
    "source": "primitive",
    "name": "Marca do Agravo",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Marca do Agravo canaliza furia em alvo no alcance. Causa 3d6+Mod.ESP fogo ou psiquico; VIG CD 15 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno. Em Aumento, o efeito secundario dura +1 rodada.",
    "type": "Raiva/Ataque",
    "duration": "10 minutos",
    "number": 51
  },
  {
    "source": "primitive",
    "name": "Explosao de Temperamento",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Explosao de Temperamento canaliza furia em alvo no alcance. Causa 3d6+Mod.ESP fogo ou psiquico; VIG CD 15 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno. Em Aumento, o efeito secundario dura +1 rodada.",
    "type": "Raiva/Ataque",
    "duration": "10 minutos",
    "number": 52
  },
  {
    "source": "primitive",
    "name": "Ultimato Flamejante",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Ultimato Flamejante canaliza furia em alvo no alcance. Causa 3d6+Mod.ESP fogo ou psiquico; VIG CD 15 reduz metade. Em falha, o alvo tambem e empurrado 3m ou sofre -1 Defesa ate o inicio do seu proximo turno. Em Aumento, o efeito secundario dura +1 rodada.",
    "type": "Raiva/Ataque",
    "duration": "10 minutos",
    "number": 53
  },
  {
    "source": "primitive",
    "name": "Chama Fraterna",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Chama Fraterna restaura ou protege um aliado no alcance. Cura 2d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "1 minuto",
    "number": 54
  },
  {
    "source": "primitive",
    "name": "Promessa Viva",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Promessa Viva restaura ou protege um aliado no alcance. Cura 2d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "1 minuto",
    "number": 55
  },
  {
    "source": "primitive",
    "name": "Cicatriz Fechada",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Cicatriz Fechada restaura ou protege um aliado no alcance. Cura 2d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "1 minuto",
    "number": 56
  },
  {
    "source": "primitive",
    "name": "Escudo do Afeto",
    "cost": "5 PE",
    "range": "18m / 1 rodada",
    "effect": "Escudo do Afeto restaura ou protege um aliado no alcance. Cura 2d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "1 rodada",
    "number": 57
  },
  {
    "source": "primitive",
    "name": "Memoria de Lar",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Memoria de Lar restaura ou protege um aliado no alcance. Cura 3d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "1 rodada",
    "number": 58
  },
  {
    "source": "primitive",
    "name": "Cura Partilhada",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Cura Partilhada restaura ou protege um aliado no alcance. Cura 3d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "1 rodada",
    "number": 59
  },
  {
    "source": "primitive",
    "name": "Luz do Encontro",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Luz do Encontro restaura ou protege um aliado no alcance. Cura 3d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "1 rodada",
    "number": 60
  },
  {
    "source": "primitive",
    "name": "Alianca de Pele",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Alianca de Pele restaura ou protege um aliado no alcance. Cura 3d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "1 rodada",
    "number": 61
  },
  {
    "source": "primitive",
    "name": "Selo de Carinho",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Selo de Carinho restaura ou protege um aliado no alcance. Cura 3d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "1 rodada",
    "number": 62
  },
  {
    "source": "primitive",
    "name": "Manto de Saudade",
    "cost": "7 PE",
    "range": "24m / 10 minutos",
    "effect": "Manto de Saudade restaura ou protege um aliado no alcance. Cura 3d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "10 minutos",
    "number": 63
  },
  {
    "source": "primitive",
    "name": "Coracao Aberto",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Coracao Aberto restaura ou protege um aliado no alcance. Cura 3d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "10 minutos",
    "number": 64
  },
  {
    "source": "primitive",
    "name": "Resgate Afetivo",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Resgate Afetivo restaura ou protege um aliado no alcance. Cura 3d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "10 minutos",
    "number": 65
  },
  {
    "source": "primitive",
    "name": "Milagre do Abrigo",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Milagre do Abrigo restaura ou protege um aliado no alcance. Cura 3d6+Mod.ESP PV ou concede o mesmo valor em PV temporarios. Se o alvo estiver abaixo de metade dos PV, remove Abalado, Assustado ou Sangramento leve.",
    "type": "Amor/Cura",
    "duration": "10 minutos",
    "number": 66
  },
  {
    "source": "primitive",
    "name": "Fenda do Panico",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Fenda do Panico projeta uma ameaca intima. Um alvo faz ESP CD 14; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 minuto",
    "number": 67
  },
  {
    "source": "primitive",
    "name": "Olhar de Ruina",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Olhar de Ruina projeta uma ameaca intima. Um alvo faz ESP CD 14; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 minuto",
    "number": 68
  },
  {
    "source": "primitive",
    "name": "Tremor Interno",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Tremor Interno projeta uma ameaca intima. Um alvo faz ESP CD 14; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 minuto",
    "number": 69
  },
  {
    "source": "primitive",
    "name": "Noite Subita",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Noite Subita projeta uma ameaca intima. Um alvo faz ESP CD 14; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 minuto",
    "number": 70
  },
  {
    "source": "primitive",
    "name": "Trava de Instinto",
    "cost": "5 PE",
    "range": "18m / 1 rodada",
    "effect": "Trava de Instinto projeta uma ameaca intima. Um alvo faz ESP CD 14; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 rodada",
    "number": 71
  },
  {
    "source": "primitive",
    "name": "Pressao do Abismo",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Pressao do Abismo projeta uma ameaca intima. Um alvo faz ESP CD 15; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 rodada",
    "number": 72
  },
  {
    "source": "primitive",
    "name": "Silhueta Final",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Silhueta Final projeta uma ameaca intima. Um alvo faz ESP CD 15; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 rodada",
    "number": 73
  },
  {
    "source": "primitive",
    "name": "Respiracao Presa",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Respiracao Presa projeta uma ameaca intima. Um alvo faz ESP CD 15; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 rodada",
    "number": 74
  },
  {
    "source": "primitive",
    "name": "Gatilho de Fuga",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Gatilho de Fuga projeta uma ameaca intima. Um alvo faz ESP CD 15; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 rodada",
    "number": 75
  },
  {
    "source": "primitive",
    "name": "Ameaça Sem Rosto",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Ameaça Sem Rosto projeta uma ameaca intima. Um alvo faz ESP CD 15; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "1 rodada",
    "number": 76
  },
  {
    "source": "primitive",
    "name": "Medula Fria",
    "cost": "7 PE",
    "range": "24m / 10 minutos",
    "effect": "Medula Fria projeta uma ameaca intima. Um alvo faz ESP CD 15; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "10 minutos",
    "number": 77
  },
  {
    "source": "primitive",
    "name": "Som Atrás da Porta",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Som Atrás da Porta projeta uma ameaca intima. Um alvo faz ESP CD 15; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "10 minutos",
    "number": 78
  },
  {
    "source": "primitive",
    "name": "Coro dos Receios",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Coro dos Receios projeta uma ameaca intima. Um alvo faz ESP CD 15; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "10 minutos",
    "number": 79
  },
  {
    "source": "primitive",
    "name": "Pavor Absoluto",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Pavor Absoluto projeta uma ameaca intima. Um alvo faz ESP CD 15; em falha fica Amedrontado, perde reacao ou nao pode se aproximar de voce ate o fim do proximo turno. Em sucesso, sofre -1 no proximo teste contra voce.",
    "type": "Medo/Controle",
    "duration": "10 minutos",
    "number": 80
  },
  {
    "source": "primitive",
    "name": "Passo Improvavel",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Passo Improvavel acelera o ritmo dos aliados. Ate 3 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "1 minuto",
    "number": 81
  },
  {
    "source": "primitive",
    "name": "Clarim Alegre",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Clarim Alegre acelera o ritmo dos aliados. Ate 3 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "1 minuto",
    "number": 82
  },
  {
    "source": "primitive",
    "name": "Euforia Estavel",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Euforia Estavel acelera o ritmo dos aliados. Ate 3 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "1 minuto",
    "number": 83
  },
  {
    "source": "primitive",
    "name": "Gesto Vitorioso",
    "cost": "5 PE",
    "range": "18m / 1 rodada",
    "effect": "Gesto Vitorioso acelera o ritmo dos aliados. Ate 3 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "1 rodada",
    "number": 84
  },
  {
    "source": "primitive",
    "name": "Luz de Festa",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Luz de Festa acelera o ritmo dos aliados. Ate 4 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "1 rodada",
    "number": 85
  },
  {
    "source": "primitive",
    "name": "Aplauso Encantado",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Aplauso Encantado acelera o ritmo dos aliados. Ate 4 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "1 rodada",
    "number": 86
  },
  {
    "source": "primitive",
    "name": "Brilho no Peito",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Brilho no Peito acelera o ritmo dos aliados. Ate 4 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "1 rodada",
    "number": 87
  },
  {
    "source": "primitive",
    "name": "Roda de Celebracao",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Roda de Celebracao acelera o ritmo dos aliados. Ate 4 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "1 rodada",
    "number": 88
  },
  {
    "source": "primitive",
    "name": "Sorte Sorridente",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Sorte Sorridente acelera o ritmo dos aliados. Ate 4 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "1 rodada",
    "number": 89
  },
  {
    "source": "primitive",
    "name": "Folego de Carnaval",
    "cost": "7 PE",
    "range": "24m / 10 minutos",
    "effect": "Folego de Carnaval acelera o ritmo dos aliados. Ate 4 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "10 minutos",
    "number": 90
  },
  {
    "source": "primitive",
    "name": "Cantiga Valente",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Cantiga Valente acelera o ritmo dos aliados. Ate 4 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "10 minutos",
    "number": 91
  },
  {
    "source": "primitive",
    "name": "Estalo de Esperanca",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Estalo de Esperanca acelera o ritmo dos aliados. Ate 4 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "10 minutos",
    "number": 92
  },
  {
    "source": "primitive",
    "name": "Triunfo Compartilhado",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Triunfo Compartilhado acelera o ritmo dos aliados. Ate 4 aliados em alcance ganham +1d4 no proximo teste, ataque ou salvamento. Quem usar o bonus pode mover 3m sem provocar reacao.",
    "type": "Alegria/Suporte",
    "duration": "10 minutos",
    "number": 93
  },
  {
    "source": "primitive",
    "name": "Sino Distante",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Sino Distante pesa a cena com luto. Inimigos em area curta fazem ESP CD 14; em falha sofrem -1 em ataques e curas recebidas caem em 2d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 minuto",
    "number": 94
  },
  {
    "source": "primitive",
    "name": "Olhos de Ausencia",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Olhos de Ausencia pesa a cena com luto. Inimigos em area curta fazem ESP CD 14; em falha sofrem -1 em ataques e curas recebidas caem em 2d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 minuto",
    "number": 95
  },
  {
    "source": "primitive",
    "name": "Poço de Silencio",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Poço de Silencio pesa a cena com luto. Inimigos em area curta fazem ESP CD 14; em falha sofrem -1 em ataques e curas recebidas caem em 2d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 minuto",
    "number": 96
  },
  {
    "source": "primitive",
    "name": "Frio da Saudade",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Frio da Saudade pesa a cena com luto. Inimigos em area curta fazem ESP CD 14; em falha sofrem -1 em ataques e curas recebidas caem em 2d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 minuto",
    "number": 97
  },
  {
    "source": "primitive",
    "name": "Recordacao Dolorosa",
    "cost": "5 PE",
    "range": "18m / 1 rodada",
    "effect": "Recordacao Dolorosa pesa a cena com luto. Inimigos em area curta fazem ESP CD 14; em falha sofrem -1 em ataques e curas recebidas caem em 2d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 rodada",
    "number": 98
  },
  {
    "source": "primitive",
    "name": "Queda do Animo",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Queda do Animo pesa a cena com luto. Inimigos em area curta fazem ESP CD 15; em falha sofrem -1 em ataques e curas recebidas caem em 3d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 rodada",
    "number": 99
  },
  {
    "source": "primitive",
    "name": "Elegia Pesada",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Elegia Pesada pesa a cena com luto. Inimigos em area curta fazem ESP CD 15; em falha sofrem -1 em ataques e curas recebidas caem em 3d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 rodada",
    "number": 100
  },
  {
    "source": "primitive",
    "name": "Sombra da Perda",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Sombra da Perda pesa a cena com luto. Inimigos em area curta fazem ESP CD 15; em falha sofrem -1 em ataques e curas recebidas caem em 3d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 rodada",
    "number": 101
  },
  {
    "source": "primitive",
    "name": "Suspiro Final",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Suspiro Final pesa a cena com luto. Inimigos em area curta fazem ESP CD 15; em falha sofrem -1 em ataques e curas recebidas caem em 3d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 rodada",
    "number": 102
  },
  {
    "source": "primitive",
    "name": "Mar de Ausencia",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Mar de Ausencia pesa a cena com luto. Inimigos em area curta fazem ESP CD 15; em falha sofrem -1 em ataques e curas recebidas caem em 3d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "1 rodada",
    "number": 103
  },
  {
    "source": "primitive",
    "name": "Coro Baixo",
    "cost": "7 PE",
    "range": "24m / 10 minutos",
    "effect": "Coro Baixo pesa a cena com luto. Inimigos em area curta fazem ESP CD 15; em falha sofrem -1 em ataques e curas recebidas caem em 3d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "10 minutos",
    "number": 104
  },
  {
    "source": "primitive",
    "name": "Gelo no Animo",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Gelo no Animo pesa a cena com luto. Inimigos em area curta fazem ESP CD 15; em falha sofrem -1 em ataques e curas recebidas caem em 3d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "10 minutos",
    "number": 105
  },
  {
    "source": "primitive",
    "name": "Memorial de Dor",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Memorial de Dor pesa a cena com luto. Inimigos em area curta fazem ESP CD 15; em falha sofrem -1 em ataques e curas recebidas caem em 3d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "10 minutos",
    "number": 106
  },
  {
    "source": "primitive",
    "name": "Luto Profundo",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Luto Profundo pesa a cena com luto. Inimigos em area curta fazem ESP CD 15; em falha sofrem -1 em ataques e curas recebidas caem em 3d6 ate o fim da rodada. Sucesso reduz para uma penalidade narrativa leve.",
    "type": "Tristeza/Debuff",
    "duration": "10 minutos",
    "number": 107
  },
  {
    "source": "primitive",
    "name": "Recusa da Queda",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Recusa da Queda firma corpo e vontade. Voce ou aliado no alcance ganha 2d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "1 minuto",
    "number": 108
  },
  {
    "source": "primitive",
    "name": "Trilha Obstinada",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Trilha Obstinada firma corpo e vontade. Voce ou aliado no alcance ganha 2d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "1 minuto",
    "number": 109
  },
  {
    "source": "primitive",
    "name": "Pulso Resiliente",
    "cost": "4 PE",
    "range": "12m / 1 minuto",
    "effect": "Pulso Resiliente firma corpo e vontade. Voce ou aliado no alcance ganha 2d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "1 minuto",
    "number": 110
  },
  {
    "source": "primitive",
    "name": "Marca de Persistencia",
    "cost": "5 PE",
    "range": "18m / 1 rodada",
    "effect": "Marca de Persistencia firma corpo e vontade. Voce ou aliado no alcance ganha 2d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "1 rodada",
    "number": 111
  },
  {
    "source": "primitive",
    "name": "Escudo de Vontade",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Escudo de Vontade firma corpo e vontade. Voce ou aliado no alcance ganha 3d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "1 rodada",
    "number": 112
  },
  {
    "source": "primitive",
    "name": "Nao Ceder",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Nao Ceder firma corpo e vontade. Voce ou aliado no alcance ganha 3d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "1 rodada",
    "number": 113
  },
  {
    "source": "primitive",
    "name": "Voto Inquebravel",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Voto Inquebravel firma corpo e vontade. Voce ou aliado no alcance ganha 3d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "1 rodada",
    "number": 114
  },
  {
    "source": "primitive",
    "name": "Coluna de Ferro",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Coluna de Ferro firma corpo e vontade. Voce ou aliado no alcance ganha 3d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "1 rodada",
    "number": 115
  },
  {
    "source": "primitive",
    "name": "Respirar na Dor",
    "cost": "6 PE",
    "range": "18m / 1 rodada",
    "effect": "Respirar na Dor firma corpo e vontade. Voce ou aliado no alcance ganha 3d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "1 rodada",
    "number": 116
  },
  {
    "source": "primitive",
    "name": "Pacto de Caminho",
    "cost": "7 PE",
    "range": "24m / 10 minutos",
    "effect": "Pacto de Caminho firma corpo e vontade. Voce ou aliado no alcance ganha 3d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "10 minutos",
    "number": 117
  },
  {
    "source": "primitive",
    "name": "Alma em Guarda",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Alma em Guarda firma corpo e vontade. Voce ou aliado no alcance ganha 3d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "10 minutos",
    "number": 118
  },
  {
    "source": "primitive",
    "name": "Ultimo Passo",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Ultimo Passo firma corpo e vontade. Voce ou aliado no alcance ganha 3d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "10 minutos",
    "number": 119
  },
  {
    "source": "primitive",
    "name": "Destino Sustentado",
    "cost": "8 PE",
    "range": "24m / 10 minutos",
    "effect": "Destino Sustentado firma corpo e vontade. Voce ou aliado no alcance ganha 3d6+Mod.ESP PV temporarios e vantagem no proximo teste de VIG ou ESP. Se ja estiver protegido, recebe resistencia ao proximo dano fisico.",
    "type": "Determinacao/Protecao",
    "duration": "10 minutos",
    "number": 120
  },
  {
    "source": "faith",
    "name": "Benção Clara",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Benção Clara manifesta luz purificadora. Aliado cura 3d6+Mod.DEV PV ou inimigo sofre 3d6+Mod.DEV radiante; DEV CD 15 reduz dano. Morto-vivo, demonio ou criatura corrupta nao reduz esse dano por resistencia comum.",
    "type": "Luz/Suporte",
    "duration": "1 rodada",
    "number": 41
  },
  {
    "source": "faith",
    "name": "Mandato Radiante",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Mandato Radiante manifesta luz purificadora. Aliado cura 3d6+Mod.DEV PV ou inimigo sofre 3d6+Mod.DEV radiante; DEV CD 15 reduz dano. Morto-vivo, demonio ou criatura corrupta nao reduz esse dano por resistencia comum.",
    "type": "Luz/Suporte",
    "duration": "1 rodada",
    "number": 42
  },
  {
    "source": "faith",
    "name": "Teto de Aurora",
    "cost": "8 PD",
    "range": "24m / 10 minutos",
    "effect": "Teto de Aurora manifesta luz purificadora. Aliado cura 3d6+Mod.DEV PV ou inimigo sofre 3d6+Mod.DEV radiante; DEV CD 15 reduz dano. Morto-vivo, demonio ou criatura corrupta nao reduz esse dano por resistencia comum.",
    "type": "Luz/Suporte",
    "duration": "10 minutos",
    "number": 43
  },
  {
    "source": "faith",
    "name": "Verdade Incandescente",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Verdade Incandescente manifesta luz purificadora. Aliado cura 5d6+Mod.DEV PV ou inimigo sofre 5d6+Mod.DEV radiante; DEV CD 16 reduz dano. Morto-vivo, demonio ou criatura corrupta nao reduz esse dano por resistencia comum.",
    "type": "Luz/Suporte",
    "duration": "10 minutos",
    "number": 44
  },
  {
    "source": "faith",
    "name": "Exilio das Trevas",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Exilio das Trevas manifesta luz purificadora. Aliado cura 5d6+Mod.DEV PV ou inimigo sofre 5d6+Mod.DEV radiante; DEV CD 16 reduz dano. Morto-vivo, demonio ou criatura corrupta nao reduz esse dano por resistencia comum.",
    "type": "Luz/Suporte",
    "duration": "10 minutos",
    "number": 45
  },
  {
    "source": "faith",
    "name": "Trono Solar",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Trono Solar manifesta luz purificadora. Aliado cura 5d6+Mod.DEV PV ou inimigo sofre 5d6+Mod.DEV radiante; DEV CD 16 reduz dano. Morto-vivo, demonio ou criatura corrupta nao reduz esse dano por resistencia comum.",
    "type": "Luz/Suporte",
    "duration": "10 minutos",
    "number": 46
  },
  {
    "source": "faith",
    "name": "Corte de Breu",
    "cost": "4 PD",
    "range": "12m / 1 minuto",
    "effect": "Corte de Breu dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 14; falha sofre 2d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 minuto",
    "number": 47
  },
  {
    "source": "faith",
    "name": "Voto Silencioso",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Voto Silencioso dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 14; falha sofre 2d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 minuto",
    "number": 48
  },
  {
    "source": "faith",
    "name": "Cortina de Segredos",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Cortina de Segredos dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 14; falha sofre 2d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 minuto",
    "number": 49
  },
  {
    "source": "faith",
    "name": "Sombra Servil",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Sombra Servil dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 14; falha sofre 2d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 minuto",
    "number": 50
  },
  {
    "source": "faith",
    "name": "Marca Oculta",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Marca Oculta dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 14; falha sofre 2d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 minuto",
    "number": 51
  },
  {
    "source": "faith",
    "name": "Noite Portatil",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Noite Portatil dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 14; falha sofre 2d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 minuto",
    "number": 52
  },
  {
    "source": "faith",
    "name": "Voz Sem Rosto",
    "cost": "6 PD",
    "range": "18m / 1 rodada",
    "effect": "Voz Sem Rosto dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 15; falha sofre 3d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 rodada",
    "number": 53
  },
  {
    "source": "faith",
    "name": "Vulto Protetor",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Vulto Protetor dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 15; falha sofre 3d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 rodada",
    "number": 54
  },
  {
    "source": "faith",
    "name": "Selo da Penumbra",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Selo da Penumbra dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 15; falha sofre 3d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 rodada",
    "number": 55
  },
  {
    "source": "faith",
    "name": "Rito da Cortina",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Rito da Cortina dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 15; falha sofre 3d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 rodada",
    "number": 56
  },
  {
    "source": "faith",
    "name": "Faca sem Brilho",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Faca sem Brilho dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 15; falha sofre 3d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 rodada",
    "number": 57
  },
  {
    "source": "faith",
    "name": "Abrigo Noturno",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Abrigo Noturno dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 15; falha sofre 3d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "1 rodada",
    "number": 58
  },
  {
    "source": "faith",
    "name": "Segredo Vivo",
    "cost": "8 PD",
    "range": "24m / 10 minutos",
    "effect": "Segredo Vivo dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 15; falha sofre 3d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "10 minutos",
    "number": 59
  },
  {
    "source": "faith",
    "name": "Oraculo Escuro",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Oraculo Escuro dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 16; falha sofre 5d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "10 minutos",
    "number": 60
  },
  {
    "source": "faith",
    "name": "Porta de Breu",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Porta de Breu dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 16; falha sofre 5d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "10 minutos",
    "number": 61
  },
  {
    "source": "faith",
    "name": "Trono da Penumbra",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Trono da Penumbra dobra penumbra e segredo. Escolha: aliado ganha vantagem em Furtividade e cobertura leve por 1 rodada, ou inimigo faz ESP CD 16; falha sofre 5d6 necrotico e nao pode usar reacao.",
    "type": "Sombra/Utilitario",
    "duration": "10 minutos",
    "number": 62
  },
  {
    "source": "faith",
    "name": "Esporo Curativo",
    "cost": "4 PD",
    "range": "12m / 1 minuto",
    "effect": "Esporo Curativo chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 14 ou sofrem 2d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 minuto",
    "number": 63
  },
  {
    "source": "faith",
    "name": "Totem de Fera",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Totem de Fera chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 14 ou sofrem 2d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 minuto",
    "number": 64
  },
  {
    "source": "faith",
    "name": "Chuva Verde",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Chuva Verde chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 14 ou sofrem 2d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 minuto",
    "number": 65
  },
  {
    "source": "faith",
    "name": "Garra Espiritual",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Garra Espiritual chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 14 ou sofrem 2d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 minuto",
    "number": 66
  },
  {
    "source": "faith",
    "name": "Barreira de Cipo",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Barreira de Cipo chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 14 ou sofrem 2d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 minuto",
    "number": 67
  },
  {
    "source": "faith",
    "name": "Fome da Terra",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Fome da Terra chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 14 ou sofrem 2d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 minuto",
    "number": 68
  },
  {
    "source": "faith",
    "name": "Sopro de Seiva",
    "cost": "6 PD",
    "range": "18m / 1 rodada",
    "effect": "Sopro de Seiva chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 15 ou sofrem 3d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 rodada",
    "number": 69
  },
  {
    "source": "faith",
    "name": "Canto do Enxame",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Canto do Enxame chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 15 ou sofrem 3d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 rodada",
    "number": 70
  },
  {
    "source": "faith",
    "name": "Coroa de Espinhos",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Coroa de Espinhos chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 15 ou sofrem 3d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 rodada",
    "number": 71
  },
  {
    "source": "faith",
    "name": "Muralha de Troncos",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Muralha de Troncos chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 15 ou sofrem 3d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 rodada",
    "number": 72
  },
  {
    "source": "faith",
    "name": "Mordida da Mata",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Mordida da Mata chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 15 ou sofrem 3d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 rodada",
    "number": 73
  },
  {
    "source": "faith",
    "name": "Semente Guardiã",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Semente Guardiã chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 15 ou sofrem 3d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "1 rodada",
    "number": 74
  },
  {
    "source": "faith",
    "name": "Pele de Liquen",
    "cost": "8 PD",
    "range": "24m / 10 minutos",
    "effect": "Pele de Liquen chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 15 ou sofrem 3d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "10 minutos",
    "number": 75
  },
  {
    "source": "faith",
    "name": "Vento de Polen",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Vento de Polen chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 16 ou sofrem 5d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "10 minutos",
    "number": 76
  },
  {
    "source": "faith",
    "name": "Ira do Bosque",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Ira do Bosque chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 16 ou sofrem 5d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "10 minutos",
    "number": 77
  },
  {
    "source": "faith",
    "name": "Trono Verde",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Trono Verde chama raiz, fera ou veneno natural. Area de 3m vira terreno dificil; inimigos fazem AGI/VIG CD 16 ou sofrem 5d6 perfurante/veneno e ficam presos ate gastar acao para se soltar.",
    "type": "Natureza/Controle",
    "duration": "10 minutos",
    "number": 78
  },
  {
    "source": "faith",
    "name": "Voz do Tumulo",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Voz do Tumulo invoca a lei do fim. Alvo faz VIG CD 14; falha sofre 2d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 minuto",
    "number": 79
  },
  {
    "source": "faith",
    "name": "Veu da Passagem",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Veu da Passagem invoca a lei do fim. Alvo faz VIG CD 14; falha sofre 2d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 minuto",
    "number": 80
  },
  {
    "source": "faith",
    "name": "Marca da Sepultura",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Marca da Sepultura invoca a lei do fim. Alvo faz VIG CD 14; falha sofre 2d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 minuto",
    "number": 81
  },
  {
    "source": "faith",
    "name": "Frio do Ossario",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Frio do Ossario invoca a lei do fim. Alvo faz VIG CD 14; falha sofre 2d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 minuto",
    "number": 82
  },
  {
    "source": "faith",
    "name": "Danca dos Ossos",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Danca dos Ossos invoca a lei do fim. Alvo faz VIG CD 14; falha sofre 2d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 minuto",
    "number": 83
  },
  {
    "source": "faith",
    "name": "Luto Sagrado",
    "cost": "6 PD",
    "range": "18m / 1 rodada",
    "effect": "Luto Sagrado invoca a lei do fim. Alvo faz VIG CD 15; falha sofre 3d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 rodada",
    "number": 84
  },
  {
    "source": "faith",
    "name": "Ciclo Encerrado",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Ciclo Encerrado invoca a lei do fim. Alvo faz VIG CD 15; falha sofre 3d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 rodada",
    "number": 85
  },
  {
    "source": "faith",
    "name": "Porta do Alem",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Porta do Alem invoca a lei do fim. Alvo faz VIG CD 15; falha sofre 3d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 rodada",
    "number": 86
  },
  {
    "source": "faith",
    "name": "Livro dos Nomes",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Livro dos Nomes invoca a lei do fim. Alvo faz VIG CD 15; falha sofre 3d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 rodada",
    "number": 87
  },
  {
    "source": "faith",
    "name": "Sombra do Mausoleu",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Sombra do Mausoleu invoca a lei do fim. Alvo faz VIG CD 15; falha sofre 3d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 rodada",
    "number": 88
  },
  {
    "source": "faith",
    "name": "Beijo do Fim",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Beijo do Fim invoca a lei do fim. Alvo faz VIG CD 15; falha sofre 3d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "1 rodada",
    "number": 89
  },
  {
    "source": "faith",
    "name": "Procissao Cinzenta",
    "cost": "8 PD",
    "range": "24m / 10 minutos",
    "effect": "Procissao Cinzenta invoca a lei do fim. Alvo faz VIG CD 15; falha sofre 3d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "10 minutos",
    "number": 90
  },
  {
    "source": "faith",
    "name": "Juramento Sepulcral",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Juramento Sepulcral invoca a lei do fim. Alvo faz VIG CD 16; falha sofre 5d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "10 minutos",
    "number": 91
  },
  {
    "source": "faith",
    "name": "Eco do Ultimo Dia",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Eco do Ultimo Dia invoca a lei do fim. Alvo faz VIG CD 16; falha sofre 5d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "10 minutos",
    "number": 92
  },
  {
    "source": "faith",
    "name": "Trono Funerario",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Trono Funerario invoca a lei do fim. Alvo faz VIG CD 16; falha sofre 5d6+Mod.DEV necrotico e nao pode recuperar PV ate o inicio do seu proximo turno. Em alvo a 0 PV, estabiliza ou impede retorno, a sua escolha.",
    "type": "Morte/Debuff",
    "duration": "10 minutos",
    "number": 93
  },
  {
    "source": "faith",
    "name": "Riso Instavel",
    "cost": "4 PD",
    "range": "12m / 1 minuto",
    "effect": "Riso Instavel quebra a previsibilidade. Role 1d6: 1-2 causa 2d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 14 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 minuto",
    "number": 94
  },
  {
    "source": "faith",
    "name": "Fenda Mutavel",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Fenda Mutavel quebra a previsibilidade. Role 1d6: 1-2 causa 2d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 14 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 minuto",
    "number": 95
  },
  {
    "source": "faith",
    "name": "Coro Desafinado",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Coro Desafinado quebra a previsibilidade. Role 1d6: 1-2 causa 2d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 14 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 minuto",
    "number": 96
  },
  {
    "source": "faith",
    "name": "Rebote Caotico",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Rebote Caotico quebra a previsibilidade. Role 1d6: 1-2 causa 2d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 14 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 minuto",
    "number": 97
  },
  {
    "source": "faith",
    "name": "Milagre Torto",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Milagre Torto quebra a previsibilidade. Role 1d6: 1-2 causa 2d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 14 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 minuto",
    "number": 98
  },
  {
    "source": "faith",
    "name": "Faísca Sem Regra",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Faísca Sem Regra quebra a previsibilidade. Role 1d6: 1-2 causa 2d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 14 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 minuto",
    "number": 99
  },
  {
    "source": "faith",
    "name": "Tempestade Menor",
    "cost": "6 PD",
    "range": "18m / 1 rodada",
    "effect": "Tempestade Menor quebra a previsibilidade. Role 1d6: 1-2 causa 3d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 15 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 rodada",
    "number": 100
  },
  {
    "source": "faith",
    "name": "Jogo dos Destinos",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Jogo dos Destinos quebra a previsibilidade. Role 1d6: 1-2 causa 3d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 15 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 rodada",
    "number": 101
  },
  {
    "source": "faith",
    "name": "Ordem Quebrada",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Ordem Quebrada quebra a previsibilidade. Role 1d6: 1-2 causa 3d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 15 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 rodada",
    "number": 102
  },
  {
    "source": "faith",
    "name": "Moeda em Pe",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Moeda em Pe quebra a previsibilidade. Role 1d6: 1-2 causa 3d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 15 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 rodada",
    "number": 103
  },
  {
    "source": "faith",
    "name": "Roda Impossivel",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Roda Impossivel quebra a previsibilidade. Role 1d6: 1-2 causa 3d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 15 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 rodada",
    "number": 104
  },
  {
    "source": "faith",
    "name": "Mandinga Variavel",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Mandinga Variavel quebra a previsibilidade. Role 1d6: 1-2 causa 3d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 15 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "1 rodada",
    "number": 105
  },
  {
    "source": "faith",
    "name": "Salto de Probabilidade",
    "cost": "8 PD",
    "range": "24m / 10 minutos",
    "effect": "Salto de Probabilidade quebra a previsibilidade. Role 1d6: 1-2 causa 3d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 15 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "10 minutos",
    "number": 106
  },
  {
    "source": "faith",
    "name": "Explosao Irregular",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Explosao Irregular quebra a previsibilidade. Role 1d6: 1-2 causa 5d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 16 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "10 minutos",
    "number": 107
  },
  {
    "source": "faith",
    "name": "Resposta Improvavel",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Resposta Improvavel quebra a previsibilidade. Role 1d6: 1-2 causa 5d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 16 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "10 minutos",
    "number": 108
  },
  {
    "source": "faith",
    "name": "Trono do Acaso",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Trono do Acaso quebra a previsibilidade. Role 1d6: 1-2 causa 5d6 dano aleatorio, 3-4 teleporta alvo 3m, 5 concede +1d4 a aliado, 6 repete o efeito em alvo adjacente. DEV CD 16 evita efeito hostil.",
    "type": "Caos/Ataque",
    "duration": "10 minutos",
    "number": 109
  },
  {
    "source": "faith",
    "name": "Peso da Regra",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Peso da Regra cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 14 ou perde reacao e sofre 2d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 minuto",
    "number": 110
  },
  {
    "source": "faith",
    "name": "Parede de Juramento",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Parede de Juramento cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 14 ou perde reacao e sofre 2d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 minuto",
    "number": 111
  },
  {
    "source": "faith",
    "name": "Marca de Obediencia",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Marca de Obediencia cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 14 ou perde reacao e sofre 2d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 minuto",
    "number": 112
  },
  {
    "source": "faith",
    "name": "Compasso Perfeito",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Compasso Perfeito cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 14 ou perde reacao e sofre 2d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 minuto",
    "number": 113
  },
  {
    "source": "faith",
    "name": "Clausula Punitiva",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Clausula Punitiva cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 14 ou perde reacao e sofre 2d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 minuto",
    "number": 114
  },
  {
    "source": "faith",
    "name": "Rito de Hierarquia",
    "cost": "6 PD",
    "range": "18m / 1 rodada",
    "effect": "Rito de Hierarquia cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 15 ou perde reacao e sofre 3d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 rodada",
    "number": 115
  },
  {
    "source": "faith",
    "name": "Veredito Imediato",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Veredito Imediato cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 15 ou perde reacao e sofre 3d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 rodada",
    "number": 116
  },
  {
    "source": "faith",
    "name": "Lei Inquebravel",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Lei Inquebravel cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 15 ou perde reacao e sofre 3d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 rodada",
    "number": 117
  },
  {
    "source": "faith",
    "name": "Arquivo Divino",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Arquivo Divino cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 15 ou perde reacao e sofre 3d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 rodada",
    "number": 118
  },
  {
    "source": "faith",
    "name": "Corrente Legal",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Corrente Legal cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 15 ou perde reacao e sofre 3d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 rodada",
    "number": 119
  },
  {
    "source": "faith",
    "name": "Ato de Autoridade",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Ato de Autoridade cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 15 ou perde reacao e sofre 3d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "1 rodada",
    "number": 120
  },
  {
    "source": "faith",
    "name": "Sentenca Luminosa",
    "cost": "8 PD",
    "range": "24m / 10 minutos",
    "effect": "Sentenca Luminosa cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 15 ou perde reacao e sofre 3d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "10 minutos",
    "number": 121
  },
  {
    "source": "faith",
    "name": "Marcha Regular",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Marcha Regular cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 16 ou perde reacao e sofre 5d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "10 minutos",
    "number": 122
  },
  {
    "source": "faith",
    "name": "Regra Absoluta",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Regra Absoluta cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 16 ou perde reacao e sofre 5d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "10 minutos",
    "number": 123
  },
  {
    "source": "faith",
    "name": "Trono da Lei",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Trono da Lei cria uma regra sagrada curta. Uma criatura ou area no alcance obedece uma condicao simples por 1 rodada; quem quebrar faz DEV CD 16 ou perde reacao e sofre 5d6 radiante/psiquico.",
    "type": "Ordem/Controle",
    "duration": "10 minutos",
    "number": 124
  },
  {
    "source": "faith",
    "name": "Asa Rasgada",
    "cost": "3 PD",
    "range": "9m / Instantaneo",
    "effect": "Asa Rasgada cobra poder por pacto. Alvo sofre 1d6+Mod.DEV profano ou fogo; DEV CD 13 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "Instantaneo",
    "number": 125
  },
  {
    "source": "faith",
    "name": "Fogo do Pacto",
    "cost": "4 PD",
    "range": "12m / 1 minuto",
    "effect": "Fogo do Pacto cobra poder por pacto. Alvo sofre 2d6+Mod.DEV profano ou fogo; DEV CD 14 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 minuto",
    "number": 126
  },
  {
    "source": "faith",
    "name": "Dente do Abismo",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Dente do Abismo cobra poder por pacto. Alvo sofre 2d6+Mod.DEV profano ou fogo; DEV CD 14 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 minuto",
    "number": 127
  },
  {
    "source": "faith",
    "name": "Voz Tentadora",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Voz Tentadora cobra poder por pacto. Alvo sofre 2d6+Mod.DEV profano ou fogo; DEV CD 14 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 minuto",
    "number": 128
  },
  {
    "source": "faith",
    "name": "Cadeia Rubra",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Cadeia Rubra cobra poder por pacto. Alvo sofre 2d6+Mod.DEV profano ou fogo; DEV CD 14 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 minuto",
    "number": 129
  },
  {
    "source": "faith",
    "name": "Pele Diabolica",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Pele Diabolica cobra poder por pacto. Alvo sofre 2d6+Mod.DEV profano ou fogo; DEV CD 14 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 minuto",
    "number": 130
  },
  {
    "source": "faith",
    "name": "Dizimo de Dor",
    "cost": "5 PD",
    "range": "12m / 1 minuto",
    "effect": "Dizimo de Dor cobra poder por pacto. Alvo sofre 2d6+Mod.DEV profano ou fogo; DEV CD 14 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 minuto",
    "number": 131
  },
  {
    "source": "faith",
    "name": "Invocacao Cruel",
    "cost": "6 PD",
    "range": "18m / 1 rodada",
    "effect": "Invocacao Cruel cobra poder por pacto. Alvo sofre 3d6+Mod.DEV profano ou fogo; DEV CD 15 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 rodada",
    "number": 132
  },
  {
    "source": "faith",
    "name": "Olhar do Pactario",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Olhar do Pactario cobra poder por pacto. Alvo sofre 3d6+Mod.DEV profano ou fogo; DEV CD 15 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 rodada",
    "number": 133
  },
  {
    "source": "faith",
    "name": "Trono Inferior",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Trono Inferior cobra poder por pacto. Alvo sofre 3d6+Mod.DEV profano ou fogo; DEV CD 15 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 rodada",
    "number": 134
  },
  {
    "source": "faith",
    "name": "Chicote de Brasa",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Chicote de Brasa cobra poder por pacto. Alvo sofre 3d6+Mod.DEV profano ou fogo; DEV CD 15 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 rodada",
    "number": 135
  },
  {
    "source": "faith",
    "name": "Pacto de Ferida",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Pacto de Ferida cobra poder por pacto. Alvo sofre 3d6+Mod.DEV profano ou fogo; DEV CD 15 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 rodada",
    "number": 136
  },
  {
    "source": "faith",
    "name": "Mandibula Rubra",
    "cost": "7 PD",
    "range": "18m / 1 rodada",
    "effect": "Mandibula Rubra cobra poder por pacto. Alvo sofre 3d6+Mod.DEV profano ou fogo; DEV CD 15 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "1 rodada",
    "number": 137
  },
  {
    "source": "faith",
    "name": "Selo de Corrupcao",
    "cost": "8 PD",
    "range": "24m / 10 minutos",
    "effect": "Selo de Corrupcao cobra poder por pacto. Alvo sofre 3d6+Mod.DEV profano ou fogo; DEV CD 15 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "10 minutos",
    "number": 138
  },
  {
    "source": "faith",
    "name": "Coroa de Chifres",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Coroa de Chifres cobra poder por pacto. Alvo sofre 5d6+Mod.DEV profano ou fogo; DEV CD 16 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "10 minutos",
    "number": 139
  },
  {
    "source": "faith",
    "name": "Oferta Maldita",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Oferta Maldita cobra poder por pacto. Alvo sofre 5d6+Mod.DEV profano ou fogo; DEV CD 16 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "10 minutos",
    "number": 140
  },
  {
    "source": "faith",
    "name": "Ascensao Infernal",
    "cost": "9 PD",
    "range": "24m / 10 minutos",
    "effect": "Ascensao Infernal cobra poder por pacto. Alvo sofre 5d6+Mod.DEV profano ou fogo; DEV CD 16 reduz metade. Se falhar, fica Marcado: o proximo ataque contra ele causa +1d6, mas o conjurador recebe sinal profano visivel ate o fim da cena.",
    "type": "Demonio/Debuff",
    "duration": "10 minutos",
    "number": 141
  }
  // END EXPANSAO SENSIENTE DEVOTO
];
