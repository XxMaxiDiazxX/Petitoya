import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export const Login = () => {
  return (
    <div className="container mt-5">
      <h1>Iniciar Sesión</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={Yup.object({
          username: Yup.string()
            .required('El nombre de usuario es obligatorio'),
          password: Yup.string()
            .required('La contraseña es obligatoria')
        })}
        onSubmit={(values) => {
          console.log('Inicio de sesión exitoso:', values);
        }}
      >
        <Form>
          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <Field
              type="text"
              name="username"
              className="form-control"
              placeholder="Tu nombre de usuario"
            />
            <ErrorMessage name="username" component="div" className="text-danger" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <Field
              type="password"
              name="password"
              className="form-control"
              placeholder="Tu contraseña"
            />
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>

          <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
        </Form>
      </Formik>
    </div>
  );
}
