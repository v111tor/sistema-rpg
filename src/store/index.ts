import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type {
  AppState, UiState, TabId, Character, Creature,
  InitiativeEntry, GameMap, MagicEntry, DiceRoll, Note,
} from '../types'
import { loadState, saveState, loadUiState, saveUiState, uid, blankCharacter, normalizeAppState } from '../services/storage'

interface StoreState {
  app: AppState
  ui: UiState
  cloudStatus: 'offline' | 'online' | 'syncing' | 'error'
  saveStatus: string
  toasts: { id: string; text: string }[]

  // App state actions
  setApp: (app: AppState) => void
  mergeApp: (partial: Partial<AppState>) => void

  // UI actions
  setTab: (tab: TabId) => void
  selectCharacter: (id: string) => void
  setSheetCategory: (cat: string) => void
  setAbilityCategory: (cat: string) => void

  // Character actions
  newCharacter: () => void
  updateCharacter: (id: string, patch: Partial<Character>) => void
  deleteCharacter: (id: string) => void

  // Campaign actions
  updateCampaign: (patch: Partial<AppState['campaign']>) => void
  addNote: (note: Note) => void
  updateNote: (id: string, patch: Partial<Note>) => void
  deleteNote: (id: string) => void

  // Creature actions
  addCreature: (c: Creature) => void
  updateCreature: (id: string, patch: Partial<Creature>) => void
  deleteCreature: (id: string) => void

  // Initiative actions
  setInitiative: (list: InitiativeEntry[]) => void
  clearInitiative: () => void

  // Map actions
  updateMap: (patch: Partial<GameMap>) => void
  saveCurrentMap: () => void
  loadSavedMap: (id: string) => void
  deleteSavedMap: (id: string) => void

  // Magic actions
  addMagic: (entry: MagicEntry) => void
  updateMagic: (id: string, patch: Partial<MagicEntry>) => void
  deleteMagic: (id: string) => void

  // Dice
  addRoll: (roll: DiceRoll) => void
  clearRolls: () => void

  // Feedback
  showToast: (text: string) => void
  setCloudStatus: (status: StoreState['cloudStatus'], msg?: string) => void
  setSaveStatus: (msg: string) => void

  // Persistence
  save: () => void
  importState: (data: AppState) => void
}

const saved = loadState()
const savedUi = loadUiState()

