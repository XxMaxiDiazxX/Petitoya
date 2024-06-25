import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap'; // Importa los componentes de Bootstrap necesarios
import '../../styles/menu/PedidoModalMenu.scss'; // Ajusta la ruta a tu archivo SCSS

const validationSchema = Yup.object().shape({
  codigo_verificacion: Yup.string()
    .required('Código de verificación es obligatorio'),
  nueva_contrasena: Yup.string()
    .required('Nueva contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).*$/,
      'La contraseña debe contener al menos un número, una letra mayúscula y un carácter especial'
    ),
  confirmar_contrasena: Yup.string()
    .oneOf([Yup.ref('nueva_contrasena'), null], 'Las contraseñas deben coincidir')
    .required('Confirmar contraseña es obligatorio'),
});

export const VerifyAndResetPassword = () => {
  const location = useLocation();
  const { id_cliente } = location.state || {};
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  return (
    <Container className="verify-and-reset-password d-flex flex-column justify-content-center">
      <Row className="password justify-content-center">
        <Col md={6} className="justify-content-center">
      <h2 className="text-center mb-4">Recuperación de Contraseña</h2>
      <Formik
        initialValues={{ id_cliente, codigo_verificacion: '', nueva_contrasena: '', confirmar_contrasena: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          axios.post('http://localhost:3001/auth/verify-code-and-reset-password', values)
            .then(response => {
              setMessage('Contraseña cambiada exitosamente.');
              navigate('/');
            })
            .catch(error => {
              setError(error.response ? error.response.data.error : error.message);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        <Form className="w-100">
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <div className="mb-3">
            <label htmlFor="codigo_verificacion" className="form-label">Código de Verificación</label>
            <Field
              type="text"
              name="codigo_verificacion"
              id="codigo_verificacion"
              className="form-control"
              placeholder="Código de Verificación"
            />
            <ErrorMessage name="codigo_verificacion" component="div" className="text-danger" />
          </div>
          <div className="mb-3">
            <label htmlFor="nueva_contrasena" className="form-label">Nueva Contraseña</label>
            <Field
              type="password"
              name="nueva_contrasena"
              id="nueva_contrasena"
              className="form-control"
              placeholder="Nueva Contraseña"
            />
            <ErrorMessage name="nueva_contrasena" component="div" className="text-danger" />
          </div>
          <div className='mb-3'>
            <label htmlFor="confirmar_contrasena" className="form-label">Confirmar Contraseña</label>
            <Field
              type="password"
              name="confirmar_contrasena"
              id="confirmar_contrasena"
              className="form-control"
              placeholder="Confirmar Contraseña"
            />
            <ErrorMessage name="confirmar_contrasena" component="div" className="text-danger" />
          </div>
          <div className='mx-4 d-flex align-items-center justify-content-center cuerpo text-uppercase text-uppercase'>
            <button type="submit" className='bg-naranj border-0'>Restablecer Contraseña</button>
          </div>
        </Form>
      </Formik>
      </Col>
      </Row>
    </Container>
  );
};