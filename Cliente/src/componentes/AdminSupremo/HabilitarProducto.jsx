import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const HabilitarProducto = ({ id_producto, onProductoHabilitado, setProductos }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para habilitar un producto
  const handleHabilitarProducto = async (idProducto) => {
    try {
      // Enviar solicitud PUT al servidor para habilitar el producto
      await axios.put(`http://localhost:3001/products/habilitar/${idProducto}`);

      // Actualiza la lista de productos después de habilitar
      const response = await axios.get('http://localhost:3001/products');
      setProductos(response.data);

      // Llama a la función onProductoHabilitado para notificar al componente padre
      onProductoHabilitado(idProducto);

      console.log('Producto habilitado exitosamente');
    } catch (error) {
      console.error('Error al habilitar el producto', error);
    }
  };

  return (
    <>
      <button className="btn btn-success custom-button1" onClick={() => setMostrarModal(true)}>
        Habilitar Producto
      </button>

      {/* Modal de confirmación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Habilitación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas habilitar este producto?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={() => handleHabilitarProducto(id_producto)}>
            Confirmar Habilitación
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HabilitarProducto;
