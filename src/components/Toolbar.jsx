import { useRef, useState } from 'react'
import useStore from '../store/useStore'

const Toolbar = () => {
  const exportJSON = useStore(s => s.exportJSON)
  const importJSON = useStore(s => s.importJSON)
  const boards = useStore(s => s.boards)
  const activeBoard = useStore(s => s.activeBoard)
  const addBoard = useStore(s => s.addBoard)
  const setActiveBoard = useStore(s => s.setActiveBoard)
  const renameBoard = useStore(s => s.renameBoard)
  const deleteBoard = useStore(s => s.deleteBoard)
  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal] = useState('')
  const importRef = useRef()

  const startRename = (b, e) => {
    e.stopPropagation()
    setRenamingId(b.id)
    setRenameVal(b.name)
  }

  const commitRename = () => {
    if (renameVal.trim()) renameBoard(renamingId, renameVal.trim())
    setRenamingId(null)
  }

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-brand">Ariane<span>.</span></div>

        <div style={{ flex: 1 }} />

        <button className="btn btn-ghost" onClick={() => importRef.current.click()}>
          ↑ Importer
        </button>
        <button className="btn btn-ghost" onClick={exportJSON}>
          ↓ Exporter
        </button>

        <input
          ref={importRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files[0]) importJSON(e.target.files[0]); e.target.value = '' }}
        />
      </div>

      <div className="tabs-bar">
        {boards.map(b => (
          <div
            key={b.id}
            className={`tab${b.id === activeBoard ? ' active' : ''}`}
            onClick={() => setActiveBoard(b.id)}
            onDoubleClick={(e) => startRename(b, e)}
            title="Double-clic pour renommer"
          >
            {renamingId === b.id ? (
              <input
                autoFocus
                value={renameVal}
                onChange={e => setRenameVal(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenamingId(null) }}
                onClick={e => e.stopPropagation()}
                style={{ width: 90, background: 'transparent', border: 'none', outline: 'none', font: 'inherit', color: 'inherit' }}
              />
            ) : (
              <span>{b.name}</span>
            )}
            {b.id === activeBoard && boards.length > 1 && (
              <span
                onClick={(e) => { e.stopPropagation(); if (confirm('Supprimer ce tableau ?')) deleteBoard(b.id) }}
                style={{ marginLeft: 6, fontSize: 10, opacity: 0.5, cursor: 'pointer' }}
                title="Supprimer"
              >✕</span>
            )}
          </div>
        ))}
        <button className="tab-add" onClick={addBoard} title="Nouveau tableau">+</button>
      </div>
    </>
  )
}

export default Toolbar
