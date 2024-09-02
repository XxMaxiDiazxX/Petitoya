import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap

const apiUrl = import.meta.env.VITE_API_URL;

const ConsultarSuper = () => {
  const [superUsuarios, setSuperUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuperUsuarios = async () => {
      try {
        const response = await axios.get(`${apiUrl}/admin/consultar_superus`);
        setSuperUsuarios(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSuperUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar superusuarios: {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Superusuarios</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID Cliente</th>
              <th>Nombre</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Fecha Creación</th>
            </tr>
          </thead>
          <tbody>
            {superUsuarios.map((usuario) => (
              <tr key={usuario.id_cliente}>
                <td>{usuario.id_cliente}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo_electronico}</td>
                <td>{usuario.telefono}</td>
                <td>{new Date(usuario.fecha_creacion).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsultarSuper;
