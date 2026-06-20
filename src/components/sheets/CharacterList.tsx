import { useState } from 'react'
import { useStore } from '../../store'
import type { Character } from '../../types'

export function CharacterList() {
  const { app, ui, selectCharacter, newCharacter } = useStore()
  const [search, setSearch] = useState('')

  const norm = (v: string) =>
    v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

  const filtered = app.characters.filter((c) =>
    !search || norm(`${c.name} ${c.player} ${c.role} ${c.ancestry}`).includes(norm(search)),
  )

  const hpPct = (c: Character) =>
    Math.max(0, Math.min(100, (c.hp.current / Math.max(1, c.hp.max)) * 100))

  const hpClass = (pct: number) => (pct > 50 ? '' : pct > 25 ? 'medium' : 'low')

  return (
    <div className="panel">
      <div className="section-title">
        <h3>Personagens registrados</h3>
        <button className="btn small primary" onClick={newCharacter}>Novo</button>
      </div>
      <div className="filterbar">
        <input
          placeholder="Pesquisar personagem, jogador ou classe"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Pesquisar personagens"
        />
      </div>
      <div className="list">
        {filtered.length === 0 && <div className="empty">Nenhum personagem encontrado.</div>}
        {filtered.map((c) => {
          const pct = hpPct(c)
          return (
            <div
              key={c.id}
              className={`item selectable ${ui.selectedCharacterId === c.id ? 'active' : ''}`}
              onClick={() => selectCharacter(c.id)}
            >
              <div className="item-head">
                <div>
                  <h4>{c.name || 'Sem nome'}</h4>
                  <p>{c.player || 'Sem jogador'} | Nível {c.level} | {c.role || 'Sem classe'}</p>
                </div>
                <span className="pill red">{c.hp.current}/{c.hp.max} PV</span>
              </div>
              <div className="hp-bar">
                <div className={`hp-fill ${hpClass(pct)}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
