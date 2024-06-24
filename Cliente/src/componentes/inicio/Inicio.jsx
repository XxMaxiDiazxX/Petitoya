import React, { useState, useEffect } from "react";
import axios from "axios";
import { Producto } from "./Producto";
import palmera from '../../img/inicioSesion/fondo.png';
import PedidoModalInicio from "./PedidoModalInicio";
import { useAuth } from "../autenticacion/AuthContext";

export const Inicio = () => {
  const { user } = useAuth();
  const [mostrarPedidoModal, setMostrarPedidoModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const obtenerProductosMenosUsados = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products/leastused');
        console.log('Respuesta del servidor:', response.data);

        if (response.data.length > 0) {
          const productosActivos = response.data.filter(producto => producto.estado !== 'inactivo');
          setProductos(productosActivos);
          setMensaje(`Se encontraron ${productosActivos.length} productos.`);
        } else {
          setMensaje('No se encontraron productos.');
        }
      } catch (error) {
        console.error('Error al obtener los productos menos usados:', error);
        setMensaje('Error interno del servidor.');
      }
    };

    obtenerProductosMenosUsados();
  }, []);

  const handleAbrirPedidoModal = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarPedidoModal(true);
  };

  const productosComidas = productos.filter(producto => producto.categoria === 'Comida');
  const productosBebidas = productos.filter(producto => producto.categoria === 'Bebida');

  return (
    <>
      <div className="MenuDelDia" style={{ height: "200px" }}>
        <img src={palmera} alt="" />
        <h1>Comida del Día</h1>
        <p>
          Disfruta de nuestra deliciosa comida del día, cuidadosamente preparada por nuestros chefs para satisfacer tus papilas gustativas. Nuestra comida del día incluye una variedad de opciones frescas y deliciosas que seguramente te encantarán. ¡No te lo pierdas!
        </p>
      </div>
      <div className="sugerencias container text-center">
        <h2 className="mt-3 bg-barra3 cuerpo text-white">Sugerencias</h2>
        <div className="row">
          <div className="comidas col-md-6">
            <h4 className="cuerpo">Comidas</h4>
            <div className="row">
              {productosComidas.map(producto => (
                <div key={producto.id_producto} className="col-6">
                  <Producto
                    nombre={producto.nombre}
                    descripcion={producto.descripcion}
                    precio={producto.precio}
                    imagenSrc={`data:image/jpeg;base64,${producto.imagenBase64}`}
                    onClick={() => handleAbrirPedidoModal(producto)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="comidas col-md-6">
            <h4 className="cuerpo">Bebidas</h4>
            <div className="row">
              {productosBebidas.map(producto => (
                <div key={producto.id_producto} className="col-6">
                  <Producto
                    nombre={producto.nombre}
                    descripcion={producto.descripcion}
                    precio={producto.precio}
                    imagenSrc={`data:image/jpeg;base64,${producto.imagenBase64}`}
                    onClick={() => handleAbrirPedidoModal(producto)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {mostrarPedidoModal && productoSeleccionado && (
        <PedidoModalInicio
          producto={productoSeleccionado}
          mostrarModal={mostrarPedidoModal}
          setMostrarModal={setMostrarPedidoModal}
          id_cliente={user.id}
        />
      )}
      {mensaje && <p>{mensaje}</p>}
    </>
  );
};

export default Inicio;
