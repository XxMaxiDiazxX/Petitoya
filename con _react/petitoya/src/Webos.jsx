import React from 'react';
import { Login } from './componentes/login';
import BasicExample from './componentes/Home';
import { BarraNavegacion } from './componentes/BarraNavegacion';
import './styles/custom.scss'



import { Routes, Route } from 'react-router-dom'

export const Webos = () => {
    return (
        
        <Routes>
            <Route exact path="/" Component={Login} />
            <Route path="/registro" Component={BasicExample} />
            <Route path="/Inicio" Component={BarraNavegacion} /> 
        </Routes>
    );
}
