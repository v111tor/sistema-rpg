import { useState } from 'react'
import { useStore } from '../../store'
import { ATTRS, ATTR_DICE, SKILLS, CLASS_HP, VIGOR_HP } from '../../data/constants'
import { uid, parseAndRoll } from '../../services/storage'
import { LEVEL_ABILITIES } from '../../data/abilities'
import { normalizeText } from '../../data/catalog'
import { SOURCES } from '../../data/constants'
import { Modal } from '../ui/Modal'
import type { AttrDie, AttrKey, Character, Attack, CustomAbility, CustomSpell } from '../../types'

const CATS = [
  ['resumo',     '📋 Resumo'],
  ['dados',      '👤 Dados'],
  ['atributos',  '🎲 Atributos'],
  ['combate',    '⚔️ Combate'],
  ['habilidades','✨ Características'],
  ['magias',     '🔮 Magias'],
  ['inventario', '🎒 Inventário'],
  ['historia',   '📖 História'],
]

function dieMod(die: AttrDie): number {
  return { d4: 0, d6: 1, d8: 2, d10: 3, d12: 4, d20: 5 }[die] ?? 0
}
function signed(n: number) { return n >= 0 ? `+${n}` : `${n}` }

export function CharacterSheet() {
  const { app, ui, updateCharacter, deleteCharacter, setSheetCategory, addRoll, showToast } = useStore()
  const c = app.characters.find(ch => ch.id === ui.selectedCharacterId) ?? app.characters[0]
  if (!c) return <div className="panel empty">Selecione um personagem.</div>

  const update = (patch: Partial<Character>) => updateCharacter(c.id, patch)
  const cat = ui.sheetCategory

  const hpPct = Math.max(0, Math.min(100, (c.hp.current / Math.max(1, c.hp.max)) * 100))
  const hpColor = hpPct > 50 ? 'var(--green)' : hpPct > 25 ? 'var(--gold)' : 'var(--danger)'

  const roll = (formula: string, label: string) => {
    const r = parseAndRoll(formula)
    if (!r) return showToast(`Fórmula inválida: ${formula}`)
    addRoll({ id: uid(), formula, result: r.result, breakdown: r.breakdown, label, timestamp: new Date().toISOString() })
    showToast(`${label}: ${formula} → ${r.result}`)
  }

  return (
    <div className="sheet-card">
      {/* ── Header compacto ── */}
      <div className="sheet-header">
        <div className="sheet-header-info">
          <span className="sheet-name">{c.name || 'Sem nome'}</span>
          <span className="sheet-meta">
            {c.player && <>{c.player} · </>}
            {c.role ? CLASS_HP[c.role]?.label ?? c.role : 'Sem classe'} ·
            Nível {c.level}
            {c.ancestry && <> · {c.ancestry}</>}
          </span>
        </div>
        <div className="sheet-header-stats">
          <Pill color="red"   label="PV"     value={`${c.hp.current}/${c.hp.max}`} />
          <Pill color="blue"  label="Aparar" value={`${c.ac}`} />
          <Pill color="gold"  label="Nível"  value={`${c.level}`} />
        </div>
        <div className="sheet-header-bar">
          <div className="hp-bar">
            <div className="hp-fill" style={{ width: `${hpPct}%`, background: hpColor }} />
          </div>
        </div>
        <button className="btn small danger ghost" onClick={() => { if (confirm(`Remover ${c.name}?`)) deleteCharacter(c.id) }}>✕ Remover</button>
      </div>

      {/* ── Tabs ── */}
      <div className="cat-tabs">
        {CATS.map(([id, label]) => (
          <button key={id} className={`cat-tab ${cat === id ? 'active' : ''}`} onClick={() => setSheetCategory(id)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Conteúdo ── */}
      <div className="sheet-body">
        {cat === 'resumo'     && <TabResumo     c={c} />}
        {cat === 'dados'      && <TabDados      c={c} update={update} />}
        {cat === 'atributos'  && <TabAtributos  c={c} update={update} roll={roll} />}
        {cat === 'combate'    && <TabCombate    c={c} update={update} roll={roll} />}
        {cat === 'habilidades'&& <TabHabilidades c={c} update={update} roll={roll} />}
        {cat === 'magias'     && <TabMagias     c={c} update={update} />}
        {cat === 'inventario' && <TabInventario c={c} update={update} />}
        {cat === 'historia'   && <TabHistoria   c={c} update={update} />}
      </div>
    </div>
  )
}

// ─── Pill helper ──────────────────────────────────────────────────────────────
function Pill({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className={`stat-pill ${color}`}>
      <span className="stat-pill-value">{value}</span>
      <span className="stat-pill-label">{label}</span>
    </div>
  )
}

// ─── Resumo ───────────────────────────────────────────────────────────────────
function TabResumo({ c }: { c: Character }) {
  const metrics = [
    { label: 'Jogador',       value: c.player || '—' },
    { label: 'Classe',        value: c.role ? CLASS_HP[c.role]?.label ?? c.role : '—' },
    { label: 'Povo / origem', value: c.ancestry || '—' },
    { label: 'Antecedente',   value: c.background || '—' },
    { label: 'PV',            value: `${c.hp.current}/${c.hp.max}` },
    { label: 'Aparar',        value: `${c.ac}` },
    { label: 'Deslocamento',  value: `${c.speed}m` },
    { label: 'Proficiência',  value: `+${c.prof}` },
  ]
  const resources = [
    { key: 'pa',   label: 'PA Arcana',     color: 'arcana' },
    { key: 'pe',   label: 'PE Emoção',     color: 'primitiva' },
    { key: 'pd',   label: 'PD Devoção',    color: 'fe' },
    { key: 'aura', label: 'Pontos de Aura',color: 'aura' },
  ] as const

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="metrics-grid">
        {metrics.map(m => (
          <div key={m.label} className="metric-card">
            <span className="metric-value">{m.value}</span>
            <span className="metric-label">{m.label}</span>
          </div>
        ))}
      </div>
      <div className="resource-grid">
        {resources.map(({ key, label, color }) => {
          const r = c.resources[key]
          const pct = r.max > 0 ? Math.max(0, Math.min(100, (r.current / r.max) * 100)) : 0
          return (
            <div key={key} className={`resource-card ${color}`}>
              <div className="resource-top">
                <span className="resource-label">{label}</span>
                <span className="resource-count">{r.current}/{r.max}</span>
              </div>
              <div className="resource-bar"><div className="resource-fill" style={{ width: `${pct}%` }} /></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Dados ────────────────────────────────────────────────────────────────────
function TabDados({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  return (
    <div className="grid" style={{ gap: 10 }}>
      <div className="field-row">
        <div><label>Nome</label><input value={c.name} onChange={e => update({ name: e.target.value })} /></div>
        <div><label>Jogador</label><input value={c.player} onChange={e => update({ player: e.target.value })} /></div>
      </div>
      <div className="field-row-3">
        <div>
          <label>Classe</label>
          <select value={c.role} onChange={e => update({ role: e.target.value })}>
            <option value="">— Escolher —</option>
            {Object.entries(CLASS_HP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div><label>Povo / Ancestral</label><input value={c.ancestry} onChange={e => update({ ancestry: e.target.value })} /></div>
        <div><label>Antecedente</label><input value={c.background} onChange={e => update({ background: e.target.value })} /></div>
      </div>
      <div className="field-row-3">
        <div><label>Nível</label><input type="number" min={1} max={20} value={c.level} onChange={e => update({ level: +e.target.value })} /></div>
        <div><label>XP</label><input type="number" min={0} value={c.xp} onChange={e => update({ xp: +e.target.value })} /></div>
        <div><label>Aura</label><input value={c.aura} onChange={e => update({ aura: e.target.value })} /></div>
      </div>
      <div>
        <label>Moedas</label>
        <div className="field-row">
          {(['pp', 'gp', 'sp', 'cp'] as const).map(coin => (
            <div key={coin}>
              <label>{coin.toUpperCase()}</label>
              <input type="number" min={0} value={c.currency[coin]}
                onChange={e => update({ currency: { ...c.currency, [coin]: +e.target.value } })} />
            </div>
          ))}
        </div>
      </div>
      <div><label>Notas rápidas</label><textarea value={c.notes} onChange={e => update({ notes: e.target.value })} /></div>
    </div>
  )
}

// ─── Atributos ────────────────────────────────────────────────────────────────
function TabAtributos({ c, update, roll }: { c: Character; update: (p: Partial<Character>) => void; roll: (f: string, l: string) => void }) {
  const saves = c.saves ?? {}
  const toggleSave = (key: AttrKey) => update({ saves: { ...saves, [key]: !saves[key] } })

  return (
    <div className="grid" style={{ gap: 10 }}>
      {ATTRS.map(([key, label, desc]) => {
        const die = c.attrs[key as AttrKey]
        const mod = dieMod(die)
        return (
          <div key={key} className="attr-row">
            <div className="attr-info">
              <span className="attr-key">{key}</span>
              <span className="attr-label">{label}</span>
              <span className="attr-desc muted">{desc}</span>
            </div>
            <select
              className="attr-select"
              value={die}
              onChange={e => update({ attrs: { ...c.attrs, [key]: e.target.value as AttrDie } })}
            >
              {ATTR_DICE.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span className="attr-mod">{signed(mod)}</span>
            <button className="btn small" onClick={() => roll(`1${die}`, `${key} · ${label}`)}>Rolar {die}</button>
          </div>
        )
      })}
      <div className="panel-inner">
        <div className="section-title">
          <h3>Testes de resistência</h3>
          <span className="pill blue">Proficiência +{c.prof}</span>
        </div>
        <p className="muted" style={{ marginBottom: 8 }}>
          Sem proficiência: role só o dado do atributo. Com proficiência: some +{c.prof}.
        </p>
        <div className="skills-grid">
          {ATTRS.map(([key, label]) => {
            const attrKey = key as AttrKey
            const die = c.attrs[attrKey]
            const hasProf = !!saves[attrKey]
            const mod = hasProf ? c.prof : 0
            return (
              <div key={key} className="skill-row">
                <button
                  className={`skill-prof-btn ${hasProf ? 'active' : ''}`}
                  title={hasProf ? 'Com proficiência' : 'Sem proficiência'}
                  onClick={() => toggleSave(attrKey)}
                >
                  {hasProf ? '◆' : '◇'}
                </button>
                <span className="skill-name">{key}</span>
                <span className="skill-attr muted">({label})</span>
                <button className="btn small" onClick={() => roll(`1${die}${mod ? '+' + mod : ''}`, `Save ${key}`)}>
                  {die} {signed(mod)}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Combate ──────────────────────────────────────────────────────────────────
function TabCombate({ c, update, roll }: {
  c: Character
  update: (p: Partial<Character>) => void
  roll: (f: string, l: string) => void
}) {
  const hpPct = Math.max(0, Math.min(100, (c.hp.current / Math.max(1, c.hp.max)) * 100))
  const hpColor = hpPct > 50 ? 'var(--green)' : hpPct > 25 ? 'var(--gold)' : 'var(--danger)'

  const calcMaxHp = () => {
    const profile = CLASS_HP[c.role]
    if (!profile) return null
    const vigorMod = VIGOR_HP[c.attrs.VIG] ?? 4
    return { total: profile.value + vigorMod, profile, vigor: c.attrs.VIG, vigorHp: vigorMod }
  }
  const hpCalc = calcMaxHp()

  const addAttack = () => {
    const atk: Attack = { id: uid(), name: 'Novo Ataque', attr: 'FOR', bonus: 0, damage: '1d6', range: 'Corpo a corpo', type: '', notes: '' }
    update({ attacks: [...c.attacks, atk] })
  }
  const patchAttack = (id: string, p: Partial<Attack>) =>
    update({ attacks: c.attacks.map(a => a.id === id ? { ...a, ...p } : a) })
  const removeAttack = (id: string) =>
    update({ attacks: c.attacks.filter(a => a.id !== id) })

  const rollAttack = (atk: Attack) => {
    const mod = dieMod(c.attrs[atk.attr]) + (atk.bonus || 0)
    const formula = `1d20${mod >= 0 ? '+' + mod : mod}`
    roll(formula, `Ataque · ${atk.name}`)
  }
  const rollDamage = (atk: Attack) => {
    roll(atk.damage, `Dano · ${atk.name}`)
  }

  return (
    <div className="grid" style={{ gap: 12 }}>
      {/* HP */}
      <div className="panel-inner">
        <div className="section-title"><h3>Pontos de Vida</h3></div>
        <div className="field-row-3">
          <div><label>PV Atual</label><input type="number" value={c.hp.current} onChange={e => update({ hp: { ...c.hp, current: +e.target.value } })} /></div>
          <div><label>PV Máximo</label><input type="number" value={c.hp.max} onChange={e => update({ hp: { ...c.hp, max: +e.target.value } })} /></div>
          <div><label>PV Temporário</label><input type="number" value={c.hp.temp} onChange={e => update({ hp: { ...c.hp, temp: +e.target.value } })} /></div>
        </div>
        <div className="hp-bar" style={{ marginTop: 8, height: 8 }}>
          <div className="hp-fill" style={{ width: `${hpPct}%`, background: hpColor }} />
        </div>
        <div className="row" style={{ marginTop: 10, gap: 6 }}>
          <button className="btn small danger" onClick={() => update({ hp: { ...c.hp, current: Math.max(0, c.hp.current - 1) } })}>−1 PV</button>
          <button className="btn small green"  onClick={() => update({ hp: { ...c.hp, current: Math.min(c.hp.max, c.hp.current + 1) } })}>+1 PV</button>
          {hpCalc && (
            <button className="btn small" onClick={() => update({ hp: { ...c.hp, max: hpCalc.total, current: hpCalc.total } })}>
              ✦ Aplicar PV calculado ({hpCalc.total})
            </button>
          )}
        </div>
        {hpCalc && (
          <p className="muted" style={{ marginTop: 6 }}>
            VIG {hpCalc.vigor} = {hpCalc.vigorHp} · {hpCalc.profile.label} {hpCalc.profile.die} = {hpCalc.profile.value}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="panel-inner">
        <div className="section-title"><h3>Estatísticas</h3></div>
        <div className="field-row-3">
          <div><label>Aparar (AC)</label><input type="number" min={0} value={c.ac} onChange={e => update({ ac: +e.target.value })} /></div>
          <div><label>Deslocamento (m)</label><input type="number" min={0} value={c.speed} onChange={e => update({ speed: +e.target.value })} /></div>
          <div><label>Proficiência</label><input type="number" min={0} value={c.prof} onChange={e => update({ prof: +e.target.value })} /></div>
        </div>
      </div>

      {/* Ataques */}
      <div className="panel-inner">
        <div className="section-title">
          <h3>Ataques comuns</h3>
          <button className="btn small primary" onClick={addAttack}>+ Adicionar</button>
        </div>
        <div className="list">
          {c.attacks.length === 0 && <div className="empty">Nenhum ataque cadastrado.</div>}
          {c.attacks.map(atk => {
            const attrDie = c.attrs[atk.attr]
            const mod = dieMod(attrDie) + (atk.bonus || 0)
            return (
              <div key={atk.id} className="attack-card">
                <div className="attack-header">
                  <div>
                    <strong>{atk.name}</strong>
                    <span className="muted" style={{ marginLeft: 8 }}>
                      {atk.attr} {attrDie} {signed(mod)} · {atk.damage}
                      {atk.range && ` · ${atk.range}`}
                    </span>
                  </div>
                  <div className="row" style={{ gap: 4 }}>
                    <button className="btn small primary" onClick={() => rollAttack(atk)}>🎲 Ataque</button>
                    <button className="btn small" onClick={() => rollDamage(atk)}>💥 Dano</button>
                    <button className="btn small danger ghost" onClick={() => removeAttack(atk.id)}>✕</button>
                  </div>
                </div>
                <div className="attack-fields">
                  <div><label>Nome</label><input value={atk.name} onChange={e => patchAttack(atk.id, { name: e.target.value })} /></div>
                  <div>
                    <label>Atributo</label>
                    <select value={atk.attr} onChange={e => patchAttack(atk.id, { attr: e.target.value as AttrKey })}>
                      {ATTRS.map(([k, l]) => <option key={k} value={k}>{k} · {l}</option>)}
                    </select>
                  </div>
                  <div><label>Bônus extra</label><input type="number" value={atk.bonus} onChange={e => patchAttack(atk.id, { bonus: +e.target.value })} /></div>
                  <div><label>Dano</label><input value={atk.damage} placeholder="1d8+2" onChange={e => patchAttack(atk.id, { damage: e.target.value })} /></div>
                  <div><label>Alcance</label><input value={atk.range} placeholder="Corpo a corpo" onChange={e => patchAttack(atk.id, { range: e.target.value })} /></div>
                  <div><label>Tipo</label><input value={atk.type} placeholder="Cortante" onChange={e => patchAttack(atk.id, { type: e.target.value })} /></div>
                </div>
                {(atk.notes !== undefined) && (
                  <div style={{ marginTop: 6 }}>
                    <label>Observações</label>
                    <input value={atk.notes} onChange={e => patchAttack(atk.id, { notes: e.target.value })} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Habilidades / Perícias ────────────────────────────────────────────────────
function TabHabilidades({ c, update, roll }: {
  c: Character
  update: (p: Partial<Character>) => void
  roll: (f: string, l: string) => void
}) {
  const { ui, setAbilityCategory } = useStore()
  const subcat = ui.abilityCategory || 'pericias'
  const [abilitySearch, setAbilitySearch] = useState('')
  const [abilityClassFilter, setAbilityClassFilter] = useState('')
  const [abilityLevelFilter, setAbilityLevelFilter] = useState('')
  const [customAbilityOpen, setCustomAbilityOpen] = useState(false)

  const roleClass = c.role ? CLASS_HP[c.role]?.label : ''
  const availableAbilities = LEVEL_ABILITIES.filter((ability) => {
    const belongsToClass = !abilityClassFilter
      || (abilityClassFilter === '__current' ? ability.class === roleClass || ability.class === 'Geral' : ability.class === abilityClassFilter)
    const matchesLevel = !abilityLevelFilter
      || (abilityLevelFilter === '__unlocked' ? ability.level <= c.level : ability.level === Number(abilityLevelFilter))
    const matchesSearch = !abilitySearch || normalizeText(`${ability.name} ${ability.effect}`).includes(normalizeText(abilitySearch))
    return belongsToClass && matchesLevel && matchesSearch
  })
  const abilityClasses = [...new Set(LEVEL_ABILITIES.map(ability => ability.class))]
  const abilityLevels = [...new Set(LEVEL_ABILITIES.map(ability => ability.level))].sort((a, b) => a - b)
  const knownAbilities = LEVEL_ABILITIES.filter(ability => c.knownAbilityIds.includes(ability.id))
  const addAbility = (id: string) => update({ knownAbilityIds: [...new Set([...c.knownAbilityIds, id])] })
  const removeAbility = (id: string) => update({ knownAbilityIds: c.knownAbilityIds.filter(knownId => knownId !== id) })
  const addCustomAbility = (ability: CustomAbility) => update({ customAbilities: [...c.customAbilities, ability] })
  const removeCustomAbility = (id: string) => update({ customAbilities: c.customAbilities.filter(ability => ability.id !== id) })

  const rollSkill = (name: string, attr: string) => {
    const attrKey = attr.split('/')[0] as AttrKey
    const die = c.attrs[attrKey] ?? 'd4'
    const mod = dieMod(die) + (c.skills[name] ? c.prof : 0)
    const formula = `1${die}${mod >= 0 ? '+' + mod : mod}`
    roll(formula, `${name}`)
  }

  return (
    <div className="grid" style={{ gap: 10 }}>
      <div className="segmented">
        <button className={subcat === 'pericias' ? 'active' : ''} onClick={() => setAbilityCategory('pericias')}>Perícias</button>
        <button className={subcat === 'habilidades' ? 'active' : ''} onClick={() => setAbilityCategory('habilidades')}>Características</button>
      </div>

      {subcat === 'pericias' && (
        <div>
          <p className="muted" style={{ marginBottom: 8 }}>
            Sem proficiência: role só o dado do atributo. Com proficiência: adiciona +{c.prof} ao resultado.
          </p>
          <div className="skills-grid">
            {SKILLS.map(([name, attr]) => {
              const attrKey = attr.split('/')[0] as AttrKey
              const die = c.attrs[attrKey] ?? 'd4'
              const mod = dieMod(die) + (c.skills[name] ? c.prof : 0)
              const hasProf = !!c.skills[name]
              return (
                <div key={name} className="skill-row">
                  <button
                    className={`skill-prof-btn ${hasProf ? 'active' : ''}`}
                    title={hasProf ? 'Com proficiência' : 'Sem proficiência'}
                    onClick={() => update({ skills: { ...c.skills, [name]: !hasProf } })}
                  >
                    {hasProf ? '◆' : '◇'}
                  </button>
                  <span className="skill-name">{name}</span>
                  <span className="skill-attr muted">({attr})</span>
                  <button className="btn small" onClick={() => rollSkill(name, attr)}>
                    {die} {signed(mod)}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {subcat === 'habilidades' && (
        <div className="grid" style={{ gap: 12 }}>
          <div className="panel-inner">
            <div className="section-title">
              <h3>Características escolhidas</h3>
              <div className="row">
                <span className="pill blue">{knownAbilities.length + c.customAbilities.length}</span>
                <button className="btn small primary" onClick={() => setCustomAbilityOpen(true)}>+ Personalizada</button>
              </div>
            </div>
            {knownAbilities.length === 0 && c.customAbilities.length === 0 ? <div className="empty">Nenhuma característica adicionada.</div> : <div className="list">
              {knownAbilities.map(a => (
                <div key={a.id} className="item">
                  <div className="item-head">
                    <div><h4>{a.name}</h4><p>{a.class} · Nível {a.level}</p></div>
                    <button className="btn small danger ghost" onClick={() => removeAbility(a.id)}>Remover</button>
                  </div>
                  <p style={{ marginTop: 4 }}>{a.effect}</p>
                </div>
              ))}
              {c.customAbilities.map(ability => (
                <div key={ability.id} className="item">
                  <div className="item-head">
                    <div><h4>{ability.name} <span className="pill gold">Personalizada</span></h4><p>{ability.class} · Nível {ability.level}</p></div>
                    <button className="btn small danger ghost" onClick={() => removeCustomAbility(ability.id)}>Remover</button>
                  </div>
                  <p style={{ marginTop: 4 }}>{ability.effect}</p>
                </div>
              ))}
            </div>}
          </div>
          <div className="panel-inner">
            <div className="section-title"><h3>Catálogo disponível</h3><span className="pill gold">{availableAbilities.length}</span></div>
            <div className="filterbar">
              <input value={abilitySearch} onChange={e => setAbilitySearch(e.target.value)} placeholder="Pesquisar característica ou efeito" />
              <select value={abilityClassFilter} onChange={event => setAbilityClassFilter(event.target.value)}>
                <option value="">Todas as classes</option>
                <option value="__current" disabled={!roleClass}>Minha classe{roleClass ? ` (${roleClass})` : ''}</option>
                {abilityClasses.map(abilityClass => <option key={abilityClass} value={abilityClass}>{abilityClass}</option>)}
              </select>
              <select value={abilityLevelFilter} onChange={event => setAbilityLevelFilter(event.target.value)}>
                <option value="">Todos os níveis</option>
                <option value="__unlocked">Até meu nível ({c.level})</option>
                {abilityLevels.map(level => <option key={level} value={level}>Nível {level}</option>)}
              </select>
            </div>
            {availableAbilities.length === 0
              ? <div className="empty">Nenhuma característica encontrada com os filtros selecionados.</div>
              : <div className="list">
                {availableAbilities.map((a) => (
                  <div key={a.id} className="item">
                    <div className="item-head">
                      <div><h4>{a.name}</h4><p>{a.class} · Nível {a.level}</p></div>
                      <button className="btn small primary" disabled={c.knownAbilityIds.includes(a.id)} onClick={() => addAbility(a.id)}>
                        {c.knownAbilityIds.includes(a.id) ? 'Adicionada' : '+ Adicionar'}
                      </button>
                    </div>
                    <p style={{ marginTop: 4 }}>{a.effect}</p>
                  </div>
                ))}
              </div>
            }
          </div>
          <CustomAbilityModal
            open={customAbilityOpen}
            defaultClass={roleClass || 'Geral'}
            defaultLevel={c.level}
            onClose={() => setCustomAbilityOpen(false)}
            onSave={ability => { addCustomAbility(ability); setCustomAbilityOpen(false) }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Magias / Recursos ────────────────────────────────────────────────────────
function TabMagias({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  const { app } = useStore()
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('')
  const [customSpellOpen, setCustomSpellOpen] = useState(false)

  const updateResource = (key: keyof typeof c.resources, field: 'current' | 'max', val: number) => {
    update({ resources: { ...c.resources, [key]: { ...c.resources[key], [field]: val } } })
  }

  const resourceDefs = [
    { key: 'pa'   as const, label: 'PA Arcana',      color: 'arcana',    desc: 'Pontos de Arcana para magias arcanas' },
    { key: 'pe'   as const, label: 'PE Emoção',      color: 'primitiva', desc: 'Pontos de Emoção para magia primitiva' },
    { key: 'pd'   as const, label: 'PD Devoção',     color: 'fe',        desc: 'Pontos de Devoção para magia de fé' },
    { key: 'aura' as const, label: 'Pontos de Aura', color: 'aura',      desc: 'Aura marcial para habilidades físicas' },
  ]

  const knownSpells = app.magic.filter(m => c.knownSpellIds.includes(m.id))
  const allSpells = app.magic.filter(spell => {
    const notKnown = !c.knownSpellIds.includes(spell.id)
    const matchesSource = !source || spell.source === source
    const matchesSearch = !search || normalizeText(`${spell.name} ${spell.effect} ${spell.cost} ${spell.type}`).includes(normalizeText(search))
    return notKnown && matchesSource && matchesSearch
  })
  const sources = [...new Set(app.magic.map(spell => spell.source))]

  const addKnown = (id: string) => update({ knownSpellIds: [...c.knownSpellIds, id] })
  const removeKnown = (id: string) => update({ knownSpellIds: c.knownSpellIds.filter(x => x !== id) })
  const addCustomSpell = (spell: CustomSpell) => update({ customSpells: [...c.customSpells, spell] })
  const removeCustomSpell = (id: string) => update({ customSpells: c.customSpells.filter(spell => spell.id !== id) })

  return (
    <div className="grid" style={{ gap: 12 }}>
      {/* Recursos */}
      <div className="panel-inner">
        <div className="section-title"><h3>Recursos de habilidade</h3></div>
        <div className="resource-grid-4">
          {resourceDefs.map(({ key, label, color, desc }) => {
            const r = c.resources[key]
            const pct = r.max > 0 ? Math.max(0, Math.min(100, (r.current / r.max) * 100)) : 0
            return (
              <div key={key} className={`resource-full ${color}`} title={desc}>
                <span className="resource-label">{label}</span>
                <div className="resource-inputs">
                  <input type="number" min={0} max={r.max} value={r.current}
                    onChange={e => updateResource(key, 'current', +e.target.value)} />
                  <span>/</span>
                  <input type="number" min={0} value={r.max}
                    onChange={e => updateResource(key, 'max', +e.target.value)} />
                </div>
                <div className="resource-bar-full"><div className="resource-fill" style={{ width: `${pct}%` }} /></div>
              </div>
            )
          })}
        </div>
        <div className="field-row" style={{ marginTop: 10 }}>
          <div><label>Emoção dominante</label><input value={c.emotion} onChange={e => update({ emotion: e.target.value })} /></div>
          <div><label>Deidade / Pacto</label><input value={c.deity} onChange={e => update({ deity: e.target.value })} /></div>
        </div>
      </div>

      {/* Habilidades conhecidas */}
      <div className="panel-inner">
        <div className="section-title">
          <h3>Habilidades do personagem</h3>
          <div className="row">
            <span className="pill gold">Base {Math.max(1, c.level) + 1} slots</span>
            <button className="btn small primary" onClick={() => setCustomSpellOpen(true)}>+ Personalizada</button>
          </div>
        </div>
        {knownSpells.length === 0 && c.customSpells.length === 0
          ? <div className="empty">Nenhuma habilidade adicionada. Use o catálogo abaixo.</div>
          : <div className="grid grid-two" style={{ gap: 6 }}>
              {knownSpells.map(spell => (
                <div key={spell.id} className={`item magic-card ${spell.source}`}>
                  <div className="item-head">
                    <div><h4>{spell.name}</h4><p>{spell.cost} · {spell.type}</p></div>
                    <button className="btn small danger ghost" onClick={() => removeKnown(spell.id)}>✕</button>
                  </div>
                  <p style={{ marginTop: 4 }}>{spell.effect}</p>
                </div>
              ))}
              {c.customSpells.map(spell => (
                <div key={spell.id} className={`item magic-card ${spell.source}`}>
                  <div className="item-head">
                    <div><h4>{spell.name} <span className="pill gold">Personalizada</span></h4><p>{spell.cost} · {spell.type}</p></div>
                    <button className="btn small danger ghost" onClick={() => removeCustomSpell(spell.id)}>✕</button>
                  </div>
                  <p style={{ marginTop: 4 }}>{spell.effect}</p>
                  <p className="muted" style={{ marginTop: 3 }}>{spell.range} · {spell.duration}</p>
                  {spell.notes && <p style={{ marginTop: 3 }}>{spell.notes}</p>}
                </div>
              ))}
            </div>
        }
      </div>

      <CustomSpellModal
        open={customSpellOpen}
        onClose={() => setCustomSpellOpen(false)}
        onSave={spell => { addCustomSpell(spell); setCustomSpellOpen(false) }}
      />

      {/* Catálogo */}
      <div className="panel-inner">
          <div className="section-title"><h3>Adicionar do catálogo</h3><span className="pill blue">{allSpells.length}</span></div>
          <div className="filterbar">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar nome, efeito, custo ou tipo" />
            <select value={source} onChange={e => setSource(e.target.value)}>
              <option value="">Todas as fontes</option>
              {sources.map(item => <option key={item} value={item}>{SOURCES[item] ?? item}</option>)}
            </select>
          </div>
          {allSpells.length === 0 ? <div className="empty">Nenhuma habilidade encontrada.</div> :
          <div className="grid grid-two" style={{ gap: 6 }}>
            {allSpells.map(spell => (
              <div key={spell.id} className={`item magic-card ${spell.source}`} style={{ opacity: 0.8 }}>
                <div className="item-head">
                  <div><h4>{spell.name}</h4><p>{spell.cost} · {spell.source}</p></div>
                  <button className="btn small primary" onClick={() => addKnown(spell.id)}>+ Adicionar</button>
                </div>
                <p style={{ marginTop: 4 }}>{spell.effect}</p>
              </div>
            ))}
          </div>
          }
      </div>

      {/* Texto livre */}
      <div className="panel-inner">
        <div className="section-title"><h3>Habilidades conhecidas (texto livre)</h3></div>
        <textarea rows={5} value={c.spells} onChange={e => update({ spells: e.target.value })}
          placeholder="Liste magias, técnicas, rituais e tecnologias conhecidas..." />
      </div>
    </div>
  )
}

function CustomAbilityModal({ open, defaultClass, defaultLevel, onClose, onSave }: {
  open: boolean
  defaultClass: string
  defaultLevel: number
  onClose: () => void
  onSave: (ability: CustomAbility) => void
}) {
  const [name, setName] = useState('')
  const [effect, setEffect] = useState('')
  const [abilityClass, setAbilityClass] = useState(defaultClass)
  const [level, setLevel] = useState(defaultLevel)
  const save = () => {
    if (!name.trim() || !effect.trim()) return
    onSave({ id: uid(), name: name.trim(), effect: effect.trim(), class: abilityClass.trim() || 'Geral', level: Math.max(1, level), custom: true })
    setName(''); setEffect('')
  }
  return (
    <Modal open={open} title="Nova característica personalizada" onClose={onClose} actions={<>
      <button className="btn small" onClick={onClose}>Cancelar</button>
      <button className="btn small primary" disabled={!name.trim() || !effect.trim()} onClick={save}>Adicionar</button>
    </>}>
      <div className="grid" style={{ gap: 10 }}>
        <div><label>Nome</label><input value={name} onChange={event => setName(event.target.value)} autoFocus /></div>
        <div className="field-row">
          <div><label>Classe / origem</label><input value={abilityClass} onChange={event => setAbilityClass(event.target.value)} /></div>
          <div><label>Nível</label><input type="number" min={1} max={20} value={level} onChange={event => setLevel(Number(event.target.value))} /></div>
        </div>
        <div><label>Efeito</label><textarea rows={5} value={effect} onChange={event => setEffect(event.target.value)} /></div>
      </div>
    </Modal>
  )
}

function CustomSpellModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (spell: CustomSpell) => void }) {
  const [spell, setSpell] = useState({ name: '', source: 'arcana', cost: '', range: '', type: '', duration: '', effect: '', notes: '' })
  const patch = (value: Partial<typeof spell>) => setSpell(current => ({ ...current, ...value }))
  const save = () => {
    if (!spell.name.trim() || !spell.effect.trim()) return
    onSave({ id: uid(), ...spell, name: spell.name.trim(), effect: spell.effect.trim(), custom: true })
    setSpell({ name: '', source: 'arcana', cost: '', range: '', type: '', duration: '', effect: '', notes: '' })
  }
  return (
    <Modal open={open} title="Nova habilidade personalizada" onClose={onClose} actions={<>
      <button className="btn small" onClick={onClose}>Cancelar</button>
      <button className="btn small primary" disabled={!spell.name.trim() || !spell.effect.trim()} onClick={save}>Adicionar</button>
    </>}>
      <div className="grid" style={{ gap: 10 }}>
        <div className="field-row">
          <div><label>Nome</label><input value={spell.name} onChange={event => patch({ name: event.target.value })} autoFocus /></div>
          <div><label>Fonte</label><select value={spell.source} onChange={event => patch({ source: event.target.value })}>{Object.entries(SOURCES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
        </div>
        <div className="field-row-3">
          <div><label>Custo</label><input value={spell.cost} onChange={event => patch({ cost: event.target.value })} placeholder="2 PA" /></div>
          <div><label>Tipo</label><input value={spell.type} onChange={event => patch({ type: event.target.value })} placeholder="Ação" /></div>
          <div><label>Duração</label><input value={spell.duration} onChange={event => patch({ duration: event.target.value })} /></div>
        </div>
        <div><label>Alcance</label><input value={spell.range} onChange={event => patch({ range: event.target.value })} /></div>
        <div><label>Efeito</label><textarea rows={5} value={spell.effect} onChange={event => patch({ effect: event.target.value })} /></div>
        <div><label>Observações</label><textarea rows={3} value={spell.notes} onChange={event => patch({ notes: event.target.value })} /></div>
      </div>
    </Modal>
  )
}

// ─── Inventário ───────────────────────────────────────────────────────────────
function TabInventario({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  return (
    <div className="grid" style={{ gap: 10 }}>
      <div><label>Traços e características especiais</label><textarea rows={4} value={c.features} onChange={e => update({ features: e.target.value })} /></div>
      <div><label>Equipamento e itens</label><textarea rows={8} value={c.inventory} onChange={e => update({ inventory: e.target.value })} /></div>
      <div><label>Notas gerais</label><textarea rows={4} value={c.notes} onChange={e => update({ notes: e.target.value })} /></div>
    </div>
  )
}

// ─── História ────────────────────────────────────────────────────────────────
function TabHistoria({ c, update }: { c: Character; update: (p: Partial<Character>) => void }) {
  return (
    <div className="grid" style={{ gap: 10 }}>
      {([
        ['appearance',  'Aparência'],
        ['personality', 'Personalidade'],
        ['bonds',       'Vínculos'],
        ['ideals',      'Ideais'],
        ['flaws',       'Falhas e fraquezas'],
      ] as [keyof Character, string][]).map(([k, l]) => (
        <div key={k}><label>{l}</label><textarea value={c[k] as string} onChange={e => update({ [k]: e.target.value })} /></div>
      ))}
    </div>
  )
}
