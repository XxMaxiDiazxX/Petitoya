import React from 'react'
import ReactDOM from 'react-dom/client'
// import { App } from './App'
// import Login from './componentes/login'
import { Webos } from './Webos'
import { BrowserRouter } from 'react-router-dom'
//import './styles/custom.scss'
import { AuthProvider } from './componentes/autenticacion/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Webos />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
