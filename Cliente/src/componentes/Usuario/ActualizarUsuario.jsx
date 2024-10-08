import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAuth } from '../autenticacion/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const ActualizarUsuario = () => {
  const { user, updateUser } = useAuth(); // Obtén el usuario y la función de actualización del contexto
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    nombre: '',
    apellido: '',
    correo_electronico: '',
    telefono: ''
  });
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false); // Nuevo estado para el modal

  // Obtén los datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const response = await axios.get(`${apiUrl}/auth/consultar-user-id/${user.id}`);
          console.log(response);
          setInitialValues({
            nombre: response.data.nombre || '',
            apellido: response.data.apellido || '',
            correo_electronico: response.data.correo_electronico || '',
            telefono: response.data.telefono || ''
          });
        } catch (error) {
          toast.error('Error al obtener los datos del usuario');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user?.id]);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un nombre válido').required('Campo requerido'),
    apellido: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un apellido válido').required('Campo requerido'),
    correo_electronico: Yup.string().email('Ingrese un correo electrónico válido').required('Campo requerido'),
    telefono: Yup.string().matches(/^[0-9]+$/, 'Ingrese un teléfono válido').required('Campo requerido'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setMostrarModalConfirmacion(true); // Muestra el modal de confirmación en lugar de actualizar directamente
  };

  const handleConfirmarActualizacion = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const response = await axios.put(`${apiUrl}/auth/actualizar-usuario/${user.id}`, initialValues);
        console.log("Response:", response);
        updateUser({ ...user, ...initialValues });
        toast.success('Usuario actualizado exitosamente');
        setMostrarModalConfirmacion(false); // Cierra el modal después de la actualización
      } else {
        toast.error('ID de usuario no disponible');
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error al actualizar el usuario: ${error.response.data.message || error.message}`);
      } else {
        toast.error(`Error de red: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarActualizacion = () => {
    setMostrarModalConfirmacion(false); // Solo cierra el modal sin actualizar
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Actualizar Usuario</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize // Asegura que los valores iniciales se actualicen cuando cambien
      >
        {({ isSubmitting, values }) => (
          <Form>
            <Row className="mb-3">
              <Col>
                <label htmlFor="nombre">Nombre</label>
                <Field type="text" name="nombre" className="form-control" />
                <ErrorMessage name="nombre" component="div" className="text-danger" />
              </Col>
              <Col>
                <label htmlFor="apellido">Apellido</label>
                <Field type="text" name="apellido" className="form-control" />
                <ErrorMessage name="apellido" component="div" className="text-danger" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <label htmlFor="correo_electronico">Correo Electrónico</label>
                <Field type="email" name="correo_electronico" className="form-control" />
                <ErrorMessage name="correo_electronico" component="div" className="text-danger" />
              </Col>
              <Col>
                <label htmlFor="telefono">Teléfono</label>
                <Field type="text" name="telefono" className="form-control" />
                <ErrorMessage name="telefono" component="div" className="text-danger" />
              </Col>
            </Row>
            <Button type="submit" className="btn custom-button2" disabled={isSubmitting || loading}>
              {loading ? 'Actualizando...' : 'Actualizar Usuario'}
            </Button>
          </Form>
        )}
      </Formik>

      {/* Modal de confirmación para actualización */}
      <Modal show={mostrarModalConfirmacion} onHide={() => setMostrarModalConfirmacion(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar actualización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas actualizar la información del usuario?
        </Modal.Body>
        <Modal.Footer>
          <Button className='custom-button1' onClick={handleCancelarActualizacion}>
            Cancelar
          </Button>
          <Button className="custom-button2" onClick={handleConfirmarActualizacion}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActualizarUsuario;
