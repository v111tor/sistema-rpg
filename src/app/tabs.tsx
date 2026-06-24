import { lazy } from 'react'
import type { TabId } from '../types'

export const TAB_LABELS: Record<TabId, string> = {
  ficha: 'Personagem',
  campanha: 'Campanhas',
  mestre: 'Criaturas',
  mapas: 'Mapas',
  magia: 'Habilidades',
  dados: 'Dados',
  downloads: 'Downloads',
}

export const CampaignTab = lazy(() =>
  import('../components/campaign/CampaignTab').then((module) => ({ default: module.CampaignTab })),
)

export const CreaturesTab = lazy(() =>
  import('../components/creatures/CreaturesTab').then((module) => ({ default: module.CreaturesTab })),
)

export const MapsTab = lazy(() =>
  import('../components/maps/MapsTab').then((module) => ({ default: module.MapsTab })),
)

export const AbilitiesTab = lazy(() =>
  import('../components/abilities/AbilitiesTab').then((module) => ({ default: module.AbilitiesTab })),
)

export const DiceTab = lazy(() =>
  import('../components/dice/DiceTab').then((module) => ({ default: module.DiceTab })),
)

export const DownloadsTab = lazy(() =>
  import('../components/downloads/DownloadsTab').then((module) => ({ default: module.DownloadsTab })),
)
