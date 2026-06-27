import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge as rfAddEdge,
} from '@xyflow/react'
import useStore from '../store/useStore'
import PostitNode from './PostitNode'

const nodeTypes = { postit: PostitNode }

const Canvas = () => {
  const boards = useStore(s => s.boards)
  const activeBoard = useStore(s => s.activeBoard)
  const moveNode = useStore(s => s.moveNode)
  const addNode = useStore(s => s.addNode)
  const showEdgeTypeMenu = useStore(s => s.showEdgeTypeMenu)
  const deleteEdge = useStore(s => s.deleteEdge)

  const board = boards.find(b => b.id === activeBoard) || { nodes: [], edges: [] }

  const onNodeDragStop = useCallback((_, node) => {
    moveNode(node.id, node.position)
  }, [moveNode])

  const onConnect = useCallback((params) => {
    // Show edge type picker near the target handle
    const targetEl = document.querySelector(`[data-id="${params.target}"]`)
    const rect = targetEl?.getBoundingClientRect() || { left: window.innerWidth / 2, top: window.innerHeight / 2 }
    showEdgeTypeMenu(
      { x: rect.left + rect.width / 2 - 100, y: rect.top - 60 },
      params.source,
      params.target
    )
  }, [showEdgeTypeMenu])

  const onDoubleClick = useCallback((e) => {
    // Double-click on empty canvas = new post-it
    if (e.target.classList.contains('react-flow__pane') || e.target.tagName === 'svg') {
      const rect = e.currentTarget.getBoundingClientRect()
      // We need canvas coordinates — use the transform from the flow
      addNode({ x: e.clientX - rect.left - 140, y: e.clientY - rect.top - 60 })
    }
  }, [addNode])

  const onEdgeDoubleClick = useCallback((_, edge) => {
    if (confirm('Supprimer ce lien ?')) deleteEdge(edge.id)
  }, [deleteEdge])

  return (
    <div style={{ flex: 1, position: 'relative' }} onDoubleClick={onDoubleClick}>
      <ReactFlow
        key={activeBoard}
        nodes={board.nodes}
        edges={board.edges}
        nodeTypes={nodeTypes}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onEdgeDoubleClick={onEdgeDoubleClick}
        fitView
        minZoom={0.15}
        maxZoom={2}
        deleteKeyCode={null}
      >
        <Background
          color="#a07840"
          gap={24}
          size={1.5}
          style={{ backgroundColor: '#c4a060' }}
        />
        <Controls />
        <MiniMap
          nodeColor={(n) => n.data?.color || '#f0c040'}
          maskColor="rgba(0,0,0,0.4)"
          style={{ background: '#1e1208', border: '1px solid #3d2810' }}
        />
      </ReactFlow>

      {board.nodes.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.45)', color: '#d4bc9a',
            padding: '18px 28px', borderRadius: 10, textAlign: 'center',
            fontSize: 14, lineHeight: 1.7,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📌</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Tableau vide</div>
            <div style={{ opacity: 0.8 }}>Double-cliquez sur le liège pour créer un post-it</div>
            <div style={{ opacity: 0.6, fontSize: 12 }}>Glissez les handles pour relier les projets</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Canvas
