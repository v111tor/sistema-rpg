import type { MagicEntry } from '../types'
import { SYSTEM_MAGIC_CATALOG } from './magic'

function slug(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const MAGIC_CATALOG: MagicEntry[] = SYSTEM_MAGIC_CATALOG.map(spell => ({
  id: `catalog-${spell.source}-${slug(spell.name)}`,
  source: spell.source,
  name: spell.name,
  cost: spell.cost,
  range: spell.range,
  effect: spell.effect,
  type: spell.type,
  duration: spell.duration,
  notes: '',
}))

export function normalizeText(value: unknown): string {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}
