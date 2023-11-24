import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useState } from 'react';
import {  Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';


// import fondo from '../img/registro/libreta.png'



// import 'bootstrap/dist/css/bootstrap.min.css';
// import './RegistroForm.css'; // Este será tu archivo de estilos personalizados

export const Registro = () => {
    const initialValues = {
        nombre: '',
        apellido: '',
        documento: '',
        correo_electronico: '',
        contrasena: '',
        confirmar_contrasena: '',
        telefono: '',
    };

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un nombre válido').required('Campo requerido'),
        apellido: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un apellido válido').required('Campo requerido'),
        documento: Yup.number().required('Campo requerido'),
        correo_electronico: Yup.string().email('Ingrese un correo electrónico válido').required('Campo requerido'),
        contrasena: Yup
            .string()
            .min(6, 'La contrasena debe tener al menos 6 caracteres')
            .matches(
                /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).*$/,
                'La contrasena debe contener al menos un numero, una letra mayuscula y un caracter especial'
            )
            .required('Campo requerido'),
        confirmar_contrasena: Yup
            .string()
            .oneOf([Yup.ref('contrasena'), null], 'Las contraseñas deben coincidir')
            .required('Campo requerido'),
        telefono: Yup
            .number()
            .required('Campo requerido'),

    });

    const [registrationError, setRegistrationError] = useState(null);
    const navigate = useNavigate();


    const onSubmit = (values, { setSubmitting }) => {
        axios.post('http://localhost:3001/create', values)
            .then(response => {
                console.log('Registro exitoso:', response.data);
                // Realizar acciones adicionales después del registro exitoso
                handleSuccessfulRegistration(response.data);
            })
            .catch(error => {
                console.error('Error de registro:', error.response?.data);
                setRegistrationError(error.response?.data?.error || 'Error de registro');
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleSuccessfulRegistration = (userData) => {
        console.log('Acciones después del registro exitoso:', userData);
        navigate('/');
    };

    const volver = () => {
        navigate('/');
    }


    return (
        <div className="h-100">
            <Col xs={12} md={8} lg={6} className="contenedor d-flex flex-column align-items-center justify-content-center w-100 h-100">

                <h4 className="text-center reda cuerpo" style={{ fontSize: "45px" }}>Registro</h4>

                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >

                    <Form className="fondito p-4 text-center labe naranj" style={{ width: "65%", fontSize: "20px" }} >
                        {registrationError && (
                            <div className="alert alert-danger" role="alert">
                                {registrationError}
                            </div>
                        )}
                        <Row className="mb-3 d-flex align-items-center ">
                            <Col className='mx-4'>
                                <label htmlFor="nombre">Nombre:</label>
                                <Field
                                    type="text"
                                    name="nombre"
                                    className="form-control bg-input text-white usua"
                                    placeholder="Ingrese su nombre"
                                />
                                <ErrorMessage name="nombre" component="span" className="error" />
                            </Col>
                            <Col className='mx-4'>
                                <label htmlFor="apellido">Apellido:</label>
                                <Field
                                    type="text"
                                    name="apellido"
                                    className="form-control bg-input text-white usua"
                                    placeholder="Ingrese su apellido"
                                />
                                <ErrorMessage name="apellido" component="span" className="error" />
                            </Col>
                        </Row>
                        <Row className="mb-3 d-flex align-items-center">
                            <Col className='mx-4'>
                                <label htmlFor="documento">Documento:</label>
                                <Field
                                    type="number"
                                    name="documento"
                                    className="form-control bg-input text-white usua"
                                    placeholder="Ingrese su documento"
                                />
                                <ErrorMessage name="documento" component="span" className="error" />
                            </Col>
                            <Col className='mx-4'>
                                <label htmlFor="telefono">Teléfono:</label>
                                <Field
                                    type="tel"
                                    name="telefono"
                                    className="form-control bg-input text-white usua"
                                    placeholder="Ingrese su teléfono"
                                />
                                <ErrorMessage name="telefono" component="span" className="error" />
                            </Col>
                        </Row>
                        <Row className="mb-3 d-flex align-items-center">
                            <Col className='mx-4'>
                                <label htmlFor="contrasena">Contraseña:</label>
                                <Field
                                    type="password"
                                    name="contrasena"
                                    className="form-control bg-input text-white contra"
                                    placeholder="Ingrese su contraseña"
                                />
                                <ErrorMessage name="contrasena" component="span" className="error" />
                            </Col>

                            <Col className='mx-4'>
                                <label htmlFor="correo_electronico">Correo Electrónico:</label>
                                <Field
                                    type="email"
                                    name="correo_electronico"
                                    className="form-control bg-input text-white usua"
                                    placeholder="Ingrese su correo electrónico"
                                />
                                <ErrorMessage name="correo_electronico" component="span" className="error" />
                            </Col>
                        </Row>
                        <Row className="mb-3 d-flex align-items-center">
                            <Col className='mx-4'>
                                <label htmlFor="confirmar_contrasena">Confirmar Contraseña:</label>
                                <Field
                                    type="password"
                                    name="confirmar_contrasena"
                                    className="form-control bg-input text-white contra"
                                    placeholder="Ingrese su contraseña"
                                />
                                <ErrorMessage name="confirmar_contrasena" component="span" className="error" />
                            </Col>
                            <Col className='mx-4 d-flex align-items-center justify-content-center cuerpo text-uppercase text-uppercase'>
                                <Button type="submit" className='bg-naranj border-0'>REGISTRARSE</Button>
                            </Col>
                        </Row>
                    </Form>
                </Formik>
                <div className='cuerpo'>
                    <Button onClick={volver} className='bg-naranj border-0'>Volver</Button>
                </div>
            </Col>
        </div>
    );
};
