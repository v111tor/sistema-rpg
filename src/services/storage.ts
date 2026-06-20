import type {
  AppState, CloudConfig, UiState, Character, GameMap, MapTile,
  Creature, InitiativeEntry, Note, AttrKey, AttrDie, DiceRoll,
} from '../types'
import { SAVE_KEY, LOCAL_UI_KEY, CLOUD_CONFIG_KEY, DEFAULT_CLOUD_CONFIG } from '../data/constants'
import { MAGIC_CATALOG, normalizeText } from '../data/catalog'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (raw) {
      return normalizeAppState(JSON.parse(raw))
    }
  } catch { /* localStorage may be unavailable or contain invalid JSON */ }
  return defaultState()
}

const ATTR_KEYS: AttrKey[] = ['FOR', 'AGI', 'VIG', 'INT', 'ESP', 'DEV']
const VALID_DICE = new Set<AttrDie>(['d4', 'd6', 'd8', 'd10', 'd12', 'd20'])

// Legacy backups are intentionally schemaless at this boundary; every value is
// normalized before it enters the typed application state.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LegacyRecord = Record<string, any>
function asRecord(value: unknown): LegacyRecord {
  return value && typeof value === 'object' ? value as LegacyRecord : {}
}

function numericSession(value: unknown): number {
  const match = String(value ?? '').match(/\d+/)
  return Math.max(1, Number(match?.[0] ?? value) || 1)
}

function migrateCharacter(value: unknown): Character {
  const c = asRecord(value)
  const blank = blankCharacter(c.id)
  const attrs = asRecord(c.attrs)
  return {
    ...blank,
    ...c,
    hp: { ...blank.hp, ...(c.hp ?? {}) },
    id: String(c.id || blank.id),
    attrs: Object.fromEntries(ATTR_KEYS.map(key => {
      const die = attrs[key]
      return [key, VALID_DICE.has(die) ? die : blank.attrs[key]]
    })) as Character['attrs'],
    resources: {
      pa:   { current: 0, max: 0, ...(c.resources?.pa   ?? {}) },
      pe:   { current: 0, max: 0, ...(c.resources?.pe   ?? {}) },
      pd:   { current: 0, max: 0, ...(c.resources?.pd   ?? {}) },
      aura: { current: 0, max: 0, ...(c.resources?.aura ?? {}) },
    },
    currency: { pp: 0, gp: 0, sp: 0, cp: 0, ...(c.currency ?? {}) },
    skills: asRecord(c.skills),
    attacks: Array.isArray(c.attacks) ? c.attacks.map((attack: unknown) => ({
      id: uid(), name: '', attr: 'FOR', bonus: 0, damage: '', range: '', type: '', notes: '',
      ...asRecord(attack),
    })) : [],
    knownSpellIds: Array.isArray(c.knownSpellIds) ? c.knownSpellIds : [],
    customSpells: Array.isArray(c.customSpells) ? c.customSpells : [],
    knownAbilityIds: Array.isArray(c.knownAbilityIds) ? c.knownAbilityIds : [],
    customAbilities: Array.isArray(c.customAbilities) ? c.customAbilities : [],
  }
}

function migrateNote(value: unknown, fallbackSession: number): Note {
  const note = asRecord(value)
  return {
    id: String(note.id || uid()),
    title: String(note.title || ''),
    content: String(note.content ?? note.body ?? ''),
    tag: String(note.tag || ''),
    session: numericSession(note.session ?? fallbackSession),
    createdAt: String(note.createdAt || new Date().toISOString()),
  }
}

function migrateCreature(value: unknown): Creature {
  const creature = asRecord(value)
  const blankAttrs = blankCharacter().attrs
  return {
    id: String(creature.id || uid()),
    name: String(creature.name || 'Criatura sem nome'),
    type: String(creature.type || ''),
    source: String(creature.source || 'campanha'),
    ac: Number(creature.ac) || 0,
    hp: String(creature.hp ?? ''),
    speed: String(creature.speed ?? ''),
    threat: String(creature.threat ?? ''),
    attrs: { ...blankAttrs, ...asRecord(creature.attrs) },
    attacks: String(creature.attacks ?? ''),
    notes: String(creature.notes ?? ''),
    actions: Array.isArray(creature.actions) ? creature.actions : [],
  }
}

