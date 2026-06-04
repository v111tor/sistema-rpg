function renderCreatures() {
  const list = state.creatures.filter(m => {
    const sourceOk = !filters.creatures.source || m.source === filters.creatures.source;
    const typeOk = !filters.creatures.type || m.type === filters.creatures.type;
    const searchOk = textMatches(`${m.name} ${m.type} ${m.threat} ${m.attacks} ${m.notes}`, filters.creatures.search);
    return sourceOk && typeOk && searchOk;
  });
  const catalog = BESTIARY_CATALOG.filter(m => {
    const sourceOk = !filters.creatures.source || sourceToKey(m.source) === filters.creatures.source;
    const typeOk = !filters.creatures.type || m.type === filters.creatures.type;
    const searchOk = textMatches(`${m.name} ${m.type} ${m.source} ${m.environment} ${m.grade}`, filters.creatures.search);
    return sourceOk && typeOk && searchOk;
  });
  byId("creature-list").innerHTML = `
    <div class="section-title"><h3>Criaturas da campanha</h3></div>
    ${list.length ? list.map(m => `
    <div class="item magic-source ${esc(m.source)}">
      <div class="item-head">
        <div>
          <h4>${esc(m.name)}</h4>
          <p>${esc(m.type)} | CA ${esc(m.ac)} | PV ${esc(m.hp)} | Grau ${esc(m.threat)}</p>
        </div>
        <div class="row">
          <button class="btn small" onclick="addCreatureToInitiative('${m.id}')">Iniciativa</button>
          <button class="btn small" onclick="openCreatureForm('${m.id}')">Editar</button>
        </div>
      </div>
      <p><b>Ações:</b> ${esc(m.attacks)}</p>
      <p>${esc(m.notes)}</p>
    </div>
    `).join("") : `<div class="empty">Nenhuma criatura da campanha encontrada.</div>`}
    <div class="section-title" style="margin-top:16px"><h3>Catálogo do bestiário</h3><span class="pill gold">${catalog.length} criaturas</span></div>
    <div class="grid two">
      ${catalog.length ? catalog.map(m => `
        <div class="item">
          <div class="item-head">
            <div>
              <h4>${esc(m.name)}</h4>
              <p>${esc(m.type)} | ${esc(m.source)} | ${esc(m.environment)} | Grau ${esc(m.grade)}</p>
            </div>
            <button class="btn small primary" onclick="addBestiaryCreature('${m.id}')">Adicionar</button>
          </div>
          <p>CA ${esc(m.ac)} | PV ${esc(m.hp)} | ${esc(m.attacks)}</p>
        </div>
      `).join("") : `<div class="empty">Nenhuma criatura do bestiário encontrada.</div>`}
    </div>
  `;
}
function sourceToKey(source) {
  const table = { "Arcana":"arcana", "Primitiva":"primitive", "Fé":"faith", "Tecnologia":"tech", "Absorção":"absorption", "Natural":"natural", "Aura":"aura" };
  return table[source] || source;
}
function addBestiaryCreature(id) {
  const m = BESTIARY_CATALOG.find(x => x.id === id);
  if (!m) return;
  state.creatures.unshift({
    id: uid(), name: m.name, type: m.type, hp: m.hp, ac: m.ac,
    init: 0, threat: "Grau " + m.grade, source: sourceToKey(m.source),
    attacks: m.attacks, notes: `${m.source}; ${m.environment}. Importada do bestiário.`
  });
  saveSoon();
  renderCreatures();
  renderMapCreatureSelect();
  renderCampaignMetrics();
}
function openCreatureForm(id) {
  const existing = state.creatures.find(m => m.id === id);
  const m = existing || { id: uid(), name: "", type: "", hp: 10, ac: 10, init: 0, threat: "Baixo", source: "arcana", attacks: "", notes: "" };
  openModal(existing ? "Editar criatura" : "Nova criatura", `
    <div class="grid">
      <div class="grid three">
        <div><label>Nome</label><input id="cr-name" value="${esc(m.name)}"></div>
        <div><label>Tipo</label><input id="cr-type" value="${esc(m.type)}"></div>
        <div><label>Fonte</label><select id="cr-source">${Object.entries(SOURCES).map(([k,v]) => `<option value="${k}" ${m.source === k ? "selected" : ""}>${v.title}</option>`).join("")}</select></div>
      </div>
      <div class="grid four">
        <div><label>PV</label><input id="cr-hp" type="number" value="${esc(m.hp)}"></div>
        <div><label>CA</label><input id="cr-ac" type="number" value="${esc(m.ac)}"></div>
        <div><label>Iniciativa</label><input id="cr-init" type="number" value="${esc(m.init)}"></div>
        <div><label>Grau</label><input id="cr-threat" value="${esc(m.threat)}"></div>
      </div>
      <div><label>Ações</label><textarea id="cr-attacks">${esc(m.attacks)}</textarea></div>
      <div><label>Notas</label><textarea id="cr-notes">${esc(m.notes)}</textarea></div>
    </div>
  `, [
    ["Salvar", "primary", () => {
      Object.assign(m, {
        name: byId("cr-name").value || "Criatura",
        type: byId("cr-type").value,
        source: byId("cr-source").value,
        hp: Number(byId("cr-hp").value) || 1,
        ac: Number(byId("cr-ac").value) || 10,
        init: Number(byId("cr-init").value) || 0,
        threat: byId("cr-threat").value,
        attacks: byId("cr-attacks").value,
        notes: byId("cr-notes").value
      });
      if (!existing) state.creatures.unshift(m);
      closeModal(); saveSoon(); renderCreatures(); renderMapCreatureSelect(); renderMap(); renderCampaignMetrics();
    }],
    ...(existing ? [["Excluir", "danger", () => { state.creatures = state.creatures.filter(x => x.id !== m.id); closeModal(); saveSoon(); renderCreatures(); renderMapCreatureSelect(); renderMap(); }]] : []),
    ["Cancelar", "", closeModal]
  ]);
}

