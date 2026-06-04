let state = loadState();
let uiState = loadUiState();
let selectedTool = "floor";
let selectedMapCreature = "";
let sheetCategory = "resumo";
let abilityCategory = "habilidades";
let cloud = {
  client: null,
  user: null,
  channel: null,
  saveTimer: null,
  remoteTimer: null,
  reconnectTimer: null,
  pollTimer: null,
  loadingRemote: false,
  saving: false,
  pendingSave: false,
  pendingRemoteData: null,
  pendingRemoteRevision: "",
  localDirty: false,
  lastSavedJson: "",
  lastRemoteRevision: "",
  configKey: "",
  authListenerReady: false,
  resumeListenersReady: false,
  clientId: getCloudClientId()
};
const filters = {
  characters: { search: "" },
  notes: { search: "", tag: "" },
  creatures: { search: "", source: "", type: "" },
  magic: { search: "", source: "" },
  characterSpells: { search: "", source: "" },
  abilities: { search: "", class: "__current", level: "unlocked" }
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function getCloudClientId() {
  const key = "mesa_rpg_cloud_client_id_v1";
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const next = "client-" + uid();
    localStorage.setItem(key, next);
    return next;
  } catch {
    return "client-" + uid();
  }
}
function loadUiState() {
  try {
    const stored = JSON.parse(localStorage.getItem(LOCAL_UI_KEY) || "{}");
    return { selectedCharacter: readLegacySelectedCharacter(), ...stored };
  } catch {
    return { selectedCharacter: readLegacySelectedCharacter() };
  }
}
function readLegacySelectedCharacter() {
  try {
    const legacy = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
    return legacy.selectedCharacter || "";
  } catch {
    return "";
  }
}
function saveUiState() {
  try {
    localStorage.setItem(LOCAL_UI_KEY, JSON.stringify(uiState));
  } catch {}
}
function selectedCharacterId() {
  const localId = uiState.selectedCharacter;
  if (localId && state.characters.some(c => c.id === localId)) return localId;
  const fallback = state.characters[0]?.id || "";
  if (fallback) {
    uiState.selectedCharacter = fallback;
    saveUiState();
  }
  return fallback;
}
function setLocalSelectedCharacter(id) {
  if (!state.characters.some(c => c.id === id)) return;
  uiState.selectedCharacter = id;
  saveUiState();
}
function blankAttack() {
  return {
    id: uid(),
    name: "Ataque comum",
    attr: "FOR",
    bonus: 0,
    damage: "1d4",
    range: "Corpo a corpo",
    type: "Contundente",
    notes: ""
  };
}
function blankCharacter() {
  const attack = blankAttack();
  attack.name = "Ataque de espada";
  attack.damage = "1d8+FOR";
  attack.type = "Cortante";
  return {
    id: uid(), name: "Novo personagem", player: "", ancestry: "", role: "", level: 1,
    background: "", alignment: "", xp: 0,
    attrs: { FOR: "d4", AGI: "d4", VIG: "d4", INT: "d4", ESP: "d4", DEV: "d4" },
    saves: Object.fromEntries(ATTRS.map(([key]) => [key, 0])),
    attacks: [attack],
    hp: { current: 12, max: 12, temp: 0 }, ac: 4, speed: 9, prof: 2, initiative: 0,
    resources: { pa: { current: 4, max: 4 }, pe: { current: 4, max: 4 }, pd: { current: 0, max: 0 }, aura: { current: 2, max: 2 } },
    knownSpellIds: [],
    customSpells: [],
    knownAbilityIds: [],
    customAbilities: [],
    emotion: "Determinação", deity: "", skills: Object.fromEntries(SKILLS.map(([n]) => [n, 0])),
    features: "", inventory: "", spells: "", bonds: "", notes: ""
  };
}
function defaultState() {
  const c = blankCharacter();
  c.name = "Kael, Aprendiz de Runa";
  c.player = "Jogador";
  c.role = "Arcanista";
  c.attrs.INT = "d8";
  c.attrs.AGI = "d6";
  c.skills["Arcanismo"] = 1;
  c.skills["Percepção"] = 1;
  c.spells = "Dardo Arcano; Escudo de Força; Runa de Alarme.";
  return {
    characters: [c],
    campaign: {
      name: "Campanha sem nome", premise: "Um mundo onde magia nasce de mente, emoção, fé, tecnologia e absorção.",
      session: "Sessão 1", location: "Ponto de partida", secrets: "", partyIds: [c.id]
    },
    notes: [{ id: uid(), title: "Abertura", body: "Anote aqui eventos, pistas, decisões dos jogadores e consequências.", tag: "Sessão" }],
    creatures: [
      { id: uid(), name: "Sentinela de Pedra", type: "Construto", hp: 40, ac: 15, init: 0, threat: "Médio", source: "tech", attacks: "Bloqueio: impede passagem. Alarme: avisa o criador.", notes: "Alimentado por cristal de armazenamento." },
      { id: uid(), name: "Eco da Tristeza", type: "Manifestação Primitiva", hp: 24, ac: 12, init: 2, threat: "Baixo", source: "primitive", attacks: "Névoa fria: reduz velocidade. Toque: 1d6 psíquico.", notes: "Aparece perto de perdas intensas." }
    ],
    initiative: [],
    magic: seedMagic(),
    rolls: [],
    map: { id: uid(), name: "Mapa atual", width: 18, height: 12, tiles: Array(18 * 12).fill("floor") },
    savedMaps: []
  };
}
function seedMagic() {
  return [
    { id: uid(), source: "arcana", name: "Dardo Arcano", cost: "2 PA", range: "18m", effect: "Ataque. Projeta forca pura. Causa 1d6+Mod.INT; alvo com cobertura recebe AGI CD 12 para reduzir metade. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Escudo de Forca", cost: "2 PA", range: "Pessoal ou 9m", effect: "Protecao. Concede +1 a +2 Aparar, resistencia situacional ou barreira. Se proteger varios aliados, exige concentracao. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "arcana", name: "Detectar Magia", cost: "2 PA", range: "18m", effect: "Utilitario/Ritual. Revela, manipula ou registra magia sem substituir pericias. Efeitos ocultos exigem Arcanismo contra CD do criador. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "arcana", name: "Mao Magica", cost: "2 PA", range: "18m", effect: "Utilitario/Ritual. Revela, manipula ou registra magia sem substituir pericias. Efeitos ocultos exigem Arcanismo contra CD do criador. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "arcana", name: "Queima Arcana", cost: "2 PA", range: "18m", effect: "Ataque/Area. Causa 1d6+Mod.INT do tipo apropriado. AGI ou VIG CD 12 reduz a metade e evita empurrao, queda ou perda de recurso. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Levitacao", cost: "2 PA", range: "Pessoal ou toque", effect: "Movimento/Furtividade. Reposiciona, oculta ou atravessa obstaculos limitados. Nao atravessa barreiras dimensionais ou protecao total sem teste. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "arcana", name: "Sono Arcano", cost: "2 PA", range: "9m a 18m", effect: "Controle. Altera acao, movimento ou posicao do alvo. INT, FOR ou ESP CD 12 nega ou permite novo teste no fim do turno. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "arcana", name: "Relampago Linear", cost: "2 PA", range: "Linha 15m", effect: "Ataque/Area. Causa 1d6+Mod.INT do tipo apropriado. AGI ou VIG CD 12 reduz a metade e evita empurrao, queda ou perda de recurso. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Invisibilidade", cost: "2 PA", range: "Pessoal ou toque", effect: "Movimento/Furtividade. Reposiciona, oculta ou atravessa obstaculos limitados. Nao atravessa barreiras dimensionais ou protecao total sem teste. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "arcana", name: "Dissipar Magia", cost: "3 PA", range: "Variavel", effect: "Especial. Efeito arcano raro. O Mestre define custo colateral se alterar a cena inteira ou repetir poder de alto nivel. Duracao/recarga: Variavel." },
    { id: uid(), source: "arcana", name: "Bola de Fogo", cost: "4 PA", range: "24m", effect: "Ataque/Area. Causa 3d6+Mod.INT do tipo apropriado. AGI ou VIG CD 13 reduz a metade e evita empurrao, queda ou perda de recurso. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Telecinese", cost: "4 PA", range: "9m a 18m", effect: "Controle. Altera acao, movimento ou posicao do alvo. INT, FOR ou ESP CD 13 nega ou permite novo teste no fim do turno. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "arcana", name: "Muralha de Forca", cost: "4 PA", range: "Pessoal ou 9m", effect: "Protecao. Concede +1 a +2 Aparar, resistencia situacional ou barreira. Se proteger varios aliados, exige concentracao. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Visao Arcana", cost: "4 PA", range: "9m", effect: "Utilitario/Ritual. Revela, manipula ou registra magia sem substituir pericias. Efeitos ocultos exigem Arcanismo contra CD do criador. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Runa de Alarme", cost: "4 PA", range: "9m", effect: "Utilitario/Ritual. Revela, manipula ou registra magia sem substituir pericias. Efeitos ocultos exigem Arcanismo contra CD do criador. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Passo Dimensional", cost: "4 PA", range: "Pessoal ou toque", effect: "Movimento/Furtividade. Reposiciona, oculta ou atravessa obstaculos limitados. Nao atravessa barreiras dimensionais ou protecao total sem teste. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Armadura Arcana", cost: "4 PA", range: "Pessoal ou 9m", effect: "Protecao. Concede +1 a +2 Aparar, resistencia situacional ou barreira. Se proteger varios aliados, exige concentracao. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Selo de Silencio", cost: "4 PA", range: "9m a 18m", effect: "Controle. Altera acao, movimento ou posicao do alvo. INT, FOR ou ESP CD 13 nega ou permite novo teste no fim do turno. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "arcana", name: "Tranca Mistica", cost: "4 PA", range: "9m", effect: "Utilitario/Ritual. Revela, manipula ou registra magia sem substituir pericias. Efeitos ocultos exigem Arcanismo contra CD do criador. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Campo Antimagia Menor", cost: "5 PA", range: "Pessoal ou 9m", effect: "Protecao. Concede +1 a +2 Aparar, resistencia situacional ou barreira. Se proteger varios aliados, exige concentracao. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Temporal Arcano", cost: "7 PA", range: "9m a 18m", effect: "Controle. Altera acao, movimento ou posicao do alvo. INT, FOR ou ESP CD 15 nega ou permite novo teste no fim do turno. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Gaiola Arcana", cost: "7 PA", range: "9m a 18m", effect: "Controle. Altera acao, movimento ou posicao do alvo. INT, FOR ou ESP CD 15 nega ou permite novo teste no fim do turno. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Duplicata Ilusoria", cost: "7 PA", range: "Pessoal", effect: "Ilusao. Cria copia que confunde ataques. O primeiro ataque contra voce por rodada tem chance de atingir a duplicata. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "arcana", name: "Olho Errante", cost: "7 PA", range: "Toque", effect: "Utilitario/Ritual. Revela, manipula ou registra magia sem substituir pericias. Efeitos ocultos exigem Arcanismo contra CD do criador. Duracao/recarga: 1 hora." },
    { id: uid(), source: "arcana", name: "Flecha Gravitacional", cost: "7 PA", range: "18m", effect: "Ataque/Area. Causa 5d6+Mod.INT do tipo apropriado. AGI ou VIG CD 15 reduz a metade e evita empurrao, queda ou perda de recurso. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Circulo de Contencao", cost: "7 PA", range: "Toque", effect: "Utilitario/Ritual. Revela, manipula ou registra magia sem substituir pericias. Efeitos ocultos exigem Arcanismo contra CD do criador. Duracao/recarga: 1 hora." },
    { id: uid(), source: "arcana", name: "Refracao Mental", cost: "7 PA", range: "Pessoal ou 9m", effect: "Protecao. Concede +1 a +2 Aparar, resistencia situacional ou barreira. Se proteger varios aliados, exige concentracao. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "arcana", name: "Forma Eterea Breve", cost: "7 PA", range: "Pessoal ou toque", effect: "Movimento/Furtividade. Reposiciona, oculta ou atravessa obstaculos limitados. Nao atravessa barreiras dimensionais ou protecao total sem teste. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Ruptura de Mana", cost: "7 PA", range: "18m", effect: "Ataque/Area. Causa 5d6+Mod.INT do tipo apropriado. AGI ou VIG CD 15 reduz a metade e evita empurrao, queda ou perda de recurso. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Porta Arcana", cost: "7 PA", range: "Pessoal ou toque", effect: "Movimento/Furtividade. Reposiciona, oculta ou atravessa obstaculos limitados. Nao atravessa barreiras dimensionais ou protecao total sem teste. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Teletransporte", cost: "15 PA", range: "Pessoal ou toque", effect: "Movimento/Furtividade. Reposiciona, oculta ou atravessa obstaculos limitados. Nao atravessa barreiras dimensionais ou protecao total sem teste. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Prisao Dimensional", cost: "15 PA", range: "9m a 18m", effect: "Controle. Altera acao, movimento ou posicao do alvo. INT, FOR ou ESP CD 16 nega ou permite novo teste no fim do turno. Duracao/recarga: 1 hora/concentracao." },
    { id: uid(), source: "arcana", name: "Colosso de Forca", cost: "15 PA", range: "6m", effect: "Criacao. Cria construto de forca com PV, Aparar e dano proporcionais ao nivel. Comandar exige acao bonus. Duracao/recarga: 1 minuto/concentracao." },
    { id: uid(), source: "arcana", name: "Biblioteca Instantanea", cost: "14 PA", range: "30m", effect: "Utilitario/Ritual. Revela, manipula ou registra magia sem substituir pericias. Efeitos ocultos exigem Arcanismo contra CD do criador. Duracao/recarga: Ritual." },
    { id: uid(), source: "arcana", name: "Chuva de Meteoros Menor", cost: "15 PA", range: "30m", effect: "Ataque/Area. Causa 8d6+Mod.INT do tipo apropriado. AGI ou VIG CD 16 reduz a metade e evita empurrao, queda ou perda de recurso. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "arcana", name: "Reescrever Runa", cost: "14 PA", range: "30m", effect: "Utilitario/Ritual. Revela, manipula ou registra magia sem substituir pericias. Efeitos ocultos exigem Arcanismo contra CD do criador. Duracao/recarga: Ritual." },
    { id: uid(), source: "arcana", name: "Santuario Geometrico", cost: "14 PA", range: "Pessoal ou 9m", effect: "Protecao. Concede +1 a +2 Aparar, resistencia situacional ou barreira. Se proteger varios aliados, exige concentracao. Duracao/recarga: 1 hora." },
    { id: uid(), source: "arcana", name: "Clone de Contingencia", cost: "14 PA", range: "Pessoal ou 9m", effect: "Protecao. Concede +1 a +2 Aparar, resistencia situacional ou barreira. Se proteger varios aliados, exige concentracao. Duracao/recarga: 1 hora." },
    { id: uid(), source: "arcana", name: "Dobrar Realidade", cost: "14 PA", range: "9m a 18m", effect: "Controle. Altera acao, movimento ou posicao do alvo. INT, FOR ou ESP CD 16 nega ou permite novo teste no fim do turno. Duracao/recarga: 1 hora/concentracao." },
    { id: uid(), source: "arcana", name: "Desejo Arcano", cost: "15 PA", range: "Variavel", effect: "Especial. Efeito arcano raro. O Mestre define custo colateral se alterar a cena inteira ou repetir poder de alto nivel. Duracao/recarga: Variavel." },
    { id: uid(), source: "primitive", name: "Brasa da Raiva", cost: "2 PE", range: "15m", effect: "Raiva/Ataque. Converte raiva em dano. Causa 1d6+Mod.ESP e pode empurrar, derrubar ou marcar; VIG/AGI CD 12 reduz efeito. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Toque Gentil", cost: "3 PE", range: "Toque", effect: "Amor/Cura. Cura 1d6 PV, protege ou cria vinculo emocional. Efeitos fortes tem limite por descanso. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Sussurro do Terror", cost: "1 PE", range: "9m", effect: "Medo/Controle. Impoe medo ou hesitacao. Alvo faz ESP CD 12; controle forte permite novo teste no fim do turno. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Bencao do Riso", cost: "2 PE", range: "9m", effect: "Alegria/Suporte. Inspira movimento, coragem e ritmo. Aliados recebem vantagem, +1d4 ou deslocamento extra; nao acumula consigo mesma. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Lagrimas do Abismo", cost: "3 PE", range: "12m", effect: "Tristeza/Debuff. Pesa o ambiente. Inimigos fazem ESP CD 12 ou sofrem penalidade curta, terreno dificil ou bloqueio de cura. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Forca Interior", cost: "1 PE", range: "Pessoal", effect: "Determinacao/Protecao. Fortalece vontade e corpo. Concede resistencia, PV temporario ou repeticao de save; versoes epicas tem limite por descanso longo. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Onda de Chamas", cost: "2 PE", range: "15m", effect: "Raiva/Ataque. Converte raiva em dano. Causa 1d6+Mod.ESP e pode empurrar, derrubar ou marcar; VIG/AGI CD 12 reduz efeito. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Cura Emocional", cost: "3 PE", range: "Toque", effect: "Amor/Cura. Cura 1d6 PV, protege ou cria vinculo emocional. Efeitos fortes tem limite por descanso. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Campo de Pavor", cost: "1 PE", range: "9m", effect: "Medo/Controle. Impoe medo ou hesitacao. Alvo faz ESP CD 12; controle forte permite novo teste no fim do turno. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Extase Coletivo", cost: "2 PE", range: "9m", effect: "Alegria/Suporte. Inspira movimento, coragem e ritmo. Aliados recebem vantagem, +1d4 ou deslocamento extra; nao acumula consigo mesma. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "primitive", name: "Tempestade de Cinzas", cost: "6 PE", range: "12m", effect: "Tristeza/Debuff. Pesa o ambiente. Inimigos fazem ESP CD 13 ou sofrem penalidade curta, terreno dificil ou bloqueio de cura. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Barreira de Determinacao", cost: "3 PE", range: "Pessoal", effect: "Determinacao/Protecao. Fortalece vontade e corpo. Concede resistencia, PV temporario ou repeticao de save; versoes epicas tem limite por descanso longo. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Grito da Fera", cost: "4 PE", range: "15m", effect: "Raiva/Ataque. Converte raiva em dano. Causa 2d6+Mod.ESP e pode empurrar, derrubar ou marcar; VIG/AGI CD 13 reduz efeito. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Laco Protetor", cost: "5 PE", range: "Toque", effect: "Amor/Cura. Cura 2d6 PV, protege ou cria vinculo emocional. Efeitos fortes tem limite por descanso. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Pressagio de Panico", cost: "6 PE", range: "9m", effect: "Medo/Controle. Impoe medo ou hesitacao. Alvo faz ESP CD 13; controle forte permite novo teste no fim do turno. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Passos Dancantes", cost: "3 PE", range: "9m", effect: "Alegria/Suporte. Inspira movimento, coragem e ritmo. Aliados recebem vantagem, +1d4 ou deslocamento extra; nao acumula consigo mesma. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Peso do Luto", cost: "4 PE", range: "12m", effect: "Tristeza/Debuff. Pesa o ambiente. Inimigos fazem ESP CD 13 ou sofrem penalidade curta, terreno dificil ou bloqueio de cura. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Juramento Interno", cost: "5 PE", range: "Pessoal", effect: "Determinacao/Protecao. Fortalece vontade e corpo. Concede resistencia, PV temporario ou repeticao de save; versoes epicas tem limite por descanso longo. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Inferno da Raiva", cost: "6 PE", range: "15m", effect: "Raiva/Ataque. Converte raiva em dano. Causa 2d6+Mod.ESP e pode empurrar, derrubar ou marcar; VIG/AGI CD 13 reduz efeito. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Ressurreicao por Amor", cost: "3 PE", range: "Toque", effect: "Amor/Cura. Cura 2d6 PV, protege ou cria vinculo emocional. Efeitos fortes tem limite por descanso. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "primitive", name: "Pesadelo Vivo", cost: "7 PE", range: "9m", effect: "Medo/Controle. Impoe medo ou hesitacao. Alvo faz ESP CD 15; controle forte permite novo teste no fim do turno. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Euforia de Batalha", cost: "8 PE", range: "9m", effect: "Alegria/Suporte. Inspira movimento, coragem e ritmo. Aliados recebem vantagem, +1d4 ou deslocamento extra; nao acumula consigo mesma. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Melancolia da Morte", cost: "9 PE", range: "12m", effect: "Tristeza/Debuff. Pesa o ambiente. Inimigos fazem ESP CD 15 ou sofrem penalidade curta, terreno dificil ou bloqueio de cura. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Muralha de Vontade", cost: "10 PE", range: "Pessoal", effect: "Determinacao/Protecao. Fortalece vontade e corpo. Concede resistencia, PV temporario ou repeticao de save; versoes epicas tem limite por descanso longo. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Marca da Ira", cost: "6 PE", range: "15m", effect: "Raiva/Ataque. Converte raiva em dano. Causa 4d6+Mod.ESP e pode empurrar, derrubar ou marcar; VIG/AGI CD 15 reduz efeito. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Pulso de Afeto", cost: "7 PE", range: "Toque", effect: "Amor/Cura. Cura 4d6 PV, protege ou cria vinculo emocional. Efeitos fortes tem limite por descanso. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Olhos do Predador", cost: "8 PE", range: "9m", effect: "Medo/Controle. Impoe medo ou hesitacao. Alvo faz ESP CD 15; controle forte permite novo teste no fim do turno. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Cancao de Vitoria", cost: "9 PE", range: "9m", effect: "Alegria/Suporte. Inspira movimento, coragem e ritmo. Aliados recebem vantagem, +1d4 ou deslocamento extra; nao acumula consigo mesma. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Silencio do Funeral", cost: "10 PE", range: "12m", effect: "Tristeza/Debuff. Pesa o ambiente. Inimigos fazem ESP CD 15 ou sofrem penalidade curta, terreno dificil ou bloqueio de cura. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Corpo Inquebravel", cost: "6 PE", range: "Pessoal", effect: "Determinacao/Protecao. Fortalece vontade e corpo. Concede resistencia, PV temporario ou repeticao de save; versoes epicas tem limite por descanso longo. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "primitive", name: "Furia de Milenios", cost: "11 PE", range: "15m", effect: "Raiva/Ataque. Converte raiva em dano. Causa 8d6+Mod.ESP e pode empurrar, derrubar ou marcar; VIG/AGI CD 16 reduz efeito. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "primitive", name: "Amor Incondicional", cost: "12 PE", range: "Toque", effect: "Amor/Cura. Cura 8d6 PV, protege ou cria vinculo emocional. Efeitos fortes tem limite por descanso. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "primitive", name: "Terror Primordial", cost: "13 PE", range: "9m", effect: "Medo/Controle. Impoe medo ou hesitacao. Alvo faz ESP CD 16; controle forte permite novo teste no fim do turno. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "primitive", name: "Festival Impossivel", cost: "14 PE", range: "9m", effect: "Alegria/Suporte. Inspira movimento, coragem e ritmo. Aliados recebem vantagem, +1d4 ou deslocamento extra; nao acumula consigo mesma. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "primitive", name: "Mare de Luto", cost: "15 PE", range: "12m", effect: "Tristeza/Debuff. Pesa o ambiente. Inimigos fazem ESP CD 16 ou sofrem penalidade curta, terreno dificil ou bloqueio de cura. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "primitive", name: "Vontade Absoluta", cost: "10 PE", range: "Pessoal", effect: "Determinacao/Protecao. Fortalece vontade e corpo. Concede resistencia, PV temporario ou repeticao de save; versoes epicas tem limite por descanso longo. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "primitive", name: "Coracao Compartilhado", cost: "11 PE", range: "15m", effect: "Raiva/Ataque. Converte raiva em dano. Causa 8d6+Mod.ESP e pode empurrar, derrubar ou marcar; VIG/AGI CD 16 reduz efeito. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "primitive", name: "Raiva Canalizada", cost: "12 PE", range: "Toque", effect: "Amor/Cura. Cura 8d6 PV, protege ou cria vinculo emocional. Efeitos fortes tem limite por descanso. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "primitive", name: "Memoria Feliz", cost: "13 PE", range: "9m", effect: "Medo/Controle. Impoe medo ou hesitacao. Alvo faz ESP CD 16; controle forte permite novo teste no fim do turno. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "primitive", name: "Eu Continuo", cost: "14 PE", range: "9m", effect: "Alegria/Suporte. Inspira movimento, coragem e ritmo. Aliados recebem vantagem, +1d4 ou deslocamento extra; nao acumula consigo mesma. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Bencao Divina", cost: "3 PD", range: "9m", effect: "Luz/Suporte. Cura, purifica ou fere corrupcao. Cura 1d6 PV ou causa dano radiante; mortos-vivos e demonios sofrem pressao adicional. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Cura Divina", cost: "4 PD", range: "Toque", effect: "Natureza/Cura. Cura, invoca vida ou prende com raizes. Cura 1d6 PV ou controla terreno com save apropriado. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Palavra Sagrada", cost: "2 PD", range: "9m raio", effect: "Ordem/Controle. Impoe regra sagrada. Alvo faz DEV ou ESP CD 12; falha causa obediencia curta, contencao ou protecao por juramento. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Obscurecer", cost: "3 PD", range: "18m", effect: "Sombra/Utilitario. Oculta ou amaldicoa. Concede furtividade, escuridao ou penalidade com DEV CD 12. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Comunhao com Animais", cost: "4 PD", range: "Pessoal", effect: "Morte/Ataque. Lida com almas e necrose. Causa 1d6 necrotico, conversa com mortos ou impede cura ate VIG/DEV CD 12. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Toque da Morte", cost: "2 PD", range: "12m", effect: "Caos/Protecao. Gera milagre instavel. Dano fica em 1d6; efeitos de controle sempre permitem save. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Explosao Caotica", cost: "3 PD", range: "24m", effect: "Demonio/Especial. Firma pacto perigoso. Concede poder forte com preco, marca ou obrigacao; alvo involuntario faz DEV CD 12. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Maldicao", cost: "4 PD", range: "9m", effect: "Luz/Suporte. Cura, purifica ou fere corrupcao. Cura 1d6 PV ou causa dano radiante; mortos-vivos e demonios sofrem pressao adicional. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Raio Sagrado", cost: "2 PD", range: "Toque", effect: "Natureza/Cura. Cura, invoca vida ou prende com raizes. Cura 1d6 PV ou controla terreno com save apropriado. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Barreira Sagrada", cost: "3 PD", range: "9m raio", effect: "Ordem/Controle. Impoe regra sagrada. Alvo faz DEV ou ESP CD 12; falha causa obediencia curta, contencao ou protecao por juramento. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "faith", name: "Invocar Aliado Menor", cost: "7 PD", range: "18m", effect: "Sombra/Utilitario. Oculta ou amaldicoa. Concede furtividade, escuridao ou penalidade com DEV CD 13. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Tempestade Divina", cost: "4 PD", range: "Pessoal", effect: "Morte/Ataque. Lida com almas e necrose. Causa 2d6 necrotico, conversa com mortos ou impede cura ate VIG/DEV CD 13. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Decretar", cost: "5 PD", range: "12m", effect: "Caos/Protecao. Gera milagre instavel. Dano fica em 2d6; efeitos de controle sempre permitem save. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Cura em Area", cost: "6 PD", range: "24m", effect: "Demonio/Especial. Firma pacto perigoso. Concede poder forte com preco, marca ou obrigacao; alvo involuntario faz DEV CD 13. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Selo de Juramento", cost: "7 PD", range: "9m", effect: "Luz/Suporte. Cura, purifica ou fere corrupcao. Cura 2d6 PV ou causa dano radiante; mortos-vivos e demonios sofrem pressao adicional. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Manto de Sombras", cost: "4 PD", range: "Toque", effect: "Natureza/Cura. Cura, invoca vida ou prende com raizes. Cura 2d6 PV ou controla terreno com save apropriado. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Espinhos Sagrados", cost: "5 PD", range: "9m raio", effect: "Ordem/Controle. Impoe regra sagrada. Alvo faz DEV ou ESP CD 13; falha causa obediencia curta, contencao ou protecao por juramento. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Riso do Caos", cost: "6 PD", range: "18m", effect: "Sombra/Utilitario. Oculta ou amaldicoa. Concede furtividade, escuridao ou penalidade com DEV CD 13. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Marca Infernal", cost: "7 PD", range: "Pessoal", effect: "Morte/Ataque. Lida com almas e necrose. Causa 2d6 necrotico, conversa com mortos ou impede cura ate VIG/DEV CD 13. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Silencio Funerario", cost: "4 PD", range: "12m", effect: "Caos/Protecao. Gera milagre instavel. Dano fica em 2d6; efeitos de controle sempre permitem save. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "faith", name: "Forma Divina Menor", cost: "8 PD", range: "24m", effect: "Demonio/Especial. Firma pacto perigoso. Concede poder forte com preco, marca ou obrigacao; alvo involuntario faz DEV CD 15. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Praga", cost: "9 PD", range: "9m", effect: "Luz/Suporte. Cura, purifica ou fere corrupcao. Cura 4d6 PV ou causa dano radiante; mortos-vivos e demonios sofrem pressao adicional. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Destruicao Sagrada", cost: "10 PD", range: "Toque", effect: "Natureza/Cura. Cura, invoca vida ou prende com raizes. Cura 4d6 PV ou controla terreno com save apropriado. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Ressurreicao", cost: "11 PD", range: "9m raio", effect: "Ordem/Controle. Impoe regra sagrada. Alvo faz DEV ou ESP CD 15; falha causa obediencia curta, contencao ou protecao por juramento. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Correntes da Ordem", cost: "7 PD", range: "18m", effect: "Sombra/Utilitario. Oculta ou amaldicoa. Concede furtividade, escuridao ou penalidade com DEV CD 15. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Passagem das Almas", cost: "8 PD", range: "Pessoal", effect: "Morte/Ataque. Lida com almas e necrose. Causa 4d6 necrotico, conversa com mortos ou impede cura ate VIG/DEV CD 15. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Milagre Pequeno", cost: "9 PD", range: "12m", effect: "Caos/Protecao. Gera milagre instavel. Dano fica em 4d6; efeitos de controle sempre permitem save. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Circulo de Exorcismo", cost: "10 PD", range: "24m", effect: "Demonio/Especial. Firma pacto perigoso. Concede poder forte com preco, marca ou obrigacao; alvo involuntario faz DEV CD 15. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Chamado da Matilha", cost: "11 PD", range: "9m", effect: "Luz/Suporte. Cura, purifica ou fere corrupcao. Cura 4d6 PV ou causa dano radiante; mortos-vivos e demonios sofrem pressao adicional. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Pacto Sangrento", cost: "7 PD", range: "Toque", effect: "Natureza/Cura. Cura, invoca vida ou prende com raizes. Cura 4d6 PV ou controla terreno com save apropriado. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "faith", name: "Ressurreicao Total", cost: "16 PD", range: "9m raio", effect: "Ordem/Controle. Impoe regra sagrada. Alvo faz DEV ou ESP CD 16; falha causa obediencia curta, contencao ou protecao por juramento. Duracao/recarga: 1 hora." },
    { id: uid(), source: "faith", name: "Avatar Divino Completo", cost: "17 PD", range: "18m", effect: "Sombra/Utilitario. Oculta ou amaldicoa. Concede furtividade, escuridao ou penalidade com DEV CD 16. Duracao/recarga: 1 hora." },
    { id: uid(), source: "faith", name: "Juizo Final Menor", cost: "18 PD", range: "Pessoal", effect: "Morte/Ataque. Lida com almas e necrose. Causa 8d6 necrotico, conversa com mortos ou impede cura ate VIG/DEV CD 16. Duracao/recarga: 1 hora." },
    { id: uid(), source: "faith", name: "Noite Absoluta", cost: "19 PD", range: "12m", effect: "Caos/Protecao. Gera milagre instavel. Dano fica em 8d6; efeitos de controle sempre permitem save. Duracao/recarga: 1 hora." },
    { id: uid(), source: "faith", name: "Jardim Sagrado", cost: "20 PD", range: "24m", effect: "Demonio/Especial. Firma pacto perigoso. Concede poder forte com preco, marca ou obrigacao; alvo involuntario faz DEV CD 16. Duracao/recarga: 1 hora." },
    { id: uid(), source: "faith", name: "Roleta do Caos", cost: "12 PD", range: "9m", effect: "Luz/Suporte. Cura, purifica ou fere corrupcao. Cura 8d6 PV ou causa dano radiante; mortos-vivos e demonios sofrem pressao adicional. Duracao/recarga: 1 hora." },
    { id: uid(), source: "faith", name: "Contrato Maior", cost: "13 PD", range: "Toque", effect: "Natureza/Cura. Cura, invoca vida ou prende com raizes. Cura 8d6 PV ou controla terreno com save apropriado. Duracao/recarga: 1 hora." },
    { id: uid(), source: "faith", name: "Ceifador Invisivel", cost: "14 PD", range: "9m raio", effect: "Ordem/Controle. Impoe regra sagrada. Alvo faz DEV ou ESP CD 16; falha causa obediencia curta, contencao ou protecao por juramento. Duracao/recarga: 1 hora." },
    { id: uid(), source: "faith", name: "Voto Inquebravel", cost: "15 PD", range: "18m", effect: "Sombra/Utilitario. Oculta ou amaldicoa. Concede furtividade, escuridao ou penalidade com DEV CD 16. Duracao/recarga: 1 hora." },
    { id: uid(), source: "faith", name: "Graca Impossivel", cost: "16 PD", range: "Pessoal", effect: "Morte/Ataque. Lida com almas e necrose. Causa 8d6 necrotico, conversa com mortos ou impede cura ate VIG/DEV CD 16. Duracao/recarga: 1 hora." },
    { id: uid(), source: "tech", name: "Cristal de Arcana", cost: "Grau 1", range: "Variavel", effect: "Armazenamento. Armazenamento de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Bomba de Fumaca Arcana", cost: "Grau 2", range: "Variavel", effect: "Consumivel. Consumivel de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Eletrochoque Portatil", cost: "Grau 1", range: "Variavel", effect: "Arma. Arma de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Adaga Sifao", cost: "Grau 1", range: "Variavel", effect: "Arma. Arma de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Bomba Arcana", cost: "Grau 2", range: "Variavel", effect: "Consumivel. Consumivel de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Bomba Acida", cost: "Grau 1", range: "Variavel", effect: "Consumivel. Consumivel de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Lente de Visao Arcana", cost: "Grau 1", range: "Variavel", effect: "Ferramenta. Ferramenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Botas de Velocidade", cost: "Grau 2", range: "Variavel", effect: "Vestimenta. Vestimenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Capa de Protecao", cost: "Grau 1", range: "Variavel", effect: "Vestimenta. Vestimenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Sentinela de Pedra", cost: "Grau 1", range: "Variavel", effect: "Construto. Construto de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 10 para criar ou reparar. Duracao/recarga: 1 uso." },
    { id: uid(), source: "tech", name: "Drone Cartografo", cost: "Grau 3", range: "Variavel", effect: "Construto. Construto de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Luva de Repulsao", cost: "Grau 2", range: "Variavel", effect: "Ferramenta. Ferramenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Mascara de Filtro Abissal", cost: "Grau 2", range: "Variavel", effect: "Vestimenta. Vestimenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Braco Hidraulico", cost: "Grau 3", range: "Variavel", effect: "Protese. Protese de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Arpao Magnetico", cost: "Grau 2", range: "Variavel", effect: "Ferramenta. Ferramenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Granada Congelante", cost: "Grau 2", range: "Variavel", effect: "Consumivel. Consumivel de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Seringa Vital", cost: "Grau 3", range: "Variavel", effect: "Consumivel. Consumivel de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Placa Reativa", cost: "Grau 2", range: "Variavel", effect: "Armadura. Armadura de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Projetor de Luz Solar", cost: "Grau 2", range: "Variavel", effect: "Ferramenta. Ferramenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Chave Universal Runica", cost: "Grau 3", range: "Variavel", effect: "Ferramenta. Ferramenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 12 para criar ou reparar. Duracao/recarga: 3 cargas." },
    { id: uid(), source: "tech", name: "Mochila Gravitacional", cost: "Grau 3", range: "Variavel", effect: "Equipamento. Equipamento de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Gerador de Barreira", cost: "Grau 3", range: "Variavel", effect: "Dispositivo. Dispositivo de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Automato Cirurgiao", cost: "Grau 4", range: "Variavel", effect: "Construto. Construto de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Armadilha de Bobina", cost: "Grau 3", range: "Variavel", effect: "Armadilha. Armadilha de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Mina de Silencio", cost: "Grau 3", range: "Variavel", effect: "Armadilha. Armadilha de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Oculos de Predicao", cost: "Grau 4", range: "Variavel", effect: "Ferramenta. Ferramenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Motor de Ponte Dobravel", cost: "Grau 3", range: "Variavel", effect: "Estrutura. Estrutura de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Gaiola de Contencao", cost: "Grau 3", range: "Variavel", effect: "Estrutura. Estrutura de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Pistola de Cristal", cost: "Grau 4", range: "Variavel", effect: "Arma. Arma de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Rede Eletrorrunica", cost: "Grau 3", range: "Variavel", effect: "Arma. Arma de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 14 para criar ou reparar. Duracao/recarga: Permanente." },
    { id: uid(), source: "tech", name: "Coracao Mecanico Auxiliar", cost: "Grau 4", range: "Variavel", effect: "Protese. Protese de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "tech", name: "Bateria Prismatica", cost: "Grau 5", range: "Variavel", effect: "Armazenamento. Armazenamento de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "tech", name: "Canhao Portatil", cost: "Grau 4", range: "Variavel", effect: "Arma. Arma de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "tech", name: "Campo Estabilizador", cost: "Grau 4", range: "Variavel", effect: "Dispositivo. Dispositivo de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "tech", name: "Sonda de Veneno", cost: "Grau 5", range: "Variavel", effect: "Ferramenta. Ferramenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "tech", name: "Corda Autonoma", cost: "Grau 4", range: "Variavel", effect: "Ferramenta. Ferramenta de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "tech", name: "Selo Rastreador", cost: "Grau 4", range: "Variavel", effect: "Dispositivo. Dispositivo de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "tech", name: "Armadura de Exoesqueleto", cost: "Grau 5", range: "Variavel", effect: "Armadura. Armadura de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "tech", name: "Portal de Oficina", cost: "Grau 4", range: "Variavel", effect: "Estrutura. Estrutura de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "tech", name: "Nucleo de Golem", cost: "Grau 4", range: "Variavel", effect: "Construto. Construto de grau controlado. Produz dano, defesa, mobilidade, sensor ou automacao equivalente ao grau; usa cargas/manutencao e Tecnologia CD 16 para criar ou reparar. Duracao/recarga: Recarga longa." },
    { id: uid(), source: "aura", name: "Golpe de Aura", cost: "2 AU", range: "Pessoal", effect: "Ataque. Tecnica ofensiva ou pressao. Adiciona 1d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 12 reduz efeito secundario. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Passo de Cacador", cost: "1 AU", range: "9m", effect: "Movimento. Movimento marcial explosivo. Move, salta ou reposiciona sem provocar reacao; exige terreno possivel e gasto de AU. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Leitura de Aura", cost: "2 AU", range: "6m", effect: "Percepcao. Leitura ou presenca de aura. Revela intencao, rastro ou assinatura espiritual; alvo oculto pode resistir com ESP CD 12. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Pulso de Intencao", cost: "1 AU", range: "3m raio", effect: "Defesa. Leitura ou presenca de aura. Revela intencao, rastro ou assinatura espiritual; alvo oculto pode resistir com ESP CD 12. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Pele de Ferro", cost: "2 AU", range: "12m", effect: "Controle. Defesa corporal. Reduz dano, concede +1 a +2 Aparar, PV temporario ou repeticao de save por duracao curta. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Aura Protetora", cost: "1 AU", range: "Corpo a corpo", effect: "Suporte. Defesa corporal. Reduz dano, concede +1 a +2 Aparar, PV temporario ou repeticao de save por duracao curta. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Salto Impossivel", cost: "2 AU", range: "Pessoal", effect: "Reacao. Movimento marcial explosivo. Move, salta ou reposiciona sem provocar reacao; exige terreno possivel e gasto de AU. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Foco Marcial", cost: "1 AU", range: "9m", effect: "Especial. Tecnica ofensiva ou pressao. Adiciona 1d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 12 reduz efeito secundario. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Rugido de Guerra", cost: "2 AU", range: "6m", effect: "Ataque. Tecnica ofensiva ou pressao. Adiciona 1d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 12 reduz efeito secundario. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Veu de Presenca", cost: "1 AU", range: "3m raio", effect: "Movimento. Leitura ou presenca de aura. Revela intencao, rastro ou assinatura espiritual; alvo oculto pode resistir com ESP CD 12. Duracao/recarga: Instantaneo." },
    { id: uid(), source: "aura", name: "Contra-Ataque", cost: "4 AU", range: "12m", effect: "Percepcao. Tecnica ofensiva ou pressao. Adiciona 2d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 13 reduz efeito secundario. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Marca Animica", cost: "2 AU", range: "Corpo a corpo", effect: "Defesa. Leitura ou presenca de aura. Revela intencao, rastro ou assinatura espiritual; alvo oculto pode resistir com ESP CD 13. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Investida de Aura", cost: "3 AU", range: "Pessoal", effect: "Controle. Movimento marcial explosivo. Move, salta ou reposiciona sem provocar reacao; exige terreno possivel e gasto de AU. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Respiracao Profunda", cost: "4 AU", range: "9m", effect: "Suporte. Tecnica ofensiva ou pressao. Adiciona 2d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 13 reduz efeito secundario. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Olhos de Combate", cost: "2 AU", range: "6m", effect: "Reacao. Leitura ou presenca de aura. Revela intencao, rastro ou assinatura espiritual; alvo oculto pode resistir com ESP CD 13. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Postura Inabalavel", cost: "3 AU", range: "3m raio", effect: "Especial. Defesa corporal. Reduz dano, concede +1 a +2 Aparar, PV temporario ou repeticao de save por duracao curta. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Lamina Espiritual", cost: "4 AU", range: "12m", effect: "Ataque. Tecnica ofensiva ou pressao. Adiciona 2d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 13 reduz efeito secundario. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Surto de Aura", cost: "2 AU", range: "Corpo a corpo", effect: "Movimento. Tecnica ofensiva ou pressao. Adiciona 2d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 13 reduz efeito secundario. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Quebra de Guarda", cost: "3 AU", range: "Pessoal", effect: "Percepcao. Tecnica ofensiva ou pressao. Adiciona 2d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 13 reduz efeito secundario. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Escudo de Espirito", cost: "4 AU", range: "9m", effect: "Defesa. Defesa corporal. Reduz dano, concede +1 a +2 Aparar, PV temporario ou repeticao de save por duracao curta. Duracao/recarga: 1 rodada." },
    { id: uid(), source: "aura", name: "Explosao de Chi", cost: "4 AU", range: "6m", effect: "Controle. Tecnica ofensiva ou pressao. Adiciona 4d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 15 reduz efeito secundario. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Passo Entre Golpes", cost: "5 AU", range: "3m raio", effect: "Suporte. Movimento marcial explosivo. Move, salta ou reposiciona sem provocar reacao; exige terreno possivel e gasto de AU. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Grito Despertador", cost: "6 AU", range: "12m", effect: "Reacao. Defesa corporal. Reduz dano, concede +1 a +2 Aparar, PV temporario ou repeticao de save por duracao curta. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Maos que Prendem", cost: "3 AU", range: "Corpo a corpo", effect: "Especial. Tecnica ofensiva ou pressao. Adiciona 4d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 15 reduz efeito secundario. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Aura Cortante", cost: "4 AU", range: "Pessoal", effect: "Ataque. Tecnica ofensiva ou pressao. Adiciona 4d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 15 reduz efeito secundario. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Corpo Sem Peso", cost: "5 AU", range: "9m", effect: "Movimento. Movimento marcial explosivo. Move, salta ou reposiciona sem provocar reacao; exige terreno possivel e gasto de AU. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Instinto de Sobrevivencia", cost: "6 AU", range: "6m", effect: "Percepcao. Leitura ou presenca de aura. Revela intencao, rastro ou assinatura espiritual; alvo oculto pode resistir com ESP CD 15. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Punho Sismico", cost: "3 AU", range: "3m raio", effect: "Defesa. Tecnica ofensiva ou pressao. Adiciona 4d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 15 reduz efeito secundario. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Corte de Vento", cost: "4 AU", range: "12m", effect: "Controle. Movimento marcial explosivo. Move, salta ou reposiciona sem provocar reacao; exige terreno possivel e gasto de AU. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Determinacao Feroz", cost: "5 AU", range: "Corpo a corpo", effect: "Suporte. Defesa corporal. Reduz dano, concede +1 a +2 Aparar, PV temporario ou repeticao de save por duracao curta. Duracao/recarga: 1 minuto." },
    { id: uid(), source: "aura", name: "Lenda Marcial", cost: "8 AU", range: "Pessoal", effect: "Reacao. Tecnica ofensiva ou pressao. Adiciona 8d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 16 reduz efeito secundario. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "aura", name: "Campo de Duelo", cost: "5 AU", range: "9m", effect: "Especial. Tecnica ofensiva ou pressao. Adiciona 8d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 16 reduz efeito secundario. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "aura", name: "Muralha Humana", cost: "6 AU", range: "6m", effect: "Ataque. Defesa corporal. Reduz dano, concede +1 a +2 Aparar, PV temporario ou repeticao de save por duracao curta. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "aura", name: "Impacto Ascendente", cost: "7 AU", range: "3m raio", effect: "Movimento. Tecnica ofensiva ou pressao. Adiciona 8d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 16 reduz efeito secundario. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "aura", name: "Cacada Perfeita", cost: "8 AU", range: "12m", effect: "Percepcao. Movimento marcial explosivo. Move, salta ou reposiciona sem provocar reacao; exige terreno possivel e gasto de AU. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "aura", name: "Anular Dor", cost: "5 AU", range: "Corpo a corpo", effect: "Defesa. Defesa corporal. Reduz dano, concede +1 a +2 Aparar, PV temporario ou repeticao de save por duracao curta. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "aura", name: "Tempestade de Golpes", cost: "6 AU", range: "Pessoal", effect: "Controle. Tecnica ofensiva ou pressao. Adiciona 8d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 16 reduz efeito secundario. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "aura", name: "Espirito Indomavel", cost: "7 AU", range: "9m", effect: "Suporte. Defesa corporal. Reduz dano, concede +1 a +2 Aparar, PV temporario ou repeticao de save por duracao curta. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "aura", name: "Romper Encantamento", cost: "8 AU", range: "6m", effect: "Reacao. Tecnica ofensiva ou pressao. Adiciona 8d6 dano de aura, derruba, empurra ou corta reacao; FOR/VIG/AGI CD 16 reduz efeito secundario. Duracao/recarga: 10 minutos." },
    { id: uid(), source: "aura", name: "Avatar de Aura", cost: "5 AU", range: "3m raio", effect: "Especial. Leitura ou presenca de aura. Revela intencao, rastro ou assinatura espiritual; alvo oculto pode resistir com ESP CD 16. Duracao/recarga: 10 minutos." }
  ];
}
function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const data = JSON.parse(raw);
    return normalize(data);
  } catch {
    return defaultState();
  }
}
function normalize(data) {
  const base = defaultState();
  const merged = { ...base, ...data };
  merged.characters ||= [];
  merged.campaign = { ...base.campaign, ...(data.campaign || {}) };
  merged.notes ||= [];
  merged.creatures ||= [];
  merged.initiative ||= [];
  merged.magic ||= seedMagic();
  mergeSystemMagic(merged.magic);
  merged.rolls ||= [];
  merged.map = { ...base.map, ...(data.map || {}) };
  merged.map.id ||= uid();
  merged.map.name ||= "Mapa atual";
  merged.savedMaps ||= [];
  if (!merged.characters.length) {
    const c = blankCharacter();
    merged.characters.push(c);
  }
  merged.characters.forEach(c => {
    c.attrs = normalizeAttrs(c.attrs || {});
    c.saves = { ...Object.fromEntries(ATTRS.map(([key]) => [key, 0])), ...(c.saves || {}) };
    c.attacks = Array.isArray(c.attacks) ? c.attacks.map(normalizeAttack) : [];
    c.hp = { current: 12, max: 12, temp: 0, ...(c.hp || {}) };
    const resources = c.resources || {};
    c.resources = {
      pa: { current: 0, max: 0, ...(resources.pa || {}) },
      pe: { current: 0, max: 0, ...(resources.pe || {}) },
      pd: { current: 0, max: 0, ...(resources.pd || {}) },
      aura: { current: 0, max: 0, ...(resources.aura || {}) }
    };
    if (c.skills?.["Tecnologia dos Animais"] && !c.skills.Tecnologia) c.skills.Tecnologia = c.skills["Tecnologia dos Animais"];
    c.skills = { ...Object.fromEntries(SKILLS.map(([n]) => [n, 0])), ...(c.skills || {}) };
    c.knownSpellIds ||= [];
    c.customSpells ||= [];
    c.knownAbilityIds ||= [];
    c.customAbilities ||= [];
  });
  const expectedTiles = Number(merged.map.width) * Number(merged.map.height);
  if (!Array.isArray(merged.map.tiles) || merged.map.tiles.length !== expectedTiles) {
    merged.map.tiles = Array(expectedTiles).fill("floor");
  }
  merged.map.tiles = merged.map.tiles.map(sanitizeMapTile);
  merged.savedMaps = merged.savedMaps.map(map => {
    const width = Number(map.width) || base.map.width;
    const height = Number(map.height) || base.map.height;
    const expected = width * height;
    const tiles = Array.isArray(map.tiles) && map.tiles.length === expected ? map.tiles.map(sanitizeMapTile) : Array(expected).fill("floor");
    return { ...map, width, height, tiles };
  });
  delete merged.selectedCharacter;
  return merged;
}
function mergeSystemMagic(list) {
  const existing = new Set(list.map(spell => spell.name));
  seedMagic().forEach(spell => {
    if (!existing.has(spell.name)) list.push(spell);
  });
}
function saveSoon() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  byId("save-status").textContent = "Auto-salvo às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  queueCloudSave();
}
function saveNow() {
  saveSoon();
  toast("Dados salvos.");
}
