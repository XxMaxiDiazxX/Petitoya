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
import { AgrSu } from "./administrador/AgrSu";
import OrdersManagement from "./superusuario/OrdersManagement";
import io from "socket.io-client"; // Importa Socket.IO Client
import { useAuth } from "./autenticacion/AuthContext";
import { ToastContainer, toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;

export const PaginaPrincipal = () => {
  const { isLoggedIn, user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      // Conectar con el servidor de Socket.IO solo si el usuario está autenticado
      const socketInstance = io(`${apiUrl}`);
      setSocket(socketInstance);

      // Unirse a la sala del usuario al conectar
      socketInstance.emit("joinRoom", user.id);

      socketInstance.on("connect", () => {
        console.log("Conectado a Socket.IO");
      });

      socketInstance.on("notificacion", (data) => {
        toast.info(data.mensaje, {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "important-toast",
        });
      });

      return () => {
        // Limpieza de eventos cuando el componente se desmonte
        socketInstance.off("connect");
        socketInstance.off("notificacion");
        socketInstance.disconnect();
      };
    } else {
      // Si no está autenticado, asegúrate de limpiar el socket si existe
      if (socket) {
        socket.off("connect");
        socket.off("notificacion");
        socket.disconnect();
      }
    }
  }, [isLoggedIn, user, socket]);

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