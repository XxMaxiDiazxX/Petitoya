import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';

const apiUrl = import.meta.env.VITE_API_URL;

const ConsultarSuper = () => {
  const [superUsuarios, setSuperUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

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

  const handleDelete = (id_cliente) => {
    setUsuarioAEliminar(id_cliente);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    if (usuarioAEliminar) {
      try {
        await axios.delete(`${apiUrl}/admin/eliminar_superus/${usuarioAEliminar}`);
        setSuperUsuarios(superUsuarios.filter(usuario => usuario.id_cliente !== usuarioAEliminar));
        setMostrarModalEliminar(false);
        setUsuarioAEliminar(null);
      } catch (err) {
        console.error('Error al eliminar superusuario:', err);
        alert('Error al eliminar superusuario. Por favor, inténtalo de nuevo.');
      }
    }
  };

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
      <div className="table-responsive-sm">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID Cliente</th>
              <th>Nombre</th>
              <th className="d-none d-md-table-cell">Correo Electrónico</th>
              <th className="d-none d-md-table-cell">Teléfono</th>
              <th className="d-none d-md-table-cell">Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {superUsuarios.map((usuario) => (
              <tr key={usuario.id_cliente}>
                <td>{usuario.id_cliente}</td>
                <td>{usuario.nombre}</td>
                <td className="d-none d-md-table-cell">{usuario.correo_electronico}</td>
                <td className="d-none d-md-table-cell">{usuario.telefono}</td>
                <td className="d-none d-md-table-cell">{new Date(usuario.fecha_creacion).toLocaleString()}</td>
                <td>
                  <button 
                    className="btn custom-button2 btn-sm"
                    onClick={() => handleDelete(usuario.id_cliente)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={mostrarModalEliminar} onHide={() => setMostrarModalEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este superusuario?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn custom-button1"
            onClick={() => setMostrarModalEliminar(false)}
          >
            Cancelar
          </button>
          <button
            className="btn custom-button2"
            onClick={confirmarEliminar}
          >
            Confirmar eliminación
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConsultarSuper;
