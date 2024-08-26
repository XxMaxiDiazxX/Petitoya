import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../../styles/index.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../autenticacion/AuthContext';
import Cuchillo from '../../img/inicioSesion/cuchillo.png';
import Tenedor from '../../img/inicioSesion/tenedor.png';

const apiUrl = import.meta.env.VITE_API_URL;

export const Login = () => {
  const [error, setError] = useState('');

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
      <div className="container-sm p-0 row rounded-4 custom-height">
        <div className="conte container-sm rounded-4 col d-flex flex-column justify-content-center align-items-center">
          {/* Agrega las imágenes a la izquierda y derecha del formulario */}
          <div className="container fondoTabla " style={{ width: "60%", height: "100%", paddingRight: "15%" }}>
            <div className="row h-100 d-flex justify-content-center align-items-center ">
              {/* Imagen a la izquierda */}
              <div className="col-md-3" style={{ maxWidth: "100px" }}>
                <img
                  src={Tenedor}
                  alt="Tenedor"
                  className="img-fluid float-start"
                  style={{ maxWidth: '75px', margin: '10px' }}
                />
              </div>
              {/* Formulario en el centro */}
              <div className="col-md-6" style={{ height: "100%", padding: "20px" }}>


                <h4 className="text-center text-white cuerpo" style={{ fontSize: "45px" }}>Inicio Sesion</h4>


                <Formik
                  initialValues={{ documento: '', contrasena: '' }}
                  validationSchema={Yup.object({
                    contrasena: Yup
                    .string()
                    .min(6, 'La contrasena debe tener al menos 6 caracteres')
                    .matches(
                        /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).*$/,
                        'La contrasena debe contener al menos un numero, una letra mayuscula y un caracter especial'
                    )
                    .required('Campo requerido'),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    axios.post(`${apiUrl}/auth/login`, values)
                      .then(response => {
                        if (response.data && response.data.user) {
                          console.log('Inicio de sesión exitoso:', response.data.user, response.data.user.role);
                          authLogin({
                            user: response.data.user,
                            role: response.data.user.role,
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
                      }
                    );
                  }}
                >
                  <Form className='container-sm d-grid text-center labe naranj' style={{ fontWeight: "bold", fontSize: "20px" }}>
                    {error && <div className="text-danger fs-6 lh-1">{error}</div>}
                    <div className='form-group mb-4'>
                      <label htmlFor="documento">Documento</label>
                      <Field
                        type="text"
                        name="documento"
                        className="form-control form-control-"
                        placeholder="Tu Documento"
                        maxlength="20"
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
                        maxlength="50"
                      />
                      <ErrorMessage name="contrasena" component="div" className="text-danger fs-6 lh-1" />
                    </div>
                    <div className='mx-4 d-flex align-items-center justify-content-center cuerpo text-uppercase text-uppercase mb-5'>
                      <button type="submit" className="btn text-white bg-naranj border-0">Ingresar</button>
                    </div>
                  </Form>
                </Formik>
                <div className="container-sm d-flex align-items-center justify-content-center cuerpo" style={{}}>
                  <Link to="/inicio" className='btn text-white bg-naranj border-0 mx-4'>Invitado</Link>
                  <Link to="/registro" className='btn text-white bg-naranj border-0 mx-4'>Registro</Link>
                </div>
                <div className="text-center mt-3">
                  <Link to="/reset-password" className="text-white">¿Olvidaste tu contraseña?</Link>
                </div>
              </div>
              {/* Imagen a la derecha */}
              <div className="col-md-3" style={{ maxWidth: "100px" }}>
                <img
                  src={Cuchillo}
                  alt="Cuchillo"
                  className="img-fluid float-end"
                  style={{ maxWidth: '75px', margin: '10px' }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
