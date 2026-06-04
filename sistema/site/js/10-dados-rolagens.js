function rand(min, max) {
  const lo = Math.ceil(Number(min));
  const hi = Math.floor(Number(max));
  if (hi <= lo) return lo;
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}
function d(sides) { return Math.floor(Math.random() * sides) + 1; }
function parseRoll(expr) {
  const clean = String(expr).toLowerCase().replace(/\s+/g, "");
  const match = clean.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!match) return null;
  const count = Number(match[1] || 1);
  const sides = Number(match[2]);
  const bonus = Number(match[3] || 0);
  const values = Array.from({ length: count }, () => d(sides));
  return { total: values.reduce((a, b) => a + b, 0) + bonus, values, bonus, expr: clean };
}
function attributeRoll(die, bonus = mod(die), label = "") {
  const sides = dieSides(die);
  const attrValue = d(sides);
  const wildValue = d(6);
  return {
    total: Math.max(attrValue, wildValue) + bonus,
    values: [attrValue, wildValue],
    bonus,
    expr: `max(${attrDie(die)},d6)${bonus ? signed(bonus) : ""}`,
    detail: label
  };
}
function singleDieRoll(die, bonus = 0, label = "") {
  const sides = dieSides(die);
  const value = d(sides);
  return {
    total: value + bonus,
    values: [value],
    bonus,
    expr: `${attrDie(die)}${bonus ? signed(bonus) : ""}`,
    detail: label
  };
}
function addRoll(label, result) {
  state.rolls.unshift({ id: uid(), label, ...result, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) });
  state.rolls = state.rolls.slice(0, 50);
  saveSoon();
  renderRolls();
}
function rollDice(expr) {
  const result = parseRoll(expr);
  if (result) addRoll(expr, result);
}
function customRoll() {
  const expr = prompt("Digite a rolagem. Exemplo: 2d6+3");
  if (expr) rollDice(expr);
}
function rollCheck(attr) {
  const c = currentCharacter();
  const die = attrDie(c.attrs[attr]);
  const bonus = mod(die);
  const result = attributeRoll(die, bonus);
  addRoll(`${ATTRS.find(([k]) => k === attr)[1]} ${die} ${signed(bonus)}`, result);
  showTab("dados");
}
function rollSkill(name) {
  const c = currentCharacter();
  const [, attr] = SKILLS.find(([skillName]) => skillName === name) || ["", "INT"];
  const chosen = skillAttr(c, attr);
  const proficient = Number(c.skills[name]) ? true : false;
  const die = attrDie(c.attrs[chosen]);
  const bonus = proficient ? profValue(c, name) : 0;
  const result = singleDieRoll(die, bonus);
  addRoll(`${name} (${chosen}) ${die}${proficient ? " prof " + signed(bonus) : " sem prof"}`, result);
  showTab("dados");
}
function rollSave(attr) {
  const c = currentCharacter();
  const [, label = attr] = ATTRS.find(([key]) => key === attr) || [];
  const die = attrDie(c.attrs[attr]);
  const proficient = Number(c.saves?.[attr]) ? true : false;
  const bonus = saveBonus(c, attr);
  const result = attributeRoll(die, bonus);
  addRoll(`Resistência de ${label} ${die}${proficient ? " prof " + signed(bonus) : " " + signed(bonus)}`, result);
  showTab("dados");
}
function rollCharacterAttack(charId, attackId) {
  const { c, attack } = findCharacterAttack(charId, attackId);
  if (!c || !attack) return;
  const attr = ATTRS.some(([key]) => key === attack.attr) ? attack.attr : "FOR";
  const die = attrDie(c.attrs[attr]);
  const bonus = mod(c.attrs[attr]) + (Number(attack.bonus) || 0);
  const result = attributeRoll(die, bonus);
  addRoll(`${attack.name || "Ataque comum"} (${attr}) ${die} ${signed(bonus)}`, result);
  showTab("dados");
}
function resolveDamageExpression(c, expr) {
  return String(expr || "").replace(/\b(FOR|AGI|VIG|INT|ESP|DEV)\b/gi, match => {
    const key = match.toUpperCase();
    return String(mod(c.attrs[key]));
  });
}
function rollCharacterDamage(charId, attackId) {
  const { c, attack } = findCharacterAttack(charId, attackId);
  if (!c || !attack) return;
  const expr = resolveDamageExpression(c, attack.damage);
  const result = parseRoll(expr);
  if (!result) return toast("Use dano no formato 1d8, 2d6+3, 1d8+FOR ou 1d10-1.");
  addRoll(`Dano - ${attack.name || "Ataque comum"}${attack.type ? " (" + attack.type + ")" : ""}`, result);
  showTab("dados");
}
function clearRolls() {
  state.rolls = [];
  saveSoon();
  renderRolls();
}
function renderRolls() {
  byId("roll-log").innerHTML = state.rolls.length ? state.rolls.map(r => `
    <div class="roll">
      <div>
        <div>${esc(r.label)}</div>
        <span class="muted">${esc(r.expr)} | ${esc(r.values.join(", "))}${r.bonus ? " | bônus " + signed(r.bonus) : ""}</span>
      </div>
      <div><strong>${esc(r.total)}</strong><div class="muted">${esc(r.time)}</div></div>
    </div>
  `).join("") : `<div class="empty">Nenhuma rolagem ainda.</div>`;
}
