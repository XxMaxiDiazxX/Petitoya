import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export const VerifyAndResetPassword = () => {
  const location = useLocation();
  const { id_cliente } = location.state || {};
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  return (
    <div className="verify-and-reset-password">
      <Formik
        initialValues={{ id_cliente, codigo_verificacion: '', nueva_contrasena: '' }}
        validationSchema={Yup.object({
          codigo_verificacion: Yup.string().required('Código de verificación es obligatorio'),
          nueva_contrasena: Yup.string().required('Nueva contraseña es obligatoria'),
        })}
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
        <Form>
          {error && <div className="text-danger">{error}</div>}
          {message && <div className="text-success">{message}</div>}
          <div>
            <label htmlFor="codigo_verificacion">Código de Verificación</label>
            <Field
              type="text"
              name="codigo_verificacion"
              placeholder="Código de Verificación"
            />
            <ErrorMessage name="codigo_verificacion" component="div" className="text-danger" />
          </div>
          <div>
            <label htmlFor="nueva_contrasena">Nueva Contraseña</label>
            <Field
              type="password"
              name="nueva_contrasena"
              placeholder="Nueva Contraseña"
            />
            <ErrorMessage name="nueva_contrasena" component="div" className="text-danger" />
          </div>
          <button type="submit">Cambiar Contraseña</button>
        </Form>
      </Formik>
    </div>
  );
};
