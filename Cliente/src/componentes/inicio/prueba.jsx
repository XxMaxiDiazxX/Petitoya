import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductosMenosUsados = () => {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const obtenerProductosMenosUsados = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products/leastused');
        console.log('Respuesta del servidor:', response.data);

        if (response.data.length > 0) {
          setProductos(response.data);
          setMensaje(`Se encontraron ${response.data.length} productos.`);
        } else {
          setMensaje('No se encontraron productos menos usados.');
        }
      } catch (error) {
        console.error('Error al obtener los productos menos usados:', error);
        setMensaje('Error interno del servidor.');
      }
    };

    obtenerProductosMenosUsados();
  }, []);

  return (
    <div className="productos-menos-usados">
      <h2>Productos Menos Usados</h2>
      <ul>
        {productos.map(producto => (
          <li key={producto.id_producto}>
            <strong>{producto.nombre}</strong> - {producto.descripcion} - {producto.precio} - {producto.categoria}
          </li>
        ))}
      </ul>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default ProductosMenosUsados;
