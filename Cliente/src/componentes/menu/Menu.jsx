import React, { useState, useEffect } from "react";
import axios from "axios";
import Producto from "./Producto";
import { useAuth } from "../autenticacion/AuthContext";
import AnadirProducto from "../AdminSupremo/AnadirProducto";
import EditarProductoModal from "../AdminSupremo/EditarProductoModal";
import EliminarProducto from "../AdminSupremo/DesactivarProducto";
import HabilitarProducto from "../AdminSupremo/HabilitarProducto";
import PedidoModalMenu from "./PedidoModalMenu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/menu/Menu.scss";

const apiUrl = "http://localhost:3001/";

export const Menu = () => {
  const { isLoggedIn, role, user } = useAuth();
  const [productosActivos, setProductosActivos] = useState(true);
  const [productos, setProductos] = useState([]);
  const [productosInactivos, setProductosInactivos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPedidoModal, setMostrarPedidoModal] = useState(false);
  const [notification, setNotification] = useState(null); // Estado adicional para manejar notificaciones

  useEffect(() => {
    fetchProductos();
  }, [productosActivos]);

  useEffect(() => {
    // Mostrar la notificación si existe
    if (notification) {
      toast[notification.type](notification.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setNotification(null); // Limpiar la notificación después de mostrarla
    }
  }, [notification]); // Dependencia en `notification`

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${apiUrl}products`);
      const activos = response.data.filter(
        (producto) => producto.estado !== "inactivo"
      );
      const inactivos = response.data.filter(
        (producto) => producto.estado === "inactivo"
      );

      setProductos(activos);
      setProductosInactivos(inactivos);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const toggleProductos = (activos) => {
    setProductosActivos(activos);
  };

  const handleAbrirEditarProductoModal = (producto) => {
    console.log(producto);
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const handleProductoDesactivado = async (idProducto) => {
    try {
      await axios.put(`${apiUrl}products/desactivar/${idProducto}`);
      const updatedProductos = productos.filter(
        (p) => p.id_producto !== idProducto
      );
      setProductos(updatedProductos);
      setNotification({
        type: "success",
        message: "Producto desactivado exitosamente",
      }); // Configurar notificación
    } catch (error) {
      console.error("Error al desactivar el producto:", error);
      setNotification({
        type: "error",
        message: "Error al desactivar el producto",
      }); // Configurar notificación
    }
  };

  const handleProductoHabilitado = async (idProducto) => {
    try {
      await axios.put(`${apiUrl}products/habilitar/${idProducto}`);
      const updatedProductosInactivos = productosInactivos.filter(
        (p) => p.id_producto !== idProducto
      );
      setProductosInactivos(updatedProductosInactivos);
      setNotification({
        type: "success",
        message: "Producto habilitado exitosamente",
      }); // Configurar notificación
    } catch (error) {
      console.error("Error al habilitar el producto:", error);
      setNotification({
        type: "error",
        message: "Error al habilitar el producto",
      }); // Configurar notificación
    }
  };

  const handleAbrirPedidoModal = (producto) => {
    if (!isLoggedIn) {
      toast.info("Debes iniciar sesión para realizar un pedido.");
      return;
    }

    setProductoSeleccionado(producto);
    setMostrarPedidoModal(true);
  };

  return (
    <div className="content">
      <ToastContainer />
      {role !== 2 && role !== 3 && (
        <div className="row">
          <div className="col-md-6 col-lg-6">
            <h4 className="cuerpo">Comidas</h4>
            <div className="container mt-4">
              {productos.map(
                (producto) =>
                  producto.categoria === "Comida" && (
                    <div key={producto.id_producto} className="producto-item">
                      <Producto
                        nombre={producto.nombre}
                        descripcion={producto.descripcion}
                        precio={producto.precio}
                        imagenSrc={`${apiUrl}${producto.imagenSrc}`}
                        onClick={() => handleAbrirPedidoModal(producto)}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
          <div className="col-md-6 col-lg-6">
            <h4 className="cuerpo">Bebidas</h4>
            <div className="container mt-4">
              {productos.map(
                (producto) =>
                  producto.categoria === "Bebida" && (
                    <div key={producto.id_producto} className="producto-item">
                      <Producto
                        nombre={producto.nombre}
                        descripcion={producto.descripcion}
                        precio={producto.precio}
                        imagenSrc={`${apiUrl}${producto.imagenSrc}`}
                        onClick={() => handleAbrirPedidoModal(producto)}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && (role === 2 || role === 3) && (
        <div className="row mt-4">
          <div className="col-md-12">
            <AnadirProducto setProductos={setProductos} />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="cuerpo">Todos los Productos</h4>
              <div
                className="btn-group"
                role="group"
                aria-label="Opciones de productos"
              >
                <button
                  type="button"
                  className={`btn ${
                    productosActivos ? "custom-button" : "btn-secondary"
                  }`}
                  onClick={() => toggleProductos(true)}
                >
                  Activos
                </button>
                <button
                  type="button"
                  className={`btn ${
                    !productosActivos ? "custom-button" : "btn-secondary"
                  }`}
                  onClick={() => toggleProductos(false)}
                >
                  Inactivos
                </button>
              </div>
            </div>

            <table className="table table-striped mt-4">
              <thead>
                <tr>
                  <th scope="col">Imagen</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(productosActivos ? productos : productosInactivos).map(
                  (producto) => (
                    <tr key={producto.id_producto}>
                      <td>
                        <img
                          src={`${apiUrl}${producto.imagenSrc}`}
                          alt={producto.nombre}
                          className="table-img"
                        />
                      </td>
                      <td>{producto.nombre}</td>
                      <td>{producto.descripcion}</td>
                      <td>{producto.precio}</td>
                      <td>
                        {productosActivos ? (
                          <>
                            <button
                              className="btn btn-primary me-2 custom-button1"
                              onClick={() =>
                                handleAbrirEditarProductoModal(producto)
                              }
                            >
                              Editar
                            </button>
                            <EliminarProducto
                              id_producto={producto.id_producto}
                              setProductos={setProductos}
                              onProductoEliminado={handleProductoDesactivado}
                            />
                          </>
                        ) : (
                          <HabilitarProducto
                            id_producto={producto.id_producto}
                            setProductos={setProductosInactivos}
                            onProductoHabilitado={handleProductoHabilitado}
                          />
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mostrarModal && productoSeleccionado && (
        <EditarProductoModal
          productoSeleccionado={productoSeleccionado}
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          setProductoSeleccionado={setProductoSeleccionado}
          setNotification={setNotification}
        />
      )}

      {mostrarPedidoModal && productoSeleccionado && (
        <PedidoModalMenu
          producto={productoSeleccionado}
          mostrarModal={mostrarPedidoModal}
          setMostrarModal={setMostrarPedidoModal}
          id_cliente={isLoggedIn ? user.id : null}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default Menu;
