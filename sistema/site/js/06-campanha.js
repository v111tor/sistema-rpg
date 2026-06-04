function renderCampaign() {
  byId("campaign-name").value = state.campaign.name;
  byId("campaign-premise").value = state.campaign.premise;
  byId("campaign-session").value = state.campaign.session;
  byId("campaign-location").value = state.campaign.location;
  byId("campaign-secrets").value = state.campaign.secrets;
  ["name", "premise", "session", "location", "secrets"].forEach(key => {
    byId("campaign-" + key).onchange = event => {
      state.campaign[key] = event.target.value;
      saveSoon();
      renderCampaignMetrics();
    };
  });
  const party = state.campaign.partyIds.map(id => state.characters.find(c => c.id === id)).filter(Boolean);
  byId("party-list").innerHTML = party.length ? party.map(c => `
    <div class="item">
      <div class="item-head">
        <div><h4>${esc(c.name)}</h4><p>${esc(c.player)} | ${esc(c.role)} | Nível ${esc(c.level)}</p></div>
        <button class="btn small danger" onclick="removeFromCampaign('${c.id}')">Remover</button>
      </div>
    </div>
  `).join("") : `<div class="empty">Nenhum personagem vinculado à campanha.</div>`;
  renderNotes();
  renderCampaignMetrics();
}
function renderCampaignMetrics() {
  const partyCount = state.campaign.partyIds.length;
  byId("campaign-metrics").innerHTML = `
    <div class="item"><h4>${partyCount}</h4><p>Personagens vinculados</p></div>
    <div class="item"><h4>${state.creatures.length}</h4><p>Criaturas catalogadas</p></div>
    <div class="item"><h4>${state.notes.length}</h4><p>Notas de sessão</p></div>
  `;
}
function addAllCharactersToCampaign() {
  state.campaign.partyIds = [...new Set([...state.campaign.partyIds, ...state.characters.map(c => c.id)])];
  saveSoon();
  renderCampaign();
}
function removeFromCampaign(id) {
  state.campaign.partyIds = state.campaign.partyIds.filter(pid => pid !== id);
  saveSoon();
  renderCampaign();
}
function renderNotes() {
  const list = state.notes.filter(n =>
    textMatches(`${n.title} ${n.body}`, filters.notes.search) &&
    textMatches(n.tag, filters.notes.tag)
  );
  byId("note-list").innerHTML = list.length ? list.map(n => `
    <div class="item">
      <div class="item-head">
        <div><h4>${esc(n.title)}</h4><p><span class="pill gold">${esc(n.tag)}</span></p></div>
        <div class="row">
          <button class="btn small" onclick="openNote('${n.id}')">Editar</button>
          <button class="btn small danger" onclick="deleteNote('${n.id}')">Excluir</button>
        </div>
      </div>
      <p>${esc(n.body)}</p>
    </div>
  `).join("") : `<div class="empty">Nenhuma nota encontrada.</div>`;
}
function addNote() { openNote(); }
function openNote(id) {
  const existing = state.notes.find(n => n.id === id);
  const n = existing || { id: uid(), title: "", tag: "Sessão", body: "" };
  openModal(existing ? "Editar nota" : "Nova nota", `
    <div class="grid">
      <div><label>Título</label><input id="note-title" value="${esc(n.title)}"></div>
      <div><label>Etiqueta</label><input id="note-tag" value="${esc(n.tag)}"></div>
      <div><label>Texto</label><textarea id="note-body">${esc(n.body)}</textarea></div>
    </div>
  `, [
    ["Salvar", "primary", () => {
      n.title = byId("note-title").value || "Nota";
      n.tag = byId("note-tag").value || "Sessão";
      n.body = byId("note-body").value;
      if (!existing) state.notes.unshift(n);
      closeModal(); saveSoon(); renderCampaign();
    }],
    ["Cancelar", "", closeModal]
  ]);
}
function deleteNote(id) {
  state.notes = state.notes.filter(n => n.id !== id);
  saveSoon();
  renderCampaign();
}
