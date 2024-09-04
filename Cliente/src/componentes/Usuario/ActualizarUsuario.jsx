// ActualizarUsuario.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAuth } from '../autenticacion/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const ActualizarUsuario = () => {
  const { user, updateUser } = useAuth(); // Obtén el usuario y la función de actualización del contexto
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    username: '',
    apellido: '',
    correo_electronico: '',
    telefono: ''
  });

  // Obtén los datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const response = await axios.get(`${apiUrl}/auth/consultar-user-id/${user.id}`);
          setInitialValues({
            username: response.data.nombre || '',
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
    username: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un nombre válido').required('Campo requerido'),
    apellido: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un apellido válido').required('Campo requerido'),
    correo_electronico: Yup.string().email('Ingrese un correo electrónico válido').required('Campo requerido'),
    telefono: Yup.string().matches(/^[0-9]+$/, 'Ingrese un teléfono válido').required('Campo requerido'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      if (user?.id) {
        const response = await axios.put(`${apiUrl}/auth/actualizar-usuario/${user.id}`, values);
        updateUser({ ...user, ...values });
        toast.success('Usuario actualizado exitosamente');
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
      setSubmitting(false);
    }
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
        {({ isSubmitting }) => (
          <Form>
            <Row className="mb-3">
              <Col>
                <label htmlFor="username">Nombre</label>
                <Field type="text" name="username" className="form-control" />
                <ErrorMessage name="username" component="div" className="text-danger" />
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
            <Button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
              {loading ? 'Actualizando...' : 'Actualizar Usuario'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ActualizarUsuario;
