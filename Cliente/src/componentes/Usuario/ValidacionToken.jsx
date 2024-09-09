import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap'; // Importa los componentes de Bootstrap necesarios

const apiUrl = import.meta.env.VITE_API_URL;

export const ValidacionToken = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  return (
    <Container fluid className="request-reset-password d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={8} lg={6} xl={4} className="mx-auto">
          <div className="password p-4 rounded shadow-sm">
            <h2 className="text-center mb-4">Recuperación de Cuenta</h2>
            <Formik
              initialValues={{ correo_electronico: '' }}
              validationSchema={Yup.object({
                correo_electronico: Yup.string()
                  .email('Correo electrónico inválido')
                  .required('Correo electrónico es obligatorio'),
              })}
              onSubmit={(values, { setSubmitting, setFieldValue }) => {
                axios.post(`${apiUrl}/auth/request-password-reset`, values)
                  .then(response => {
                    setMessage('Se ha enviado un código de verificación a tu correo electrónico.');
                    setFieldValue('id_cliente', response.data.id_cliente);
                    navigate('/verify-code', { state: { id_cliente: response.data.id_cliente } });
                  })
                  .catch(error => {
                    setError(error.response ? error.response.data.error : error.message);
                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
              }}
            >
              <Form>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <div className="mb-3">
                  <label htmlFor="correo_electronico" className="form-label">Correo Electrónico</label>
                  <Field
                    type="email"
                    name="correo_electronico"
                    className="form-control"
                    placeholder="Correo Electrónico"
                  />
                  <ErrorMessage name="correo_electronico" component="div" className="text-danger mt-1" />
                </div>
                <div className="d-flex justify-content-center">
                  <Button type="submit" className="btn custom-button2">Enviar</Button>
                </div>
              </Form>
            </Formik>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ValidacionToken;
