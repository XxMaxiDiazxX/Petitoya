import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react'
import Login from './login';
import {Link } from 'react-router-dom';


export const BarraNavegacion = () => {
  return (
    <>
      <Navbar expand="lg" className="bg-custom-color" data-bs-theme="light" class="">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <switch>
                <Nav.Link href="./login.jsx">inicio</Nav.Link>
                <Nav.Link href="#link">menu</Nav.Link>
                <Nav.Link href="#link">pedidos</Nav.Link>
              </switch>
              <NavDropdown title="cuenta" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">cuenta</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  configuracion
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">cerrar sesion</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
        <Navbar expand="lg" className="bg-custom-color" data-bs-theme="light" class="">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link><Link to='/'>inicio</Link></Nav.Link>
                <Nav.Link href="/">menu</Nav.Link>
                <Nav.Link href="#link">pedidos</Nav.Link>
                <NavDropdown title="cuenta" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">cuenta</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    configuracion
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">cerrar sesion</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    </>
  )
}