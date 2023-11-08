import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export const Login = () => {


  
  return (
    <div class="cont-cont">
      <div class="contefoto"></div>
      <div class="relleno">
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
              .min(6, 'La contraseña debe tener al menos 6 caractteres')
              .matches(
                /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).*$/,
                'La contraseña debe contener al menos un número, una letra mayúscula y un carácter especial'
              )
              .required('La Contraseña es Obligatoria'),
          })}
          onSubmit={(values) => {
            console.log('Inicio de sesion Exitoso', values);
          }}
        >
          <Form>
            <div className='form-group'>
              <label htmlFor="username">Nombre de usuario</label>
              <Field
                type="text"
                name="username"
                className="form-control"
                placeholder="Tu Documento"
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
        {/* <form action="php/inicio sesion.php" class="mames" onsubmit="return validarFormulario()" method="post">
          <input type="text" name="documento" class="usua" placeholder="Documento" required />
          <input id="password" type="password" name="contrasena" class="contra" placeholder="Contraseña" required />
          <span class="error" id="mensajeContrasena"></span>
          <button type="submit">Ingresar</button>
        </form>
        <div class="botones-inferiores">
          <Button variant="primary">Secondary</Button>{' '}
          <a class="boton-registro" href="/registro">Registro</a>
          <a class="boton-invitado" href="/">Invitado</a>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
