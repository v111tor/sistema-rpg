import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useStore } from './store'
import { Sidebar } from './components/ui/Sidebar'
import { TopBar } from './components/ui/TopBar'
import { ToastContainer } from './components/ui/Toast'
import { DiceRoller3D } from './components/ui/DiceRoller3D'
import { CharacterList } from './components/sheets/CharacterList'
import { CharacterSheet } from './components/sheets/CharacterSheet'
import type { DiceRoll } from './types'
import { loadCloudConfig, normalizeAppState, saveState } from './services/storage'
import * as supabase from './services/supabase'

const CampaignTab = lazy(() => import('./components/campaign/CampaignTab').then(m => ({ default: m.CampaignTab })))
const CreaturesTab = lazy(() => import('./components/creatures/CreaturesTab').then(m => ({ default: m.CreaturesTab })))
const MapsTab = lazy(() => import('./components/maps/MapsTab').then(m => ({ default: m.MapsTab })))
const AbilitiesTab = lazy(() => import('./components/abilities/AbilitiesTab').then(m => ({ default: m.AbilitiesTab })))
const DiceTab = lazy(() => import('./components/dice/DiceTab').then(m => ({ default: m.DiceTab })))

export default function App() {
  const { app, ui, setApp, setCloudStatus } = useStore()
  const [activeRoll, setActiveRoll] = useState<DiceRoll | null>(null)
  const prevLen = useRef(app.rolls.length)

  // Detect when a new roll is added and show the 3D animation
  useEffect(() => {
    if (app.rolls.length > prevLen.current) {
      setActiveRoll(app.rolls[0]) // rolls are prepended, [0] is newest
    }
    prevLen.current = app.rolls.length
  }, [app.rolls])

  useEffect(() => {
    const config = loadCloudConfig()
    if (!config.url || !config.anonKey) return
    supabase.initClient(config)
    void supabase.hasSession().then(active => {
      if (!active) return
      setCloudStatus('online')
      supabase.subscribeToChanges(config.shareCode, remote => {
        const normalized = normalizeAppState(remote)
        setApp(normalized)
        saveState(normalized)
      })
    })
    return () => supabase.unsubscribe()
  }, [setApp, setCloudStatus])

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      <div className="app">
        <Sidebar />

        <main className="main" id="conteudo" tabIndex={-1}>
          <TopBar />

          {ui.activeTab === 'ficha' && (
            <div className="grid grid-sheet">
              <CharacterList />
              <CharacterSheet />
            </div>
          )}

          <Suspense fallback={<div className="panel">Carregando módulo…</div>}>
            {ui.activeTab === 'campanha' && <CampaignTab />}
            {ui.activeTab === 'mestre'   && <CreaturesTab />}
            {ui.activeTab === 'mapas'    && <MapsTab />}
            {ui.activeTab === 'magia'    && <AbilitiesTab />}
            {ui.activeTab === 'dados'    && <DiceTab />}
          </Suspense>
        </main>
      </div>

      <ToastContainer />

      {activeRoll && (
        <DiceRoller3D
          roll={activeRoll}
          onClose={() => setActiveRoll(null)}
        />
      )}
    </>
  )
}
