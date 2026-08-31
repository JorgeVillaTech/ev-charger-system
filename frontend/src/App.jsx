import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import RutaProtegida from './components/RutaProtegida'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/olvide-password" element={<ForgotPassword />} />
      <Route path="/home" element={
        <RutaProtegida>
          <Home />
        </RutaProtegida>
      } />
      <Route path="/" element={<Login />} />
    </Routes>
  )
}

export default App