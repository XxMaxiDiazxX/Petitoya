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


export const PaginaPrincipal = () => {

  const { isLoggedIn, logout, isAdmin, user } = useAuth();

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <BarraNavegacion />
      <div className="container flex-grow-1">
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
          <Route path="admin" element={<RutaPrivadaAdmin element={<Admin />} />} />
        </Routes>
      </div>
      <PieDePagina />
    </div>
  );
};