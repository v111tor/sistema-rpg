import { useState } from 'react'
import { useStore } from '../../store'
import { normalizeText } from '../../data/catalog'
import { LEVEL_ABILITIES } from '../../data/abilities'
import { SOURCES } from '../../data/constants'

export function AbilitiesTab() {
  const { app, ui, selectCharacter, updateCharacter, showToast } = useStore()
  const [magicSearch, setMagicSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [abilitySearch, setAbilitySearch] = useState('')
  const [classFilter, setClassFilter] = useState('')

  const selectedCharacter = app.characters.find(character => character.id === ui.selectedCharacterId) ?? app.characters[0]

  const sources = [...new Set(app.magic.map((m) => m.source))]
  const classes = [...new Set(LEVEL_ABILITIES.map((a) => a.class))]

  const filteredMagic = app.magic.filter((m) => {
    const okSource = !sourceFilter || m.source === sourceFilter
    const okSearch = !magicSearch || normalizeText(`${m.name} ${m.cost} ${m.effect} ${m.type}`).includes(normalizeText(magicSearch))
    return okSource && okSearch
  })

  const filteredAbilities = LEVEL_ABILITIES.filter((a) => {
    const okClass  = !classFilter  || a.class === classFilter
    const okSearch = !abilitySearch || normalizeText(`${a.name} ${a.effect}`).includes(normalizeText(abilitySearch))
    return okClass && okSearch
  })

  const addSpell = (id: string) => {
    if (!selectedCharacter) return
    updateCharacter(selectedCharacter.id, { knownSpellIds: [...new Set([...selectedCharacter.knownSpellIds, id])] })
    showToast('Magia adicionada ao personagem.')
  }
  const addAbility = (id: string) => {
    if (!selectedCharacter) return
    updateCharacter(selectedCharacter.id, { knownAbilityIds: [...new Set([...selectedCharacter.knownAbilityIds, id])] })
    showToast('Característica adicionada ao personagem.')
  }

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div className="panel">
        <div className="section-title"><h3>Adicionar ao personagem</h3></div>
        <select value={selectedCharacter?.id ?? ''} onChange={event => selectCharacter(event.target.value)}>
          {app.characters.map(character => <option key={character.id} value={character.id}>{character.name}</option>)}
        </select>
      </div>
      <div className="grid grid-two">
      <div className="panel">
        <div className="section-title">
          <h3>Catálogo de magias</h3>
          <span className="pill blue">{filteredMagic.length}</span>
        </div>
        <div className="filterbar">
          <input placeholder="Pesquisar magia, custo ou efeito" value={magicSearch} onChange={(e) => setMagicSearch(e.target.value)} />
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} style={{ maxWidth: 140 }}>
            <option value="">Todas as fontes</option>
            {sources.map((s) => <option key={s} value={s}>{SOURCES[s] ?? s}</option>)}
          </select>
        </div>
        <div className="list" style={{ maxHeight: 600, overflowY: 'auto' }}>
          {filteredMagic.map((m) => {
            const added = selectedCharacter?.knownSpellIds.includes(m.id)
            return <div key={m.id} className="item">
              <div className="item-head">
                <div>
                  <h4>{m.name}</h4>
                  <p>{SOURCES[m.source] ?? m.source} · {m.cost} · {m.type}</p>
                </div>
                <button className="btn small primary" disabled={added} onClick={() => addSpell(m.id)}>{added ? 'Adicionada' : '+ Adicionar'}</button>
              </div>
              <p style={{ marginTop: 4 }}>{m.effect}</p>
              <p style={{ marginTop: 2, color: 'var(--text-dim)', fontSize: 11 }}>Alcance: {m.range} · {m.duration}</p>
            </div>
          })}
          {filteredMagic.length === 0 && <div className="empty">Nenhuma magia encontrada.</div>}
        </div>
      </div>

      <div className="panel">
        <div className="section-title">
          <h3>Habilidades por nível</h3>
          <span className="pill gold">{filteredAbilities.length}</span>
        </div>
        <div className="filterbar">
          <input placeholder="Pesquisar habilidade" value={abilitySearch} onChange={(e) => setAbilitySearch(e.target.value)} />
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ maxWidth: 140 }}>
            <option value="">Todas as classes</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="list" style={{ maxHeight: 600, overflowY: 'auto' }}>
          {filteredAbilities.map((a) => {
            const added = selectedCharacter?.knownAbilityIds.includes(a.id)
            return (
            <div key={a.id} className="item">
              <div className="item-head">
                <div>
                  <h4>{a.name}</h4>
                  <p>{a.class} · Nível {a.level}</p>
                </div>
                <button className="btn small primary" disabled={added} onClick={() => addAbility(a.id)}>{added ? 'Adicionada' : '+ Adicionar'}</button>
              </div>
              <p style={{ marginTop: 4 }}>{a.effect}</p>
            </div>
          )})}
          {filteredAbilities.length === 0 && <div className="empty">Nenhuma habilidade encontrada.</div>}
        </div>
      </div>
      </div>
    </div>
  )
}
