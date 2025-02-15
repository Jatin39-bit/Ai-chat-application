import AppRoutes from './routes/AppRoutes'
import './App.css'
import UserProvider from './context/user.context'

function App() {
  return(
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  )
}

export default App
