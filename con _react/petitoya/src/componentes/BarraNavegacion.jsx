import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react'
import Login from './login';
import { Link } from 'react-router-dom';

export const BarraNavegacion = () => {
  return (
    <>

    {/* aca esta la barra de menu, con la barra de busqueda, logo y menu del usuario */}

    <Navbar expand="lg" className="bg-Barra2">
      <Container>
        <Navbar.Brand href="#"><img src="../img/palmera.png" width="auto" height="auto" class="d-inline-block align-text-top"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
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
              <NavDropdown.Item href="#action/3.2">
                configuracion
              </NavDropdown.Item>
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
    </>
  )
}
