// Inicio.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Producto } from "./Producto";
import Carusel from "./Carusel";
import PedidoModalInicio from "./PedidoModalInicio";
import { useAuth } from "../autenticacion/AuthContext";
import "../../styles/Inicio/Inicio.scss"; // Importar los estilos SCSS


const apiUrl = 'http://localhost:3001/';


export const Inicio = () => {
  const { user } = useAuth() || { user: null };
  const [mostrarPedidoModal, setMostrarPedidoModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerProductosMenosUsados = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products/leastused');
        console.log('Respuesta del servidor:', response.data);

        if (response.data.length > 0) {
          const productosActivos = response.data.filter(producto => producto.estado !== 'inactivo');
          console.log('Productos activos:', productosActivos);
          setProductos(productosActivos.slice(0, 8)); // Limitar a 8 productos
        } else {
          console.log('No se encontraron productos.');
        }
      } catch (error) {
        console.error('Error al obtener los productos menos usados:', error);
      }
    };

    obtenerProductosMenosUsados();
  }, []);

  const handleAbrirPedidoModal = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarPedidoModal(true);
  };

  // Filtrar productos por categoría
  const productosComidas = productos.filter(producto => producto.categoria === 'Comida');
  const productosBebidas = productos.filter(producto => producto.categoria === 'Bebida');

  return (
    <>
      <div className="sugerencias container text-center">
      <Carusel/>
        <h2 className="mt-3 bg-barra3 cuerpo text-white">Sugerencias</h2>
        <div className="row">
          {/* Mostrar productos de Comidas */}
          <div className="col-12 col-lg-6 mb-4">
            <h4 className="cuerpo">Comidas</h4>
            <div className="row">
              {productosComidas.map(producto => (
                <div key={producto.id_producto} className="col-12 col-sm-6 col-md-4 col-lg-6 mb-4">
                  <Producto
                    nombre={producto.nombre}
                    descripcion={producto.descripcion}
                    precio={producto.precio}
                    imagenSrc={`${apiUrl}${producto.imagenSrc}`}
                    onClick={() => handleAbrirPedidoModal(producto)}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Mostrar productos de Bebidas */}
          <div className="col-12 col-lg-6 mb-4">
            <h4 className="cuerpo">Bebidas</h4>
            <div className="row">
              {productosBebidas.map(producto => (
                <div key={producto.id_producto} className="col-12 col-sm-6 col-md-4 col-lg-6 mb-4">
                  <Producto
                    nombre={producto.nombre}
                    descripcion={producto.descripcion}
                    precio={producto.precio}
                    imagenSrc={`${apiUrl}${producto.imagenSrc}`}
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
          id_cliente={user ? user.id : null}  // Aquí se asegura de que user y user.id estén definidos
        />
      )}
    </>
  );
};

