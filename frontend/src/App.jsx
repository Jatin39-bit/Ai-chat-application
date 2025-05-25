import AppRoutes from './routes/AppRoutes'
import './App.css'
import UserProvider from './context/user.context'
import { SnackbarProvider } from './context/snackbar.context'
import Layout from './components/Layout'
import { HashRouter } from 'react-router-dom'

function App() {
  return(
    <HashRouter>
      <UserProvider>
        <SnackbarProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </SnackbarProvider>
      </UserProvider>
    </HashRouter>
  )
}

export default App
