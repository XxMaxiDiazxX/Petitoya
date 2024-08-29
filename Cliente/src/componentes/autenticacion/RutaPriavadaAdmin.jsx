import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RutaPrivadaAdmin = ({ element }) => {
  const { isLoggedIn, role } = useAuth();

  // Verificación de estado inicial
  if (isLoggedIn === null || role === null) {
    // Mostrar un componente de carga o un estado inicial mientras se recuperan los datos
    return <div>Cargando...</div>;
  }

  // Verificar si el usuario está autenticado y es un administrador
  if (!isLoggedIn || !(role === 3 || role === 2)) {
    // Redirigir al inicio si el usuario no está autenticado o no tiene el rol adecuado
    return <Navigate to="/" />;
  }

  // Si el usuario está autenticado y tiene el rol adecuado, mostrar el componente
  return element;
};

export default RutaPrivadaAdmin;
