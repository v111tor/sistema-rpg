export type AttrDie = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20'
export type AttrKey = 'FOR' | 'AGI' | 'VIG' | 'INT' | 'ESP' | 'DEV'

export interface Attributes {
  FOR: AttrDie
  AGI: AttrDie
  VIG: AttrDie
  INT: AttrDie
  ESP: AttrDie
  DEV: AttrDie
}

export interface HP {
  current: number
  max: number
  temp: number
}

export interface Resource {
  current: number
  max: number
}

export interface Resources {
  pa: Resource   // Pontos de Arcana
  pe: Resource   // Pontos de Emoção
  pd: Resource   // Pontos de Devoção
  aura: Resource // Pontos de Aura
}

export interface Attack {
  id: string
  name: string
  attr: AttrKey
  bonus: number
  damage: string
  range: string
  type: string
  notes: string
}

export interface CustomSpell {
  id: string
  source: string
  name: string
  cost: string
  range: string
  effect: string
  type: string
  duration: string
  notes: string
  custom: true
}

export interface CustomAbility {
  id: string
  name: string
  effect: string
  class: string
  level: number
  custom: true
}

export interface Character {
  id: string
  name: string
  player: string
  role: string
  ancestry: string
  level: number
  xp: number
  background: string
  // Combat stats
  ac: number
  speed: number
  prof: number
  // Resources
  hp: HP
  resources: Resources
  attrs: Attributes
  skills: Record<string, boolean>   // true = has proficiency
  attacks: Attack[]
  // Magic
  emotion: string
  deity: string
  knownSpellIds: string[]
  customSpells: CustomSpell[]
  knownAbilityIds: string[]
  customAbilities: CustomAbility[]
  spells: string                    // freeform known spells text
  // Inventory & notes
  features: string
  inventory: string
  notes: string
  // Background narrative
  appearance: string
  personality: string
  bonds: string
  flaws: string
  ideals: string
  // Currency
  currency: { pp: number; gp: number; sp: number; cp: number }
  aura: string
}

export interface Note {
  id: string
  title: string
  content: string
  tag: string
  session: number
  createdAt: string
}

export interface Campaign {
  name: string
  premise: string
  session: number
  location: string
  secrets: string
  partyIds: string[]
  notes: Note[]
}

export interface CreatureActionRoll {
  id: string
  label: string
  formula: string
}

export interface CreatureAction {
  name: string
  description: string
  rolls: CreatureActionRoll[]
}

export interface Creature {
  id: string
  name: string
  type: string
  source: string
  ac: number
  hp: string
  speed: string
  threat: string
  attrs: Attributes
  attacks: string
  notes: string
  actions: CreatureAction[]
}

export interface InitiativeEntry {
  id: string
  name: string
  initiative: number
  hp: string
  isPlayer: boolean
  creatureId?: string
}

export type TileType =
  | 'floor' | 'wall' | 'water' | 'door'
  | 'altar' | 'chest' | 'trap' | 'hazard'
  | 'light' | 'pillar' | 'rubble' | 'secret'
  | 'stairs' | 'statue' | 'npc' | 'pc' | 'boss'
  | 'token-npc' | 'token-boss' | 'empty'

export interface MapTile {
  type: TileType
  creatureId?: string
  visible: boolean
}

export interface GameMap {
  id: string
  name: string
  width: number
  height: number
  tiles: MapTile[]
  visibility: boolean[]  // fog of war: true = revealed
}

export interface MagicEntry {
  id: string
  source: string
  name: string
  cost: string
  range: string
  effect: string
  type: string
  duration: string
  notes: string
}

export interface DiceRoll {
  id: string
  formula: string
  result: number
  breakdown: number[]
  label?: string
  timestamp: string
}

export interface AppState {
  characters: Character[]
  campaign: Campaign
  creatures: Creature[]
  initiative: InitiativeEntry[]
  map: GameMap
  savedMaps: GameMap[]
  magic: MagicEntry[]
  rolls: DiceRoll[]
}

export type TabId = 'ficha' | 'campanha' | 'mestre' | 'mapas' | 'magia' | 'dados'

export interface CloudConfig {
  url: string
  anonKey: string
  shareCode: string
  email: string
}

export interface UiState {
  selectedCharacterId: string
  activeTab: TabId
  sheetCategory: string
  abilityCategory: string
}
