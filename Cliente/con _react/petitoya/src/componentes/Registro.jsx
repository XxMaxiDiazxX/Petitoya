import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Container, Row, Col, Button } from 'react-bootstrap';
import * as Yup from 'yup';
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
    };

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un nombre válido').required('Campo requerido'),
        apellido: Yup.string().matches(/[A-Za-z]+/, 'Ingrese un apellido válido').required('Campo requerido'),
        documento: Yup.number().required('Campo requerido'),
        correo_electronico: Yup.string().email('Ingrese un correo electrónico válido').required('Campo requerido'),
        contrasena: Yup.string().required('Campo requerido'),
        confirmar_contrasena: Yup.string()
            .oneOf([Yup.ref('contrasena'), null], 'Las contraseñas deben coincidir')
            .required('Campo requerido'),
    });

    const onSubmit = (values) => {
        // Aquí puedes manejar la lógica de envío del formulario
        console.log(values);
    };

    return (
        <Container className="cont-cont justify-content-center">
            <Col xs={12} md={8} lg={6} className="red relleno container">
                <h4 className="text-center mb-4">Registro</h4>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >

                    <Form className="mames">
                        <Row className="mb-3">
                            <Col>
                                <label htmlFor="nombre">Nombre:</label>
                                <Field
                                    type="text"
                                    name="nombre"
                                    className="form-control usua"
                                    placeholder="Ingrese su nombre"
                                />
                                <ErrorMessage name="nombre" component="span" className="error" />
                            </Col>
                            <Col>
                                <label htmlFor="apellido">Apellido:</label>
                                <Field
                                    type="text"
                                    name="apellido"
                                    className="form-control usua"
                                    placeholder="Ingrese su apellido"
                                />
                                <ErrorMessage name="apellido" component="span" className="error" />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <label htmlFor="documento">Documento:</label>
                                <Field
                                    type="number"
                                    name="documento"
                                    className="form-control usua"
                                    placeholder="Ingrese su documento"
                                />
                                <ErrorMessage name="documento" component="span" className="error" />
                            </Col>
                            <Col>
                                <label htmlFor="correo_electronico">Correo Electrónico:</label>
                                <Field
                                    type="email"
                                    name="correo_electronico"
                                    className="form-control usua"
                                    placeholder="Ingrese su correo electrónico"
                                />
                                <ErrorMessage name="correo_electronico" component="span" className="error" />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <label htmlFor="contrasena">Contraseña:</label>
                                <Field
                                    type="password"
                                    name="contrasena"
                                    className="form-control contra"
                                    placeholder="Ingrese su contraseña"
                                />
                                <ErrorMessage name="contrasena" component="span" className="error" />
                            </Col>
                            <Col>
                                <label htmlFor="confirmar_contrasena">Confirmar Contraseña:</label>
                                <Field
                                    type="password"
                                    name="confirmar_contrasena"
                                    className="form-control contra"
                                    placeholder="Ingrese su contraseña"
                                />
                                <ErrorMessage name="confirmar_contrasena" component="span" className="error" />
                            </Col>
                        </Row>
                        <Button type="submit">Registrarse</Button>
                    </Form>
                </Formik>
            </Col>
        </Container>
    );
};
