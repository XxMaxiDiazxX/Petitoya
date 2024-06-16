import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const ValidacionToken = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  return (
    <div className="request-reset-password">
      <Formik
        initialValues={{ correo_electronico: '' }}
        validationSchema={Yup.object({
          correo_electronico: Yup.string()
            .email('Correo electrónico inválido')
            .required('Correo electrónico es obligatorio'),
        })}
        onSubmit={(values, { setSubmitting, setFieldValue }) => {
          axios.post('http://localhost:3001/auth/request-password-reset', values)
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
          {error && <div className="text-danger">{error}</div>}
          {message && <div className="text-success">{message}</div>}
          <div>
            <label htmlFor="correo_electronico">Correo Electrónico</label>
            <Field
              type="email"
              name="correo_electronico"
              placeholder="Tu Correo Electrónico"
            />
            <ErrorMessage name="correo_electronico" component="div" className="text-danger" />
          </div>
          <button type="submit">Enviar</button>
        </Form>
      </Formik>
    </div>
  );
};
