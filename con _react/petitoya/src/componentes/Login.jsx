import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../styles/index.css';


export const Login = () => {



  return (
    <div className="login">
      <div className="cont-cont">
        <div className="contefoto"></div>
        <div className="relleno">
          <h4>Inicio Sesion</h4>
          <Formik
            initialValues={{ documento: '', contrasena: '' }}
            validationSchema={Yup.object({
              documento: Yup
                .number()
                .positive()
                .integer()
                .required('Usuario Requerido'),
              contrasena: Yup
                .string()
                .min(6, 'La contrasena debe tener al menos 6 caracteres')
                .matches(
                  /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).*$/,
                  'La contrasena debe contener al menos un numero, una letra mayuscula y un caracter especial'
                )
                .required('La Contrasena es Obligatoria'),
            })}
            onSubmit={(values) => {
              console.log('Inicio de sesion Exitoso', values);
            }}
          >
            <Form>
              <div className='form-group'>
                <label htmlFor="documento">Nombre de usuario</label>
                <Field
                  type="text"
                  name="documento"
                  className="form-control"
                  placeholder="Tu Documento"
                />
                <ErrorMessage name="documento" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label htmlFor="contrasena">Contrasena</label>
                <Field
                  type="password"
                  name="contrasena"
                  className="form-control"
                  placeholder="Tu contraseña"
                />
                <ErrorMessage name="contrasena" component="div" className="text-danger" />

              </div>

              <button type="submit" className="btn btn-custom-color nuevo">Iniciar Sesion</button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
