import React from 'react';
import { PaginaPrincipal } from './componentes/inicio';
import './styles/custom.scss'
import { Login } from './componentes/Usuario/Login';
import { Registro } from './componentes/Usuario/Registro';
import { ResetPassword } from './componentes/Usuario/cambiarContrasena';
import PageNotFound from './componentes/error/NotFoundPage';
import { Routes, Route } from 'react-router-dom'



export const ControladorRutas = () => {
    return (
        <Routes>
            <Route exact path="/" Component={Login} />
            <Route path="/registro" Component={Registro} />
            <Route path="/reset-password" Component={ResetPassword} />
            <Route path="/inicio/*" Component={PaginaPrincipal} />
            <Route path='*' Component={PageNotFound} />
        </Routes>
    );
}
