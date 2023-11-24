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

  const EstiloCuenta = {
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#f2eddb'
  }

  return (
    <>
      {/* aca esta la barra de menu, con la barra de busqueda, logo y menu del usuario */}

      <Navbar expand="lg" className="bg-Barra2" style={{ height: '9%' }}>
        <Container>
          <Navbar.Brand href="#">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={palmeraIco} height="50" className='red' style={{ width: '70px' }} alt="Palmera" />
              <p style={{ margin: 0, marginLeft: '10px', fontSize: '30px', fontWeight: 'bold' }} className='texto-titulo cuerpo'>Petitoya</p>
            </div>
          </Navbar.Brand>
          {isLoggedIn ? (
            <NavDropdown title={<span style={EstiloCuenta}>Bienvenido, {user.username}</span>} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.2">Configuración</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav>
              <Nav.Link as={Link} to="/registro" style={EstiloCuenta}>Registro</Nav.Link>
              <Nav.Link as={Link} to="/" style={EstiloCuenta}>Iniciar Sesión</Nav.Link>
            </Nav>
          )}
        </Container>
      </Navbar>

      {/* aca esta la barra de navegacion con las opciones inicio, menu, pedidos */}

      <Navbar expand="lg" className="bg-barra3" data-bs-theme="light">
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
