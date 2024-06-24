import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BarraNavegacion } from './BarraNavegacion';
import { Menu } from './menu/Menu';
import { Inicio } from './inicio/Inicio';
import { Pedidos } from './pedidos/Pedidos';
import { PieDePagina } from './PieDePagina';
import RutaPrivadaAdmin from './autenticacion/RutaPriavadaAdmin';
import Admin from './AdminSupremo/Admin';
import { useAuth } from './autenticacion/AuthContext';
import PageNotFound from './error/NotFoundPage';
import Carrito from './pedidos/Carrito';
import { AgrSu } from './Administrador/AgrSu';
import ProductosMenosUsados from './inicio/prueba';


export const PaginaPrincipal = () => {

  const { isLoggedIn, logout, isAdmin, user } = useAuth();

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <BarraNavegacion />
      <div
        className="container flex-grow-1"
      >

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="menu" element={<Menu />} />
          <Route path="pedidos" element={
            isLoggedIn && isAdmin ? (
              <>
                {/* interfaz de pedidos para Admins */}
              </>
            ) : (
              <Pedidos />
            )
          }
          />
          <Route path='carrito' element={<Carrito />} />
          <Route path="admin" element={<RutaPrivadaAdmin element={<AgrSu/>} />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </div>
      <PieDePagina />
    </div>
  );
};