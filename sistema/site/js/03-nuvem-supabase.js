function cloudConfig() {
  try {
    return normalizeCloudConfig({ ...DEFAULT_CLOUD_CONFIG, ...JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY) || "{}") });
  } catch {
    return normalizeCloudConfig({ ...DEFAULT_CLOUD_CONFIG });
  }
}
function normalizeCloudUrl(url) {
  return String(url || "").trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
}
function normalizeCloudConfig(config) {
  return {
    ...config,
    url: normalizeCloudUrl(config.url),
    anonKey: String(config.anonKey || "").trim(),
    shareCode: String(config.shareCode || "mesa-principal").trim() || "mesa-principal",
    email: String(config.email || "").trim()
  };
}
function setCloudStatus(text, online = false) {
  const el = byId("cloud-status");
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("online", online);
  el.classList.toggle("offline", !online);
}
function saveCloudConfig(config) {
  localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(normalizeCloudConfig({ ...DEFAULT_CLOUD_CONFIG, ...config })));
}
function canUseCloud(config = cloudConfig()) {
  return Boolean(config.url && config.anonKey && config.shareCode);
}
function cloudConnectionKey(config = cloudConfig()) {
  return `${config.url}|${config.anonKey.slice(0, 12)}|${config.shareCode}`;
}
function detachCloudChannel(options = {}) {
  if (!options.keepReconnectTimer) {
    clearTimeout(cloud.reconnectTimer);
    cloud.reconnectTimer = null;
  }
  if (cloud.client && cloud.channel) {
    try {
      cloud.client.removeChannel(cloud.channel);
    } catch {
      // Canal ja pode ter sido encerrado pelo navegador ou pelo Supabase.
    }
  }
  cloud.channel = null;
}
function stopCloudPolling() {
  clearTimeout(cloud.pollTimer);
  cloud.pollTimer = null;
}
function resetCloudConnection() {
  detachCloudChannel();
  stopCloudPolling();
  cloud.client = null;
  cloud.user = null;
  cloud.configKey = "";
  cloud.authListenerReady = false;
}
async function ensureCloudClient() {
  const config = cloudConfig();
  if (!canUseCloud(config)) {
    setCloudStatus("Offline", false);
    return null;
  }
  if (!window.supabase?.createClient) {
    toast("Supabase nao carregou. Verifique a internet.");
    setCloudStatus("Sem internet", false);
    return null;
  }
  const key = cloudConnectionKey(config);
  if (cloud.client && cloud.configKey !== key) {
    resetCloudConnection();
  }
  if (!cloud.client) {
    cloud.client = window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "mesa_rpg_supabase_auth_v1"
      },
      realtime: {
        params: { eventsPerSecond: 10 }
      }
    });
    cloud.configKey = key;
  }
  const { data } = await cloud.client.auth.getSession();
  cloud.user = data.session?.user || null;
  setCloudStatus(cloud.user ? "Online" : "Login pendente", Boolean(cloud.user));
  return cloud.client;
}
async function requireCloudLogin() {
  const client = await ensureCloudClient();
  if (!client) return null;
  if (!cloud.user) {
    toast("Entre com email e senha primeiro. Se acabou de criar a conta, confirme o email.");
    setCloudStatus("Login pendente", false);
    return null;
  }
  return client;
}
function openCloudSettings() {
  const config = cloudConfig();
  openModal("Sincronizacao online", `
    <div class="grid">
      <div class="grid two">
        <div><label>URL do Supabase</label><input id="cloud-url" value="${esc(config.url || "")}" placeholder="https://xxxxx.supabase.co"></div>
        <div><label>Anon public key</label><input id="cloud-key" value="${esc(config.anonKey || "")}" placeholder="eyJ..."></div>
      </div>
      <div class="grid three">
        <div><label>ID da mesa</label><input id="cloud-share" value="${esc(config.shareCode || "mesa-principal")}" placeholder="mesa-principal"></div>
        <div><label>Email</label><input id="cloud-email" type="email" value="${esc(config.email || "")}"></div>
        <div><label>Senha</label><input id="cloud-password" type="password" autocomplete="current-password"></div>
      </div>
      <p class="muted">Use o mesmo ID da mesa para mestre e jogadores. A senha nao fica salva no navegador.</p>
    </div>
  `, [
    ["Entrar / criar conta", "primary", async () => {
      const next = {
        url: byId("cloud-url").value.trim(),
        anonKey: byId("cloud-key").value.trim(),
        shareCode: byId("cloud-share").value.trim() || "mesa-principal",
        email: byId("cloud-email").value.trim()
      };
      saveCloudConfig(next);
      resetCloudConnection();
      const connected = await signInCloud(next.email, byId("cloud-password").value);
      if (connected) closeModal();
    }],
    ["Carregar nuvem", "", async () => {
      saveCloudConfig({
        url: byId("cloud-url").value.trim(),
        anonKey: byId("cloud-key").value.trim(),
        shareCode: byId("cloud-share").value.trim() || "mesa-principal",
        email: byId("cloud-email").value.trim()
      });
      await loadCloudState();
      closeModal();
    }],
    ["Salvar nuvem", "", async () => {
      saveCloudConfig({
        url: byId("cloud-url").value.trim(),
        anonKey: byId("cloud-key").value.trim(),
        shareCode: byId("cloud-share").value.trim() || "mesa-principal",
        email: byId("cloud-email").value.trim()
      });
      await saveCloudNow();
      closeModal();
    }],
    ["Cancelar", "", closeModal]
  ]);
}
async function signInCloud(email, password) {
  const client = await ensureCloudClient();
  if (!client) return false;
  if (!email || !password) {
    toast("Informe email e senha.");
    return false;
  }
  if (password.length < 6) {
    toast("A senha precisa ter pelo menos 6 caracteres.");
    return false;
  }
  let result = await client.auth.signInWithPassword({ email, password });
  if (result.error) {
    result = await client.auth.signUp({ email, password });
  }
  if (result.error) {
    toast("Login online falhou: " + result.error.message);
    setCloudStatus("Login falhou", false);
    return false;
  }
  if (!result.data.session) {
    setCloudStatus("Confirme o email", false);
    toast("Conta criada. Confirme o email enviado pelo Supabase e depois entre novamente.");
    return false;
  }
  cloud.user = result.data.session.user;
  setCloudStatus("Online", true);
  await joinCloudCampaign();
  await loadCloudState();
  subscribeCloud();
  startCloudPolling();
  return true;
}
async function joinCloudCampaign() {
  const client = await requireCloudLogin();
  const config = cloudConfig();
  if (!client || !config.shareCode) return;
  await client.rpc("join_campaign", { p_share_code: config.shareCode });
}
async function loadCloudState(options = {}) {
  const client = await requireCloudLogin();
  const config = cloudConfig();
  if (!client) return;
  const silent = options.silent || false;
  const skipSubscribe = options.skipSubscribe || false;
  const { data, error } = await client.from(CLOUD_TABLE).select("data, updated_at").eq("share_code", config.shareCode).maybeSingle();
  if (error) return toast("Erro ao carregar nuvem: " + error.message);
  if (!data) {
    await saveCloudNow();
    if (!silent) toast("Mesa criada na nuvem.");
    return;
  }
  const revision = data.data?._sync?.revision || data.updated_at || "";
  if (options.onlyIfNewer && revision && revision <= cloud.lastRemoteRevision) return false;
  if (revision && revision > cloud.lastRemoteRevision) cloud.lastRemoteRevision = revision;
  applyRemoteCloudState(data.data || defaultState(), { immediate: true, silent });
  if (!skipSubscribe) subscribeCloud();
  if (!silent) toast("Mesa carregada da nuvem.");
  return true;
}
function queueCloudSave() {
  if (cloud.loadingRemote || !cloud.client || !cloud.user) return;
  cloud.localDirty = true;
  clearTimeout(cloud.saveTimer);
  cloud.saveTimer = setTimeout(() => {
    cloud.saveTimer = null;
    saveCloudNow(true);
  }, 1800);
}
async function saveCloudNow(silent = false) {
  if (cloud.saving) {
    cloud.pendingSave = true;
    return;
  }
  const client = silent ? cloud.client || await ensureCloudClient() : await requireCloudLogin();
  const config = cloudConfig();
  if (!client || !cloud.user) {
    if (!silent) toast("Configure o modo Online primeiro.");
    return;
  }
  clearTimeout(cloud.saveTimer);
  cloud.saveTimer = null;
  cloud.saving = true;
  cloud.pendingSave = false;
  const timestamp = new Date().toISOString();
  const json = JSON.stringify(state);
  const payload = cloudPayload(state, timestamp);
  setCloudStatus("Sincronizando...", true);
  try {
    const existing = await client.from(CLOUD_TABLE).select("id").eq("share_code", config.shareCode).maybeSingle();
    if (existing.error) {
      if (!silent) toast("Erro ao localizar mesa: " + existing.error.message);
      setCloudStatus("Erro online", false);
      return;
    }
    const result = existing.data
      ? await client.from(CLOUD_TABLE).update({ data: payload, updated_at: timestamp }).eq("share_code", config.shareCode)
      : await client.from(CLOUD_TABLE).insert({ share_code: config.shareCode, owner_id: cloud.user.id, data: payload, updated_at: timestamp });
    const { error } = result;
    if (error) {
      if (!silent) toast("Erro ao salvar na nuvem: " + error.message);
      setCloudStatus("Erro online", false);
      return;
    }
    cloud.lastSavedJson = json;
    cloud.lastRemoteRevision = timestamp;
    cloud.localDirty = cloud.pendingSave;
    setCloudStatus("Online", true);
    byId("save-status").textContent = "Nuvem salva as " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    if (!silent) toast("Mesa sincronizada.");
    subscribeCloud();
    startCloudPolling();
    flushPendingRemote();
  } finally {
    cloud.saving = false;
    if (cloud.pendingSave) {
      cloud.pendingSave = false;
      queueCloudSave();
    }
  }
}
async function syncCloudNow() {
  const client = await requireCloudLogin();
  if (!client || !cloud.user) return openCloudSettings();
  await saveCloudNow();
  subscribeCloud();
  startCloudPolling();
}
async function initCloudFromConfig() {
  const client = await ensureCloudClient();
  if (!client) return;
  if (!cloud.authListenerReady) {
    cloud.authListenerReady = true;
    client.auth.onAuthStateChange(async (_event, session) => {
      cloud.user = session?.user || null;
      setCloudStatus(cloud.user ? "Online" : "Login pendente", Boolean(cloud.user));
      if (cloud.user) {
        await joinCloudCampaign();
        await loadCloudState({ silent: true });
        subscribeCloud();
        startCloudPolling();
      } else {
        detachCloudChannel();
        stopCloudPolling();
      }
    });
  }
  installCloudResumeListeners();
  if (cloud.user) {
    await joinCloudCampaign();
    await loadCloudState({ silent: true });
    subscribeCloud();
    startCloudPolling();
  }
}
function installCloudResumeListeners() {
  if (cloud.resumeListenersReady) return;
  cloud.resumeListenersReady = true;
  window.addEventListener("online", () => resumeCloudConnection());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) resumeCloudConnection();
  });
}
function scheduleCloudReconnect(delay = 2500) {
  if (cloud.reconnectTimer) return;
  cloud.reconnectTimer = setTimeout(async () => {
    cloud.reconnectTimer = null;
    detachCloudChannel({ keepReconnectTimer: true });
    await resumeCloudConnection();
  }, delay);
}
async function resumeCloudConnection() {
  const client = await ensureCloudClient();
  if (!client || !cloud.user) return;
  await joinCloudCampaign();
  await loadCloudState({ silent: true });
  subscribeCloud();
  startCloudPolling();
}
function startCloudPolling(interval = 5000) {
  if (cloud.pollTimer || !cloud.client || !cloud.user) return;
  const tick = async () => {
    cloud.pollTimer = null;
    if (!cloud.client || !cloud.user) return;
    if (!document.hidden) {
      try {
        await loadCloudState({ silent: true, skipSubscribe: true, onlyIfNewer: true });
      } catch {
        setCloudStatus("Reconectando...", false);
      }
    }
    if (cloud.client && cloud.user) {
      cloud.pollTimer = setTimeout(tick, interval);
    }
  };
  cloud.pollTimer = setTimeout(tick, interval);
}
function subscribeCloud() {
  const config = cloudConfig();
  if (!cloud.client || !cloud.user || !config.shareCode || cloud.channel) return;
  cloud.channel = cloud.client
    .channel("mesa-" + config.shareCode)
    .on("postgres_changes", { event: "*", schema: "public", table: CLOUD_TABLE, filter: "share_code=eq." + config.shareCode }, payload => {
      handleCloudPayload(payload.new?.data, payload.new?.updated_at);
    })
    .subscribe(async status => {
      if (status === "SUBSCRIBED") {
        clearTimeout(cloud.reconnectTimer);
        cloud.reconnectTimer = null;
        setCloudStatus("Online", true);
        await loadCloudState({ silent: true, skipSubscribe: true });
        startCloudPolling();
      }
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        setCloudStatus("Reconectando...", false);
        cloud.channel = null;
        startCloudPolling();
        scheduleCloudReconnect();
      }
    });
}
function cloudPayload(source, revision) {
  return {
    ...source,
    _sync: {
      clientId: cloud.clientId,
      revision,
      savedAt: revision
    }
  };
}
function cleanCloudPayload(data) {
  if (!data || typeof data !== "object") return data;
  const { _sync, ...clean } = data;
  return clean;
}
function handleCloudPayload(data, rowRevision = "") {
  if (!data) return;
  const meta = data._sync || {};
  const revision = meta.revision || rowRevision || new Date().toISOString();
  if (meta.clientId === cloud.clientId) {
    cloud.lastRemoteRevision = revision || cloud.lastRemoteRevision;
    setCloudStatus("Online", true);
    return;
  }
  if (revision && revision <= cloud.lastRemoteRevision) return;
  cloud.lastRemoteRevision = revision;
  cloud.pendingRemoteData = data;
  cloud.pendingRemoteRevision = revision;
  clearTimeout(cloud.remoteTimer);
  cloud.remoteTimer = setTimeout(flushPendingRemote, 350);
}
function flushPendingRemote() {
  if (!cloud.pendingRemoteData) return;
  if (cloud.saving || cloud.saveTimer || cloud.pendingSave) {
    clearTimeout(cloud.remoteTimer);
    cloud.remoteTimer = setTimeout(flushPendingRemote, 900);
    return;
  }
  applyRemoteCloudState(cloud.pendingRemoteData);
  cloud.pendingRemoteData = null;
  cloud.pendingRemoteRevision = "";
}
function applyRemoteCloudState(data, options = {}) {
  const incoming = normalize(cleanCloudPayload(data) || defaultState());
  const incomingJson = JSON.stringify(incoming);
  if (!options.immediate && (incomingJson === JSON.stringify(state) || incomingJson === cloud.lastSavedJson)) return;
  cloud.loadingRemote = true;
  state = incoming;
  localStorage.setItem(SAVE_KEY, incomingJson);
  renderAll();
  cloud.loadingRemote = false;
  cloud.localDirty = false;
  cloud.lastSavedJson = incomingJson;
  setCloudStatus("Online", true);
  if (!options.immediate && !options.silent) toast("Atualizacao recebida da mesa.");
}
