import React from 'react';
import { PaginaPrincipal } from './componentes/inicio';
import './styles/custom.scss';
import { Login } from './componentes/Usuario/Login';
import { Registro } from './componentes/Usuario/Registro';
import ValidacionToken from './componentes/Usuario/ValidacionToken';
import PageNotFound from './componentes/error/NotFoundPage';
import { Routes, Route } from 'react-router-dom';
import { VerifyAndResetPassword } from './componentes/Usuario/Restablecimiento';

export const ControladorRutas = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/reset-password" element={<ValidacionToken />} />
      <Route path="/verify-code" element={<VerifyAndResetPassword />} />
      <Route path="/inicio/*" element={<PaginaPrincipal />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};