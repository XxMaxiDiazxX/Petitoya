import React from 'react';
import { PaginaPrincipal } from './componentes/inicio';
import './styles/custom.scss';
import { Login } from './componentes/usuario/Login';
import { Registro } from './componentes/usuario/Registro';
import ValidacionToken from './componentes/usuario/ValidacionToken';
import PageNotFound from './componentes/error/NotFoundPage';
import { Routes, Route } from 'react-router-dom';
import { VerifyAndResetPassword } from './componentes/usuario/Restablecimiento';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ControladorRutas = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reset-password" element={<ValidacionToken />} />
        <Route path="/verify-code" element={<VerifyAndResetPassword />} />
        <Route path="/inicio/*" element={<PaginaPrincipal />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};
