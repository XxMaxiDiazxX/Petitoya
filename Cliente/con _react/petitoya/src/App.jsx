import React from 'react'
import ReactDOM from 'react-dom/client'
import { ControladorRutas } from './ControladorRutas'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './componentes/autenticacion/AuthContext'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ControladorRutas />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
