import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './app/providers/AuthProvider'
import { AppRouterProvider } from './app/providers/AppRouterProvider'
import { QueryProvider } from './app/providers/QueryProvider'

import { ThemeProvider } from './app/providers/themeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="chatbot-akademik-theme">
      <AuthProvider>
        <QueryProvider>
          <AppRouterProvider />
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
