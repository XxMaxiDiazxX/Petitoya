import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './autenticacion/AuthContext';
import palmeraIco from '../img/palmera.png';
import FaShoppingCart from '../img/carro-de-la-compr.ico';
import '../styles/Inicio/BarraNavegacion.scss'; // Importa el archivo SASS

export const BarraNavegacion = () => {
  const { isLoggedIn, logout, role, user } = useAuth();
  const navigate = useNavigate();
  const [userNavExpanded, setUserNavExpanded] = useState(false);
  const [linksNavExpanded, setLinksNavExpanded] = useState(false);

  const EstiloCuenta = {
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#f2eddb'
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleUserNav = () => {
    setUserNavExpanded(!userNavExpanded);
    if (linksNavExpanded) setLinksNavExpanded(false); // Cierra el otro menú si está abierto
  };

  const handleToggleLinksNav = () => {
    setLinksNavExpanded(!linksNavExpanded);
    if (userNavExpanded) setUserNavExpanded(false); // Cierra el otro menú si está abierto
  };

  return (
    <>
      {/* Barra de navegación principal */}
      <Navbar expand="lg" className="bg-Barra2" variant="dark">
        <Container>

          {/* Toggle para el menú del usuario a la izquierda (solo visible en pantallas pequeñas) */}
          <Navbar.Toggle aria-controls="usuario-nav" className="d-lg-none d-xs-block" onClick={handleToggleUserNav} />

          {/* Logo en el centro */}
          <Navbar.Brand as={Link} to="/" className="mx-auto d-lg-block">
            <div className="brand-container">
              <img src={palmeraIco} height="50" alt="Palmera" />
              <p className="brand-title">Petitoya</p>
            </div>
          </Navbar.Brand>

          {/* Toggle para la navegación de links a la derecha (solo visible en pantallas pequeñas) */}
          <Navbar.Toggle aria-controls="links-nav" className="d-lg-none d-xs-block" onClick={handleToggleLinksNav}>
            <span className="text-white cuerpo">Menú</span>
          </Navbar.Toggle>

          {/* Contenido del menú del usuario */}
          <Navbar.Collapse id="usuario-nav" in={userNavExpanded}>
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="" className="mx-2" onClick={() => setUserNavExpanded(false)}>Inicio</Nav.Link>
              <Nav.Link as={Link} to="menu" className="mx-2" onClick={() => setUserNavExpanded(false)}>Menú</Nav.Link>
              {isLoggedIn && role === 1 ? (
                <Nav.Link as={Link} to="pedidos" className="mx-2" onClick={() => setUserNavExpanded(false)}>Pedidos</Nav.Link>
              ) : (
                <></>
              )}
              {isLoggedIn && role === 2 && (
                <Nav.Link as={Link} to="admin" className="mx-2" onClick={() => setUserNavExpanded(false)}>Ruta Privada Admin</Nav.Link>
              )}
              {isLoggedIn && role === 3 && (
                <Nav.Link as={Link} to="superusuario" className="mx-2" onClick={() => setUserNavExpanded(false)}>Ruta Privada Superusuario</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>

          {/* Contenido de la navegación de links a la derecha */}
          <Navbar.Collapse id="links-nav" in={linksNavExpanded} className="justify-content-end">
            <Nav className="ml-auto">
              {isLoggedIn && (
                <>
                  <Nav.Link as={Link} to="carrito" className="text-white cuerpo" onClick={() => setLinksNavExpanded(false)}>
                    <span className="d-lg-none">Carrito</span>
                    <img src={FaShoppingCart} height="40" alt="Carrito" className="d-none d-lg-block" />
                  </Nav.Link>
                  <Nav.Link as={Link} to="#action/3.2" className="d-lg-none text-white cuerpo" onClick={() => setUserNavExpanded(false)}>Configuración</Nav.Link>
                  <Nav.Link as={Link} to="#" className="d-lg-none text-white cuerpo" onClick={() => { handleLogout(); setUserNavExpanded(false); }}>Cerrar Sesión</Nav.Link>
                </>


              )}
              {isLoggedIn ? (
                <NavDropdown title={<span style={EstiloCuenta} className="d-none d-lg-inline">Bienvenido, {user.username}</span>} id="basic-nav-dropdown" className='text-white cuerpo d-none d-lg-block'>
                  <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/registro" style={EstiloCuenta} onClick={() => setLinksNavExpanded(false)}>Registro</Nav.Link>
                  <Nav.Link as={Link} to="/" style={EstiloCuenta} onClick={() => setLinksNavExpanded(false)}>Iniciar Sesión</Nav.Link>
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
