import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/pedidos/Item.scss'; // Asegúrate de importar el archivo SCSS correcto

const apiUrl = import.meta.env.VITE_API_URL;

const PedidoTable = ({ pedidos }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detalles, setDetalles] = useState([]);

  const fetchDetalles = async (id_pedido) => {
    try {
      const response = await axios.get(`${apiUrl}/orders/detalles/${id_pedido}`);
      setDetalles(response.data);
    } catch (error) {
      console.error('Error fetching detalles:', error);
    }
  };

  const handleShowModal = (pedido) => {
    fetchDetalles(pedido.id_pedido);
    setSelectedPedido(pedido);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDetalles([]);
  };

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Estado</th>
            <th>Total a Pagar</th>
            <th>Fecha de Compra</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id_pedido} onClick={() => handleShowModal(pedido)} style={{ cursor: 'pointer' }}>
              <td>{pedido.id_pedido}</td>
              <td>{pedido.estado}</td>
              <td>{`$${pedido.monto_total}`}</td>
              <td>{new Date(pedido.fecha_compra).toLocaleDateString('es-ES')}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedPedido && (
        <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{`Pedido ID: ${selectedPedido.id_pedido}`}</h5>
            <p>{`Estado: ${selectedPedido.estado}`}</p>
            <p>{`Total a Pagar: $${selectedPedido.monto_total}`}</p>
            <p>{`Fecha de Compra: ${new Date(selectedPedido.fecha_compra).toLocaleDateString('es-ES')}`}</p>
            <h6>Productos:</h6>
            {detalles.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.nombre}</td>
                      <td>{detalle.descripcion}</td>
                      <td>{`$${detalle.precio}`}</td>
                      <td>{detalle.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Cargando detalles...</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default PedidoTable;
