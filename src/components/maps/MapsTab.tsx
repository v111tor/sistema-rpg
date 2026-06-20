import { useState, useRef, useCallback, useEffect } from 'react'
import { useStore } from '../../store'
import { MAP_TOOLS } from '../../data/constants'
import type { TileType, MapTile } from '../../types'

// ── Tile rendering ────────────────────────────────────────────────────────────
const TILE_SYMBOLS: Partial<Record<TileType, string>> = {
  wall: '🧱', floor: '·', water: '🌊', door: '🚪', trap: '⚠️',
  hazard: '☣️', light: '🔥', pillar: '🏛️', rubble: '🪨', secret: '❓',
  stairs: '🪜', statue: '🗿', altar: '⛩️', chest: '🧰',
  npc: '🧙', pc: '⭐', boss: '👹', 'token-npc': '🧙', 'token-boss': '👹',
}
const TILE_BG: Partial<Record<TileType, string>> = {
  wall: '#1e2030', floor: '#13152a', water: '#0d2233',
  door: '#2a1e10', altar: '#1a1030',
}

type PaintMode = 'terrain' | 'reveal' | 'hide' | 'reveal-area' | 'hide-area'

function generateDungeon(width: number, height: number): MapTile[] {
  const tiles: MapTile[] = Array.from({ length: width * height }, () => ({ type: 'wall', visible: true }))
  const rooms: { x: number; y: number; width: number; height: number; cx: number; cy: number }[] = []
  const set = (x: number, y: number, type: TileType = 'floor') => {
    if (x > 0 && y > 0 && x < width - 1 && y < height - 1) tiles[y * width + x] = { type, visible: true }
  }

  for (let attempt = 0; attempt < 80 && rooms.length < 9; attempt++) {
    const roomWidth = 3 + Math.floor(Math.random() * Math.max(1, Math.min(6, width - 4)))
    const roomHeight = 3 + Math.floor(Math.random() * Math.max(1, Math.min(5, height - 4)))
    const x = 1 + Math.floor(Math.random() * Math.max(1, width - roomWidth - 2))
    const y = 1 + Math.floor(Math.random() * Math.max(1, height - roomHeight - 2))
    if (rooms.some(room => x <= room.x + room.width + 1 && x + roomWidth + 1 >= room.x && y <= room.y + room.height + 1 && y + roomHeight + 1 >= room.y)) continue
    const room = { x, y, width: roomWidth, height: roomHeight, cx: x + Math.floor(roomWidth / 2), cy: y + Math.floor(roomHeight / 2) }
    rooms.push(room)
    for (let ry = y; ry < y + roomHeight; ry++) for (let rx = x; rx < x + roomWidth; rx++) set(rx, ry)
  }

  if (!rooms.length) {
    const room = { x: 1, y: 1, width: width - 2, height: height - 2, cx: Math.floor(width / 2), cy: Math.floor(height / 2) }
    rooms.push(room)
    for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) set(x, y)
  }

  for (let index = 1; index < rooms.length; index++) {
    const from = rooms[index - 1], to = rooms[index]
    const horizontalFirst = Math.random() > 0.5
    const carveHorizontal = () => { for (let x = Math.min(from.cx, to.cx); x <= Math.max(from.cx, to.cx); x++) set(x, horizontalFirst ? from.cy : to.cy) }
    const carveVertical = () => { for (let y = Math.min(from.cy, to.cy); y <= Math.max(from.cy, to.cy); y++) set(horizontalFirst ? to.cx : from.cx, y) }
    if (horizontalFirst) { carveHorizontal(); carveVertical() } else { carveVertical(); carveHorizontal() }
  }

  tiles[rooms[0].cy * width + rooms[0].cx] = { type: 'pc', visible: true }
  const last = rooms[rooms.length - 1]
  tiles[last.cy * width + last.cx] = { type: rooms.length > 1 ? 'boss' : 'stairs', visible: true }
  const available = tiles.map((tile, index) => tile.type === 'floor' ? index : -1).filter(index => index >= 0)
  const take = () => available.splice(Math.floor(Math.random() * available.length), 1)[0]
  const place = (type: TileType, count = 1) => { for (let i = 0; i < count && available.length; i++) tiles[take()] = { type, visible: true } }
  place('stairs'); place('door', Math.max(1, Math.floor(rooms.length / 2))); place('chest', 2)
  place('trap', 2); place('water', Math.max(2, Math.floor(width * height * 0.015))); place('light', 2)
  return tiles
}

