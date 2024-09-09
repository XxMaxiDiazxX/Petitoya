import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../autenticacion/AuthContext";
import { Table, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Inicio/Carrito.scss";

const apiUrl = import.meta.env.VITE_API_URL;

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [totalPrecio, setTotalPrecio] = useState(0);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalPedido, setMostrarModalPedido] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const { user } = useAuth();

  const calcularTotal = (carrito) => {
    const total = carrito.reduce(
      (acc, producto) =>
        acc + producto.precio * (producto.cantidad || 0), // Por defecto, 0 si no hay cantidad
      0
    );
    setTotalPrecio(total);
  };

  useEffect(() => {
    if (user && user.id) {
      const fetchCarrito = async () => {
        try {
          const response = await axios.get(`${apiUrl}/cart/${user.id}`);
          setCarrito(response.data);
          calcularTotal(response.data); // Calcular total al cargar el carrito
        } catch (error) {
          console.error("Error fetching carrito:", error);
        }
      };

      fetchCarrito();
    }
  }, [user]);

  const handleCantidadChange = async (id_producto, cantidad) => {
    try {
      await axios.post(`${apiUrl}/cart`, {
        id_cliente: user.id,
        id_producto,
        cantidad,
      });
      const nuevoCarrito = carrito.map((item) =>
        item.id_producto === id_producto ? { ...item, cantidad } : item
      );
      setCarrito(nuevoCarrito);
      calcularTotal(nuevoCarrito); // Recalcular total al cambiar cantidad
    } catch (error) {
      console.error("Error updating cantidad:", error);
      toast.error("Error actualizando la cantidad del producto.");
    }
  };

  const handleEliminarProducto = async () => {
    try {
      await axios.delete(
        `${apiUrl}/cart/${user.id}/${productoAEliminar}`
      );
      const nuevoCarrito = carrito.filter(
        (item) => item.id_producto !== productoAEliminar
      );
      setCarrito(nuevoCarrito);
      calcularTotal(nuevoCarrito); // Recalcular total al eliminar producto
      setMostrarModalEliminar(false); // Cerrar modal
      toast.success("Producto eliminado del carrito.");
    } catch (error) {
      console.error(
        `Error eliminando producto ${productoAEliminar} del carrito:`,
        error
      );
      toast.error("Error eliminando el producto.");
    }
  };

  const confirmarEliminarProducto = (id_producto) => {
    setProductoAEliminar(id_producto);
    setMostrarModalEliminar(true); // Mostrar modal de confirmación para eliminar
  };

  const handleRealizarPedido = async () => {
    try {
      const response = await axios.post(`${apiUrl}/orders`, {
        id_cliente: user.id,
        productos: carrito,
      });

      if (response.data && response.data.id_pedido) {
        setCarrito([]);
        setTotalPrecio(0); // Resetear el total cuando el pedido sea exitoso
        toast.success("Pedido realizado con éxito.");
        setMostrarModalPedido(false); // Cerrar el modal de confirmación
      } else {
        toast.error("Error al realizar el pedido.");
      }
    } catch (error) {
      console.error("Error realizando pedido:", error);
      toast.error("Error al realizar el pedido.");
    }
  };

  const confirmarRealizarPedido = () => {
    setMostrarModalPedido(true); // Mostrar modal de confirmación para realizar pedido
  };

  if (!user) {
    return <div>Cargando...</div>; // O cualquier indicador de carga
  }

  return (
    <div className="container mt-4 carrito-container">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p className="text-center">No hay productos en el carrito.</p>
      ) : (
        <>
          {/* Vista de Escritorio */}
          <div className="d-none d-md-block">
            <Table responsive="sm" striped bordered hover className="mb-4">
              <thead className="table-header">
                <tr>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td className="d-flex align-items-center">
                      <img
                        src={`${apiUrl}/${producto.imagen}`}
                        alt={producto.nombre}
                        className="table-img"
                      />
                      <span className="ms-3">{producto.nombre}</span>
                    </td>
                    <td>{producto.descripcion}</td>
                    <td>{`$${producto.precio}`}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={producto.cantidad}
                        min="1"
                        onChange={(e) =>
                          handleCantidadChange(
                            producto.id_producto,
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn custom-button2 btn-sm"
                        onClick={() =>
                          confirmarEliminarProducto(producto.id_producto)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Vista Móvil */}
          <div className="d-block d-md-none">
            {carrito.map((producto) => (
              <div
                key={producto.id_producto}
                className="carrito-item-mobile mb-3 p-3 rounded shadow-sm"
              >
                <img
                  src={`${apiUrl}/${producto.imagen}`}
                  alt={producto.nombre}
                  className="img-fluid rounded"
                />
                <div className="mt-2">
                  <h5>{producto.nombre}</h5>
                  <p>{producto.descripcion}</p>
                  <p className="fw-bold">{`Precio: $${producto.precio}`}</p>
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={producto.cantidad}
                    min="1"
                    onChange={(e) =>
                      handleCantidadChange(
                        producto.id_producto,
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <button
                    className="btn custom-button2 btn-block btn-sm w-100"
                    onClick={() => confirmarEliminarProducto(producto.id_producto)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h4>Total: ${totalPrecio}</h4>
            <button
              className="btn custom-button1 btn-lg mt-3"
              onClick={confirmarRealizarPedido}
            >
              Realizar Pedido
            </button>
          </div>

          {/* Modal de confirmación para eliminar producto */}
          <Modal show={mostrarModalEliminar} onHide={() => setMostrarModalEliminar(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro de que deseas eliminar este producto del carrito?
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn custom-button1"
                onClick={() => setMostrarModalEliminar(false)}
              >
                Cancelar
              </button>
              <button
                className="btn custom-button2"
                onClick={handleEliminarProducto}
              >
                Confirmar eliminación
              </button>
            </Modal.Footer>
          </Modal>

          {/* Modal de confirmación para realizar pedido */}
          <Modal show={mostrarModalPedido} onHide={() => setMostrarModalPedido(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro de que deseas realizar el pedido con los productos actuales?, una vez realizado el pedido, no se podrá cancelar
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn custom-button1"
                onClick={() => setMostrarModalPedido(false)}
              >
                Cancelar
              </button>
              <button
                className="btn custom-button2"
                onClick={handleRealizarPedido}
              >
                Confirmar pedido
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Carrito;
