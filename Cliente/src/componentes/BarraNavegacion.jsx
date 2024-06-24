import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './autenticacion/AuthContext';
import palmeraIco from '../img/palmera.png';
import FaShoppingCart from '../img/carro-de-la-compra.ico';
import '../styles/Inicio/BarraNavegacion.scss'; // Importa el archivo SASS

export const BarraNavegacion = () => {
  const { isLoggedIn, logout, role, user } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false); // Estado para mostrar/ocultar el menú desplegable

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const EstiloCuenta = {
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#f2eddb'
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      {/* Barra de navegación principal */}
      <Navbar expand="lg" className="bg-Barra2" variant="dark">
        <Container>
          {/* Menú del usuario a la izquierda (solo visible en pantallas pequeñas) */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-lg-none d-xs-block">
            <span className="text-white cuerpo">Menú</span>
          </Navbar.Toggle>
          {/* Logo en el centro */}
          <Navbar.Brand as={Link} to="/" className="mx-auto d-lg-block d-xs-none">
            <div className="brand-container">
              <img src={palmeraIco} height="50" alt="Palmera" />
              <p className="brand-title">Petitoya</p>
            </div>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="secondary-navbar-nav" className="d-lg-none d-xs-block" />
          <Navbar.Collapse id="secondary-navbar-nav">
            <Nav className="ml-auto d-flex justify-content-center w-100">
              <Nav.Link as={Link} to="" className="mx-2">Inicio</Nav.Link>
              <Nav.Link as={Link} to="menu" className="mx-2">Menú</Nav.Link>
              {isLoggedIn && (
                <Nav.Link as={Link} to="pedidos" className="mx-2">Pedidos</Nav.Link>
              )}
              {isLoggedIn && role === 2 && (
                <Nav.Link as={Link} to="/admin" className="mx-2">Ruta Privada Admin</Nav.Link>
              )}
              {isLoggedIn && role === 3 && (
                <Nav.Link as={Link} to="/superusuario" className="mx-2">Ruta Privada Superusuario</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>


          {/* Navegación de links a la derecha */}
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center">
              {isLoggedIn && (
                <Nav.Link as={Link} to="carrito" className="text-white cuerpo">
                  <img src={FaShoppingCart} height="40" alt="Carrito" />
                </Nav.Link>
              )}
              {isLoggedIn ? (
                <NavDropdown title={<span style={EstiloCuenta}>Bienvenido, {user.username}</span>} id="basic-nav-dropdown" className='text-white cuerpo'>
                  <NavDropdown.Item href="#action/3.2">Configuración</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/registro" style={EstiloCuenta}>Registro</Nav.Link>
                  <Nav.Link as={Link} to="/" style={EstiloCuenta}>Iniciar Sesión</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>


        </Container>
      </Navbar>
    </>
  );
};

export default BarraNavegacion;
