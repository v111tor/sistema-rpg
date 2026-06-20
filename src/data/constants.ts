import type { AttrDie, AttrKey } from '../types'

export const SAVE_KEY = 'mesa_rpg_sistema_mecanico_v1'
export const LOCAL_UI_KEY = 'mesa_rpg_ui_local_v1'
export const CLOUD_CONFIG_KEY = 'mesa_rpg_supabase_config_v1'
export const CLOUD_TABLE = 'campaign_states'

export const DEFAULT_CLOUD_CONFIG = {
  url: 'https://bnznywlkhxdyieeozmcd.supabase.co',
  anonKey: 'sb_publishable_ADB15dEYrOIXKrpYaY_eNg_hZvGFy56',
  shareCode: 'mesa-principal',
  email: '',
}

export const ATTR_DICE: AttrDie[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20']

export const ATTRS: [AttrKey, string, string][] = [
  ['FOR', 'Força', 'Ataques corpo a corpo, carga e atletismo'],
  ['AGI', 'Agilidade', 'Ataques à distância, Aparar e iniciativa'],
  ['VIG', 'Vigor', 'PV, resistência a venenos, doenças e exaustão'],
  ['INT', 'Intelecto', 'Conhecimento, arcanismo e tecnologia'],
  ['ESP', 'Espírito', 'Percepção, emoções e magia primitiva'],
  ['DEV', 'Devoção', 'Religião, proteção divina e magia de fé'],
]

export const CLASS_HP: Record<string, { label: string; die: AttrDie; value: number }> = {
  guerreiro:  { label: 'Guerreiro',  die: 'd8', value: 8  },
  arcanista:  { label: 'Arcanista',  die: 'd4', value: 4  },
  sensiente:  { label: 'Sensiente',  die: 'd6', value: 6  },
  devoto:     { label: 'Devoto',     die: 'd8', value: 8  },
  artifice:   { label: 'Artífice',   die: 'd6', value: 6  },
  explorador: { label: 'Explorador', die: 'd8', value: 8  },
}

export const VIGOR_HP: Record<AttrDie, number> = {
  d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20,
}

export const SKILLS: [string, string][] = [
  ['Acrobacia', 'AGI'],   ['Arcanismo', 'INT'],    ['Atletismo', 'FOR'],
  ['Enganação', 'ESP'],   ['Furtividade', 'AGI'],  ['História', 'INT'],
  ['Intimidação', 'FOR/ESP'], ['Intuição', 'ESP'], ['Medicina', 'INT'],
  ['Natureza', 'INT'],    ['Percepção', 'ESP'],     ['Persuasão', 'ESP'],
  ['Prestidigitação', 'AGI'], ['Religião', 'DEV'], ['Sobrevivência', 'VIG'],
  ['Tecnologia', 'INT'],
]

export const SOURCES: Record<string, string> = {
  arcana:    'Arcana',
  primitiva: 'Primitiva',
  fe:        'Fé',
  tecnica:   'Técnica',
}

export const MAP_TOOLS: [string, string, string][] = [
  ['empty', 'Apagar', '⌫'], ['floor', 'Chão', '·'], ['wall', 'Parede', '🧱'],
  ['water', 'Água', '🌊'], ['door', 'Porta', '🚪'], ['trap', 'Armadilha', '⚠️'],
  ['hazard', 'Perigo', '☣️'], ['light', 'Luz', '🔥'], ['pillar', 'Pilar', '🏛️'],
  ['rubble', 'Entulho', '🪨'], ['secret', 'Secreto', '❓'], ['stairs', 'Escadas', '🪜'],
  ['statue', 'Estátua', '🗿'], ['altar', 'Altar', '⛩️'], ['chest', 'Baú', '🧰'],
  ['npc', 'NPC', '🧙'], ['pc', 'PC', '⭐'], ['boss', 'Chefe', '👹'],
]
