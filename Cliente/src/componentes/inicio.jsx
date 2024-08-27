import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { BarraNavegacion } from "./BarraNavegacion";
import { Menu } from "./menu/Menu";
import { Inicio } from "./inicio/Inicio";
import { Pedidos } from "./pedidos/Pedidos";
import { PieDePagina } from "./PieDePagina";
import RutaPrivadaAdmin from "./autenticacion/RutaPriavadaAdmin";
import PageNotFound from "./error/NotFoundPage";
import Carrito from "./pedidos/Carrito";
import { AgrSu } from "./Administrador/AgrSu";
import OrdersManagement from "./superusuario/OrdersManagement";
import io from "socket.io-client"; // Importa Socket.IO Client
import { useAuth } from "./autenticacion/AuthContext";
import { ToastContainer, toast } from "react-toastify";



const apiUrl = import.meta.env.VITE_API_URL;

// Conecta con el servidor de Socket.IO
const socket = io(`${apiUrl}`);

export const PaginaPrincipal = () => {
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      // Unirse a la sala del usuario al conectar
      socket.emit('joinRoom', user.id);
  
      socket.on('connect', () => {
        console.log('Conectado a Socket.IO');
      });
  
      socket.on('notificacion', (data) => {
        toast.info(data.mensaje, {
          position: 'top-right',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  
      return () => {
        // Limpieza de eventos cuando el componente se desmonte
        socket.off('connect');
        socket.off('notificacion');
      };
    } else {
      // Si no está autenticado, puedes limpiar eventos o manejar casos específicos para invitados
      socket.off('connect');
      socket.off('notificacion');
    }
  }, [isLoggedIn]);
  
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <BarraNavegacion />
      <div className="container flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="menu" element={<Menu />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="carrito" element={<Carrito />} />
          <Route
            path="admin"
            element={<RutaPrivadaAdmin element={<AgrSu />} />}
          />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="superusuario"
            element={<RutaPrivadaAdmin element={<OrdersManagement />} />}
          />
        </Routes>
      </div>
      <PieDePagina />
      
      {/* ToastContainer para notificaciones */}
      <ToastContainer />
    </div>
  );
};
