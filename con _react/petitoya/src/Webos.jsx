import React from 'react';
import { Login } from './componentes/login';


import { Routes, Route } from 'react-router-dom'

export const Webos = () => {
    return (
        <Routes>
            <Route exact path="/" Component={Login} />            
        </Routes>
    );
}
