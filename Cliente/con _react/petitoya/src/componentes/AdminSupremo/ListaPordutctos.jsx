import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Row, Col } from 'react-bootstrap';

export const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de productos', error);
    }
  };

  const mostrarModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalShow(true);
  };

  const cerrarModal = () => {
    setModalShow(false);
  };

  const editarProducto = async (producto) => {
    // Lógica para editar el producto (puedes implementar según tu backend)
    console.log('Editar producto:', producto);
    cerrarModal();
  };

  const eliminarProducto = async (id) => {
    // Lógica para eliminar el producto (puedes implementar según tu backend)
    console.log('Eliminar producto con ID:', id);
  };

  return (
    <div className='bg-white' style={{padding: "20px"}}>
      <h2>Listado de Productos</h2>
      <Row>
        <Col>ID</Col>
        <Col>Nombre</Col>
        <Col>Descripción</Col>
        <Col>Precio</Col>
        <Col>Fecha de Creación</Col>
        <Col>Categoría</Col>
        <Col>Acciones</Col>
      </Row>
      {productos.map((producto) => (
        <Row key={producto.id_producto} className="my-2 align-items-center">
          <Col>{producto.id_producto}</Col>
          <Col>{producto.nombre}</Col>
          <Col>{producto.descripcion}</Col>
          <Col>{producto.precio}</Col>
          <Col>{producto.fecha_creacion}</Col>
          <Col>{producto.categoria}</Col>
          <Col>
            <Button variant="primary" onClick={() => mostrarModal(producto)}>
              Editar
            </Button>
            <Button variant="danger" onClick={() => eliminarProducto(producto.id_producto)}>
              Eliminar
            </Button>
          </Col>
        </Row>
      ))}

      <Modal show={modalShow} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productoSeleccionado && (
            <div>
              <p>ID: {productoSeleccionado.id_producto}</p>
              <p>Nombre: {productoSeleccionado.nombre}</p>
              <p>Descripción: {productoSeleccionado.descripcion}</p>
              <p>Precio: {productoSeleccionado.precio}</p>
              <p>Fecha de Creación: {productoSeleccionado.fecha_creacion}</p>
              <p>Categoría: {productoSeleccionado.categoria}</p>
              {/* Agrega más campos según tu estructura de datos */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => editarProducto(productoSeleccionado)}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
