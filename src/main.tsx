import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/tokens.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { getStoredToken, setAuthToken } from './api/client.js'

const stored = getStoredToken()
if (stored) setAuthToken(stored)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
