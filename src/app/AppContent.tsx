import { Suspense } from 'react'
import { CharacterList } from '../components/sheets/CharacterList'
import { CharacterSheet } from '../components/sheets/CharacterSheet'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { useStore } from '../store'
import {
  AbilitiesTab,
  CampaignTab,
  CreaturesTab,
  DiceTab,
  DownloadsTab,
  MapsTab,
} from './tabs'

export function AppContent() {
  const activeTab = useStore((state) => state.ui.activeTab)

  return (
    <ErrorBoundary key={activeTab}>
      {activeTab === 'ficha' && (
        <div className="grid grid-sheet">
          <CharacterList />
          <CharacterSheet />
        </div>
      )}

      <Suspense fallback={<div className="panel">Carregando modulo...</div>}>
        {activeTab === 'campanha' && <CampaignTab />}
        {activeTab === 'mestre' && <CreaturesTab />}
        {activeTab === 'mapas' && <MapsTab />}
        {activeTab === 'magia' && <AbilitiesTab />}
        {activeTab === 'dados' && <DiceTab />}
        {activeTab === 'downloads' && <DownloadsTab />}
      </Suspense>
    </ErrorBoundary>
  )
}
