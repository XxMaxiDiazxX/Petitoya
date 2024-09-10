import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/pedidos/Item.scss'; // Asegúrate de importar el archivo SCSS correcto
import { useAuth } from '../autenticacion/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const PedidoTable = ({ pedidos }) => {  // Añadido role como prop
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const {role} = useAuth();

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
            <th>Total a Pagar</th>
            <th>Fecha de Compra</th>
            {/* Si el rol no es 1, mostramos las columnas adicionales */}
            {role !== 1 && (
              <>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Correo</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id_pedido} onClick={() => handleShowModal(pedido)} style={{ cursor: 'pointer' }}>
              <td>{pedido.id_pedido}</td>
              <td>{`$${pedido.monto_total}`}</td>
              <td>{new Date(pedido.fecha_compra).toLocaleDateString('es-ES')}</td>
              {/* Si el rol no es 1, mostramos los datos adicionales del cliente */}
              {role !== 1 && (
                <>
                  <td>{pedido.cliente_nombre}</td>
                  <td>{pedido.cliente_telefono}</td>
                  <td>{pedido.cliente_correo}</td>
                </>
              )}
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
            <div className="container mt-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">{`Pedido ID: ${selectedPedido.id_pedido}`}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text"><strong>Total a Pagar:</strong> ${selectedPedido.monto_total}</p>
                  <p className="card-text"><strong>Fecha de Compra:</strong> {new Date(selectedPedido.fecha_compra).toLocaleDateString('es-ES')}</p>

                  {/* Si el rol no es 1, mostramos los datos adicionales del cliente */}
                  {role !== 1 && (
                    <>
                      <p className="card-text"><strong>Cliente:</strong> {selectedPedido.cliente_nombre}</p>
                      <p className="card-text"><strong>Teléfono:</strong> {selectedPedido.cliente_telefono}</p>
                      <p className="card-text"><strong>Correo:</strong> {selectedPedido.cliente_correo}</p>
                    </>
                  )}

                  <h6 className="mt-4 mb-3">Productos:</h6>
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
                    <p className="text-center">Cargando detalles...</p>
                  )}
                </div>
              </div>
            </div>
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
