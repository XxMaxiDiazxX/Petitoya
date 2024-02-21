import React from 'react';
import { PaginaPrincipal } from './componentes/inicio';
import './styles/custom.scss'
import { Login } from './componentes/Login';
import { Registro } from './componentes/Registro';


import { Routes, Route } from 'react-router-dom'



export const ControladorRutas = () => {
    return (
        <Routes>
            <Route exact path="/" Component={Login} />
            <Route path="/registro" Component={Registro} />
            <Route path="/inicio/*" Component={PaginaPrincipal} />
        </Routes>
    );
}