function addCharacterToInitiative(id) {
  const c = state.characters.find(x => x.id === id);
  state.initiative.push({ id: uid(), name: c.name, type: "PJ", hp: c.hp.current, ac: c.ac, bonus: mod(c.attrs.AGI) + Number(c.initiative || 0), roll: 0, active: false });
  saveSoon(); renderInitiative(); showTab("mestre");
}
function addCreatureToInitiative(id) {
  const m = state.creatures.find(x => x.id === id);
  state.initiative.push({ id: uid(), name: m.name, type: "Criatura", hp: m.hp, ac: m.ac, bonus: Number(m.init) || 0, roll: 0, active: false });
  saveSoon(); renderInitiative();
}
function rollInitiative() {
  state.initiative.forEach(e => e.roll = d(20) + Number(e.bonus || 0));
  state.initiative.sort((a, b) => b.roll - a.roll);
  state.initiative.forEach((e, i) => e.active = i === 0);
  saveSoon(); renderInitiative();
}
function nextTurn() {
  if (!state.initiative.length) return;
  let idx = state.initiative.findIndex(e => e.active);
  state.initiative.forEach(e => e.active = false);
  state.initiative[(idx + 1) % state.initiative.length].active = true;
  saveSoon(); renderInitiative();
}
function clearInitiative() {
  state.initiative = [];
  saveSoon(); renderInitiative();
}
function renderInitiative() {
  byId("initiative-list").innerHTML = state.initiative.length ? state.initiative.map(e => `
    <div class="item ${e.active ? "active" : ""}">
      <div class="item-head">
        <div><h4>${esc(e.name)}</h4><p>${esc(e.type)} | CA ${esc(e.ac)} | PV ${esc(e.hp)} | bônus ${signed(Number(e.bonus || 0))}</p></div>
        <span class="pill gold">${esc(e.roll || "-")}</span>
      </div>
    </div>
  `).join("") : `<div class="empty">Adicione personagens ou criaturas ao encontro.</div>`;
}
