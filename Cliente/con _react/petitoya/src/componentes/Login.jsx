import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../styles/index.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from './autenticacion/AuthContext';
import Cuchillo from '../img/inicioSesion/cuchillo.png';
import Tenedor from '../img/inicioSesion/tenedor.png';

 export const Login = () => {
  const [error, setError] = useState('');

  // Obtén isLoggedIn del contexto useAuth
  const { login: authLogin, isLoggedIn } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario ya está logueado, redirigir a la página de inicio
    if (isLoggedIn) {
      navigate('/inicio');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="login">
      <div className="container-sm bg-white p-0 row rounded-4 custom-height">
        <div className="conte container-sm bg-Barra2 rounded-4 col d-flex flex-column justify-content-center align-items-center">
          {/* Agrega las imágenes a la izquierda y derecha del formulario */}
          <div className="container">
            <div className="row">
              {/* Imagen a la izquierda */}
              <div className="col-md-3">
                <img
                  src={Tenedor}
                  alt="Tenedor"
                  className="img-fluid float-start"
                  style={{ maxWidth: '75px', margin: '10px' }}
                />
              </div>
              {/* Formulario en el centro */}
              <div className="col-md-6">
                <h4>Inicio Sesion</h4>
                <Formik
                  initialValues={{ documento: '', contrasena: '' }}
                  validationSchema={Yup.object({
                    // Esquema de validación
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    axios.post('http://localhost:3001/login', values)
                      .then(response => {
                        if (response.data && response.data.user) {
                          console.log('Inicio de sesión exitoso:', response.data.user, response.data.user.isAdmin);
                          authLogin({
                            user: response.data.user,
                            isAdmin: response.data.user.isAdmin,
                          });
                          navigate('/inicio');
                        } else {
                          console.error('Error de inicio de sesión: Respuesta incorrecta del servidor');
                          setError('Error en la respuesta del servidor');
                        }
                      })
                      .catch(error => {
                        console.error('Error de inicio de sesión:', error.response ? error.response.data : error.message);
                        setError(error.response ? error.response.data.error : error.message);
                      })
                      .finally(() => {
                        setSubmitting(false);
                      });
                  }}
                >
                  <Form className='container-sm d-grid text-center'>
                    {error && <div className="text-danger fs-6 lh-1">{error}</div>}
                    <div className='form-group mb-4'>
                      <label htmlFor="documento">Nombre de usuario</label>
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

                    <button type="submit" className="btn btn-custom-color nuevo">Iniciar Sesion</button>
                  </Form>
                </Formik>
              </div>
              {/* Imagen a la derecha */}
              <div className="col-md-3">
                <img
                  src={Cuchillo}
                  alt="Cuchillo"
                  className="img-fluid float-end"
                  style={{ maxWidth: '75px', margin: '10px' }}
                />
              </div>
            </div>
          </div>

          <div className="container-sm red">
            <Link to="/inicio">Invitado</Link>
            <Link to="/registro">Registro</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
