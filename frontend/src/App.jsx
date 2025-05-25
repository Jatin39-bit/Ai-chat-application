import AppRoutes from './routes/AppRoutes'
import './App.css'
import UserProvider from './context/user.context'
import Layout from './components/Layout'
import { HashRouter } from 'react-router-dom'

function App() {
  return(
    <HashRouter>
      <UserProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </UserProvider>
    </HashRouter>
  )
}

export default App
