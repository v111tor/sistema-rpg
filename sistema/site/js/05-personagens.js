function renderCharacterList() {
  const el = byId("character-list");
  const query = filters.characters.search;
  const activeCharacter = selectedCharacterId();
  const list = state.characters.filter(c => textMatches(`${c.name} ${c.player} ${c.role} ${c.ancestry}`, query));
  el.innerHTML = list.length ? list.map(c => `
    <div class="item selectable ${activeCharacter === c.id ? "active" : ""}" onclick="selectCharacter('${c.id}')">
      <div class="item-head">
        <div>
          <h4>${esc(c.name)}</h4>
          <p>${esc(c.player || "Sem jogador")} | Nível ${esc(c.level)} | ${esc(c.role || "Sem classe")}</p>
        </div>
        <span class="pill red">${esc(c.hp.current)}/${esc(c.hp.max)} PV</span>
      </div>
    </div>
  `).join("") : `<div class="empty">Nenhum personagem encontrado.</div>`;
}
function selectCharacter(id) {
  setLocalSelectedCharacter(id);
  byId("save-status").textContent = "Ficha selecionada neste dispositivo";
  renderCharacterList();
  renderSheet();
}
function newCharacter() {
  const c = blankCharacter();
  state.characters.push(c);
  setLocalSelectedCharacter(c.id);
  saveSoon();
  renderCharacterList();
  renderSheet();
}
function deleteCharacter(id) {
  if (state.characters.length <= 1) return toast("Mantenha pelo menos uma ficha.");
  state.characters = state.characters.filter(c => c.id !== id);
  state.campaign.partyIds = state.campaign.partyIds.filter(pid => pid !== id);
  if (uiState.selectedCharacter === id) setLocalSelectedCharacter(state.characters[0].id);
  saveSoon();
  renderAll();
}

function renderSheet() {
  const c = currentCharacter();
  const hpPct = Math.max(0, Math.min(100, (Number(c.hp.current) / Math.max(1, Number(c.hp.max))) * 100));
  const categories = [
    ["resumo", "Resumo"],
    ["dados", "Dados"],
    ["atributos", "Atributos"],
    ["combate", "Combate"],
    ["habilidades", "Características"],
    ["magias", "Habilidades"],
    ["inventario", "Inventário"]
  ];
  byId("sheet-area").innerHTML = `
    <div class="grid">
      <div class="panel">
        <div class="section-title">
          <h3>${esc(c.name)}</h3>
          <div class="row">
            <span class="pill red">PV ${esc(c.hp.current)}/${esc(c.hp.max)}</span>
            <span class="pill gold">Aparar ${esc(c.ac)}</span>
            <span class="pill blue">Nível ${esc(c.level)}</span>
            <button class="btn small danger" onclick="deleteCharacter('${c.id}')">Excluir</button>
          </div>
        </div>
        <div class="sheet-tabs" role="tablist" aria-label="Categorias da ficha de personagem">
          ${categories.map(([id, label]) => `<button class="${sheetCategory === id ? "active" : ""}" role="tab" aria-selected="${sheetCategory === id}" onclick="selectSheetCategory('${id}')">${label}</button>`).join("")}
        </div>
      </div>
      ${renderSheetCategory(c, hpPct)}
    </div>
  `;
}

function selectSheetCategory(id) {
  sheetCategory = id;
  renderSheet();
}

function selectAbilityCategory(id) {
  abilityCategory = id;
  renderSheet();
}

