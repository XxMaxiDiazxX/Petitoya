import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BarraNavegacion } from './BarraNavegacion';
import { Menu } from './menu/Menu';
import { Inicio } from './inicio/Inicio';
import { Pedidos } from './pedidos/Pedidos';
import { PieDePagina } from './PieDePagina';
import RutaPrivadaAdmin from './autenticacion/RutaPriavadaAdmin';
import PageNotFound from './error/NotFoundPage';
import Carrito from './pedidos/Carrito';
import { AgrSu } from './Administrador/AgrSu';
import OrdersManagement from './superusuario/OrdersManagement';
import io from 'socket.io-client'; // Importa Socket.IO Client
import Modal from 'react-bootstrap/Modal'; // Importa el componente Modal (React Bootstrap)
const apiUrl = import.meta.env.VITE_API_URL


// Conecta con el servidor de Socket.IO
const socket = io(`${apiUrl}`);

export const PaginaPrincipal = () => {
  const [showModal, setShowModal] = useState(false); // Estado para mostrar u ocultar el modal
  const [mensajeModal, setMensajeModal] = useState(''); // Estado para almacenar el mensaje del modal

  useEffect(() => {
    // Escucha el evento de actualización del estado del pedido
    socket.on('actualizacionEstadoPedido', (data) => {
      setMensajeModal(`¡Tu pedido está ahora en estado: ${data.estado}!`);
      setShowModal(true); // Muestra el modal cuando se recibe una actualización
    });

    // Limpieza: elimina el evento cuando el componente se desmonta
    return () => {
      socket.off('actualizacionEstadoPedido');
    };
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <BarraNavegacion />
      <div className="container flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="menu" element={<Menu />} />
          <Route path="pedidos" element={<Pedidos />}/>
          <Route path='carrito' element={<Carrito />} />
          <Route path="admin" element={<RutaPrivadaAdmin element={<AgrSu />} />} />
          <Route path='*' element={<PageNotFound />} />
          <Route path='superusuario' element={<RutaPrivadaAdmin element={<OrdersManagement />} />} />
        </Routes>
      </div>
      <PieDePagina />

      {/* Modal para notificaciones */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notificación de Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>{mensajeModal}</Modal.Body>
        <Modal.Footer>
          <button onClick={() => setShowModal(false)}>Cerrar</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
