import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './autenticacion/AuthContext';
import palmeraIco from '../img/palmera.png';

export const BarraNavegacion = () => {

  const { isLoggedIn, logout, isAdmin, user } = useAuth();
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
          <Navbar.Brand href="#" className='row red'>
            <img src={palmeraIco} width="20" height="60" className='col-md red' style={{ width: '20px' }} />
            <p styles={{}} className='col-md-2'>webos</p>
          </Navbar.Brand>
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

      <Navbar expand="lg" className="bg-Barra" data-bs-theme="light">
        <Container>
          <Nav.Link as={Link} to="">inicio</Nav.Link>
          <Nav.Link as={Link} to="menu">menu</Nav.Link>
          <Nav.Link as={Link} to="pedidos">pedidos</Nav.Link>
          {isLoggedIn && isAdmin && (
            <Nav.Link as={Link} to='admin'>Ruta Privada Admin</Nav.Link>
          )}
        </Container>
      </Navbar>

    </>
  )
}
