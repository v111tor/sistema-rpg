import { useState } from 'react'
import { useStore } from '../../store'
import { Modal } from '../ui/Modal'
import { uid } from '../../services/storage'
import type { Note } from '../../types'

export function CampaignTab() {
  const { app, updateCampaign, addNote, updateNote, deleteNote } = useStore()
  const { campaign } = app
  const [noteSearch, setNoteSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [editNote, setEditNote] = useState<Note | null>(null)
  const [newNoteOpen, setNewNoteOpen] = useState(false)

  const norm = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

  const filteredNotes = campaign.notes.filter((n) => {
    const matchSearch = !noteSearch || norm(`${n.title} ${n.content}`).includes(norm(noteSearch))
    const matchTag = !tagFilter || n.tag.toLowerCase().includes(tagFilter.toLowerCase())
    return matchSearch && matchTag
  })

  const partyChars = app.characters.filter((c) => campaign.partyIds.includes(c.id))
  const metrics = [
    { label: 'Sessão', value: campaign.session },
    { label: 'Personagens', value: partyChars.length },
    { label: 'Notas', value: campaign.notes.length },
    { label: 'Local', value: campaign.location || '—' },
  ]

  return (
    <>
      <div className="grid grid-two">
        <div className="panel">
          <div className="section-title"><h3>Arquivo da campanha</h3></div>
          <div className="grid" style={{ gap: 10 }}>
            <div><label>Nome</label><input value={campaign.name} onChange={(e) => updateCampaign({ name: e.target.value })} /></div>
            <div><label>Premissa</label><textarea value={campaign.premise} onChange={(e) => updateCampaign({ premise: e.target.value })} /></div>
            <div className="field-row">
              <div><label>Sessão atual</label><input type="number" min={1} value={campaign.session} onChange={(e) => updateCampaign({ session: +e.target.value })} /></div>
              <div><label>Local atual</label><input value={campaign.location} onChange={(e) => updateCampaign({ location: e.target.value })} /></div>
            </div>
            <div><label>Segredos do mestre</label><textarea value={campaign.secrets} onChange={(e) => updateCampaign({ secrets: e.target.value })} /></div>
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <h3>Personagens vinculados</h3>
            <button className="btn small" onClick={() => updateCampaign({ partyIds: app.characters.map((c) => c.id) })}>
              Adicionar todas
            </button>
          </div>
          <div className="list">
            {app.characters.map((c) => {
              const inParty = campaign.partyIds.includes(c.id)
              return (
                <div key={c.id} className="item">
                  <div className="item-head">
                    <div><h4>{c.name}</h4><p>{c.player} | Nível {c.level}</p></div>
                    <button className={`btn small ${inParty ? 'danger' : 'primary'}`}
                      onClick={() => updateCampaign({ partyIds: inParty ? campaign.partyIds.filter((id) => id !== c.id) : [...campaign.partyIds, c.id] })}>
                      {inParty ? 'Remover' : 'Adicionar'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-two" style={{ marginTop: 12 }}>
        <div className="panel">
          <div className="section-title">
            <h3>Registro de sessão</h3>
            <button className="btn small primary" onClick={() => setNewNoteOpen(true)}>Nova nota</button>
          </div>
          <div className="filterbar">
            <input placeholder="Pesquisar notas" value={noteSearch} onChange={(e) => setNoteSearch(e.target.value)} />
            <input placeholder="Etiqueta" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} style={{ maxWidth: 120 }} />
          </div>
          <div className="list">
            {filteredNotes.length === 0 && <div className="empty">Nenhuma nota encontrada.</div>}
            {filteredNotes.map((n) => (
              <div key={n.id} className="item selectable" onClick={() => setEditNote(n)}>
                <div className="item-head">
                  <div><h4>{n.title || 'Sem título'}</h4><p>Sessão {n.session} {n.tag && `· ${n.tag}`}</p></div>
                  <button className="btn small danger" onClick={(e) => { e.stopPropagation(); deleteNote(n.id) }}>✕</button>
                </div>
                {n.content && <p style={{ marginTop: 4 }}>{n.content.slice(0, 80)}{n.content.length > 80 ? '…' : ''}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title"><h3>Resumo rápido</h3></div>
          <div className="grid grid-two" style={{ gap: 10 }}>
            {metrics.map(({ label, value }) => (
              <div key={label} className="item" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{value}</div>
                <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NoteModal
        note={editNote}
        onClose={() => setEditNote(null)}
        onSave={(patch) => { updateNote(editNote!.id, patch); setEditNote(null) }}
      />

      <NoteModal
        note={null}
        open={newNoteOpen}
        onClose={() => setNewNoteOpen(false)}
        onSave={(note) => {
          addNote({ id: uid(), session: campaign.session, createdAt: new Date().toISOString(), ...note } as Note)
          setNewNoteOpen(false)
        }}
      />
    </>
  )
}

function NoteModal({ note, open, onClose, onSave }: {
  note: Note | null
  open?: boolean
  onClose: () => void
  onSave: (patch: Partial<Note>) => void
}) {
  const isOpen = open ?? !!note
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [tag, setTag] = useState(note?.tag ?? '')

  if (!isOpen) return null

  return (
    <Modal open title={note ? 'Editar nota' : 'Nova nota'} onClose={onClose}
      actions={<>
        <button className="btn small" onClick={onClose}>Cancelar</button>
        <button className="btn small primary" onClick={() => onSave({ title, content, tag })}>Salvar</button>
      </>}>
      <div className="grid" style={{ gap: 10 }}>
        <div><label>Título</label><input defaultValue={note?.title} onChange={(e) => setTitle(e.target.value)} autoFocus /></div>
        <div><label>Etiqueta</label><input defaultValue={note?.tag} onChange={(e) => setTag(e.target.value)} /></div>
        <div><label>Conteúdo</label><textarea rows={6} defaultValue={note?.content} onChange={(e) => setContent(e.target.value)} /></div>
      </div>
    </Modal>
  )
}
