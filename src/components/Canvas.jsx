import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
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

  // Track click timing to detect double-click on pane
  const lastClickTime = useRef(0)
  const lastClickPos = useRef({ x: 0, y: 0 })

  const { screenToFlowPosition } = useReactFlow()

  const onNodeDragStop = useCallback((_, node) => {
    moveNode(node.id, node.position)
  }, [moveNode])

  const onConnect = useCallback((params) => {
    const targetEl = document.querySelector(`[data-id="${params.target}"]`)
    const rect = targetEl?.getBoundingClientRect() || { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 }
    showEdgeTypeMenu(
      { x: rect.left + rect.width / 2 - 100, y: rect.top - 60 },
      params.source,
      params.target
    )
  }, [showEdgeTypeMenu])

  // React Flow fires onPaneClick reliably — detect double-click manually
  const onPaneClick = useCallback((e) => {
    const now = Date.now()
    const dx = Math.abs(e.clientX - lastClickPos.current.x)
    const dy = Math.abs(e.clientY - lastClickPos.current.y)
    if (now - lastClickTime.current < 350 && dx < 10 && dy < 10) {
      const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      addNode({ x: pos.x - 140, y: pos.y - 60 })
      lastClickTime.current = 0
    } else {
      lastClickTime.current = now
      lastClickPos.current = { x: e.clientX, y: e.clientY }
    }
  }, [addNode, screenToFlowPosition])

  const onEdgeDoubleClick = useCallback((_, edge) => {
    if (confirm('Supprimer ce lien ?')) deleteEdge(edge.id)
  }, [deleteEdge])

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <ReactFlow
        key={activeBoard}
        nodes={board.nodes}
        edges={board.edges}
        nodeTypes={nodeTypes}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
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
