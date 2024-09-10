import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import imagen1 from '../../img/error/fondo.jpg'; // Imagen por defecto

const apiUrl = import.meta.env.VITE_API_URL;

const Carusel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products/obtenercarru`);
        console.log('Datos obtenidos:', response.data);
        setItems(response.data);
      } catch (error) {
        console.error('Error al obtener los ítems del carrusel:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselItems();
  }, []);

  if (loading) return <p>Loading...</p>;

  // Mostrar imagen predeterminada en caso de error
  if (error || items.length === 0) {
    return (
      <Carousel className="carusel align-items-md-center p-2">
        <Carousel.Item className="carusel">
          <img src={imagen1} alt="No items" className="d-block w-100" />
          <Carousel.Caption className="carousel-caption-dark">
            <h3>No hay ítems en el carrusel</h3>
            <p>Por favor, añada ítems al carrusel.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
  }

  return (
    <Carousel className="carusel align-items-md-center p-2">
      {items.map(item => (
        <Carousel.Item key={item.id} className="carusel">
          <img src={`${apiUrl}${item.imagenRuta}`} alt={item.titulo} className="d-block w-100" />
          <Carousel.Caption className="carousel-caption-dark">
            <h3>{item.titulo}</h3>
            <p>{item.descripcion}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Carusel;
