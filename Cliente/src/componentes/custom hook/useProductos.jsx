import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const apiUrl = 'http://localhost:3001/';

const useProductos = (productosActivos) => {
  const [productos, setProductos] = useState([]);
  const [productosInactivos, setProductosInactivos] = useState([]);

  const fetchProductos = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}products`);
      const activos = response.data.filter(
        (producto) => producto.estado !== 'inactivo'
      );
      const inactivos = response.data.filter(
        (producto) => producto.estado === 'inactivo'
      );

      setProductos(activos);
      setProductosInactivos(inactivos);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [productosActivos, fetchProductos]);

  const desactivarProducto = useCallback(async (idProducto) => {
    try {
      await axios.put(`${apiUrl}products/desactivar/${idProducto}`);
      setProductos((prev) =>
        prev.filter((producto) => producto.id_producto !== idProducto)
      );
    } catch (error) {
      console.error('Error al desactivar el producto:', error);
    }
  }, []);

  const habilitarProducto = useCallback(async (idProducto) => {
    try {
      await axios.put(`${apiUrl}products/habilitar/${idProducto}`);
      setProductosInactivos((prev) =>
        prev.filter((producto) => producto.id_producto !== idProducto)
      );
    } catch (error) {
      console.error('Error al habilitar el producto:', error);
    }
  }, []);

  return {
    productos,
    productosInactivos,
    desactivarProducto,
    habilitarProducto
  };
};

export default useProductos;
