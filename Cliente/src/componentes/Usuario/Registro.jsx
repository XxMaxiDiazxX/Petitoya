import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';

const apiUrl = import.meta.env.VITE_API_URL;

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
    documento: Yup.number()
      .min(0, "El documento no puede ser negativo") // Asegura que el número sea positivo
      .required("Campo requerido"),
    correo_electronico: Yup.string().email('Ingrese un correo electrónico válido').required('Campo requerido'),
    contrasena: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).*$/, 'La contraseña debe contener al menos un número, una letra mayúscula y un caracter especial')
      .required('Campo requerido'),
    confirmar_contrasena: Yup.string()
      .oneOf([Yup.ref('contrasena'), null], 'Las contraseñas deben coincidir')
      .required('Campo requerido'),
    telefono: Yup.number().required('Campo requerido'),
  });

  const navigate = useNavigate();

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, values);
      console.log('Registro exitoso:', response.data);
      handleSuccessfulRegistration(response.data);
    } catch (error) {
      console.error('Error de registro:', error.response?.data);
      toast.error(error.response?.data?.error || 'Error de registro');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessfulRegistration = (userData) => {
    console.log('Acciones después del registro exitoso:', userData);
    toast.success('Registro exitoso');
    navigate('/'); // Redirigir después de un registro exitoso
  };

  const volver = () => {
    navigate('/');
  };

  return (
    <div className="h-100">
      <Col xs={12} md={8} lg={6} className="contenedor d-flex flex-column align-items-center justify-content-center w-100 h-100">
        <h4 className="text-center reda cuerpo" style={{ fontSize: "45px" }}>Registro</h4>

        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form className="fondito p-4 text-center labe naranj" style={{ width: "80%", fontSize: "20px" }}>
              <Row className="mb-3 d-flex align-items-center">
                <Col xs={12} md={6}>
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
                <Col xs={12} md={6}>
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
                <Col xs={12} md={6}>
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
                <Col xs={12} md={6}>
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
                <Col xs={12} md={6}>
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

                <Col xs={12} md={6}>
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
                <Col xs={12} md={6}>
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
                  <Button type="submit" className='bg-naranj border-0' disabled={isSubmitting}>
                    REGISTRARSE
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        <div className='cuerpo'>
          <Button onClick={volver} className='bg-naranj border-0'>Volver</Button>
        </div>
      </Col>
    </div>
  );
};
