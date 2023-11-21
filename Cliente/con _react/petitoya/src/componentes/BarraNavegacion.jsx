import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react';
import { Inicio } from './Product/Inicio';

import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Menu } from './menu/Menu';
import { useAuth } from './autenticacion/AuthContext';



export const BarraNavegacion = () => {

  const { isLoggedIn, logout, user} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };


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
          {isLoggedIn ? (
            <NavDropdown title="Cuenta" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Bienvenido, {user.username}</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Configuración</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <NavDropdown title="Cuenta" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/">Iniciar Sesión</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/registro">Registro</NavDropdown.Item>
            </NavDropdown>
          )}
        </Container>
      </Navbar>

      {/* aca esta la barra de navegacion con las opciones inicio, menu, pedidos */}

      <Navbar expand="lg" className="bg-Barra" data-bs-theme="light" >
        <Container>
          <Nav.Link as={Link} to=''>inicio</Nav.Link>
          <Nav.Link as={Link} to='menu'>menu</Nav.Link>
          <Nav.Link href="#link">pedidos</Nav.Link>
        </Container>
      </Navbar>

      <Routes>
        <Route exaxt path="/" Component={Inicio} />
        <Route path="menu" Component={Menu} />
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