function migrateInitiative(value: unknown): InitiativeEntry {
  const entry = asRecord(value)
  return {
    id: String(entry.id || uid()),
    name: String(entry.name || ''),
    initiative: Number(entry.initiative ?? entry.init ?? entry.roll) || 0,
    hp: String(entry.hp ?? ''),
    isPlayer: Boolean(entry.isPlayer),
    creatureId: entry.creatureId ? String(entry.creatureId) : undefined,
  }
}

function migrateRoll(value: unknown): DiceRoll {
  const roll = asRecord(value)
  const rawBreakdown = roll.breakdown ?? roll.values ?? roll.results
  const breakdown = Array.isArray(rawBreakdown)
    ? rawBreakdown.map(Number).filter(Number.isFinite)
    : []
  const result = Number(roll.result ?? roll.total ?? roll.value)
  return {
    id: String(roll.id || uid()),
    formula: String(roll.formula ?? roll.dice ?? roll.expression ?? '1d20'),
    result: Number.isFinite(result) ? result : breakdown.reduce((sum, item) => sum + item, 0),
    breakdown,
    label: roll.label ? String(roll.label) : undefined,
    timestamp: String(roll.timestamp ?? roll.time ?? roll.createdAt ?? new Date().toISOString()),
  }
}

function migrateTile(value: unknown): MapTile {
  if (typeof value === 'string') return { type: value as MapTile['type'], visible: true }
  const tile = asRecord(value)
  return {
    type: String(tile.type || 'floor') as MapTile['type'],
    visible: tile.visible !== false,
    creatureId: tile.creatureId ? String(tile.creatureId) : undefined,
  }
}

function migrateMap(value: unknown): GameMap {
  const map = asRecord(value)
  const fallback = blankMap(String(map.id || uid()))
  const width = Math.max(4, Math.min(40, Number(map.width) || fallback.width))
  const height = Math.max(4, Math.min(32, Number(map.height) || fallback.height))
  const total = width * height
  const sourceTiles = Array.isArray(map.tiles) ? map.tiles : []
  const sourceVisibility = Array.isArray(map.visibility) ? map.visibility : []
  return {
    id: String(map.id || fallback.id),
    name: String(map.name || fallback.name),
    width,
    height,
    tiles: Array.from({ length: total }, (_, i) => migrateTile(sourceTiles[i] ?? 'floor')),
    visibility: Array.from({ length: total }, (_, i) => sourceVisibility[i] !== false),
  }
}

/** Converts every supported legacy backup/cloud shape to the current domain model. */
export function normalizeAppState(value: unknown): AppState {
  const data = asRecord(value)
  const fallback = defaultState()
  const campaign = asRecord(data.campaign)
  const session = numericSession(campaign.session)
  const legacyNotes = Array.isArray(data.notes) ? data.notes : []
  const campaignNotes = Array.isArray(campaign.notes) ? campaign.notes : legacyNotes
  const characters = Array.isArray(data.characters) ? data.characters.map(migrateCharacter) : []

  const legacyMagic = Array.isArray(data.magic) ? data.magic.map(asRecord) : []
  const legacyNames = new Set(legacyMagic.map(entry => normalizeText(entry.name)))
  const magic = [
    ...legacyMagic,
    ...MAGIC_CATALOG.filter(entry => !legacyNames.has(normalizeText(entry.name))),
  ] as AppState['magic']

  return {
    characters: characters.length ? characters : fallback.characters,
    campaign: {
      ...fallback.campaign,
      ...campaign,
      session,
      partyIds: Array.isArray(campaign.partyIds) ? campaign.partyIds.map(String) : [],
      notes: campaignNotes.map(note => migrateNote(note, session)),
    },
    creatures: Array.isArray(data.creatures) ? data.creatures.map(migrateCreature) : [],
    initiative: Array.isArray(data.initiative) ? data.initiative.map(migrateInitiative) : [],
    map: migrateMap(data.map),
    savedMaps: Array.isArray(data.savedMaps) ? data.savedMaps.map(migrateMap) : [],
    magic,
    rolls: Array.isArray(data.rolls) ? data.rolls.map(migrateRoll) : [],
  }
}

