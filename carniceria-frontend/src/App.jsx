import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Panel from './Panel'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cuando la URL sea / mostramos el Login */}
        <Route path="/" element={<Login />} />
        
        {/* Cuando la URL sea /panel mostramos el Dashboard */}
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App