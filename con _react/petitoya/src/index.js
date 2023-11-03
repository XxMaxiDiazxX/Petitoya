import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#root')
);


// import React from 'react'
// import ReactDOM from 'react-dom/client'
// // import { Hola } from './componentes/Hola'
// import { Webos } from './Webos'
// // import App from './App'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     {/* <Hola /> */}
//     <Webos />
//     {/* <App/> */}
//   </React.StrictMode>,
// )