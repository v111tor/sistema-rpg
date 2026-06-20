import { useState } from 'react'
import { useStore } from '../../store'
import { Modal } from '../ui/Modal'
import { BESTIARY_CATALOG } from '../../data/bestiary'
import { rollDie, uid } from '../../services/storage'
import type { Creature, InitiativeEntry } from '../../types'

const BLANK_CREATURE = (): Creature => ({
  id: uid(), name: '', type: '', source: 'campanha', ac: 12, hp: '20', speed: '9m',
  threat: '1', attrs: { FOR: 'd6', AGI: 'd6', VIG: 'd6', INT: 'd4', ESP: 'd4', DEV: 'd4' },
  attacks: '', notes: '', actions: [],
})

export function CreaturesTab() {
  const { app, addCreature, updateCreature, deleteCreature, setInitiative, clearInitiative } = useStore()
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<Creature | null>(null)

  const norm = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

  const campaignCreatures = app.creatures.filter((m) => {
    const okSearch = !search || norm(`${m.name} ${m.type} ${m.attacks} ${m.notes}`).includes(norm(search))
    return okSearch
  })

  const catalog = BESTIARY_CATALOG.filter((m) => {
    const okSearch = !search || norm(`${m.name} ${m.type} ${m.source} ${m.environment}`).includes(norm(search))
    return okSearch
  })

  const addToInitiative = (name: string, hp: string, creatureId?: string) => {
    const roll = rollDie(20)
    const entry: InitiativeEntry = { id: uid(), name, initiative: roll, hp, isPlayer: false, creatureId }
    setInitiative([...app.initiative, entry].sort((a, b) => b.initiative - a.initiative))
  }

  const rollInitiative = () => {
    const entries = app.creatures.map((m) => ({
      id: uid(), name: m.name, initiative: rollDie(20),
      hp: m.hp, isPlayer: false, creatureId: m.id,
    }))
    app.characters.forEach((c) => {
      entries.push({ id: uid(), name: c.name, initiative: rollDie(20), hp: `${c.hp.current}/${c.hp.max}`, isPlayer: true, creatureId: c.id })
    })
    setInitiative(entries.sort((a, b) => b.initiative - a.initiative))
  }

  const [turn, setTurn] = useState(0)

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
            {catalog.slice(0, 40).map((m, i) => (
              <div key={i} className="item" style={{ fontSize: 12 }}>
                <div className="item-head">
                  <div><b>{m.name}</b><p>{m.type} · {m.environment} · Grau {m.grade}</p></div>
                </div>
                <p>PV {m.hp} | CA {m.ac}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h3>Controle de encontro</h3>
            <div className="row">
              <button className="btn small" onClick={rollInitiative}>Rolar</button>
              <button className="btn small" onClick={() => setTurn((t) => (t + 1) % Math.max(1, app.initiative.length))}>Próximo</button>
              <button className="btn small danger" onClick={() => { clearInitiative(); setTurn(0) }}>Limpar</button>
            </div>
          </div>
          <div className="list">
            {app.initiative.length === 0 && <div className="empty">Sem encontro ativo.</div>}
            {app.initiative.map((e, i) => (
              <div key={e.id} className={`item ${i === turn % app.initiative.length ? 'selectable active' : ''}`}>
                <div className="item-head">
                  <div>
                    <h4>{e.name} {e.isPlayer && <span className="pill blue">PC</span>}</h4>
                    <p>Iniciativa: {e.initiative} | PV: {e.hp}</p>
                  </div>
                  <span className="pill gold">{i + 1}º</span>
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
    </>
  )
}

function CreatureFormModal({ creature, onClose, onSave }: { creature: Creature; onClose: () => void; onSave: (c: Creature) => void }) {
  const [c, setC] = useState<Creature>(creature)
  const p = (patch: Partial<Creature>) => setC((prev) => ({ ...prev, ...patch }))

  return (
    <Modal open title={creature.name || 'Nova criatura'} onClose={onClose}
      actions={<>
        <button className="btn small" onClick={onClose}>Cancelar</button>
        <button className="btn small primary" onClick={() => onSave(c)}>Salvar</button>
      </>}>
      <div className="grid" style={{ gap: 10 }}>
        <div className="field-row">
          <div><label>Nome</label><input value={c.name} onChange={(e) => p({ name: e.target.value })} autoFocus /></div>
          <div><label>Tipo</label><input value={c.type} onChange={(e) => p({ type: e.target.value })} /></div>
        </div>
        <div className="field-row-3">
          <div><label>CA</label><input type="number" value={c.ac} onChange={(e) => p({ ac: +e.target.value })} /></div>
          <div><label>PV</label><input value={c.hp} onChange={(e) => p({ hp: e.target.value })} /></div>
          <div><label>Grau</label><input value={c.threat} onChange={(e) => p({ threat: e.target.value })} /></div>
        </div>
        <div><label>Ações</label><textarea value={c.attacks} onChange={(e) => p({ attacks: e.target.value })} /></div>
        <div><label>Notas</label><textarea value={c.notes} onChange={(e) => p({ notes: e.target.value })} /></div>
      </div>
    </Modal>
  )
}