export const useStore = create<StoreState>()(
  subscribeWithSelector((set, get) => ({
    app: saved,
    ui: {
      selectedCharacterId: savedUi.selectedCharacterId ?? saved.characters[0]?.id ?? '',
      activeTab: savedUi.activeTab ?? 'ficha',
      sheetCategory: savedUi.sheetCategory ?? 'resumo',
      abilityCategory: savedUi.abilityCategory ?? 'habilidades',
    },
    cloudStatus: 'offline',
    saveStatus: 'Pronto',
    toasts: [],

    setApp: (app) => set({ app }),
    mergeApp: (partial) => set((s) => ({ app: { ...s.app, ...partial } })),

    setTab: (activeTab) => {
      set((s) => ({ ui: { ...s.ui, activeTab } }))
      saveUiState({ ...get().ui, activeTab })
    },

    selectCharacter: (selectedCharacterId) => {
      set((s) => ({ ui: { ...s.ui, selectedCharacterId } }))
      saveUiState({ ...get().ui, selectedCharacterId })
    },

    setSheetCategory: (sheetCategory) => {
      set((s) => ({ ui: { ...s.ui, sheetCategory } }))
    },

    setAbilityCategory: (abilityCategory) => {
      set((s) => ({ ui: { ...s.ui, abilityCategory } }))
    },

    newCharacter: () => {
      const c = blankCharacter()
      set((s) => ({
        app: { ...s.app, characters: [...s.app.characters, c] },
        ui: { ...s.ui, selectedCharacterId: c.id },
      }))
      get().save()
    },

    updateCharacter: (id, patch) => {
      set((s) => ({
        app: {
          ...s.app,
          characters: s.app.characters.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        },
      }))
      get().save()
    },

    deleteCharacter: (id) => {
      const { app, ui } = get()
      if (app.characters.length <= 1) {
        get().showToast('Mantenha pelo menos uma ficha.')
        return
      }
      const next = app.characters.filter((c) => c.id !== id)
      const nextSelected = ui.selectedCharacterId === id ? next[0].id : ui.selectedCharacterId
      set((s) => ({
        app: {
          ...s.app,
          characters: next,
          campaign: { ...s.app.campaign, partyIds: s.app.campaign.partyIds.filter((p) => p !== id) },
        },
        ui: { ...s.ui, selectedCharacterId: nextSelected },
      }))
      get().save()
    },

    updateCampaign: (patch) => {
      set((s) => ({ app: { ...s.app, campaign: { ...s.app.campaign, ...patch } } }))
      get().save()
    },

    addNote: (note) => {
      set((s) => ({
        app: { ...s.app, campaign: { ...s.app.campaign, notes: [...s.app.campaign.notes, note] } },
      }))
      get().save()
    },

    updateNote: (id, patch) => {
      set((s) => ({
        app: {
          ...s.app,
          campaign: {
            ...s.app.campaign,
            notes: s.app.campaign.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
          },
        },
      }))
      get().save()
    },

    deleteNote: (id) => {
      set((s) => ({
        app: {
          ...s.app,
          campaign: { ...s.app.campaign, notes: s.app.campaign.notes.filter((n) => n.id !== id) },
        },
      }))
      get().save()
    },

    addCreature: (c) => {
      set((s) => ({ app: { ...s.app, creatures: [...s.app.creatures, c] } }))
      get().save()
    },

    updateCreature: (id, patch) => {
      set((s) => ({
        app: {
          ...s.app,
          creatures: s.app.creatures.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        },
      }))
      get().save()
    },

    deleteCreature: (id) => {
      set((s) => ({ app: { ...s.app, creatures: s.app.creatures.filter((c) => c.id !== id) } }))
      get().save()
    },

    setInitiative: (initiative) => {
      set((s) => ({ app: { ...s.app, initiative } }))
      get().save()
    },
    clearInitiative: () => {
      set((s) => ({ app: { ...s.app, initiative: [] } }))
      get().save()
    },

    updateMap: (patch) => {
      set((s) => ({ app: { ...s.app, map: { ...s.app.map, ...patch } } }))
      get().save()
    },

    saveCurrentMap: () => {
      const { app } = get()
      const existing = app.savedMaps.findIndex((m) => m.id === app.map.id)
      const updated =
        existing >= 0
          ? app.savedMaps.map((m, i) => (i === existing ? { ...app.map } : m))
          : [...app.savedMaps, { ...app.map }]
      set((s) => ({ app: { ...s.app, savedMaps: updated } }))
      get().save()
    },

    loadSavedMap: (id) => {
      const { app } = get()
      const found = app.savedMaps.find((m) => m.id === id)
      if (found) {
        set((s) => ({ app: { ...s.app, map: { ...found, tiles: found.tiles.map(tile => ({ ...tile })), visibility: [...found.visibility] } } }))
        get().save()
      }
    },

    deleteSavedMap: (id) => {
      set((s) => ({ app: { ...s.app, savedMaps: s.app.savedMaps.filter((m) => m.id !== id) } }))
      get().save()
    },

    addMagic: (entry) => {
      set((s) => ({ app: { ...s.app, magic: [...s.app.magic, entry] } }))
      get().save()
    },

    updateMagic: (id, patch) => {
      set((s) => ({
        app: { ...s.app, magic: s.app.magic.map((m) => (m.id === id ? { ...m, ...patch } : m)) },
      }))
      get().save()
    },

    deleteMagic: (id) => {
      set((s) => ({ app: { ...s.app, magic: s.app.magic.filter((m) => m.id !== id) } }))
      get().save()
    },

    addRoll: (roll) => {
      set((s) => ({ app: { ...s.app, rolls: [roll, ...s.app.rolls].slice(0, 100) } }))
      get().save()
    },

    clearRolls: () => {
      set((s) => ({ app: { ...s.app, rolls: [] } }))
      get().save()
    },

    showToast: (text) => {
      const id = uid()
      set((s) => ({ toasts: [...s.toasts, { id, text }] }))
      setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2400)
    },

    setCloudStatus: (cloudStatus, msg) => {
      set({ cloudStatus })
      if (msg) set({ saveStatus: msg })
    },

    setSaveStatus: (saveStatus) => set({ saveStatus }),

    save: () => {
      const { app } = get()
      saveState(app)
      set({ saveStatus: 'Salvo' })
      setTimeout(() => set({ saveStatus: 'Pronto' }), 1500)
    },

    importState: (data) => {
      set((s) => ({
        app: normalizeAppState(data),
        ui: { ...s.ui, selectedCharacterId: data.characters?.[0]?.id ?? '' },
      }))
      get().save()
      get().showToast('Dados importados com sucesso.')
    },
  })),
)
