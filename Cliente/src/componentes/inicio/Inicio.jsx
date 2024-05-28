
import { Producto } from "./Producto";
import palmera from '../../img/inicioSesion/fondo.png';
import { useState } from "react";

export const Inicio = () => {

  const [mostrarPedidoModal, setMostrarPedidoModal] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);


  // FALTA MOSTRAR LOS PRODUCTOS POR ESTADISTICA PERO SE NECESITA MODIFICAR LA BASE DE DATOS

  const handleAbrirPedidoModal = (producto) => {
    setMostrarPedidoModal(true);
    setProductoSeleccionado(producto);
  };

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
              {productos.map(producto => (
                producto.categoria === 'Comida' && producto.estado !== 'inactivo' && (
                  <div key={producto.id_producto}>
                    <Producto
                      nombre={producto.nombre}
                      descripcion={producto.descripcion}
                      precio={producto.precio}
                      imagenSrc={`data:image/jpeg;base64,${producto.imagenBase64}`}
                      onClick={() => handleAbrirPedidoModal(producto)}
                    />
                  </div>
                )
              ))}

            </div>
          </div>
          <div className="comidas col-md-6">
            <h4 className="cuerpo">Bebidas</h4>
            <div className="row">
              <Producto imagenSrc={palmera} descripcion="Café gourmet El mejor café 250g" precio="$ 12.000" onClick={() => handleAbrirPedidoModal(producto)} />
              <Producto imagenSrc={palmera} descripcion="Té verde Fuente de antioxidantes 100g" precio="$ 10.000" onClick={() => handleAbrirPedidoModal(prodcuto)}/>
              {/* Agrega más productos según sea necesario */}
            </div>
          </div>
        </div>
      </div>
      {mostrarPedidoModal && productoSeleccionado && (
        <PedidoModal
          producto={productoSeleccionado}
          mostrarModal={mostrarPedidoModal}
          setMostrarModal={setMostrarPedidoModal}
        />
      )}
    </>
  )
};