function renderSheetCategory(c, hpPct) {
  const hpCalc = hpCalcDetails(c);
  const blocks = {
    resumo: `
      <div class="panel">
        <div class="section-title"><h3>Resumo operacional</h3></div>
        <div class="sheet-summary">
          <div class="sheet-metric"><b>${esc(c.player || "-")}</b><span>Jogador</span></div>
          <div class="sheet-metric"><b>${esc(c.role || "-")}</b><span>Classe / função</span></div>
          <div class="sheet-metric"><b>${esc(c.ancestry || "-")}</b><span>Povo / origem</span></div>
          <div class="sheet-metric"><b>${esc(c.background || "-")}</b><span>Antecedente</span></div>
          <div class="sheet-metric"><b>${esc(c.hp.current)}/${esc(c.hp.max)}</b><span>PV</span></div>
          <div class="sheet-metric"><b>${esc(c.ac)}</b><span>Aparar</span></div>
          <div class="sheet-metric"><b>${esc(c.speed)}m</b><span>Deslocamento</span></div>
          <div class="sheet-metric"><b>${esc(c.prof)}</b><span>Proficiência</span></div>
          <div class="sheet-metric"><b>${esc(c.resources.pa.current)}/${esc(c.resources.pa.max)}</b><span>PA Arcana</span></div>
          <div class="sheet-metric"><b>${esc(c.resources.pe.current)}/${esc(c.resources.pe.max)}</b><span>PE Emoção</span></div>
          <div class="sheet-metric"><b>${esc(c.resources.pd.current)}/${esc(c.resources.pd.max)}</b><span>PD Devoção</span></div>
          <div class="sheet-metric"><b>${esc(c.resources.aura.current)}/${esc(c.resources.aura.max)}</b><span>Pontos de Aura</span></div>
        </div>
      </div>
    `,
    dados: `
      <div class="panel">
        <div class="section-title"><h3>Dados do personagem</h3></div>
        <div class="grid three">
          ${inputFor(c, "name", "Nome")}
          ${inputFor(c, "player", "Jogador")}
          ${inputFor(c, "level", "Nível", "number")}
          ${inputFor(c, "ancestry", "Povo / origem")}
          ${inputFor(c, "role", "Classe / função")}
          ${inputFor(c, "background", "Antecedente")}
        </div>
      </div>
    `,
    atributos: `
      <div class="panel">
        <div class="section-title"><h3>Atributos e testes</h3></div>
        <div class="stats">
          ${ATTRS.map(([key, label]) => `
            <div class="stat">
              <span>${esc(key)} · ${label}</span>
              <strong>${esc(attrDie(c.attrs[key]))}</strong>
              <span>${signed(mod(c.attrs[key]))}</span>
              <select title="${esc(label)}" onchange="updateAttr('${c.id}','${key}',this.value)">
                ${ATTR_DICE.map(die => `<option value="${die}" ${attrDie(c.attrs[key]) === die ? "selected" : ""}>${die}</option>`).join("")}
              </select>
              <button class="btn small" onclick="rollCheck('${key}')">Rolar</button>
            </div>
          `).join("")}
        </div>
        <div class="section-title" style="margin-top:16px"><h3>Testes de resistência</h3></div>
        <div class="skills">
          ${ATTRS.map(([key, label]) => {
            const die = attrDie(c.attrs[key]);
            const proficient = Number(c.saves?.[key]) ? true : false;
            const bonus = saveBonus(c, key);
            return `
              <div class="skill">
                <span>${esc(key)} · ${esc(label)} <span class="muted">${die} ${signed(mod(c.attrs[key]))}</span></span>
                <button class="btn small ${proficient ? "primary" : ""}" onclick="toggleSave('${key}')">${proficient ? "Prof" : "Sem"}</button>
                <button class="btn small" onclick="rollSave('${key}')">${die} ${signed(bonus)}</button>
              </div>
            `;
          }).join("")}
        </div>
        <p class="muted" style="margin:10px 0 0">Marque Prof quando a classe conceder proficiência naquele save. O botão de rolagem usa dado do atributo + modificador; com proficiência, soma também o bônus de Proficiência.</p>
      </div>
    `,
    combate: `
      <div class="panel">
        <div class="section-title"><h3>Combate</h3></div>
        <div class="grid three">
          ${hpInput(c, "current", "PV atual")}
          ${hpInput(c, "max", "PV máximo")}
          ${hpInput(c, "temp", "PV temporário")}
          ${inputFor(c, "ac", "Aparar", "number")}
          ${inputFor(c, "speed", "Deslocamento", "number")}
          ${inputFor(c, "prof", "Proficiência", "number")}
        </div>
        <div class="empty" style="margin-top:10px;text-align:left;padding:12px">
          <strong>PV sugerido pelo sistema: ${hpCalc.total}</strong>
          <p class="muted" style="margin:6px 0 0">
            VIG ${hpCalc.vigor} = ${hpCalc.vigorHp} · ${hpCalc.profile.label} ${hpCalc.profile.die} = ${hpCalc.profile.value}
          </p>
          <button class="btn small" style="margin-top:8px" onclick="applyCalculatedHp('${c.id}')">Aplicar PV calculado</button>
        </div>
        <div class="bar"><i style="width:${hpPct}%;background:var(--red)"></i></div>
        <div class="row" style="margin-top:10px">
          <button class="btn small" onclick="adjustHp(-1)">-1 PV</button>
          <button class="btn small" onclick="adjustHp(1)">+1 PV</button>
          <button class="btn small" onclick="addCharacterToInitiative('${c.id}')">Iniciativa</button>
        </div>
        ${renderCharacterAttacks(c)}
      </div>
    `,
    habilidades: `
      <div class="grid">
        <div class="panel">
          <div class="section-title">
            <h3>Características</h3>
            <span class="pill blue">${esc(c.role || "Classe não definida")}</span>
          </div>
          <div class="sheet-tabs" role="tablist" aria-label="Categorias de características">
            ${[
              ["pericias", "Perícias"],
              ["habilidades", "Características"]
            ].map(([id, label]) => `<button class="${abilityCategory === id ? "active" : ""}" role="tab" aria-selected="${abilityCategory === id}" onclick="selectAbilityCategory('${id}')">${label}</button>`).join("")}
          </div>
          ${renderAbilityCategory(c)}
        </div>
      </div>
    `,
    magias: `
      <div class="grid">
        <div class="panel">
          <div class="section-title"><h3>Recursos de habilidade</h3></div>
          <div class="resource-grid">
            ${resourceBox(c, "pa", "PA Arcana", "arcana")}
            ${resourceBox(c, "pe", "PE Emoção", "primitive")}
            ${resourceBox(c, "pd", "PD Devoção", "faith")}
            ${resourceBox(c, "aura", "Pontos de Aura", "aura")}
          </div>
          <div class="field-row" style="margin-top:10px">
            ${inputFor(c, "emotion", "Emoção dominante")}
            ${inputFor(c, "deity", "Deidade / pacto")}
          </div>
        </div>
        <div class="panel">
          <div class="section-title">
            <h3>Habilidades do personagem</h3>
            <span class="pill gold">Base ${Math.max(1, Number(c.level) || 1) + 1}</span>
            <button class="btn small primary" onclick="openCharacterSpellForm('${c.id}')">Criar habilidade personalizada</button>
          </div>
          <div class="grid two">
            ${renderCharacterSpells(c)}
          </div>
        </div>
        <div class="panel">
          <div class="section-title"><h3>Catálogo do sistema</h3></div>
          <div class="filterbar two">
            <input id="char-spell-search" placeholder="Buscar habilidade do sistema" value="${esc(filters.characterSpells.search)}" oninput="setFilter('characterSpells','search',this.value)">
            <select id="char-spell-source" onchange="setFilter('characterSpells','source',this.value)">
              <option value="">Todas as fontes</option>
              ${Object.entries(SOURCES).map(([key, src]) => `<option value="${key}" ${filters.characterSpells.source === key ? "selected" : ""}>${src.title}</option>`).join("")}
            </select>
          </div>
          <div class="grid two">
            ${renderSpellCatalogForCharacter(c)}
          </div>
        </div>
        <div class="panel">
          <div class="section-title"><h3>Habilidades conhecidas</h3></div>
          ${textareaFor(c, "spells", "Habilidades, magias, técnicas, tecnologias e rituais conhecidos")}
        </div>
      </div>
    `,
    inventario: `
      <div class="panel">
        <div class="section-title"><h3>Inventário e notas</h3></div>
        <div class="grid">
          ${textareaFor(c, "features", "Traços e características")}
          ${textareaFor(c, "inventory", "Equipamento")}
          ${textareaFor(c, "notes", "Notas")}
        </div>
      </div>
    `
  };
  return blocks[sheetCategory] || blocks.resumo;
}

