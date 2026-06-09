let magicListRenderTimer = null;
let magicSourcesRendered = false;

function renderMagic() {
  renderMagicSources();
  renderMagicList();
}
function renderMagicSources() {
  if (magicSourcesRendered) return;
  byId("magic-sources").innerHTML = Object.entries(SOURCES).map(([key, src]) => `
    <div class="item magic-source ${key}">
      <h4>${src.title} <span class="pill ${src.color}">${src.resource}</span></h4>
      <p>${src.text}</p>
    </div>
  `).join("");
  magicSourcesRendered = true;
}
function scheduleMagicListRender() {
  clearTimeout(magicListRenderTimer);
  magicListRenderTimer = setTimeout(renderMagicList, 120);
}
function renderMagicList() {
  const list = state.magic.filter(m => {
    const sourceOk = !filters.magic.source || m.source === filters.magic.source;
    const searchOk = textMatches(`${m.name} ${m.type} ${m.cost} ${m.range} ${m.duration} ${m.effect}`, filters.magic.search);
    return sourceOk && searchOk;
  });
  byId("magic-list").innerHTML = list.map(m => {
    const src = SOURCES[m.source] || SOURCES.arcana;
    const details = [src.title, m.type, m.cost, m.range].filter(Boolean).map(esc).join(" | ");
    return `
      <div class="item magic-source ${esc(m.source)}">
        <div class="item-head">
          <div><h4>${esc(m.name)}</h4><p>${details}</p></div>
          <button class="btn small" onclick="openMagicForm('${m.id}')">Editar</button>
        </div>
        <p>${esc(m.effect)}</p>
      </div>
    `;
  }).join("") || `<div class="empty">Nenhuma habilidade encontrada.</div>`;
}
function openMagicForm(id) {
  const existing = state.magic.find(m => m.id === id);
  const m = existing || { id: uid(), source: "arcana", name: "", cost: "", range: "", effect: "" };
  openModal(existing ? "Editar habilidade" : "Nova habilidade", `
    <div class="grid">
      <div class="grid three">
        <div><label>Nome</label><input id="mg-name" value="${esc(m.name)}"></div>
        <div><label>Fonte</label><select id="mg-source">${Object.entries(SOURCES).map(([k,v]) => `<option value="${k}" ${m.source === k ? "selected" : ""}>${v.title}</option>`).join("")}</select></div>
        <div><label>Custo</label><input id="mg-cost" value="${esc(m.cost)}"></div>
      </div>
      <div><label>Alcance / duração</label><input id="mg-range" value="${esc(m.range)}"></div>
      <div><label>Efeito mecânico</label><textarea id="mg-effect">${esc(m.effect)}</textarea></div>
    </div>
  `, [
    ["Salvar", "primary", () => {
      Object.assign(m, { name: byId("mg-name").value || "Registro de habilidade", source: byId("mg-source").value, cost: byId("mg-cost").value, range: byId("mg-range").value, effect: byId("mg-effect").value });
      if (!existing) state.magic.unshift(m);
      closeModal(); saveSoon(); renderMagic();
    }],
    ...(existing ? [["Excluir", "danger", () => { state.magic = state.magic.filter(x => x.id !== m.id); closeModal(); saveSoon(); renderMagic(); }]] : []),
    ["Cancelar", "", closeModal]
  ]);
}
