import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'
import type { AppState, CloudConfig } from '../types'
import { CLOUD_TABLE } from '../data/constants'

let client: SupabaseClient | null = null
let channel: RealtimeChannel | null = null

export function initClient(config: CloudConfig): SupabaseClient {
  if (client) {
    channel?.unsubscribe()
    channel = null
  }
  client = createClient(config.url, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'mesa_rpg_supabase_auth_v1' },
  })
  return client
}

export function getClient(): SupabaseClient | null {
  return client
}

export async function signIn(email: string, password: string, config: CloudConfig): Promise<{ authenticated: boolean; message: string; error: string | null }> {
  const c = initClient(config)
  const login = await c.auth.signInWithPassword({ email, password })
  if (!login.error) return { authenticated: true, message: 'Autenticado com sucesso.', error: null }
  if (!/invalid login credentials/i.test(login.error.message)) {
    return { authenticated: false, message: '', error: login.error.message }
  }
  const signup = await c.auth.signUp({ email, password })
  if (signup.error) return { authenticated: false, message: '', error: signup.error.message }
  if (!signup.data.session) {
    return { authenticated: false, message: 'Conta criada. Confirme o email e depois entre novamente.', error: null }
  }
  return { authenticated: true, message: 'Conta criada e autenticada.', error: null }
}

export async function hasSession(): Promise<boolean> {
  if (!client) return false
  const { data } = await client.auth.getSession()
  return Boolean(data.session)
}

export async function signOut(): Promise<void> {
  await client?.auth.signOut()
}

export async function loadRemoteState(
  config: CloudConfig,
): Promise<{ data: AppState | null; revision: string; error: string | null }> {
  if (!client) return { data: null, revision: '', error: 'Sem cliente' }
  const { data, error } = await client
    .from(CLOUD_TABLE)
    .select('data, updated_at')
    .eq('share_code', config.shareCode)
    .maybeSingle()
  if (error) return { data: null, revision: '', error: error.message }
  return { data: data?.data ?? null, revision: data?.updated_at ?? '', error: null }
}

export async function saveRemoteState(
  state: AppState,
  config: CloudConfig,
): Promise<{ error: string | null }> {
  if (!client) return { error: 'Abra Online e autentique-se primeiro.' }
  const { data: authData } = await client.auth.getUser()
  const user = authData.user
  if (!user) return { error: 'Sessão expirada. Entre novamente.' }
  const existing = await client.from(CLOUD_TABLE).select('id').eq('share_code', config.shareCode).maybeSingle()
  if (existing.error) return { error: existing.error.message }
  const query = existing.data
    ? client.from(CLOUD_TABLE).update({ data: state, updated_at: new Date().toISOString() }).eq('share_code', config.shareCode)
    : client.from(CLOUD_TABLE).insert({ share_code: config.shareCode, owner_id: user.id, data: state, updated_at: new Date().toISOString() })
  const { error } = await query
  return { error: error?.message ?? null }
}

export async function joinCampaign(shareCode: string): Promise<{ error: string | null }> {
  if (!client) return { error: 'Abra Online e autentique-se primeiro.' }
  const { error } = await client.rpc('join_campaign', { p_share_code: shareCode })
  return { error: error?.message ?? null }
}

export function subscribeToChanges(
  shareCode: string,
  onUpdate: (state: AppState, revision: string) => void,
): void {
  if (!client) return
  channel?.unsubscribe()
  channel = client
    .channel(`crm-${shareCode}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: CLOUD_TABLE, filter: `share_code=eq.${shareCode}` },
      (payload) => {
        const row = payload.new as { data: AppState; updated_at: string }
        onUpdate(row.data, row.updated_at)
      },
    )
    .subscribe()
}

export function unsubscribe(): void {
  channel?.unsubscribe()
  channel = null
}
