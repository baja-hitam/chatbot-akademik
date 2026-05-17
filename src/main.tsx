import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './app/providers/AuthProvider'
import { AppRouterProvider } from './app/providers/AppRouterProvider'
import { QueryProvider } from './app/providers/QueryProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryProvider>
        <AppRouterProvider />
      </QueryProvider>
    </AuthProvider>
  </StrictMode>,
)