export function MapsTab() {
  const { app, updateMap, saveCurrentMap, loadSavedMap, deleteSavedMap } = useStore()
  const { map } = app

  const [tool, setTool]       = useState<TileType>('floor')
  const [mode, setMode]       = useState<PaintMode>('terrain')
  const [viewMode, setView]   = useState<'gm' | 'player'>(
    () => (localStorage.getItem('mesa_rpg_map_view_mode_v1') as 'gm' | 'player') || 'gm',
  )
  const [mapWidth,  setMapWidth]  = useState(map.width)
  const [mapHeight, setMapHeight] = useState(map.height)
  const [selectedCreature, setSelectedCreature] = useState(app.creatures[0]?.id ?? '')

  useEffect(() => {
    // A map loaded from the library replaces the editable dimension draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMapWidth(map.width)
    setMapHeight(map.height)
  }, [map.id, map.width, map.height])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!selectedCreature && app.creatures[0]) setSelectedCreature(app.creatures[0].id)
  }, [app.creatures, selectedCreature])

  // Painting refs — never stale
  const paintingRef = useRef(false)
  const toolRef     = useRef(tool)
  const modeRef     = useRef(mode)
  const creatureRef = useRef(selectedCreature)
  useEffect(() => { toolRef.current = tool },             [tool])
  useEffect(() => { modeRef.current = mode },             [mode])
  useEffect(() => { creatureRef.current = selectedCreature }, [selectedCreature])

  const pendingTilesRef      = useRef<MapTile[] | null>(null)
  const pendingVisibilityRef = useRef<boolean[] | null>(null)

  const ensureVisibility = useCallback((vis?: boolean[]) => {
    const total = map.width * map.height
    if (!vis || vis.length !== total) return Array(total).fill(true)
    return vis
  }, [map.width, map.height])

  const applyTile = useCallback((idx: number) => {
    const m = modeRef.current
    if (m === 'terrain') {
      if (!pendingTilesRef.current) return
      const ttype = toolRef.current
      const isToken = ttype === 'token-npc' || ttype === 'token-boss'
      pendingTilesRef.current[idx] = {
        type: ttype,
        visible: pendingTilesRef.current[idx]?.visible ?? true,
        creatureId: isToken ? creatureRef.current : undefined,
      }
    } else {
      if (!pendingVisibilityRef.current) return
      const reveal = m === 'reveal' || m === 'reveal-area'
      const radius = m.endsWith('-area') ? 1 : 0
      const w = map.width, h = map.height
      const cx = idx % w, cy = Math.floor(idx / w)
      for (let y = Math.max(0, cy - radius); y <= Math.min(h - 1, cy + radius); y++) {
        for (let x = Math.max(0, cx - radius); x <= Math.min(w - 1, cx + radius); x++) {
          pendingVisibilityRef.current[y * w + x] = reveal
        }
      }
    }
  }, [map.width, map.height])

  const startPaint = useCallback((idx: number) => {
    paintingRef.current = true
    const m = modeRef.current
    if (m === 'terrain') {
      pendingTilesRef.current = map.tiles.map(t => ({ ...t }))
    } else {
      pendingVisibilityRef.current = ensureVisibility([...map.visibility])
    }
    applyTile(idx)
  }, [map.tiles, map.visibility, applyTile, ensureVisibility])

  const continuePaint = useCallback((idx: number) => {
    if (!paintingRef.current) return
    applyTile(idx)
  }, [applyTile])

  const commitPaint = useCallback(() => {
    if (!paintingRef.current) return
    paintingRef.current = false
    if (pendingTilesRef.current) {
      updateMap({ tiles: pendingTilesRef.current })
      pendingTilesRef.current = null
    }
    if (pendingVisibilityRef.current) {
      updateMap({ visibility: pendingVisibilityRef.current })
      pendingVisibilityRef.current = null
    }
  }, [updateMap])

  useEffect(() => {
    window.addEventListener('mouseup', commitPaint)
    return () => window.removeEventListener('mouseup', commitPaint)
  }, [commitPaint])

  const resize = () => {
    const w = Math.max(4, Math.min(40, mapWidth))
    const h = Math.max(4, Math.min(32, mapHeight))
    const total = w * h
    const tiles = Array.from({ length: total }, (_, i): MapTile =>
      map.tiles[i] ?? { type: 'empty', visible: true }
    )
    updateMap({ width: w, height: h, tiles, visibility: Array(total).fill(true) })
  }

  const clearMap = () => {
    const total = map.width * map.height
    updateMap({ tiles: Array.from({ length: total }, (): MapTile => ({ type: 'empty', visible: true })) })
  }

  const randomDungeon = () => {
    const total = map.width * map.height
    updateMap({ tiles: generateDungeon(map.width, map.height), visibility: Array(total).fill(false) })
  }

  const revealAll = () => updateMap({ visibility: Array(map.width * map.height).fill(true) })
  const hideAll   = () => updateMap({ visibility: Array(map.width * map.height).fill(false) })

  const vis = ensureVisibility(map.visibility)
  const revealed = vis.filter(Boolean).length
  const total = vis.length

  const isPlayer = viewMode === 'player'
  const setViewMode = (v: 'gm' | 'player') => {
    setView(v); localStorage.setItem('mesa_rpg_map_view_mode_v1', v)
  }

  const VISIBILITY_TOOLS: [PaintMode, string][] = [
    ['reveal',      '👁 Revelar célula'],
    ['hide',        '🌑 Ocultar célula'],
    ['reveal-area', '🔦 Revelar área 3x3'],
    ['hide-area',   '🌫 Ocultar área 3x3'],
  ]

  return (
    <div className="map-wrap">
      {/* ── Painel lateral ────────────────────────────────────────── */}
      <div className="panel map-sidebar">

        {/* Dimensões */}
        <div className="section-title"><h3>🗺 Editor tático</h3></div>
        <div style={{ display: 'grid', gap: 8 }}>
          <div><label>Nome do mapa</label>
            <input value={map.name} onChange={e => updateMap({ name: e.target.value })} />
          </div>
          <div className="field-row">
            <div><label>Largura</label>
              <input type="number" min={4} max={40} value={mapWidth} onChange={e => setMapWidth(+e.target.value)} />
            </div>
            <div><label>Altura</label>
              <input type="number" min={4} max={32} value={mapHeight} onChange={e => setMapHeight(+e.target.value)} />
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: 8, flexWrap: 'wrap', gap: 4 }}>
          <button className="btn small primary" onClick={resize}>✓ Aplicar</button>
          <button className="btn small primary" onClick={saveCurrentMap}>💾 Salvar</button>
          <button className="btn small"         onClick={randomDungeon}>🎲 Aleatório</button>
          <button className="btn small"         onClick={clearMap}>🗑 Limpar</button>
        </div>

        {/* Visibilidade */}
        <div className="section-title" style={{ marginTop: 14 }}><h3>👁 Visibilidade</h3></div>
        <div className="segmented">
          <button className={viewMode === 'gm' ? 'active' : ''} onClick={() => setViewMode('gm')}>Mestre</button>
          <button className={viewMode === 'player' ? 'active' : ''} onClick={() => setViewMode('player')}>Jogadores</button>
        </div>
        <div className="tool-grid" style={{ marginTop: 8 }}>
          {VISIBILITY_TOOLS.map(([key, label]) => (
            <button
              key={key}
              className={`tool-btn ${mode === key ? 'active' : ''}`}
              onClick={() => { setMode(key); }}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className="row" style={{ marginTop: 8, gap: 4 }}>
          <button className="btn small" onClick={revealAll}>Revelar tudo</button>
          <button className="btn small" onClick={hideAll}>Ocultar tudo</button>
          <button className="btn small" onClick={() => setMode('terrain')}>✏ Editar terreno</button>
        </div>
        <p className="muted" style={{ marginTop: 6 }}>
          {revealed}/{total} células reveladas
        </p>

        {/* Ferramentas de terreno */}
        <div className="section-title" style={{ marginTop: 14 }}>
          <h3>🖌 Terreno</h3>
          {mode === 'terrain' && <span className="pill blue">{MAP_TOOLS.find(([k]) => k === tool)?.[1] ?? tool}</span>}
        </div>
        <div className="tool-grid">
          {MAP_TOOLS.map(([key, label, icon]) => (
            <button
              key={key}
              className={`tool-btn ${tool === key && mode === 'terrain' ? 'active' : ''}`}
              title={label}
              onClick={() => { setTool(key as TileType); setMode('terrain') }}
            >
              <span className="icon">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Token de criatura */}
        {app.creatures.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: 14 }}><h3>🪆 Token de criatura</h3></div>
            <div style={{ marginBottom: 6 }}>
              <label>Criatura para o token</label>
              <select value={selectedCreature} onChange={e => setSelectedCreature(e.target.value)}>
                {app.creatures.map(c => <option key={c.id} value={c.id}>{c.name} – {c.type || 'Criatura'}</option>)}
              </select>
            </div>
            <div className="row" style={{ gap: 4 }}>
              <button className="btn small" onClick={() => { setTool('token-npc'); setMode('terrain') }}>
                ☺ NPC token
              </button>
              <button className="btn small" onClick={() => { setTool('token-boss'); setMode('terrain') }}>
                ☠ Chefe token
              </button>
            </div>
          </>
        )}

        {/* Mapas salvos */}
        <div className="section-title" style={{ marginTop: 14 }}><h3>📁 Mapas salvos</h3></div>
        <div className="list">
          {app.savedMaps.length === 0 && <div className="empty">Nenhum mapa salvo.</div>}
          {app.savedMaps.map(m => (
            <div key={m.id} className={`item ${m.id === map.id ? 'selectable active' : ''}`}>
              <div className="item-head">
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</span>
                  <p>{m.width}×{m.height}</p>
                </div>
                <div className="row" style={{ gap: 4 }}>
                  <button className="btn small" onClick={() => loadSavedMap(m.id)}>Carregar</button>
                  <button className="btn small danger ghost" onClick={() => deleteSavedMap(m.id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="muted" style={{ marginTop: 10 }}>
          Clique ou arraste para pintar. Em modo visibilidade, arraste para revelar/ocultar áreas.
        </p>
      </div>

      {/* ── Grid do mapa ──────────────────────────────────────────── */}
      <div className="map-stage">
        <div
          className="map-grid"
          style={{ gridTemplateColumns: `repeat(${map.width}, 36px)` }}
          onDragStart={e => e.preventDefault()}
          onMouseLeave={commitPaint}
        >
          {map.tiles.map((tile, i) => {
            const isVisible = vis[i] ?? true
            const hidden = isPlayer && !isVisible

            return (
              <div
                key={i}
                className={`map-cell ${tile.type}${!isVisible ? ' fog' : ''}`}
                style={{
                  background: hidden ? '#05060a' : (TILE_BG[tile.type] ?? 'var(--bg)'),
                  opacity: !isVisible && !isPlayer ? 0.45 : 1,
                }}
                onMouseDown={e => { e.preventDefault(); startPaint(i) }}
                onMouseEnter={() => continuePaint(i)}
                onMouseUp={commitPaint}
                title={tile.creatureId ? app.creatures.find(c => c.id === tile.creatureId)?.name : undefined}
              >
                {hidden ? '' : (TILE_SYMBOLS[tile.type] ?? '')}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
