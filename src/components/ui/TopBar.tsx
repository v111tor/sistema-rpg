import { useRef, useState } from 'react'
import { useStore } from '../../store'
import { exportJson } from '../../services/storage'
import { CloudModal } from './CloudModal'
import * as supabase from '../../services/supabase'
import { loadCloudConfig } from '../../services/storage'

export function TopBar() {
  const fileRef = useRef<HTMLInputElement>(null)
  const { app, ui, cloudStatus, saveStatus, save, importState, showToast, setCloudStatus } = useStore()
  const [cloudOpen, setCloudOpen] = useState(false)

  const TAB_LABELS: Record<string, string> = {
    ficha: 'Personagem', campanha: 'Campanhas', mestre: 'Criaturas',
    mapas: 'Mapas', magia: 'Habilidades', dados: 'Dados',
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importState(JSON.parse(reader.result as string))
      } catch {
        showToast('Arquivo inválido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function syncNow() {
    const cfg = loadCloudConfig()
    setCloudStatus('syncing')
    const { error } = await supabase.saveRemoteState(app, cfg)
    if (error) { showToast('Erro ao sincronizar: ' + error); setCloudStatus('error'); return }
    showToast('Sincronizado!')
    setCloudStatus('online')
  }

  const statusLabel = { online: '● Online', offline: '○ Offline', syncing: '↻ Sync…', error: '✕ Erro' }

  return (
    <>
      <div className="topbar">
        <h2>{TAB_LABELS[ui.activeTab] ?? ''}</h2>
        <div className="topbar-actions">
          <button className="btn small" onClick={save}>💾 Salvar</button>
          <button className="btn small" onClick={() => exportJson(app)}>📤 Backup</button>
          <button className="btn small" onClick={() => fileRef.current?.click()}>📥 Importar</button>
          <button className="btn small primary" onClick={() => setCloudOpen(true)}>☁️ Online</button>
          {cloudStatus !== 'offline' && (
            <button className="btn small" onClick={syncNow}>🔄 Sincronizar</button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} />
        <span className={`cloud-status ${cloudStatus}`}>{statusLabel[cloudStatus]}</span>
        <span className="save-status">{saveStatus}</span>
      </div>
      <CloudModal open={cloudOpen} onClose={() => setCloudOpen(false)} />
    </>
  )
}
