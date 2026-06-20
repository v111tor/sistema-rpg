import { useEffect, useRef, useState } from 'react'
import { playDiceRollSound } from '../../services/diceAudio'
import type { DiceRoll } from '../../types'

// ── Die theme per type ────────────────────────────────────────────────────────
const THEME: Record<string, { c1: string; c2: string; shadow: string; label: string }> = {
  d4:  { c1: '#f06060', c2: '#b03040', shadow: '#f06060', label: 'D4'  },
  d6:  { c1: '#6c72f5', c2: '#3d44cc', shadow: '#6c72f5', label: 'D6'  },
  d8:  { c1: '#b259f7', c2: '#6d25cc', shadow: '#b259f7', label: 'D8'  },
  d10: { c1: '#d4a94a', c2: '#9a7220', shadow: '#d4a94a', label: 'D10' },
  d12: { c1: '#4acd7a', c2: '#259048', shadow: '#4acd7a', label: 'D12' },
  d20: { c1: '#3dc8e8', c2: '#1888aa', shadow: '#3dc8e8', label: 'D20' },
}

// ── d6 pip positions (x%, y%) ─────────────────────────────────────────────────
const PIPS: [number, number][][] = [
  [],
  [[50, 50]],
  [[30, 30], [70, 70]],
  [[30, 30], [50, 50], [70, 70]],
  [[30, 30], [70, 30], [30, 70], [70, 70]],
  [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  [[30, 22], [70, 22], [30, 50], [70, 50], [30, 78], [70, 78]],
]

function D6Pips({ n }: { n: number }) {
  const dots = PIPS[Math.min(6, Math.max(1, n))] ?? PIPS[1]
  const r = n <= 1 ? 12 : n <= 3 ? 10 : 8
  return (
    <svg viewBox="0 0 100 100" width={90} height={90}>
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity={0.92} />
      ))}
    </svg>
  )
}

// ── Face component ────────────────────────────────────────────────────────────
function Face({
  cls, label, showResult, result, isDie6,
}: {
  cls: string; label: string; showResult: boolean; result: number; isDie6: boolean
}) {
  return (
    <div className={`die-face ${cls}`}>
      {showResult
        ? isDie6
          ? <D6Pips n={result} />
          : <span className="die-face-result">{result}</span>
        : <span className="die-face-label">{label}</span>
      }
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
type Phase = 'rolling' | 'settling' | 'landed'

interface Props {
  roll: DiceRoll
  onClose: () => void
}

export function DiceRoller3D({ roll, onClose }: Props) {
  const { formula, result, breakdown, label } = roll

  const dieMatch = formula.match(/d(\d+)/i)
  const dieKey = dieMatch ? `d${dieMatch[1]}` : 'd6'
  const theme = THEME[dieKey] ?? THEME.d6
  const isSingleD6 = breakdown.length === 1 && dieKey === 'd6'

  const [phase, setPhase] = useState<Phase>('rolling')
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    playDiceRollSound(breakdown.length)

    // animation: tumble 1400ms → settle 400ms → show result
    const t1 = setTimeout(() => setPhase('settling'), 1400)
    const t2 = setTimeout(() => setPhase('landed'),   1800)
    closeTimer.current = setTimeout(onClose, 5000)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(closeTimer.current) }
  }, [roll.id, breakdown.length, onClose])

  const showResult = phase === 'landed'
  const faces = ['face-front', 'face-back', 'face-right', 'face-left', 'face-top', 'face-bottom']

  // Only face-front shows the result (it ends facing the camera after animation)
  return (
    <div className="dice3d-overlay" onClick={onClose} role="button" tabIndex={0} aria-label="Fechar dado">
      <div className="dice3d-container" onClick={e => e.stopPropagation()}>

        {label && <p className="dice3d-label">{label}</p>}

        {/* ── 3D Scene ── */}
        <div className="dice3d-scene">
          <div
            className={`dice3d-cube ${phase}`}
            style={{
              '--die-c1': theme.c1,
              '--die-c2': theme.c2,
              '--die-shadow': theme.shadow,
            } as React.CSSProperties}
          >
            {faces.map((cls) => (
              <Face
                key={cls}
                cls={cls}
                label={theme.label}
                showResult={showResult && cls === 'face-front'}
                result={result}
                isDie6={isSingleD6}
              />
            ))}
          </div>
        </div>

        {/* ── Result text below ── */}
        <div className={`dice3d-result ${showResult ? 'show' : ''}`}>
          <span className="dice3d-total" style={{ '--glow': theme.shadow } as React.CSSProperties}>
            {result}
          </span>
          {breakdown.length > 1 && (
            <span className="dice3d-breakdown">
              [{breakdown.join(' + ')}] = {result}
            </span>
          )}
          <span className="dice3d-formula">{formula}</span>
        </div>

        <button className="btn small ghost dice3d-close" onClick={onClose}>
          clique para fechar
        </button>
      </div>
    </div>
  )
}
