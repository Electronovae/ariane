import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'
import useStore from '../store/useStore'

const EditModal = () => {
  const editingNode = useStore(s => s.editingNode)
  const setEditingNode = useStore(s => s.setEditingNode)
  const updateNode = useStore(s => s.updateNode)
  const deleteNode = useStore(s => s.deleteNode)
  const PIN_COLORS = useStore(s => s.PIN_COLORS)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('')
  const [tab, setTab] = useState('edit')

  const textareaRef = useRef()

  useEffect(() => {
    if (editingNode) {
      setTitle(editingNode.data.title || '')
      setContent(editingNode.data.content || '')
      setColor(editingNode.data.color || PIN_COLORS[0])
      setTab('edit')
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [editingNode])

  if (!editingNode) return null

  const save = () => {
    updateNode(editingNode.id, { title, content, color })
    setEditingNode(null)
  }

  const handleDelete = () => {
    if (confirm('Supprimer ce post-it définitivement ?')) {
      deleteNode(editingNode.id)
      setEditingNode(null)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { save(); }
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); save(); }
  }

  const previewHtml = marked.parse(content)

  return (
    <div className="modal-overlay" onClick={save}>
      <div
        className="modal"
        style={{ '--pin-color': color }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <input
            className="modal-title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre du projet..."
          />
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
            {PIN_COLORS.map(c => (
              <div
                key={c}
                className={`color-dot${color === c ? ' selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        <div className="modal-body">
          <div className="editor-tabs">
            <div className={`editor-tab${tab === 'edit' ? ' active' : ''}`} onClick={() => setTab('edit')}>Éditer</div>
            <div className={`editor-tab${tab === 'preview' ? ' active' : ''}`} onClick={() => setTab('preview')}>Aperçu</div>
          </div>

          {tab === 'edit' ? (
            <textarea
              ref={textareaRef}
              className="md-editor"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Contenu en Markdown...&#10;&#10;## Tâches&#10;- [ ] Première tâche&#10;- [ ] Deuxième tâche"
              spellCheck={false}
            />
          ) : (
            <div
              className="md-preview"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: '#aaa' }}>Ctrl+S ou Échap pour fermer</span>
          <button className="btn btn-primary" onClick={save}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default EditModal
