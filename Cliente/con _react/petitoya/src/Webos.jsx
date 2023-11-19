import React from 'react';
import BasicExample from './componentes/Home';
import { BarraNavegacion } from './componentes/BarraNavegacion';
import './styles/custom.scss'
import {Login} from './componentes/Login';



import { Routes, Route } from 'react-router-dom'

export const Webos = () => {
    return (
        
        <Routes>
            <Route exact path="/" Component={Login} />
            <Route path="/registro" Component={BasicExample} />
            <Route path="inicio/*" Component={BarraNavegacion} /> 
        </Routes>
    );
}
