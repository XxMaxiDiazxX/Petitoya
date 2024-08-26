import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import imagen1 from '../../img/error/fondo.jpg';
const apiUrl = import.meta.env.VITE_API_URL;

const Carusel = () => {
  return (
    <Carousel className="carusel align-items-md-center p-2">
      <Carousel.Item className="carusel">
        <img className="" src={imagen1} alt="First slide" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item  className="carusel">
        <img className="" src={imagen1} alt="Second slide" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item  className="carusel">
        <img className="" src={imagen1} alt="Third slide" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Carusel;