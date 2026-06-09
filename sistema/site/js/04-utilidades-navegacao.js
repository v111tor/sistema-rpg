function byId(id) { return document.getElementById(id); }
function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
function normalizeText(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function textMatches(value, query) {
  return !query || normalizeText(value).includes(normalizeText(query));
}
function setFilter(group, key, value) {
  filters[group][key] = value;
  if (group === "characters") renderCharacterList();
  if (group === "notes") renderNotes();
  if (group === "creatures") renderCreatures();
  if (group === "magic") {
    if (typeof scheduleMagicListRender === "function") scheduleMagicListRender();
    else renderMagic();
  }
  if (group === "characterSpells") renderSheet();
  if (group === "abilities") renderSheet();
}
function attrDie(value) {
  if (ATTR_DICE.includes(String(value))) return String(value);
  return legacyAttrToDie(value);
}
function legacyAttrToDie(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "d4";
  if (n >= 20) return "d20";
  if (n >= 18) return "d12";
  if (n >= 16) return "d10";
  if (n >= 14) return "d8";
  if (n >= 12) return "d6";
  return "d4";
}
function normalizeAttrs(attrs = {}) {
  return {
    FOR: attrDie(attrs.FOR ?? attrs.STR),
    AGI: attrDie(attrs.AGI ?? attrs.DEX),
    VIG: attrDie(attrs.VIG ?? attrs.CON),
    INT: attrDie(attrs.INT),
    ESP: attrDie(attrs.ESP ?? attrs.WIS ?? attrs.CHA),
    DEV: attrDie(attrs.DEV ?? attrs.WIS)
  };
}
function normalizeAttack(attack = {}) {
  return {
    id: attack.id || uid(),
    name: String(attack.name || "Ataque comum"),
    attr: ATTRS.some(([key]) => key === attack.attr) ? attack.attr : "FOR",
    bonus: Number(attack.bonus) || 0,
    damage: String(attack.damage || "1d4"),
    range: String(attack.range || "Corpo a corpo"),
    type: String(attack.type || ""),
    notes: String(attack.notes || "")
  };
}
function dieSides(value) {
  return Number(String(attrDie(value)).replace("d", "")) || 4;
}
function mod(value) {
  const table = { d4: 0, d6: 1, d8: 2, d10: 3, d12: 4, d20: 6 };
  return table[attrDie(value)] ?? 0;
}
function signed(n) { return n >= 0 ? "+" + n : String(n); }
function slugText(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function classHpProfile(role) {
  const text = slugText(role);
  return Object.entries(CLASS_HP).find(([key]) => text.includes(key))?.[1] || CLASS_HP.guerreiro;
}
function calcMaxHp(c) {
  const profile = classHpProfile(c.role);
  const vigor = attrDie(c.attrs?.VIG);
  const vigorHp = VIGOR_HP[vigor] || VIGOR_HP.d4;
  return vigorHp + profile.value;
}
function hpCalcDetails(c) {
  const profile = classHpProfile(c.role);
  const vigor = attrDie(c.attrs?.VIG);
  const vigorHp = VIGOR_HP[vigor] || VIGOR_HP.d4;
  return { profile, vigor, vigorHp, total: vigorHp + profile.value };
}
function skillAttr(c, attr) {
  if (String(attr).includes("/")) {
    return String(attr).split("/").sort((a, b) => mod(c.attrs[b]) - mod(c.attrs[a]))[0];
  }
  return attr;
}
function profValue(c, skillName) {
  const [, attr] = SKILLS.find(([name]) => name === skillName) || ["", "INT"];
  const chosen = skillAttr(c, attr);
  return Number(c.skills[skillName]) ? mod(c.attrs[chosen]) : 0;
}
function saveBonus(c, attr) {
  return mod(c.attrs[attr]) + (Number(c.saves?.[attr]) ? Number(c.prof) || 0 : 0);
}
function currentCharacter() {
  return state.characters.find(c => c.id === selectedCharacterId()) || state.characters[0];
}

document.querySelectorAll(".nav button").forEach(btn => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});
byId("import-file").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = normalize(JSON.parse(reader.result));
      saveSoon();
      renderAll();
      toast("Backup importado.");
    } catch {
      toast("Arquivo inválido.");
    }
  };
  reader.readAsText(file);
});

function showTab(tab) {
  document.querySelectorAll(".tabs").forEach(el => el.classList.toggle("active", el.id === "tab-" + tab));
  document.querySelectorAll(".nav button").forEach(el => el.classList.toggle("active", el.dataset.tab === tab));
  const titles = { ficha: "Personagem", campanha: "Campanhas", mestre: "Criaturas", mapas: "Mapas", magia: "Habilidades", dados: "Dados" };
  byId("page-title").textContent = titles[tab] || "Mesa RPG";
  if (tab === "mapas") { renderMapTools(); renderMap(); }
}

function renderAll() {
  renderCharacterList();
  renderSheet();
  renderCampaign();
  renderCreatures();
  renderInitiative();
  renderMapTools();
  renderMap();
  renderMagic();
  renderRolls();
  syncFilterControls();
}
function syncFilterControls() {
  const creatureSource = byId("creature-source-filter");
  if (creatureSource) {
    creatureSource.innerHTML = `<option value="">Todas as fontes</option>` + Object.entries(SOURCES).map(([key, src]) => `<option value="${key}" ${filters.creatures.source === key ? "selected" : ""}>${src.title}</option>`).join("");
  }
  const creatureType = byId("creature-type-filter");
  if (creatureType) {
    const types = [...new Set([...state.creatures.map(c => c.type), ...BESTIARY_CATALOG.map(c => c.type)].filter(Boolean))].sort();
    creatureType.innerHTML = `<option value="">Todos os tipos</option>` + types.map(type => `<option value="${esc(type)}" ${filters.creatures.type === type ? "selected" : ""}>${esc(type)}</option>`).join("");
  }
  const magicSource = byId("magic-source-filter");
  if (magicSource) {
    magicSource.innerHTML = `<option value="">Todas as fontes</option>` + Object.entries(SOURCES).map(([key, src]) => `<option value="${key}" ${filters.magic.source === key ? "selected" : ""}>${src.title}</option>`).join("");
  }
}
