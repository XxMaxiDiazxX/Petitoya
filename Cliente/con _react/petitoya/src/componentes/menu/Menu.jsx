import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente de Producto (puedes mantener tu componente existente)
const Producto = ({ nombre, descripcion, precio, imagenSrc }) => (
  <div className="card mb-4 box-shadow">
    <img className="card-img-top" src={imagenSrc} alt={nombre} />
    <div className="card-body">
      <h5 className="card-title">{nombre}</h5>
      <p className="card-text">{descripcion}</p>
      <p className="card-text">{`Precio: ${precio}`}</p>
    </div>
  </div>
);

// Componente Comidas (puedes tener algo similar para Bebidas)
const Comidas = ({ productos }) => (
  <>
    {productos.map((producto, index) => (
      <Producto
        key={index}
        nombre={producto.nombre}
        descripcion={producto.descripcion}
        precio={producto.precio}
        imagenSrc={producto.imagen_url}
      />
    ))}
  </>
);

const Menu = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cambia la URL según tu entorno
    const apiUrl = '/api/productos';

    // Utiliza Axios para realizar la solicitud HTTP
    axios.get(apiUrl)
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error fetching productos:', error));
  }, []);

  const productosComidas = productos.filter(producto => producto.categoria === 'Comida');
  const productosBebidas = productos.filter(producto => producto.categoria === 'Bebida');

  return (
    <div className="sugerencias d-flex">
      <div className="comidas flex-grow-1 pr-3">
        <h4>Comidas</h4>
        <Comidas productos={productosComidas} />
      </div>
      <div className="bebidas red flex-grow-1 pr-3">
        <h4>Bebidas</h4>
        <Comidas productos={productosBebidas} />
      </div>
    </div>
  );
};

export default Menu;
