import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BarraNavegacion } from './BarraNavegacion';
import { Menu } from './menu/Menu';
import { Inicio } from './inicio/Inicio';
import { Pedidos } from './pedidos/Pedidos';
import { PieDePagina } from './PieDePagina';
import RutaPrivadaAdmin from './autenticacion/RutaPriavadaAdmin';
import Admin from './AdminSupremo/Admin';

export const PaginaPrincipal = () => {
  return (
    <div>
      <BarraNavegacion />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="menu" element={<Menu />} />
              <Route path="pedidos" element={<Pedidos />} />
              <Route path="admin" element={<RutaPrivadaAdmin element={<Admin />} />} />
            </Routes>
          </div>
        </div>
      </div>
      <PieDePagina className="mt-5" />
    </div>
  );
};
