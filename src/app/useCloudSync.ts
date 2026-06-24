import { useEffect } from 'react'
import { useStore } from '../store'
import { loadCloudConfig, normalizeAppState, saveState } from '../services/storage'
import * as supabase from '../services/supabase'

export function useCloudSync() {
  const setApp = useStore((state) => state.setApp)
  const setCloudStatus = useStore((state) => state.setCloudStatus)

  useEffect(() => {
    const config = loadCloudConfig()
    if (!config.url || !config.anonKey) return

    supabase.initClient(config)
    void supabase.hasSession().then((active) => {
      if (!active) return
      setCloudStatus('online')
      supabase.subscribeToChanges(config.shareCode, (remote) => {
        const normalized = normalizeAppState(remote)
        setApp(normalized)
        saveState(normalized)
      })
    })

    return () => supabase.unsubscribe()
  }, [setApp, setCloudStatus])
}
