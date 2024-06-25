import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/pedidos/Item.scss'; // Asegúrate de importar el archivo SCSS correcto

const Pedido = ({ id_pedido, estado, fecha_compra, total_pagar }) => {
  const [showModal, setShowModal] = useState(false);
  const [detalles, setDetalles] = useState([]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options); // Ajusta 'es-ES' según tu localización
  };

  const fetchDetalles = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/orders/detalles/${id_pedido}`);
      setDetalles(response.data);
    } catch (error) {
      console.error('Error fetching detalles:', error);
    }
  };

  const handleShowModal = () => {
    fetchDetalles();
    setShowModal(true);
  };

  return (
    <div className="card custom-card">
      <div className="card-body">
        <h5 className="card-title">{`Pedido ID: ${id_pedido}`}</h5>
        <p className="card-text">{`Estado: ${estado}`}</p>
        <p className="card-text">{`Total a Pagar: $${total_pagar}`}</p> {/* Mostrar total a pagar */}
        <p className="card-text">{`Fecha de Compra: ${formatDate(fecha_compra)}`}</p>
        <div className="btn-group mt-2">
          <Button variant="primary" onClick={handleShowModal}>
            Ver Detalles
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>{`Pedido ID: ${id_pedido}`}</h5>
          <p>{`Estado: ${estado}`}</p>
          <p >{`Total a Pagar: $${total_pagar}`}</p>
          <p>{`Fecha de Compra: ${formatDate(fecha_compra)}`}</p>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Pedido;
