import { useEffect, useRef, useState } from 'react'
import type { DiceRoll } from '../types'

export function useActiveDiceRoll(rolls: DiceRoll[]) {
  const [activeRoll, setActiveRoll] = useState<DiceRoll | null>(null)
  const previousLength = useRef(rolls.length)

  useEffect(() => {
    if (rolls.length > previousLength.current) {
      setActiveRoll(rolls[0] ?? null)
    }
    previousLength.current = rolls.length
  }, [rolls])

  return { activeRoll, clearActiveRoll: () => setActiveRoll(null) }
}
