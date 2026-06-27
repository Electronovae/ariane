import { create } from 'zustand'

const PIN_COLORS = ['#f0c040', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c', '#e91e63']

const EDGE_TYPES = {
  dependency: { label: 'dépend de', color: '#e74c3c', dash: false },
  subproject:  { label: 'sous-projet', color: '#3498db', dash: false },
  related:     { label: 'lié à',       color: '#95a5a6', dash: true },
}

const makeBoard = (id, name) => ({ id, name, nodes: [], edges: [] })

const defaultBoards = [makeBoard('board-1', 'Mon espace')]

const load = () => {
  try {
    const raw = localStorage.getItem('ariane-v1')
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

const save = (state) => {
  const data = { boards: state.boards, activeBoard: state.activeBoard }
  localStorage.setItem('ariane-v1', JSON.stringify(data))
}

let nodeCounter = Date.now()
const uid = () => `n-${++nodeCounter}`
const eid = () => `e-${++nodeCounter}`

const useStore = create((set, get) => {
  const persisted = load()

  return {
    boards: persisted?.boards || defaultBoards,
    activeBoard: persisted?.activeBoard || 'board-1',
    edgeTypeMenu: null,   // { x, y, sourceId, targetId } — shown after drag
    editingNode: null,    // node being edited in modal

    // Board management
    addBoard: () => set(s => {
      const id = `board-${Date.now()}`
      const boards = [...s.boards, makeBoard(id, 'Nouveau tableau')]
      save({ ...s, boards, activeBoard: id })
      return { boards, activeBoard: id }
    }),

    renameBoard: (id, name) => set(s => {
      const boards = s.boards.map(b => b.id === id ? { ...b, name } : b)
      save({ ...s, boards })
      return { boards }
    }),

    deleteBoard: (id) => set(s => {
      if (s.boards.length === 1) return {}
      const boards = s.boards.filter(b => b.id !== id)
      const activeBoard = s.activeBoard === id ? boards[0].id : s.activeBoard
      save({ ...s, boards, activeBoard })
      return { boards, activeBoard }
    }),

    setActiveBoard: (id) => set(s => {
      save({ ...s, activeBoard: id })
      return { activeBoard: id }
    }),

    // Nodes
    addNode: (position) => set(s => {
      const id = uid()
      const color = PIN_COLORS[Math.floor(Math.random() * PIN_COLORS.length)]
      const node = {
        id,
        type: 'postit',
        position,
        data: { title: 'Nouveau projet', content: '## Nouveau projet\n\n- [ ] Première tâche\n', color }
      }
      const boards = s.boards.map(b =>
        b.id === s.activeBoard ? { ...b, nodes: [...b.nodes, node] } : b
      )
      save({ ...s, boards })
      return { boards, editingNode: node }
    }),

    updateNode: (id, data) => set(s => {
      const boards = s.boards.map(b =>
        b.id === s.activeBoard
          ? { ...b, nodes: b.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n) }
          : b
      )
      save({ ...s, boards })
      return { boards }
    }),

    moveNode: (id, position) => set(s => {
      const boards = s.boards.map(b =>
        b.id === s.activeBoard
          ? { ...b, nodes: b.nodes.map(n => n.id === id ? { ...n, position } : n) }
          : b
      )
      save({ ...s, boards })
      return { boards }
    }),

    deleteNode: (id) => set(s => {
      const boards = s.boards.map(b =>
        b.id === s.activeBoard
          ? { ...b, nodes: b.nodes.filter(n => n.id !== id), edges: b.edges.filter(e => e.source !== id && e.target !== id) }
          : b
      )
      save({ ...s, boards })
      return { boards }
    }),

    setEditingNode: (node) => set({ editingNode: node }),

    // Edges
    showEdgeTypeMenu: (pos, sourceId, targetId) => set({ edgeTypeMenu: { ...pos, sourceId, targetId } }),
    hideEdgeTypeMenu: () => set({ edgeTypeMenu: null }),

    addEdge: (sourceId, targetId, type) => set(s => {
      const exists = s.boards.find(b => b.id === s.activeBoard)
        ?.edges.some(e => e.source === sourceId && e.target === targetId)
      if (exists) return {}
      const cfg = EDGE_TYPES[type]
      const edge = {
        id: eid(),
        source: sourceId,
        target: targetId,
        edgeType: type,
        label: cfg.label,
        style: { stroke: cfg.color, strokeDasharray: cfg.dash ? '6 3' : undefined },
        labelStyle: { fontSize: 10, fill: '#555', fontWeight: 600 },
        labelBgStyle: { fill: 'rgba(255,255,255,0.9)' },
        labelBgPadding: [3, 5],
        labelBgBorderRadius: 8,
        markerEnd: { type: 'arrowclosed', color: cfg.color },
      }
      const boards = s.boards.map(b =>
        b.id === s.activeBoard ? { ...b, edges: [...b.edges, edge] } : b
      )
      save({ ...s, boards })
      return { boards, edgeTypeMenu: null }
    }),

    deleteEdge: (id) => set(s => {
      const boards = s.boards.map(b =>
        b.id === s.activeBoard ? { ...b, edges: b.edges.filter(e => e.id !== id) } : b
      )
      save({ ...s, boards })
      return { boards }
    }),

    // Import / Export
    exportJSON: () => {
      const s = get()
      const blob = new Blob([JSON.stringify({ boards: s.boards }, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'ariane.json'; a.click()
      URL.revokeObjectURL(url)
    },

    importJSON: (file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.boards) {
            set(s => {
              const newState = { boards: data.boards, activeBoard: data.boards[0]?.id }
              save(newState)
              return newState
            })
          }
        } catch { alert('Fichier invalide.') }
      }
      reader.readAsText(file)
    },

    PIN_COLORS,
    EDGE_TYPES,
  }
})

export default useStore
