import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useAuth } from '../autenticacion/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const ActualizarUsuario = () => {
  const { user, login } = useAuth(); // Obtén el usuario y la función de login del contexto
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario

  console.log(user.id);

  useEffect(() => {
    // Realiza una solicitud para obtener los datos actuales del usuario al cargar el componente
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/auth/actualizar-usuario/${user.id}`);
        setUserData(response.data); // Asigna los datos del usuario a estado local
      } catch (error) {
        toast.error('Error al obtener los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id_cliente]);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un nombre válido').required('Campo requerido'),
    apellido: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un apellido válido').required('Campo requerido'),
    correo_electronico: Yup.string().email('Ingrese un correo electrónico válido').required('Campo requerido'),
    telefono: Yup.string().matches(/^[0-9]+$/, 'Ingrese un teléfono válido').required('Campo requerido'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/auth/actualizar-usuario/${user.id}`, values);

      // Actualiza el contexto con los nuevos datos del usuario
      login({ ...user, ...values });

      toast.success('Usuario actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el usuario');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos del usuario
  }

  if (!userData) {
    return <div>No se encontraron datos del usuario</div>; // Muestra un mensaje si no se encuentran los datos del usuario
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Actualizar Usuario</h2>
      <Formik
        initialValues={{
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          correo_electronico: userData.correo_electronico || '',
          telefono: userData.telefono || '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize // Asegura que los valores iniciales se actualicen cuando los valores del usuario cambien
      >
        {({ isSubmitting }) => (
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