function renderCharacterAttacks(c) {
  const attacks = Array.isArray(c.attacks) ? c.attacks : [];
  return `
    <div class="section-title" style="margin-top:16px">
      <h3>Ataques comuns</h3>
      <button class="btn small primary" onclick="addCharacterAttack('${c.id}')">Adicionar ataque</button>
    </div>
    <div class="list">
      ${attacks.length ? attacks.map(attack => {
        const attr = ATTRS.some(([key]) => key === attack.attr) ? attack.attr : "FOR";
        const die = attrDie(c.attrs[attr]);
        const attackBonus = mod(c.attrs[attr]) + (Number(attack.bonus) || 0);
        return `
          <div class="item">
            <div class="item-head">
              <div>
                <h4>${esc(attack.name || "Ataque comum")}</h4>
                <p>${esc(attr)} ${die} ${signed(attackBonus)} | ${esc(attack.damage || "sem dano")} ${attack.type ? "· " + esc(attack.type) : ""}</p>
              </div>
              <button class="btn small danger" onclick="removeCharacterAttack('${c.id}','${attack.id}')">Remover</button>
            </div>
            <div class="grid four" style="margin-top:10px">
              <div><label>Nome</label><input value="${esc(attack.name)}" onchange="updateCharacterAttack('${c.id}','${attack.id}','name',this.value)"></div>
              <div><label>Atributo</label><select onchange="updateCharacterAttack('${c.id}','${attack.id}','attr',this.value)">
                ${ATTRS.map(([key, label]) => `<option value="${key}" ${attr === key ? "selected" : ""}>${key} · ${label}</option>`).join("")}
              </select></div>
              <div><label>Bônus extra</label><input type="number" value="${esc(attack.bonus)}" onchange="updateCharacterAttack('${c.id}','${attack.id}','bonus',this.value)"></div>
              <div><label>Dano</label><input value="${esc(attack.damage)}" placeholder="1d8+FOR" onchange="updateCharacterAttack('${c.id}','${attack.id}','damage',this.value)"></div>
              <div><label>Alcance</label><input value="${esc(attack.range)}" placeholder="Corpo a corpo" onchange="updateCharacterAttack('${c.id}','${attack.id}','range',this.value)"></div>
              <div><label>Tipo</label><input value="${esc(attack.type)}" placeholder="Cortante" onchange="updateCharacterAttack('${c.id}','${attack.id}','type',this.value)"></div>
            </div>
            <div style="margin-top:10px"><label>Observações</label><textarea onchange="updateCharacterAttack('${c.id}','${attack.id}','notes',this.value)">${esc(attack.notes)}</textarea></div>
            <div class="row" style="margin-top:10px">
              <button class="btn small" onclick="rollCharacterAttack('${c.id}','${attack.id}')">Rolar ataque</button>
              <button class="btn small" onclick="rollCharacterDamage('${c.id}','${attack.id}')">Rolar dano</button>
            </div>
          </div>
        `;
      }).join("") : `<div class="empty">Nenhum ataque cadastrado. Adicione espada, arco, ataque desarmado ou qualquer ataque comum do personagem.</div>`}
    </div>
  `;
}

