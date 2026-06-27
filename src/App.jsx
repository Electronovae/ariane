import { ReactFlowProvider } from '@xyflow/react'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import EditModal from './components/EditModal'
import EdgeTypeMenu from './components/EdgeTypeMenu'

function App() {
  return (
    <ReactFlowProvider>
      <Toolbar />
      <Canvas />
      <EditModal />
      <EdgeTypeMenu />
    </ReactFlowProvider>
  )
}

export default App
