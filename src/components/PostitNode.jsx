import { memo, useCallback } from 'react'
import { Handle, Position } from '@xyflow/react'
import { marked } from 'marked'
import useStore from '../store/useStore'

marked.setOptions({ breaks: true, gfm: true })

const PostitNode = memo(({ data, id, selected }) => {
  const setEditingNode = useStore(s => s.setEditingNode)
  const deleteNode = useStore(s => s.deleteNode)

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation()
    setEditingNode({ id, data })
  }, [id, data, setEditingNode])

  const handleDelete = useCallback((e) => {
    e.stopPropagation()
    if (confirm('Supprimer ce post-it ?')) deleteNode(id)
  }, [id, deleteNode])

  const previewHtml = marked.parse(data.content || '')
  const isDone = data.title?.startsWith('✅')

  return (
    <div className="postit-node" style={{ '--pin-color': data.color }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0.4, background: '#666' }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0.4, background: '#666' }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0.4, background: '#666' }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0.4, background: '#666' }} />

      <div
        className="postit-card"
        style={{
          '--pin-color': data.color,
          outline: selected ? '2px solid rgba(41,128,185,0.6)' : 'none',
          background: isDone ? '#e8f5e9' : undefined,
        }}
        onDoubleClick={handleDoubleClick}
      >
        <div className="postit-body">
          <div className="postit-title" style={ isDone ? { color: '#1b5e20' } : undefined }>{data.title || 'Sans titre'}</div>
          <div
            className="postit-preview"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
        {selected && (
          <button
            onClick={handleDelete}
            style={{
              position: 'absolute', top: -38, right: 0,
              background: 'rgba(200,30,30,0.85)', color: 'white',
              border: 'none', borderRadius: 4, padding: '2px 7px',
              fontSize: 11, cursor: 'pointer', fontWeight: 700
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
})

PostitNode.displayName = 'PostitNode'
export default PostitNode