function renderAbilityCategory(c) {
  if (abilityCategory === "pericias") {
    return `
      <div class="grid">
        <div class="section-title" style="margin-top:14px"><h3>Perícias treinadas</h3></div>
        <p class="muted" style="margin:0">Sem proficiência: role só o dado do atributo. Com proficiência: role o dado e some o Mod. do atributo.</p>
        <div class="skills">
          ${SKILLS.map(([name, attr]) => {
            const chosenAttr = skillAttr(c, attr);
            const die = attrDie(c.attrs[chosenAttr]);
            const profBonus = Number(c.skills[name]) ? `${die} ${signed(profValue(c, name))}` : die;
            return `
            <div class="skill">
              <span>${esc(name)} <span class="muted">(${esc(attr)}${attr !== chosenAttr ? " → " + esc(chosenAttr) : ""})</span></span>
              <button class="btn small ${c.skills[name] ? "primary" : ""}" onclick="toggleSkill('${name}')">${c.skills[name] ? "Prof" : "Sem"}</button>
              <button class="btn small" onclick="rollSkill('${name}')">${profBonus}</button>
            </div>
          `;
          }).join("")}
        </div>
      </div>
    `;
  }
  return `
    <div class="grid" style="margin-top:14px">
      <div class="section-title">
        <h3>Características adquiridas</h3>
        <button class="btn small primary" onclick="openCustomAbilityForm('${c.id}')">Criar característica personalizada</button>
      </div>
      <div class="grid two">${renderKnownAbilities(c)}</div>
      <div class="section-title" style="margin-top:14px">
        <h3>Catálogo de características por classe e nível</h3>
        <span class="pill gold">Nível ${esc(c.level)}</span>
      </div>
      <div class="filterbar three">
        <input placeholder="Buscar característica" value="${esc(filters.abilities.search)}" oninput="setFilter('abilities','search',this.value)">
        <select onchange="setFilter('abilities','class',this.value)">
          <option value="__current" ${filters.abilities.class === "__current" ? "selected" : ""}>Classe do personagem</option>
          <option value="" ${filters.abilities.class === "" ? "selected" : ""}>Todas as classes</option>
          ${abilityClasses().map(cls => `<option value="${esc(cls)}" ${filters.abilities.class === cls ? "selected" : ""}>${esc(cls)}</option>`).join("")}
        </select>
        <select onchange="setFilter('abilities','level',this.value)">
          <option value="unlocked" ${filters.abilities.level === "unlocked" ? "selected" : ""}>Desbloqueadas até meu nível</option>
          <option value="all" ${filters.abilities.level === "all" ? "selected" : ""}>Todos os níveis</option>
        </select>
      </div>
      <div class="grid two">${renderAbilityCatalog(c)}</div>
    </div>
  `;
}

