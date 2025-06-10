import AppRoutes from './routes/AppRoutes'
import './App.css'
import UserProvider from './context/user.context'
import { SnackbarProvider } from './context/snackbar.context'
import Layout from './components/Layout'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return(
    <BrowserRouter>
      <UserProvider>
        <SnackbarProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </SnackbarProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
