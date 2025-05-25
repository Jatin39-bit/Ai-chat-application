import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Project from '../pages/Project'
import ProtectWrapper from '../auth/ProtectWrapper'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/project" element={<ProtectWrapper><Project /></ProtectWrapper>} />
    </Routes>
  )
}

export default AppRoutes