function inputFor(c, key, label, type = "text") {
  return `<div><label>${label}</label><input type="${type}" value="${esc(c[key])}" onchange="updateChar('${c.id}','${key}',this.value)"></div>`;
}
function textareaFor(c, key, label) {
  return `<div><label>${label}</label><textarea onchange="updateChar('${c.id}','${key}',this.value)">${esc(c[key])}</textarea></div>`;
}
function hpInput(c, key, label) {
  return `<div><label>${label}</label><input type="number" value="${esc(c.hp[key])}" onchange="updateHp('${c.id}','${key}',this.value)"></div>`;
}
function resourceBox(c, key, label, cls) {
  const r = c.resources[key] || { current: 0, max: 0 };
  const pct = Math.max(0, Math.min(100, (Number(r.current) / Math.max(1, Number(r.max))) * 100));
  return `
    <div class="resource ${cls}">
      <b>${label}</b>
      <div class="resource-line">
        <input type="number" value="${esc(r.current)}" onchange="updateResource('${c.id}','${key}','current',this.value)">
        <span>/</span>
        <input type="number" value="${esc(r.max)}" onchange="updateResource('${c.id}','${key}','max',this.value)">
      </div>
      <div class="bar"><i style="width:${pct}%"></i></div>
    </div>
  `;
}
function getCharacterSpellList(c) {
  const system = state.magic.filter(spell => c.knownSpellIds.includes(spell.id));
  return [...system, ...c.customSpells.map(spell => ({ ...spell, custom: true }))];
}
function renderCharacterSpells(c) {
  const list = getCharacterSpellList(c);
  if (!list.length) return `<div class="empty">Nenhuma habilidade adicionada ao personagem. Use o catálogo ou crie uma habilidade personalizada.</div>`;
  return list.map(spell => spellCard(spell, `
    <button class="btn small danger" onclick="${spell.custom ? `removeCustomSpell('${c.id}','${spell.id}')` : `removeKnownSpell('${c.id}','${spell.id}')`}">Remover</button>
  `)).join("");
}
function renderSpellCatalogForCharacter(c) {
  const list = state.magic.filter(spell => {
    const sourceOk = !filters.characterSpells.source || spell.source === filters.characterSpells.source;
    const searchOk = textMatches(`${spell.name} ${spell.cost} ${spell.range} ${spell.effect}`, filters.characterSpells.search);
    return sourceOk && searchOk;
  });
  if (!list.length) return `<div class="empty">Nenhuma habilidade encontrada no catálogo.</div>`;
  return list.map(spell => spellCard(spell, c.knownSpellIds.includes(spell.id)
    ? `<span class="pill green">Adicionada</span>`
    : `<button class="btn small primary" onclick="addKnownSpell('${c.id}','${spell.id}')">Adicionar</button>`
  )).join("");
}
function abilityClasses() {
  return [...new Set(LEVEL_ABILITIES.map(a => a.class))].sort();
}
function currentAbilityClass(c) {
  const role = normalizeText(c.role || "");
  const aliases = {
    "conjurador arcano": "Arcanista",
    "canalizador primitivo": "Sensiente",
    "sensitivo de aura": "Guerreiro",
    "tecnomago": "Artífice"
  };
  if (aliases[role]) return aliases[role];
  return abilityClasses().find(cls => normalizeText(cls) === role) || c.role || "";
}
function abilityIsUnlocked(c, ability) {
  return Number(ability.level) <= Number(c.level || 1);
}
function abilityCard(ability, actionHtml = "") {
  return `
    <div class="item">
      <div class="item-head">
        <div>
          <h4>${esc(ability.name)}</h4>
          <p>${esc(ability.class)} | Nível ${esc(ability.level)}</p>
        </div>
        ${actionHtml}
      </div>
      <p>${esc(ability.effect)}</p>
    </div>
  `;
}
function renderKnownAbilities(c) {
  const list = LEVEL_ABILITIES.filter(a => c.knownAbilityIds.includes(a.id));
  const custom = c.customAbilities.map(a => ({ ...a, custom: true }));
  const all = [...list, ...custom];
  if (!all.length) return `<div class="empty">Nenhuma habilidade adquirida ainda.</div>`;
  return all.map(a => abilityCard(a, `<button class="btn small danger" onclick="${a.custom ? `removeCustomAbility('${c.id}','${a.id}')` : `removeKnownAbility('${c.id}','${a.id}')`}">Remover</button>`)).join("");
}
function renderAbilityCatalog(c) {
  const currentClass = currentAbilityClass(c);
  const list = LEVEL_ABILITIES.filter(a => {
    const selectedClass = filters.abilities.class === "__current" ? currentClass : filters.abilities.class;
    const classOk = !selectedClass || a.class === selectedClass || a.class === "Geral";
    const levelOk = filters.abilities.level !== "unlocked" || abilityIsUnlocked(c, a);
    const searchOk = textMatches(`${a.name} ${a.class} ${a.level} ${a.effect}`, filters.abilities.search);
    return classOk && levelOk && searchOk;
  });
  if (!list.length) return `<div class="empty">Nenhuma habilidade encontrada para a classe e nível atuais.</div>`;
  return list.map(a => abilityCard(a, c.knownAbilityIds.includes(a.id)
    ? `<span class="pill green">Adquirida</span>`
    : abilityIsUnlocked(c, a)
      ? `<button class="btn small primary" onclick="addKnownAbility('${c.id}','${a.id}')">Adicionar</button>`
      : `<span class="pill red">Nível ${esc(a.level)}</span>`
  )).join("");
}
function addKnownAbility(charId, abilityId) {
  const c = state.characters.find(x => x.id === charId);
  if (!c.knownAbilityIds.includes(abilityId)) c.knownAbilityIds.push(abilityId);
  saveSoon();
  renderSheet();
}
function removeKnownAbility(charId, abilityId) {
  const c = state.characters.find(x => x.id === charId);
  c.knownAbilityIds = c.knownAbilityIds.filter(id => id !== abilityId);
  saveSoon();
  renderSheet();
}
function openCustomAbilityForm(charId) {
  openModal("Criar característica personalizada", `
    <div class="grid">
      <div class="grid three">
        <div><label>Nome</label><input id="ab-name"></div>
        <div><label>Classe</label><input id="ab-class" value="Geral"></div>
        <div><label>Nível</label><input id="ab-level" type="number" value="1" min="1"></div>
      </div>
      <div><label>Efeito</label><textarea id="ab-effect"></textarea></div>
    </div>
  `, [
    ["Salvar", "primary", () => {
      const c = state.characters.find(x => x.id === charId);
      c.customAbilities.push({
        id: uid(),
        name: byId("ab-name").value || "Característica personalizada",
        class: byId("ab-class").value || "Geral",
        level: Number(byId("ab-level").value) || 1,
        effect: byId("ab-effect").value
      });
      closeModal(); saveSoon(); renderSheet();
    }],
    ["Cancelar", "", closeModal]
  ]);
}
function removeCustomAbility(charId, abilityId) {
  const c = state.characters.find(x => x.id === charId);
  c.customAbilities = c.customAbilities.filter(a => a.id !== abilityId);
  saveSoon();
  renderSheet();
}
function spellCard(spell, actionHtml = "") {
  const src = SOURCES[spell.source] || SOURCES.arcana;
  return `
    <div class="item magic-source ${esc(spell.source)}">
      <div class="item-head">
        <div>
          <h4>${esc(spell.name)}</h4>
          <p>${esc(src.title)} | ${esc(spell.cost || "-")} | ${esc(spell.range || "-")}</p>
        </div>
        ${actionHtml}
      </div>
      <p>${esc(spell.effect || "")}</p>
    </div>
  `;
}
function addKnownSpell(charId, spellId) {
  const c = state.characters.find(x => x.id === charId);
  if (!c.knownSpellIds.includes(spellId)) c.knownSpellIds.push(spellId);
  saveSoon();
  renderSheet();
}
function removeKnownSpell(charId, spellId) {
  const c = state.characters.find(x => x.id === charId);
  c.knownSpellIds = c.knownSpellIds.filter(id => id !== spellId);
  saveSoon();
  renderSheet();
}
function removeCustomSpell(charId, spellId) {
  const c = state.characters.find(x => x.id === charId);
  c.customSpells = c.customSpells.filter(spell => spell.id !== spellId);
  saveSoon();
  renderSheet();
}
function openCharacterSpellForm(charId) {
  openModal("Criar habilidade personalizada", `
    <div class="grid">
      <div class="grid three">
        <div><label>Nome</label><input id="cs-name"></div>
        <div><label>Fonte</label><select id="cs-source">${Object.entries(SOURCES).map(([k,v]) => `<option value="${k}">${v.title}</option>`).join("")}</select></div>
        <div><label>Custo</label><input id="cs-cost" placeholder="ex: 2 PA"></div>
      </div>
      <div><label>Alcance / duração</label><input id="cs-range" placeholder="ex: 18m / instantâneo"></div>
      <div><label>Efeito</label><textarea id="cs-effect"></textarea></div>
    </div>
  `, [
    ["Salvar", "primary", () => {
      const c = state.characters.find(x => x.id === charId);
      c.customSpells.push({
        id: uid(),
        name: byId("cs-name").value || "Habilidade personalizada",
        source: byId("cs-source").value,
        cost: byId("cs-cost").value,
        range: byId("cs-range").value,
        effect: byId("cs-effect").value
      });
      closeModal(); saveSoon(); renderSheet();
    }],
    ["Cancelar", "", closeModal]
  ]);
}

