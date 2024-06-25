import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import imagen1 from '../../img/error/fondo.jpg';
const apiUrl = 'http://localhost:3001/';

const Carusel = () => {
  return (
    <Carousel className="carousel-container">
      <Carousel.Item>
        <img className="carousel-item-image" src={imagen1} alt="First slide" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="carousel-item-image" src={imagen1} alt="Second slide" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="carousel-item-image" src={imagen1} alt="Third slide" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Carusel;