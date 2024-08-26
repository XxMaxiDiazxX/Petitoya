import React, { useState, useEffect } from "react";
import axios from "axios";
import Producto from "./Producto";
import { useAuth } from "../autenticacion/AuthContext";
import EditarProductoModal from "../AdminSupremo/EditarProductoModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/menu/Menu.scss";
import PedidoModalMenu from "./PedidoModalMenu";
import TablaProductos from "../superusuario/TablaProductos";
const apiUrl = import.meta.env.VITE_API_URL;

export const Menu = () => {
  const { isLoggedIn, role, user } = useAuth();
  const [productosActivos, setProductosActivos] = useState(true);
  const [productos, setProductos] = useState([]);
  const [productosInactivos, setProductosInactivos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPedidoModal, setMostrarPedidoModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, [productosActivos]);

  useEffect(() => {
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
      setNotification(null);
    }
  }, [notification]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`);
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
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const handleProductoDesactivado = async (idProducto) => {
    try {
      await axios.put(`${apiUrl}/products/desactivar/${idProducto}`);
      const updatedProductos = productos.filter(
        (p) => p.id_producto !== idProducto
      );
      setProductos(updatedProductos);
      setNotification({
        type: "success",
        message: "Producto desactivado exitosamente",
      });
    } catch (error) {
      console.error("Error al desactivar el producto:", error);
      setNotification({
        type: "error",
        message: "Error al desactivar el producto",
      });
    }
  };

  const handleProductoHabilitado = async (idProducto) => {
    try {
      await axios.put(`${apiUrl}/products/habilitar/${idProducto}`);
      const updatedProductosInactivos = productosInactivos.filter(
        (p) => p.id_producto !== idProducto
      );
      setProductosInactivos(updatedProductosInactivos);
      setNotification({
        type: "success",
        message: "Producto habilitado exitosamente",
      });
    } catch (error) {
      console.error("Error al habilitar el producto:", error);
      setNotification({
        type: "error",
        message: "Error al habilitar el producto",
      });
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
              {productos.map((producto) =>
                producto.categoria === "Comida" ? (
                  <div key={producto.id_producto} className="producto-item">
                    <Producto
                      nombre={producto.nombre}
                      descripcion={producto.descripcion}
                      precio={producto.precio}
                      imagenSrc={`${apiUrl}/${producto.imagenSrc}`}
                      onClick={() => handleAbrirPedidoModal(producto)}
                    />
                  </div>
                ) : null
              )}
            </div>
          </div>
          <div className="col-md-6 col-lg-6">
            <h4 className="cuerpo">Bebidas</h4>
            <div className="container mt-4">
              {productos.map((producto) =>
                producto.categoria === "Bebida" ? (
                  <div key={producto.id_producto} className="producto-item">
                    <Producto
                      nombre={producto.nombre}
                      descripcion={producto.descripcion}
                      precio={producto.precio}
                      imagenSrc={`${apiUrl}/${producto.imagenSrc}`}
                      onClick={() => handleAbrirPedidoModal(producto)}
                    />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && (role === 2 || role === 3) && (
        <TablaProductos
          productosActivos={productosActivos}
          productos={productos}
          productosInactivos={productosInactivos}
          toggleProductos={toggleProductos}
          handleAbrirEditarProductoModal={handleAbrirEditarProductoModal}
          handleProductoDesactivado={handleProductoDesactivado}
          handleProductoHabilitado={handleProductoHabilitado}
          setProductos={setProductos}
          setProductosInactivos={setProductosInactivos}
          apiUrl={apiUrl}
        />
      )}

      {mostrarModal && productoSeleccionado && (
        <EditarProductoModal
          productoSeleccionado={productoSeleccionado}
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          setProductoSeleccionado={setProductoSeleccionado}
          setNotification={setNotification}
          fetchProductos={fetchProductos} // Pasar fetchProductos aquí
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
