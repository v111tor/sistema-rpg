import { useState } from 'react'
import { useStore } from '../../store'
import { Modal } from '../ui/Modal'
import { BESTIARY_CATALOG } from '../../data/bestiary'
import { parseAndRoll, rollDie, uid } from '../../services/storage'
import { ATTRS, ATTR_DICE } from '../../data/constants'
import type { AttrDie, AttrKey, Creature, InitiativeEntry } from '../../types'

interface CombatRollResult {
  id: string
  label: string
  formula: string
  calculation: string
  result: number
}

const BLANK_CREATURE = (): Creature => ({
  id: uid(), name: '', type: '', source: 'campanha', ac: 12, hp: '20', speed: '9m',
  threat: '1', attrs: { FOR: 'd6', AGI: 'd6', VIG: 'd6', INT: 'd4', ESP: 'd4', DEV: 'd4' },
  attacks: '', notes: '', actions: [],
})

export function CreaturesTab() {
  const { app, addCreature, updateCreature, deleteCreature, setInitiative, clearInitiative, showToast } = useStore()
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<Creature | null>(null)
  const [dashboardId, setDashboardId] = useState<string | null>(null)
  const [activeTurnId, setActiveTurnId] = useState('')
  const [combatRoll, setCombatRoll] = useState<CombatRollResult | null>(null)

  const norm = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

  const campaignCreatures = app.creatures.filter((m) => {
    const okSearch = !search || norm(`${m.name} ${m.type} ${m.attacks} ${m.notes}`).includes(norm(search))
    return okSearch
  })

  const catalog = BESTIARY_CATALOG.filter((m) => {
    const okSearch = !search || norm(`${m.name} ${m.type} ${m.source} ${m.environment}`).includes(norm(search))
    return okSearch
  })

  const addFromCatalog = (entry: (typeof BESTIARY_CATALOG)[number]) => {
    const creature: Creature = {
      id: uid(),
      name: entry.name,
      type: entry.type,
      source: entry.source,
      ac: entry.ac,
      hp: String(entry.hp),
      speed: '9m',
      threat: String(entry.grade),
      attrs: { FOR: 'd6', AGI: 'd6', VIG: 'd6', INT: 'd4', ESP: 'd4', DEV: 'd4' },
      attacks: '',
      notes: `Ambiente: ${entry.environment}. Fonte: ${entry.source}.`,
      actions: [],
    }
    addCreature(creature)
    showToast(`${entry.name} adicionada à campanha.`)
  }

  const addToInitiative = (name: string, hp: string, creatureId?: string) => {
    const roll = rollDie(20)
    const entry: InitiativeEntry = { id: uid(), name, initiative: roll, hp, isPlayer: false, creatureId }
    const next = [...app.initiative, entry].sort((a, b) => b.initiative - a.initiative)
    setInitiative(next)
    if (!activeTurnId) setActiveTurnId(next[0]?.id ?? '')
  }

  const rollInitiative = () => {
    const entries = app.creatures.map((m) => ({
      id: uid(), name: m.name, initiative: rollDie(20),
      hp: m.hp, isPlayer: false, creatureId: m.id,
    }))
    app.characters.forEach((c) => {
      entries.push({ id: uid(), name: c.name, initiative: rollDie(20), hp: `${c.hp.current}/${c.hp.max}`, isPlayer: true, creatureId: c.id })
    })
    const sorted = entries.sort((a, b) => b.initiative - a.initiative)
    setInitiative(sorted)
    setActiveTurnId(sorted[0]?.id ?? '')
  }

  const updateInitiative = (id: string, patch: Partial<InitiativeEntry>) => {
    const next = app.initiative
      .map(entry => entry.id === id ? { ...entry, ...patch } : entry)
      .sort((a, b) => b.initiative - a.initiative)
    setInitiative(next)
  }

  const removeInitiative = (id: string) => {
    const next = app.initiative.filter(entry => entry.id !== id)
    setInitiative(next)
    if (activeTurnId === id) setActiveTurnId(next[0]?.id ?? '')
  }

  const addManualInitiative = () => {
    const entry: InitiativeEntry = { id: uid(), name: 'Novo participante', initiative: 0, hp: '', isPlayer: false }
    setInitiative([...app.initiative, entry])
    if (!activeTurnId) setActiveTurnId(entry.id)
  }

  const nextTurn = () => {
    if (!app.initiative.length) return
    const index = app.initiative.findIndex(entry => entry.id === activeTurnId)
    setActiveTurnId(app.initiative[(index + 1 + app.initiative.length) % app.initiative.length].id)
  }

  const rollForCreature = (label: string, formula: string) => {
    const rolled = parseAndRoll(formula)
    if (!rolled) {
      showToast(`Fórmula inválida: ${formula || 'vazia'}`)
      return
    }
    const match = formula.trim().match(/^(\d+)d(\d+)([+-]\d+)?$/i)
    const modifier = Number(match?.[3] ?? 0)
    const dice = rolled.breakdown.length > 1 ? `(${rolled.breakdown.join(' + ')})` : String(rolled.breakdown[0] ?? 0)
    const modifierText = modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : ''
    setCombatRoll({ id: uid(), label, formula, calculation: `${dice}${modifierText} = ${rolled.result}`, result: rolled.result })
  }

  const dashboardCreature = app.creatures.find(creature => creature.id === dashboardId) ?? null

  return (
    <>
      <div className="grid grid-two">
        <div className="panel">
          <div className="section-title">
            <h3>Criaturas</h3>
            <button className="btn small primary" onClick={() => setForm(BLANK_CREATURE())}>Nova criatura</button>
          </div>
          <div className="filterbar">
            <input placeholder="Pesquisar criatura, ação ou nota" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="list">
            {campaignCreatures.length === 0 && <div className="empty">Nenhuma criatura da campanha.</div>}
            {campaignCreatures.map((m) => (
              <div key={m.id} className="item">
                <div className="item-head">
                  <div><h4>{m.name}</h4><p>{m.type} | CA {m.ac} | PV {m.hp} | Grau {m.threat}</p></div>
                  <div className="row">
                    <button className="btn small" onClick={() => addToInitiative(m.name, m.hp, m.id)}>+Init</button>
                    <button className="btn small primary" onClick={() => setDashboardId(m.id)}>Ficha completa</button>
                    <button className="btn small" onClick={() => setForm({ ...m })}>Editar</button>
                    <button className="btn small danger" onClick={() => deleteCreature(m.id)}>✕</button>
                  </div>
                </div>
                {m.attacks && <p><b>Ações:</b> {m.attacks}</p>}
              </div>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 16 }}>
            <h3>Bestiário</h3>
            <span className="pill gold">{catalog.length}</span>
          </div>
          <div className="grid grid-two" style={{ gap: 6 }}>
            {catalog.map((m) => (
              <div key={`${m.source}-${m.name}`} className="item" style={{ fontSize: 12 }}>
                <div className="item-head">
                  <div><b>{m.name}</b><p>{m.type} · {m.environment} · Grau {m.grade}</p></div>
                  <button className="btn small primary" onClick={() => addFromCatalog(m)}>+ Adicionar</button>
                </div>
                <p>PV {m.hp} | CA {m.ac} | {m.source}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h3>Controle de encontro</h3>
            <div className="row">
              <button className="btn small" onClick={rollInitiative}>Rolar</button>
              <button className="btn small" onClick={addManualInitiative}>+ Manual</button>
              <button className="btn small" onClick={nextTurn}>Próximo</button>
              <button className="btn small danger" onClick={() => { clearInitiative(); setActiveTurnId('') }}>Limpar</button>
            </div>
          </div>
          <div className="list">
            {app.initiative.length === 0 && <div className="empty">Sem encontro ativo.</div>}
            {app.initiative.map((e, i) => (
              <div key={e.id} className={`item selectable ${e.id === activeTurnId ? 'active' : ''}`} onClick={() => setActiveTurnId(e.id)}>
                <div className="item-head" style={{ marginBottom: 7 }}>
                  <div><h4>{i + 1}º turno {e.isPlayer && <span className="pill blue">PC</span>}</h4></div>
                  <span className={`pill ${e.id === activeTurnId ? 'green' : 'gold'}`}>{e.id === activeTurnId ? 'Ativo' : `Init ${e.initiative}`}</span>
                </div>
                <div className="initiative-editor" onClick={event => event.stopPropagation()}>
                  <input aria-label="Nome do participante" value={e.name} onChange={event => updateInitiative(e.id, { name: event.target.value })} />
                  <input aria-label="Iniciativa" type="number" value={e.initiative} onChange={event => updateInitiative(e.id, { initiative: Number(event.target.value) })} />
                  <input className="initiative-hp" aria-label="Pontos de vida" value={e.hp} placeholder="PV" onChange={event => updateInitiative(e.id, { hp: event.target.value })} />
                  <button className="btn small danger ghost" onClick={() => removeInitiative(e.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {form && (
        <CreatureFormModal
          creature={form}
          onClose={() => setForm(null)}
          onSave={(c) => {
            if (app.creatures.find((x) => x.id === c.id)) updateCreature(c.id, c)
            else addCreature(c)
            setForm(null)
          }}
        />
      )}

      {dashboardCreature && (
        <CreatureDashboard
          creature={dashboardCreature}
          onClose={() => setDashboardId(null)}
          onEdit={() => { setForm({ ...dashboardCreature }); setDashboardId(null) }}
          onInitiative={() => addToInitiative(dashboardCreature.name, dashboardCreature.hp, dashboardCreature.id)}
          onRoll={rollForCreature}
        />
      )}

      {combatRoll && <CombatRollPopup roll={combatRoll} onClose={() => setCombatRoll(null)} />}
    </>
  )
}

function CreatureDashboard({ creature, onClose, onEdit, onInitiative, onRoll }: {
  creature: Creature
  onClose: () => void
  onEdit: () => void
  onInitiative: () => void
  onRoll: (label: string, formula: string) => void
}) {
  const [quickFormula, setQuickFormula] = useState('1d20')
  const metrics = [
    ['PV', creature.hp || '—'], ['CA', String(creature.ac)], ['Deslocamento', creature.speed || '—'], ['Grau', creature.threat || '—'],
  ]
  return (
    <Modal open wide title="Ficha completa da criatura" onClose={onClose} actions={<>
      <button className="btn small" onClick={onClose}>Fechar</button>
      <button className="btn small" onClick={onEdit}>Editar ficha</button>
      <button className="btn small primary" onClick={onInitiative}>+ Iniciativa</button>
    </>}>
      <div className="creature-dashboard">
        <div className="creature-dashboard-hero">
          <div>
            <h2>{creature.name}</h2>
            <p className="muted">{creature.type || 'Tipo indefinido'} · {creature.source || 'Fonte indefinida'}</p>
          </div>
          <span className="pill red">Grau {creature.threat || '—'}</span>
        </div>

        <div className="metrics-grid">
          {metrics.map(([label, value]) => <div className="metric-card" key={label}><span className="metric-value">{value}</span><span className="metric-label">{label}</span></div>)}
        </div>

        <section className="panel-inner">
          <div className="section-title"><h3>Dados rápidos</h3><span className="pill gold">Sem sair da ficha</span></div>
          <div className="row">
            {['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100'].map(formula => <button className="btn small" key={formula} onClick={() => onRoll(`${creature.name} · ${formula}`, formula)}>{formula}</button>)}
            <input value={quickFormula} onChange={event => setQuickFormula(event.target.value)} placeholder="2d6+3" style={{ flex: 1, minWidth: 110 }} onKeyDown={event => event.key === 'Enter' && onRoll(`${creature.name} · rolagem`, quickFormula)} />
            <button className="btn small primary" onClick={() => onRoll(`${creature.name} · rolagem`, quickFormula)}>Rolar</button>
          </div>
        </section>

        <div className="creature-dashboard-grid">
          <section className="panel-inner">
            <div className="section-title"><h3>Atributos</h3></div>
            <div className="creature-attributes">
              {ATTRS.map(([key, label]) => <div className="creature-attribute" key={key}><strong>{creature.attrs[key]}</strong><span>{key} · {label}</span></div>)}
            </div>
          </section>
          <section className="panel-inner">
            <div className="section-title"><h3>Resumo para combate</h3></div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{creature.attacks || 'Nenhum ataque ou ação rápida registrado.'}</p>
          </section>
        </div>

        <section className="panel-inner">
          <div className="section-title"><h3>Ações detalhadas</h3><span className="pill blue">{creature.actions.length}</span></div>
          {creature.actions.length === 0 ? <div className="empty">Nenhuma ação detalhada.</div> : <div className="grid grid-two">
            {creature.actions.map((action, index) => <div className="item" key={`${action.name}-${index}`}>
              <h4>{action.name || `Ação ${index + 1}`}</h4>
              <p style={{ whiteSpace: 'pre-wrap', marginTop: 5 }}>{action.description}</p>
              {action.rolls.length > 0 && <div className="row" style={{ marginTop: 9 }}>
                {action.rolls.map(roll => <button className="btn small primary" key={roll.id} onClick={() => onRoll(`${creature.name} · ${action.name} · ${roll.label}`, roll.formula)}>🎲 {roll.label}: {roll.formula}</button>)}
              </div>}
            </div>)}
          </div>}
        </section>

        <section className="panel-inner">
          <div className="section-title"><h3>Notas da sessão</h3></div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{creature.notes || 'Sem notas adicionais.'}</p>
        </section>
      </div>
    </Modal>
  )
}

function CombatRollPopup({ roll, onClose }: { roll: CombatRollResult; onClose: () => void }) {
  return (
    <aside className="combat-roll-popup" role="status" aria-live="polite">
      <button className="combat-roll-close" aria-label="Fechar resultado" onClick={onClose}>×</button>
      <span className="combat-roll-label">{roll.label}</span>
      <strong className="combat-roll-result">{roll.result}</strong>
      <span className="combat-roll-formula">{roll.formula}</span>
      <code>{roll.calculation}</code>
    </aside>
  )
}

function CreatureFormModal({ creature, onClose, onSave }: { creature: Creature; onClose: () => void; onSave: (c: Creature) => void }) {
  const [c, setC] = useState<Creature>(creature)
  const p = (patch: Partial<Creature>) => setC((prev) => ({ ...prev, ...patch }))
  const addAction = () => p({ actions: [...c.actions, { name: 'Nova ação', description: '', rolls: [{ id: uid(), label: 'Ataque', formula: '1d20' }] }] })
  const patchAction = (index: number, patch: Partial<Creature['actions'][number]>) => p({ actions: c.actions.map((action, actionIndex) => actionIndex === index ? { ...action, ...patch } : action) })
  const removeAction = (index: number) => p({ actions: c.actions.filter((_, actionIndex) => actionIndex !== index) })
  const addActionRoll = (actionIndex: number) => patchAction(actionIndex, { rolls: [...c.actions[actionIndex].rolls, { id: uid(), label: 'Dano', formula: '1d6' }] })
  const patchActionRoll = (actionIndex: number, rollId: string, patch: Partial<Creature['actions'][number]['rolls'][number]>) => patchAction(actionIndex, { rolls: c.actions[actionIndex].rolls.map(roll => roll.id === rollId ? { ...roll, ...patch } : roll) })
  const removeActionRoll = (actionIndex: number, rollId: string) => patchAction(actionIndex, { rolls: c.actions[actionIndex].rolls.filter(roll => roll.id !== rollId) })

  return (
    <Modal open wide title={creature.name || 'Nova criatura'} onClose={onClose}
      actions={<>
        <button className="btn small" onClick={onClose}>Cancelar</button>
        <button className="btn small primary" onClick={() => onSave(c)}>Salvar</button>
      </>}>
      <div className="grid" style={{ gap: 10 }}>
        <div className="field-row">
          <div><label>Nome</label><input value={c.name} onChange={(e) => p({ name: e.target.value })} autoFocus /></div>
          <div><label>Tipo</label><input value={c.type} onChange={(e) => p({ type: e.target.value })} /></div>
        </div>
        <div className="field-row">
          <div><label>Fonte</label><input value={c.source} onChange={(e) => p({ source: e.target.value })} /></div>
          <div><label>Deslocamento</label><input value={c.speed} onChange={(e) => p({ speed: e.target.value })} placeholder="9m" /></div>
        </div>
        <div className="field-row-3">
          <div><label>CA</label><input type="number" value={c.ac} onChange={(e) => p({ ac: +e.target.value })} /></div>
          <div><label>PV</label><input value={c.hp} onChange={(e) => p({ hp: e.target.value })} /></div>
          <div><label>Grau</label><input value={c.threat} onChange={(e) => p({ threat: e.target.value })} /></div>
        </div>
        <div>
          <label>Atributos</label>
          <div className="creature-attributes">
            {ATTRS.map(([key, label]) => <div key={key}><label>{key} · {label}</label><select value={c.attrs[key as AttrKey]} onChange={event => p({ attrs: { ...c.attrs, [key]: event.target.value as AttrDie } })}>{ATTR_DICE.map(die => <option key={die} value={die}>{die}</option>)}</select></div>)}
          </div>
        </div>
        <div><label>Resumo de ataques e ações</label><textarea rows={4} value={c.attacks} onChange={(e) => p({ attacks: e.target.value })} /></div>
        <div>
          <div className="section-title"><h3>Ações detalhadas</h3><button className="btn small primary" onClick={addAction}>+ Ação</button></div>
          <div className="list">
            {c.actions.map((action, index) => <div className="item" key={index}>
              <div className="field-row">
                <div><label>Nome</label><input value={action.name} onChange={event => patchAction(index, { name: event.target.value })} /></div>
                <div className="row" style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}><button className="btn small danger ghost" onClick={() => removeAction(index)}>Remover</button></div>
              </div>
              <div><label>Descrição</label><textarea rows={3} value={action.description} onChange={event => patchAction(index, { description: event.target.value })} /></div>
              <div className="section-title" style={{ marginTop: 9 }}><h4>Dados da habilidade</h4><button className="btn small" onClick={() => addActionRoll(index)}>+ Dado</button></div>
              <div className="list">
                {action.rolls.map(roll => <div className="creature-roll-editor" key={roll.id}>
                  <input aria-label="Nome da rolagem" value={roll.label} placeholder="Ataque" onChange={event => patchActionRoll(index, roll.id, { label: event.target.value })} />
                  <input aria-label="Fórmula da rolagem" value={roll.formula} placeholder="2d6+3" onChange={event => patchActionRoll(index, roll.id, { formula: event.target.value })} />
                  <button className="btn small danger ghost" onClick={() => removeActionRoll(index, roll.id)}>✕</button>
                </div>)}
              </div>
            </div>)}
          </div>
        </div>
        <div><label>Notas</label><textarea value={c.notes} onChange={(e) => p({ notes: e.target.value })} /></div>
      </div>
    </Modal>
  )
}
