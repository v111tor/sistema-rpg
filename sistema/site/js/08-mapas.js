let mapViewMode = localStorage.getItem("mesa_rpg_map_view_mode_v1") || "gm";
let selectedVisibilityTool = "";

function renderMapTools() {
  ensureMapVisibility();
  renderMapCreatureSelect();
  byId("map-tools").innerHTML = MAP_TOOLS.map(tool => {
    const [key, label] = tool;
    return `<button class="tool ${esc(key)} ${selectedTool === key ? "active" : ""}" title="${esc(label)}" onclick="selectMapTool('${key}')">${mapToolContent(tool)}<span>${esc(label)}</span></button>`;
  }).join("");
  renderMapPrivacy();
  renderMapLegend();
  byId("map-name").value = state.map.name || "Mapa atual";
  byId("map-name").onchange = event => {
    state.map.name = event.target.value || "Mapa atual";
    saveSoon();
    renderSavedMaps();
  };
  byId("map-width").value = state.map.width;
  byId("map-height").value = state.map.height;
  renderSavedMaps();
}
function ensureMapVisibility(map = state.map, defaultVisible = true) {
  const width = Number(map.width) || 18;
  const height = Number(map.height) || 12;
  const expected = width * height;
  if (!Array.isArray(map.visibility) || map.visibility.length !== expected) {
    map.visibility = Array(expected).fill(defaultVisible);
  } else {
    map.visibility = map.visibility.map(value => value !== false);
  }
  return map.visibility;
}
function isPlayerMapView() {
  return mapViewMode === "player";
}
function renderMapPrivacy() {
  const el = byId("map-privacy");
  if (!el) return;
  ensureMapVisibility();
  const revealed = state.map.visibility.filter(Boolean).length;
  const total = state.map.visibility.length;
  const tools = [
    ["reveal", "Revelar célula"],
    ["hide", "Ocultar célula"],
    ["reveal-area", "Revelar área"],
    ["hide-area", "Ocultar área"]
  ];
  el.innerHTML = `
    <div class="segmented map-view-toggle" role="group" aria-label="Visualização do mapa">
      <button class="${mapViewMode === "gm" ? "active" : ""}" onclick="setMapViewMode('gm')">Mestre</button>
      <button class="${mapViewMode === "player" ? "active" : ""}" onclick="setMapViewMode('player')">Jogadores</button>
    </div>
    <div class="tool-grid visibility-tools">
      ${tools.map(([key, label]) => `<button class="tool visibility ${selectedVisibilityTool === key ? "active" : ""}" onclick="selectVisibilityTool('${key}')"><span>${esc(label)}</span></button>`).join("")}
    </div>
    <div class="row compact" style="margin-top:8px">
      <button class="btn small" onclick="revealAllMap()">Revelar tudo</button>
      <button class="btn small" onclick="hideAllMap()">Ocultar tudo</button>
      <button class="btn small" onclick="clearVisibilityTool()">Editar terreno</button>
    </div>
    <p class="muted">${revealed}/${total} espaços revelados para jogadores.</p>
  `;
}
function setMapViewMode(mode) {
  mapViewMode = mode === "player" ? "player" : "gm";
  localStorage.setItem("mesa_rpg_map_view_mode_v1", mapViewMode);
  renderMapPrivacy();
  renderMap();
}
function selectVisibilityTool(key) {
  selectedVisibilityTool = selectedVisibilityTool === key ? "" : key;
  if (selectedVisibilityTool) selectedTool = "";
  renderMapTools();
}
function clearVisibilityTool() {
  selectedVisibilityTool = "";
  if (!selectedTool) selectedTool = "floor";
  renderMapTools();
}
function revealAllMap() {
  ensureMapVisibility();
  state.map.visibility = state.map.visibility.map(() => true);
  saveSoon();
  renderMapTools();
  renderMap();
}
function hideAllMap() {
  ensureMapVisibility();
  state.map.visibility = state.map.visibility.map(() => false);
  saveSoon();
  renderMapTools();
  renderMap();
}
function setTileVisibility(idx, visible, radius = 0) {
  ensureMapVisibility();
  const width = Number(state.map.width) || 18;
  const height = Number(state.map.height) || 12;
  const cx = idx % width;
  const cy = Math.floor(idx / width);
  for (let y = Math.max(0, cy - radius); y <= Math.min(height - 1, cy + radius); y++) {
    for (let x = Math.max(0, cx - radius); x <= Math.min(width - 1, cx + radius); x++) {
      state.map.visibility[y * width + x] = visible;
    }
  }
}
function applyVisibilityTool(idx) {
  if (!selectedVisibilityTool) return false;
  const reveal = selectedVisibilityTool === "reveal" || selectedVisibilityTool === "reveal-area";
  const radius = selectedVisibilityTool.endsWith("-area") ? 1 : 0;
  setTileVisibility(idx, reveal, radius);
  saveSoon();
  renderMapTools();
  renderMap();
  return true;
}
function renderMapCreatureSelect() {
  const select = byId("map-creature-select");
  if (!select) return;
  if (!selectedMapCreature && state.creatures[0]) selectedMapCreature = state.creatures[0].id;
  if (selectedMapCreature && !state.creatures.some(c => c.id === selectedMapCreature)) selectedMapCreature = state.creatures[0]?.id || "";
  select.innerHTML = state.creatures.length
    ? state.creatures.map(c => `<option value="${esc(c.id)}" ${selectedMapCreature === c.id ? "selected" : ""}>${esc(c.name)} - ${esc(c.type || "Criatura")}</option>`).join("")
    : `<option value="">Nenhuma criatura cadastrada</option>`;
  select.disabled = !state.creatures.length;
}
function selectMapCreature(id) {
  selectedMapCreature = id;
}
function renderMapLegend() {
  const legend = byId("map-legend");
  if (!legend) return;
  legend.innerHTML = MAP_TOOLS.map(tool => {
    const [key, label] = tool;
    return `
    <div class="legend-item">
      <span class="legend-symbol ${esc(key)}">${mapToolContent(tool)}</span>
      <span>${esc(label)}</span>
    </div>
  `;
  }).join("");
}
function selectMapTool(key) {
  selectedTool = key;
  selectedVisibilityTool = "";
  renderMapTools();
}
function mapToolByKey(key) {
  return MAP_TOOLS.find(([toolKey]) => toolKey === key);
}
function mapToolContent(tool) {
  const [, label, symbol, icon] = tool || [];
  if (icon) {
    return `<img class="map-icon" src="${MAP_ICON_BASE + esc(icon)}" alt="${esc(label || "")}" loading="lazy">`;
  }
  return esc(symbol || "");
}
function tileType(tile) {
  return typeof tile === "object" && tile ? tile.type || "floor" : tile || "floor";
}
function sanitizeMapTile(tile) {
  const type = tileType(tile);
  const validType = mapToolByKey(type) ? type : "floor";
  const creatureId = tileCreatureId(tile);
  if ((validType === "token-npc" || validType === "token-boss") && creatureId) {
    return { type: validType, creatureId };
  }
  return validType;
}
function cloneMapVisibility(map = state.map) {
  return ensureMapVisibility(map).map(Boolean);
}
function tileCreatureId(tile) {
  return typeof tile === "object" && tile ? tile.creatureId || "" : "";
}
function cloneMapTile(tile) {
  return typeof tile === "object" && tile ? { ...tile } : tile;
}
function creatureById(id) {
  return state.creatures.find(c => c.id === id);
}
function linkedCreatureTile(type) {
  if ((type === "token-npc" || type === "token-boss") && selectedMapCreature) {
    return { type, creatureId: selectedMapCreature };
  }
  return type;
}
function mapCreatureCard(tile) {
  const creature = creatureById(tileCreatureId(tile));
  if (!creature) return "";
  const source = SOURCES[creature.source]?.title || creature.source || "-";
  return `
    <div class="tile-card">
      <h4>${esc(creature.name)}</h4>
      <p>${esc(creature.type || "Criatura")} | ${esc(source)} | ${esc(creature.threat || "-")}</p>
      <p>CA ${esc(creature.ac)} | PV ${esc(creature.hp)} | Inic. ${signed(Number(creature.init || 0))}</p>
      <p>${esc(creature.attacks || "Sem ações registradas.")}</p>
    </div>
  `;
}
function openMapCreatureSheet(tileIdx) {
  const tile = state.map.tiles[tileIdx];
  const creature = creatureById(tileCreatureId(tile));
  if (!creature) {
    toast("Criatura não encontrada. Ela pode ter sido excluída da campanha.");
    return;
  }
  const source = SOURCES[creature.source]?.title || creature.source || "-";
  openModal("Ficha da criatura", `
    <div class="grid">
      <div class="item magic-source ${esc(creature.source || "")}">
        <div class="item-head">
          <div>
            <h4>${esc(creature.name)}</h4>
            <p>${esc(creature.type || "Criatura")} | ${esc(source)} | ${esc(creature.threat || "-")}</p>
          </div>
          <span class="pill red">Mapa</span>
        </div>
        <div class="grid four" style="margin-top:10px">
          <div class="sheet-metric"><b>${esc(creature.hp)}</b><span>PV</span></div>
          <div class="sheet-metric"><b>${esc(creature.ac)}</b><span>CA</span></div>
          <div class="sheet-metric"><b>${signed(Number(creature.init || 0))}</b><span>Iniciativa</span></div>
          <div class="sheet-metric"><b>${esc(creature.threat || "-")}</b><span>Grau</span></div>
        </div>
      </div>
      <div class="panel">
        <div class="section-title"><h3>Ações</h3></div>
        <p>${esc(creature.attacks || "Sem ações registradas.")}</p>
      </div>
      <div class="panel">
        <div class="section-title"><h3>Notas</h3></div>
        <p>${esc(creature.notes || "Sem notas.")}</p>
      </div>
    </div>
  `, [
    ["Iniciativa", "primary", () => { addCreatureToInitiative(creature.id); closeModal(); }],
    ["Editar", "", () => { closeModal(); openCreatureForm(creature.id); }],
    ["Remover do mapa", "danger", () => { state.map.tiles[tileIdx] = "floor"; closeModal(); saveSoon(); renderMap(); }],
    ["Fechar", "", closeModal]
  ]);
}
function mapTileClick(event, idx) {
  if (applyVisibilityTool(idx)) return;
  if (isPlayerMapView()) return;
  const tile = state.map.tiles[idx];
  if (tileCreatureId(tile) && !event.shiftKey) {
    openMapCreatureSheet(idx);
    return;
  }
  paintTile(idx);
}
function resizeMap() {
  const width = Math.max(8, Math.min(40, Number(byId("map-width").value) || 18));
  const height = Math.max(8, Math.min(32, Number(byId("map-height").value) || 12));
  const old = state.map;
  const tiles = Array(width * height).fill("floor");
  const visibility = Array(width * height).fill(true);
  ensureMapVisibility(old);
  for (let y = 0; y < Math.min(height, old.height); y++) {
    for (let x = 0; x < Math.min(width, old.width); x++) {
      tiles[y * width + x] = cloneMapTile(old.tiles[y * old.width + x] || "floor");
      visibility[y * width + x] = old.visibility[y * old.width + x] !== false;
    }
  }
  state.map = { ...old, width, height, tiles, visibility };
  saveSoon(); renderMap();
}
function clearMap() {
  state.map.tiles = Array(state.map.width * state.map.height).fill("floor");
  state.map.visibility = Array(state.map.width * state.map.height).fill(true);
  saveSoon(); renderMap();
}
function mapSnapshot() {
  ensureMapVisibility();
  return {
    id: state.map.id || uid(),
    name: state.map.name || "Mapa sem nome",
    width: state.map.width,
    height: state.map.height,
    tiles: state.map.tiles.map(cloneMapTile),
    visibility: cloneMapVisibility(),
    updatedAt: new Date().toISOString()
  };
}
function saveCurrentMap() {
  const snap = mapSnapshot();
  const idx = state.savedMaps.findIndex(m => m.id === snap.id);
  if (idx >= 0) state.savedMaps[idx] = snap;
  else state.savedMaps.unshift(snap);
  state.map.id = snap.id;
  saveSoon();
  renderSavedMaps();
  toast("Mapa salvo no banco.");
}
function loadSavedMap(id) {
  const map = state.savedMaps.find(m => m.id === id);
  if (!map) return;
  ensureMapVisibility(map);
  state.map = { id: map.id, name: map.name, width: map.width, height: map.height, tiles: map.tiles.map(cloneMapTile), visibility: map.visibility.map(Boolean) };
  saveSoon();
  renderMapTools();
  renderMap();
}
function duplicateSavedMap(id) {
  const map = state.savedMaps.find(m => m.id === id);
  if (!map) return;
  ensureMapVisibility(map);
  const copy = { ...map, id: uid(), name: map.name + " (cópia)", tiles: map.tiles.map(cloneMapTile), visibility: map.visibility.map(Boolean), updatedAt: new Date().toISOString() };
  state.savedMaps.unshift(copy);
  saveSoon();
  renderSavedMaps();
}
function renameSavedMap(id) {
  const map = state.savedMaps.find(m => m.id === id);
  if (!map) return;
  const name = prompt("Novo nome do mapa:", map.name);
  if (!name) return;
  map.name = name;
  map.updatedAt = new Date().toISOString();
  if (state.map.id === id) state.map.name = name;
  saveSoon();
  renderMapTools();
}
function deleteSavedMap(id) {
  state.savedMaps = state.savedMaps.filter(m => m.id !== id);
  saveSoon();
  renderSavedMaps();
}
function renderSavedMaps() {
  const el = byId("saved-map-list");
  if (!el) return;
  el.innerHTML = state.savedMaps.length ? state.savedMaps.map(m => `
    <div class="item ${state.map.id === m.id ? "active" : ""}">
      <div class="item-head">
        <div>
          <h4>${esc(m.name)}</h4>
          <p>${esc(m.width)}x${esc(m.height)} | ${new Date(m.updatedAt).toLocaleString("pt-BR")}</p>
        </div>
      </div>
      <div class="row" style="margin-top:8px">
        <button class="btn small primary" onclick="loadSavedMap('${m.id}')">Carregar</button>
        <button class="btn small" onclick="duplicateSavedMap('${m.id}')">Duplicar</button>
        <button class="btn small" onclick="renameSavedMap('${m.id}')">Renomear</button>
        <button class="btn small danger" onclick="deleteSavedMap('${m.id}')">Excluir</button>
      </div>
    </div>
  `).join("") : `<div class="empty">Nenhum mapa salvo ainda.</div>`;
}
function randomDungeon() {
  const width = Math.max(8, Math.min(40, Number(state.map.width) || 18));
  const height = Math.max(8, Math.min(32, Number(state.map.height) || 12));
  const tiles = Array(width * height).fill("wall");
  const visibility = Array(width * height).fill(false);
  const rooms = [];
  const idx = (x, y) => y * width + x;
  const inside = (x, y) => x > 0 && y > 0 && x < width - 1 && y < height - 1;
  const carve = (x, y, tile = "floor") => { if (inside(x, y)) tiles[idx(x, y)] = tile; };
  const overlaps = room => rooms.some(r =>
    room.x < r.x + r.w + 1 && room.x + room.w + 1 > r.x &&
    room.y < r.y + r.h + 1 && room.y + room.h + 1 > r.y
  );
  const maxRoomW = Math.max(3, Math.min(8, width - 3));
  const maxRoomH = Math.max(3, Math.min(6, height - 3));
  const targetRooms = Math.max(3, Math.min(10, Math.floor((width * height) / 70)));

  for (let attempt = 0; attempt < targetRooms * 12 && rooms.length < targetRooms; attempt++) {
    const rw = rand(3, maxRoomW);
    const rh = rand(3, maxRoomH);
    const xMax = Math.max(1, width - rw - 1);
    const yMax = Math.max(1, height - rh - 1);
    const room = { x: rand(1, xMax), y: rand(1, yMax), w: rw, h: rh };
    room.cx = Math.floor(room.x + room.w / 2);
    room.cy = Math.floor(room.y + room.h / 2);
    if (overlaps(room)) continue;
    rooms.push(room);
    for (let yy = room.y; yy < room.y + room.h; yy++) {
      for (let xx = room.x; xx < room.x + room.w; xx++) carve(xx, yy);
    }
  }

  if (!rooms.length) {
    const w = Math.max(3, Math.min(6, width - 2));
    const h = Math.max(3, Math.min(5, height - 2));
    const room = { x: Math.floor((width - w) / 2), y: Math.floor((height - h) / 2), w, h };
    room.cx = Math.floor(room.x + room.w / 2);
    room.cy = Math.floor(room.y + room.h / 2);
    rooms.push(room);
    for (let yy = room.y; yy < room.y + room.h; yy++) {
      for (let xx = room.x; xx < room.x + room.w; xx++) carve(xx, yy);
    }
  }

  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1], b = rooms[i];
    const firstHorizontal = Math.random() > 0.5;
    if (firstHorizontal) {
      for (let x = Math.min(a.cx, b.cx); x <= Math.max(a.cx, b.cx); x++) carve(x, a.cy);
      for (let y = Math.min(a.cy, b.cy); y <= Math.max(a.cy, b.cy); y++) carve(b.cx, y);
      carve(b.cx, a.cy, "door");
    } else {
      for (let y = Math.min(a.cy, b.cy); y <= Math.max(a.cy, b.cy); y++) carve(a.cx, y);
      for (let x = Math.min(a.cx, b.cx); x <= Math.max(a.cx, b.cx); x++) carve(x, b.cy);
      carve(a.cx, b.cy, "door");
    }
  }

  const floorIndexes = () => tiles.map((t, i) => t === "floor" ? i : -1).filter(i => i >= 0);
  const place = (tile, count) => {
    for (let i = 0; i < count; i++) {
      const floors = floorIndexes();
      if (!floors.length) return;
      tiles[floors[rand(0, floors.length - 1)]] = tile;
    }
  };
  const scale = Math.max(1, Math.floor((width * height) / 180));
  place("chest", Math.min(4, scale + 1));
  place("pillar", Math.min(10, scale * 3));
  place("trap", Math.min(6, scale + 2));
  place("rubble", Math.min(8, scale * 2));
  place("light", Math.min(6, scale + 2));
  place("secret", Math.min(3, scale));
  place("altar", 1);
  place("stairs", Math.min(2, rooms.length));
  place("water", Math.min(5, scale));
  place("hazard", Math.min(4, scale));

  const start = rooms[0];
  const end = rooms[rooms.length - 1];
  tiles[idx(start.cx, start.cy)] = "token-pc";
  tiles[idx(end.cx, end.cy)] = rooms.length > 1 ? "token-boss" : "stairs";
  for (let y = Math.max(0, start.cy - 1); y <= Math.min(height - 1, start.cy + 1); y++) {
    for (let x = Math.max(0, start.cx - 1); x <= Math.min(width - 1, start.cx + 1); x++) {
      visibility[idx(x, y)] = true;
    }
  }
  state.map = {
    ...state.map,
    width,
    height,
    tiles,
    visibility,
    name: state.map.name && state.map.name !== "Mapa atual" ? state.map.name : "Dungeon aleatória"
  };
  saveSoon();
  renderMapTools();
  renderMap();
}
function renderMap() {
  const grid = byId("map-grid");
  if (!grid) return;
  ensureMapVisibility();
  grid.style.gridTemplateColumns = `repeat(${state.map.width}, 32px)`;
  grid.classList.toggle("player-view", isPlayerMapView());
  grid.innerHTML = state.map.tiles.map((tile, idx) => {
    const type = tileType(tile);
    const tool = mapToolByKey(type);
    const creature = creatureById(tileCreatureId(tile));
    const visible = state.map.visibility[idx] !== false;
    const hiddenForPlayer = isPlayerMapView() && !visible;
    const label = hiddenForPlayer ? "Área não revelada" : (creature ? `${creature.name} | clique para abrir ficha` : (tool ? tool[1] : type));
    const classes = `tile ${esc(type)} ${creature && !hiddenForPlayer ? "has-creature" : ""} ${!visible ? "concealed" : "revealed"} ${hiddenForPlayer ? "hidden-to-player" : ""}`;
    return `<div class="${classes}" title="${esc(label)}" onclick="mapTileClick(event, ${idx})">${hiddenForPlayer ? "" : mapToolContent(tool)}${hiddenForPlayer ? "" : mapCreatureCard(tile)}</div>`;
  }).join("");
}
function paintTile(idx) {
  if (applyVisibilityTool(idx)) return;
  state.map.tiles[idx] = linkedCreatureTile(selectedTool);
  if ((selectedTool === "token-npc" || selectedTool === "token-boss") && !selectedMapCreature) {
    toast("Selecione uma criatura para vincular ao token.");
  }
  saveSoon();
  renderMap();
}