function updateChar(id, key, value) {
  const c = state.characters.find(x => x.id === id);
  if (!c) return;
  c[key] = ["level", "ac", "speed", "prof", "xp"].includes(key) ? Number(value) : value;
  saveSoon();
  renderCharacterList();
  renderCampaign();
}
function updateAttr(id, key, value) {
  const c = state.characters.find(x => x.id === id);
  c.attrs[key] = attrDie(value);
  saveSoon();
  renderSheet();
}
function updateHp(id, key, value) {
  const c = state.characters.find(x => x.id === id);
  c.hp[key] = Number(value) || 0;
  saveSoon();
  renderCharacterList();
  renderSheet();
}
function findCharacterAttack(charId, attackId) {
  const c = state.characters.find(x => x.id === charId);
  if (!c) return {};
  c.attacks ||= [];
  const attack = c.attacks.find(a => a.id === attackId);
  return { c, attack };
}
function addCharacterAttack(charId) {
  const c = state.characters.find(x => x.id === charId);
  if (!c) return;
  c.attacks ||= [];
  c.attacks.push(blankAttack());
  saveSoon();
  renderSheet();
}
function updateCharacterAttack(charId, attackId, key, value) {
  const { attack } = findCharacterAttack(charId, attackId);
  if (!attack) return;
  attack[key] = key === "bonus" ? Number(value) || 0 : value;
  if (key === "attr" && !ATTRS.some(([attr]) => attr === attack.attr)) attack.attr = "FOR";
  saveSoon();
  renderSheet();
}
function removeCharacterAttack(charId, attackId) {
  const c = state.characters.find(x => x.id === charId);
  if (!c) return;
  c.attacks = (c.attacks || []).filter(attack => attack.id !== attackId);
  saveSoon();
  renderSheet();
}
function applyCalculatedHp(id) {
  const c = state.characters.find(x => x.id === id);
  if (!c) return;
  const previousMax = Number(c.hp.max) || 0;
  const previousCurrent = Number(c.hp.current) || 0;
  const nextMax = calcMaxHp(c);
  c.hp.max = nextMax;
  if (previousCurrent <= 0 || previousCurrent === previousMax) {
    c.hp.current = nextMax;
  } else {
    c.hp.current = Math.min(previousCurrent, nextMax);
  }
  saveSoon();
  renderCharacterList();
  renderSheet();
  toast("PV calculado aplicado.");
}
function updateResource(id, res, key, value) {
  const c = state.characters.find(x => x.id === id);
  c.resources[res][key] = Number(value) || 0;
  saveSoon();
  renderSheet();
}
function adjustHp(delta) {
  const c = currentCharacter();
  c.hp.current = Math.max(0, Number(c.hp.current) + delta);
  saveSoon();
  renderCharacterList();
  renderSheet();
}
function toggleSkill(name) {
  const c = currentCharacter();
  c.skills[name] = c.skills[name] ? 0 : 1;
  saveSoon();
  renderSheet();
}
function toggleSave(attr) {
  const c = currentCharacter();
  c.saves ||= {};
  c.saves[attr] = c.saves[attr] ? 0 : 1;
  saveSoon();
  renderSheet();
}
