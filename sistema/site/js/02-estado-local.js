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
  taskQueue: Promise.resolve(),
  queuedTasks: 0,
  activeTask: "",
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
  return SYSTEM_MAGIC_CATALOG.map(spell => ({ id: uid(), ...spell }));
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
  const magicNameKey = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const systemByName = new Map(SYSTEM_MAGIC_CATALOG.map(spell => [magicNameKey(spell.name), spell]));
  const present = new Set();
  list.forEach(spell => {
    const systemSpell = systemByName.get(magicNameKey(spell.name));
    if (!systemSpell) return;
    Object.assign(spell, systemSpell);
    spell.id ||= uid();
    present.add(magicNameKey(systemSpell.name));
  });
  SYSTEM_MAGIC_CATALOG.forEach(spell => {
    const key = magicNameKey(spell.name);
    if (!present.has(key)) {
      list.push({ id: uid(), ...spell });
      present.add(key);
    }
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
