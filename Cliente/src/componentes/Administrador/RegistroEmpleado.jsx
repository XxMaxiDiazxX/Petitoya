import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;

const RegistroEmpleado = () => {
  const initialValues = {
    nombre: "",
    apellido: "",
    documento: "",
    correo_electronico: "",
    contrasena: "",
    confirmar_contrasena: "",
    telefono: "",
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .matches(/[A-Za-z]+/, "Ingrese un nombre válido")
      .required("Campo requerido"),
    apellido: Yup.string()
      .matches(/[A-Za-z]+/, "Ingrese un apellido válido")
      .required("Campo requerido"),
    documento: Yup.number()
      .min(0, "El documento no puede ser negativo")
      .required("Campo requerido"),
    correo_electronico: Yup.string()
      .email("Ingrese un correo electrónico válido")
      .required("Campo requerido"),
    contrasena: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).*$/, "Debe contener un número, una mayúscula y un carácter especial")
      .required("Campo requerido"),
    confirmar_contrasena: Yup.string()
      .oneOf([Yup.ref("contrasena"), null], "Las contraseñas deben coincidir")
      .required("Campo requerido"),
    telefono: Yup.number().required("Campo requerido"),
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    axios
      .post(`${apiUrl}/auth/registerSu`, values)
      .then((response) => {
        toast.success('Registro exitoso');
        resetForm();
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Error de registro");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Col
      xs={12}
      md={8}
      lg={6}
      className="d-flex flex-column align-items-center justify-content-center w-100 h-100"
    >
      <h4 className="text-center cuerpo" style={{ fontSize: "45px" }}>
        Registro de empleados
      </h4>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form className="fondito p-4 text-center labe naranj" style={{ width: "65%", fontSize: "20px" }}>
            <Row className="mb-3 d-flex align-items-center">
              <Col className='mx-4'>
                <label htmlFor="nombre">Nombre:</label>
                <Field
                  type="text"
                  name="nombre"
                  className="form-control bg-input usua"
                  placeholder="Ingrese su nombre"
                  maxLength="30"
                />
                <ErrorMessage name="nombre" component="span" className="error" />
              </Col>
              <Col className='mx-4'>
                <label htmlFor="apellido">Apellido:</label>
                <Field
                  type="text"
                  name="apellido"
                  className="form-control bg-input usua"
                  placeholder="Ingrese su apellido"
                  maxLength="30"
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
                  className="form-control bg-input usua"
                  placeholder="Ingrese su documento"
                  maxLength="20"
                  min="0" // Esto asegura que no se puedan ingresar números negativos
                  step="1" // Esto asegura que solo se puedan ingresar enteros
                />
                <ErrorMessage name="documento" component="span" className="error" />
              </Col>
              <Col className='mx-4'>
                <label htmlFor="telefono">Teléfono:</label>
                <Field
                  type="tel"
                  name="telefono"
                  className="form-control bg-input usua"
                  placeholder="Ingrese su teléfono"
                  maxLength="20"
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
                  className="form-control bg-input contra"
                  placeholder="Ingrese su contraseña"
                  maxLength="50"
                />
                <ErrorMessage name="contrasena" component="span" className="error" />
              </Col>

              <Col className='mx-4'>
                <label htmlFor="correo_electronico">Correo Electrónico:</label>
                <Field
                  type="email"
                  name="correo_electronico"
                  className="form-control bg-input usua"
                  placeholder="Ingrese su correo electrónico"
                  maxLength="100"
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
                  className="form-control bg-input contra"
                  placeholder="Ingrese su contraseña"
                  maxLength="50"
                />
                <ErrorMessage name="confirmar_contrasena" component="span" className="error" />
              </Col>
              <Col className='mx-4 d-flex align-items-center justify-content-center cuerpo text-uppercase'>
                <Button type="submit" className='custom-button2 border-0' disabled={isSubmitting}>
                  REGISTRAR
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Col>
  );
};

export default RegistroEmpleado;
