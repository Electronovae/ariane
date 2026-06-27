import useStore from '../store/useStore'

const EdgeTypeMenu = () => {
  const edgeTypeMenu = useStore(s => s.edgeTypeMenu)
  const hideEdgeTypeMenu = useStore(s => s.hideEdgeTypeMenu)
  const addEdge = useStore(s => s.addEdge)
  const EDGE_TYPES = useStore(s => s.EDGE_TYPES)

  if (!edgeTypeMenu) return null

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 199 }}
        onClick={hideEdgeTypeMenu}
      />
      <div
        className="edge-type-bar"
        style={{ left: edgeTypeMenu.x, top: edgeTypeMenu.y }}
      >
        <span style={{ color: '#aaa', fontSize: 11, alignSelf: 'center', marginRight: 4 }}>Lien :</span>
        {Object.entries(EDGE_TYPES).map(([type, cfg]) => (
          <button
            key={type}
            className="edge-type-btn"
            style={{ borderColor: cfg.color, color: cfg.color }}
            onClick={() => addEdge(edgeTypeMenu.sourceId, edgeTypeMenu.targetId, type)}
          >
            {cfg.label}
          </button>
        ))}
      </div>
    </>
  )
}

export default EdgeTypeMenu
