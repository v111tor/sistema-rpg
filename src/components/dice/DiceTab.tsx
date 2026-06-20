import { useState } from 'react'
import { useStore } from '../../store'
import { uid } from '../../services/storage'

const PRESETS = ['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100', '2d6', '4d6']

function parseAndRoll(formula: string): { result: number; breakdown: number[] } | null {
  const match = formula.trim().match(/^(\d+)d(\d+)([+-]\d+)?$/i)
  if (!match) return null
  const count = parseInt(match[1])
  const sides = parseInt(match[2])
  const mod = parseInt(match[3] ?? '0')
  if (count < 1 || count > 100 || sides < 2) return null
  const breakdown = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1)
  return { breakdown, result: breakdown.reduce((a, b) => a + b, 0) + mod }
}

export function DiceTab() {
  const { app, addRoll, clearRolls, showToast } = useStore()
  const [custom, setCustom] = useState('')

  const roll = (formula: string) => {
    const res = parseAndRoll(formula)
    if (!res) return showToast(`Fórmula inválida: "${formula}"`)
    addRoll({ id: uid(), formula, result: res.result, breakdown: res.breakdown, timestamp: new Date().toISOString() })
  }

  return (
    <div className="grid grid-two">
      <div className="panel">
        <div className="section-title"><h3>Rolagem livre</h3></div>
        <div className="grid grid-four" style={{ gap: 8, marginBottom: 14 }}>
          {PRESETS.map((d) => (
            <button key={d} className={`btn ${d === '1d20' ? 'primary' : ''}`} onClick={() => roll(d)}>{d}</button>
          ))}
        </div>
        <div className="row">
          <input
            placeholder="Fórmula: ex. 3d6+2"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && roll(custom)}
            style={{ flex: 1 }}
          />
          <button className="btn primary" onClick={() => roll(custom)}>Rolar</button>
        </div>
      </div>

      <div className="panel">
        <div className="section-title">
          <h3>Histórico</h3>
          <button className="btn small danger" onClick={clearRolls}>Limpar</button>
        </div>
        <div className="dice-log">
          {app.rolls.length === 0 && <div className="empty">Nenhuma rolagem ainda.</div>}
          {app.rolls.map((r) => (
            <div key={r.id} className="dice-entry">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="dice-formula">{r.formula}</span>
                <span className="dice-result">{r.result}</span>
              </div>
              {r.breakdown.length > 1 && (
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
                  [{r.breakdown.join(', ')}]
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
