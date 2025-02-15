import AppRoutes from './routes/AppRoutes'
import './App.css'
import UserProvider from './context/user.context'
import {BrowserRouter} from 'react-router-dom'

function App() {
  return(
    <BrowserRouter>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
    </BrowserRouter>
  )
}

export default App
