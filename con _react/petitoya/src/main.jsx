import React from 'react'
import ReactDOM from 'react-dom/client'
// import { App } from './App'
// import Login from './componentes/login'
import { Webos } from './Webos'
import { BrowserRouter } from 'react-router-dom'
//import './styles/custom.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Webos />
    </BrowserRouter>
  </React.StrictMode>,
)
