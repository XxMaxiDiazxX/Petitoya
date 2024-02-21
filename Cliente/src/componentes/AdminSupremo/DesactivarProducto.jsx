import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

const EliminarProducto = ({ id_producto, onProductoEliminado, setProductos }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  // Modifica la función para desactivar un producto
  const handleDesactivarProducto = async (idProducto) => {
    try {
      // Enviar solicitud PUT al servidor para desactivar el producto
      await axios.put(`http://localhost:3001/productos/desactivar/${idProducto}`);

      // Actualiza la lista de productos después de desactivar
      const response = await axios.get('http://localhost:3001/productos');
      setProductos(response.data);

      // Llama a la función onProductoEliminado para notificar al componente padre
      onProductoEliminado(idProducto);

      console.log('Producto desactivado exitosamente');
    } catch (error) {
      console.error('Error al desactivar el producto', error);
    }
  };

  return (
    <>
      <button className="btn btn-danger" onClick={() => setMostrarModal(true)}>
        Eliminar Producto
      </button>

      {/* Modal de confirmación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este producto?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={() => handleDesactivarProducto(id_producto)}>
            Confirmar Desactivacion
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EliminarProducto;