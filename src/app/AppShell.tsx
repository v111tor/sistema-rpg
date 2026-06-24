import { DiceRoller3D } from '../components/ui/DiceRoller3D'
import { Sidebar } from '../components/ui/Sidebar'
import { ToastContainer } from '../components/ui/Toast'
import { TopBar } from '../components/ui/TopBar'
import { useStore } from '../store'
import { AppContent } from './AppContent'
import { useActiveDiceRoll } from './useActiveDiceRoll'
import { useCloudSync } from './useCloudSync'

export function AppShell() {
  const rolls = useStore((state) => state.app.rolls)
  const { activeRoll, clearActiveRoll } = useActiveDiceRoll(rolls)

  useCloudSync()

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteudo</a>

      <div className="app">
        <Sidebar />

        <main className="main" id="conteudo" tabIndex={-1}>
          <TopBar />
          <AppContent />
        </main>
      </div>

      <ToastContainer />

      {activeRoll && (
        <DiceRoller3D
          roll={activeRoll}
          onClose={clearActiveRoll}
        />
      )}
    </>
  )
}
