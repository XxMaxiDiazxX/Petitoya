import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../styles/index.css';


export const Login = () => {



  return (
    <div className="login">
      <div className="container-sm bg-white p-0 row rounded-4 custom-height">
        <div className="contefoto col"></div>
        <div className="container-sm bg-Barra2 rounded-4 col d-flex flex-column justify-content-center align-items-center">
          <h4 className="mb-4">Inicio Sesion</h4>
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
            <Form className='container-sm red d-grid text-center mb-5'>
              <div className='form-group mb-4'>
                <label htmlFor="documento" >Nombre de usuario</label>
                <Field
                  type="text"
                  name="documento"
                  className="form-control form-control-"
                  placeholder="Tu Documento"
                />
              </div>
              <ErrorMessage name="documento" component="div" className="text-danger fs-6 lh-1" />

              <div className="form-group mb-4">
                <label htmlFor="contrasena">Contrasena</label>
                <Field
                  type="password"
                  name="contrasena"
                  className="form-control"
                  placeholder="Tu contraseña"
                />
                <ErrorMessage name="contrasena" component="div" className="text-danger fs-6 lh-1" />

              </div>

              <button type="submit" className="btn btn-custom-color nuevo ">Iniciar Sesion</button>
            </Form>
          </Formik>
          <div class="container-sm">
                <a class="" href="registro.html">Registro</a>
                <a class="" href="inicio.html">Invitado</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
