import React, { useState, useEffect } from "react";
import axios from "axios";
import { Producto } from "./Producto";
import palmera from '../../img/inicioSesion/fondo.png';
import PedidoModalInicio from "./PedidoModalInicio";
import { useAuth } from "../autenticacion/AuthContext";
import "../../styles/Inicio/Inicio.scss"; // Importar los estilos SCSS

export const Inicio = () => {
  const { user } = useAuth();
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
        setMensaje('Error interno del servidor.');
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

  console.log('Productos Comidas:', productosComidas);
  console.log('Productos Bebidas:', productosBebidas);

  return (
    <>
    <div id="carouselExampleCaptions" class="carousel slide">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="carousel-caption d-none d-md-block">
            <h5>First slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-caption d-none d-md-block">
            <h5>Second slide label</h5>
            <p>Some representative placeholder content for the second slide.</p>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-caption d-none d-md-block">
            <h5>Third slide label</h5>
            <p>Some representative placeholder content for the third slide.</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
      <div className="sugerencias container text-center">
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
                    imagenSrc={`data:image/jpeg;base64,${producto.imagenBase64}`}
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
    </>
  );
};

export default Inicio;
