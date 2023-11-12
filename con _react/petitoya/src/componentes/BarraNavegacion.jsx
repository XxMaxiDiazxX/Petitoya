import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react';
import BasicExample from './Home';
import { Link } from 'react-router-dom';


import { Routes, Route } from 'react-router-dom'


export const BarraNavegacion = () => {
  return (
    <>

      {/* aca esta la barra de menu, con la barra de busqueda, logo y menu del usuario */}

      <Navbar expand="lg" className="bg-Barra2" style={{ height: '9%' }}>
        <Container>
          <Navbar.Brand href="#"><img src="./img/palmera.png" width="auto" height="auto" /></Navbar.Brand>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Busca Un Producto"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <NavDropdown title="cuenta" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">cuenta</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">configuracion</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">cerrar sesion</NavDropdown.Item>
          </NavDropdown>
        </Container>
      </Navbar>

      {/* aca esta la barra de navegacion con las opciones inicio, menu, pedidos */}

      <Navbar expand="lg" className="bg-Barra" data-bs-theme="light" class="">
        <Container>
          <Nav.Link><Link to='/'>inicio</Link></Nav.Link>
          <Nav.Link href="/">menu</Nav.Link>
          <Nav.Link href="#link">pedidos</Nav.Link>
        </Container>
      </Navbar>

      <Routes>
        <Route exact path="/" Component={BasicExample} />
      </Routes>


      <footer className="bg-dark text-light mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h2>Redes sociales</h2>
              <ul>
                <li><a href="">Nombre_intragram</a></li>
                <li><a href="">Nombre_intragram</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h2>Contacto</h2>
              <ul>
                <li><a href="mailto:johansebastianvelezortiz@gmail.com">johansebastianvelezortiz@gmail.com</a></li>
                <li><a href="tel:3214140078">3214140078</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h2>Nosotros</h2>
              <ul>
                <li><a href="">Misión</a></li>
                <li><a href="">Visión</a></li>
                <li><a href="">Términos y condiciones</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