export function saveState(state: AppState): void {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)) } catch { /* storage quota or privacy mode */ }
}

export function loadUiState(): Partial<UiState> {
  try {
    const raw = localStorage.getItem(LOCAL_UI_KEY)
    if (raw) return JSON.parse(raw) as Partial<UiState>
  } catch { /* localStorage may be unavailable or contain invalid JSON */ }
  return {}
}

export function saveUiState(ui: Partial<UiState>): void {
  try { localStorage.setItem(LOCAL_UI_KEY, JSON.stringify(ui)) } catch { /* non-critical UI preference */ }
}

export function loadCloudConfig(): CloudConfig {
  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_KEY)
    if (raw) return { ...DEFAULT_CLOUD_CONFIG, ...JSON.parse(raw) }
  } catch { /* localStorage may be unavailable or contain invalid JSON */ }
  return { ...DEFAULT_CLOUD_CONFIG }
}

export function saveCloudConfig(config: CloudConfig): void {
  try { localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config)) } catch { /* config remains in memory */ }
}

export function exportJson(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mesa-rpg-backup.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function defaultState(): AppState {
  return {
    characters: [blankCharacter()],
    campaign: { name: '', premise: '', session: 1, location: '', secrets: '', partyIds: [], notes: [] },
    creatures: [],
    initiative: [],
    map: blankMap(),
    savedMaps: [],
    magic: MAGIC_CATALOG.map(entry => ({ ...entry })),
    rolls: [],
  }
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function blankCharacter(id = uid()): Character {
  return {
    id,
    name: 'Novo Personagem',
    player: '',
    role: '',
    ancestry: '',
    level: 1,
    xp: 0,
    background: '',
    aura: '',
    // combat
    ac: 10,
    speed: 9,
    prof: 2,
    // hp & resources
    hp: { current: 8, max: 8, temp: 0 },
    resources: {
      pa:   { current: 0, max: 0 },
      pe:   { current: 0, max: 0 },
      pd:   { current: 0, max: 0 },
      aura: { current: 0, max: 0 },
    },
    attrs: { FOR: 'd4', AGI: 'd4', VIG: 'd4', INT: 'd4', ESP: 'd4', DEV: 'd4' },
    skills: {},
    attacks: [],
    // magic
    emotion: '',
    deity: '',
    knownSpellIds: [],
    customSpells: [],
    knownAbilityIds: [],
    customAbilities: [],
    spells: '',
    // inventory
    features: '',
    inventory: '',
    notes: '',
    // narrative
    appearance: '',
    personality: '',
    bonds: '',
    flaws: '',
    ideals: '',
    currency: { pp: 0, gp: 0, sp: 0, cp: 0 },
  }
}

export function blankMap(id = uid()): GameMap {
  const width = 18
  const height = 12
  const total = width * height
  return {
    id,
    name: 'Novo Mapa',
    width,
    height,
    tiles: Array.from({ length: total }, () => ({ type: 'empty' as const, visible: true })),
    visibility: Array(total).fill(true),
  }
}

/** Dice modifier: die face → modifier value */
export function dieMod(die: string): number {
  const faces: Record<string, number> = { d4: 0, d6: 1, d8: 2, d10: 3, d12: 4, d20: 5 }
  return faces[die] ?? 0
}

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

export function parseAndRoll(formula: string): { result: number; breakdown: number[] } | null {
  const match = formula.trim().match(/^(\d+)d(\d+)([+-]\d+)?$/i)
  if (!match) return null
  const count = parseInt(match[1])
  const sides = parseInt(match[2])
  const mod = parseInt(match[3] ?? '0')
  if (count < 1 || count > 100 || sides < 2) return null
  const breakdown = Array.from({ length: count }, () => rollDie(sides))
  return { breakdown, result: breakdown.reduce((a, b) => a + b, 0) + mod }
}
