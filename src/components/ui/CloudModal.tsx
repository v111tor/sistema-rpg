import { useState } from 'react'
import { Modal } from './Modal'
import { useStore } from '../../store'
import { loadCloudConfig, saveCloudConfig, normalizeAppState, saveState } from '../../services/storage'
import * as supabase from '../../services/supabase'

interface Props {
  open: boolean
  onClose: () => void
}

export function CloudModal({ open, onClose }: Props) {
  const { app, setApp, setCloudStatus, showToast } = useStore()
  const cfg = loadCloudConfig()

  const [url, setUrl]     = useState(cfg.url)
  const [key, setKey]     = useState(cfg.anonKey)
  const [code, setCode]   = useState(cfg.shareCode)
  const [email, setEmail] = useState(cfg.email)
  const [pass, setPass]   = useState('')
  const [loading, setLoading] = useState(false)

  const config = () => ({ url: url.trim(), anonKey: key.trim(), shareCode: code.trim() || 'mesa-principal', email: email.trim() })

  async function handleSignIn() {
    if (!email || !pass) return showToast('Informe email e senha.')
    if (pass.length < 6) return showToast('Senha precisa ter ao menos 6 caracteres.')
    setLoading(true)
    const cfg = config()
    saveCloudConfig(cfg)
    supabase.initClient(cfg)
    const { authenticated, message, error } = await supabase.signIn(email, pass, cfg)
    setLoading(false)
    if (error) { showToast('Falha: ' + error); setCloudStatus('error'); return }
    if (!authenticated) { showToast(message); setCloudStatus('offline'); return }
    setCloudStatus('online')
    showToast(message)
    supabase.subscribeToChanges(cfg.shareCode, remote => {
      const normalized = normalizeAppState(remote)
      setApp(normalized)
      saveState(normalized)
    })
    await handleLoad()
    onClose()
  }

  async function handleLoad() {
    const cfg = config()
    saveCloudConfig(cfg)
    setCloudStatus('syncing')
    const { data, error } = await supabase.loadRemoteState(cfg)
    if (error) { showToast('Erro ao carregar: ' + error); setCloudStatus('error'); return }
    if (data) {
      const normalized = normalizeAppState(data)
      setApp(normalized)
      saveState(normalized)
      showToast('Dados da nuvem carregados!')
    } else {
      showToast('Mesa ainda sem dados. Use Salvar nuvem para criá-la.')
    }
    setCloudStatus('online')
  }

  async function handleJoin() {
    const cfg = config()
    saveCloudConfig(cfg)
    const { error } = await supabase.joinCampaign(cfg.shareCode)
    if (error) { showToast('Erro ao entrar na mesa: ' + error); return }
    showToast('Mesa vinculada. Carregando dados…')
    await handleLoad()
  }

  async function handleSave() {
    const cfg = config()
    saveCloudConfig(cfg)
    setCloudStatus('syncing')
    const { error } = await supabase.saveRemoteState(app, cfg)
    if (error) { showToast('Erro ao salvar: ' + error); setCloudStatus('error'); return }
    showToast('Salvo na nuvem!')
    setCloudStatus('online')
    onClose()
  }

  return (
    <Modal open={open} title="☁️ Sincronização online" onClose={onClose}
      actions={<>
        <button className="btn small" onClick={onClose} disabled={loading}>Cancelar</button>
        <button className="btn small" onClick={handleLoad} disabled={loading}>⬇ Carregar nuvem</button>
        <button className="btn small" onClick={handleJoin} disabled={loading}>🔗 Entrar na mesa</button>
        <button className="btn small" onClick={handleSave} disabled={loading}>⬆ Salvar nuvem</button>
        <button className="btn small primary" onClick={handleSignIn} disabled={loading}>
          {loading ? 'Entrando…' : '🔑 Entrar / criar conta'}
        </button>
      </>}
    >
      <div className="grid" style={{ gap: 10 }}>
        <div className="field-row">
          <div><label>URL do Supabase</label><input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://xxxxx.supabase.co" /></div>
          <div><label>Anon public key</label><input value={key} onChange={e => setKey(e.target.value)} placeholder="eyJ…" /></div>
        </div>
        <div className="field-row-3">
          <div><label>ID da mesa</label><input value={code} onChange={e => setCode(e.target.value)} placeholder="mesa-principal" /></div>
          <div><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><label>Senha</label><input type="password" value={pass} onChange={e => setPass(e.target.value)} autoComplete="current-password" /></div>
        </div>
        <p className="muted">Use o mesmo ID da mesa para mestre e jogadores. A senha não fica salva no navegador.</p>
      </div>
    </Modal>
  )
}
