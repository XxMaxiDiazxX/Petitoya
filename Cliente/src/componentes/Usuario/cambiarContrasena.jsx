import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  return (
    <div className="reset-password">
      <div className="container-sm p-0 row rounded-4 custom-height">
        <div className="conte container-sm rounded-4 col d-flex flex-column justify-content-center align-items-center">
          <div className="container fondoTabla " style={{ width: "60%", height: "100%", paddingRight: "15%" }}>
            <div className="row h-100 d-flex justify-content-center align-items-center ">
              <div className="col-md-3" style={{ maxWidth: "100px" }}></div>
              <div className="col-md-6" style={{ height: "100%", padding: "20px" }}>
                <h4 className="text-center text-white cuerpo" style={{ fontSize: "45px" }}>Restablecer Contraseña</h4>

                <Formik
                  initialValues={{ email: '' }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email('Correo electrónico inválido')
                      .required('Correo electrónico es obligatorio'),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    axios.put('http://localhost:3001/auth/cambiar-contrasena', values)
                      .then(response => {
                        setMessage('Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.');
                      })
                      .catch(error => {
                        setError(error.response ? error.response.data.error : error.message);
                      })
                      .finally(() => {
                        setSubmitting(false);
                      });
                  }}
                >
                  <Form className='container-sm d-grid text-center labe naranj' style={{ fontWeight: "bold", fontSize: "20px" }}>
                    {error && <div className="text-danger fs-6 lh-1">{error}</div>}
                    {message && <div className="text-success fs-6 lh-1">{message}</div>}
                    <div className='form-group mb-4'>
                      <label htmlFor="email">Correo Electrónico</label>
                      <Field
                        type="email"
                        name="email"
                        className="form-control form-control-"
                        placeholder="Tu Correo Electrónico"
                      />
                      <ErrorMessage name="email" component="div" className="text-danger fs-6 lh-1" />
                    </div>
                    <div className='mx-4 d-flex align-items-center justify-content-center cuerpo text-uppercase text-uppercase mb-5'>
                      <button type="submit" className="btn text-white bg-naranj border-0">Enviar</button>
                    </div>
                  </Form>
                </Formik>
                <div className="container-sm d-flex align-items-center justify-content-center cuerpo">
                  <Link to="/login" className='btn text-white bg-naranj border-0 mx-4'>Volver al Inicio de Sesión</Link>
                </div>
              </div>
              <div className="col-md-3" style={{ maxWidth: "100px" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
