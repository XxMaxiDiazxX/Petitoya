import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toast
import imagen1 from '../../img/error/fondo.jpg'; // Imagen por defecto

const apiUrl = import.meta.env.VITE_API_URL;

const AgregarCaruselItem = () => {
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState(null); // Guardar valores del formulario
  const [previewItem, setPreviewItem] = useState({
    titulo: 'Título predeterminado',
    descripcion: 'Descripción predeterminada',
    imagen: imagen1,
  }); // Estado inicial para previsualización con datos predeterminados

  const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('El título es obligatorio'),
    descripcion: Yup.string().required('La descripción es obligatoria'),
    imagen: Yup.mixed().required('La imagen es obligatoria'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setFormValues(values);
    setShowModal(true);
    setSubmitting(false);
  };

  const previewChanges = (values) => {
    setPreviewItem({
      titulo: values.titulo,
      descripcion: values.descripcion,
      imagen: URL.createObjectURL(values.imagen), // Crear URL de la imagen para previsualización
    });
  };

  const confirmSubmit = async () => {
    if (!formValues) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('titulo', formValues.titulo);
    formData.append('descripcion', formValues.descripcion);
    formData.append('imagen', formValues.imagen);

    try {
      await axios.post(`${apiUrl}/products/anadircarru`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Item agregado al carrusel con éxito');
      setFormValues(null);
      setPreviewItem({
        titulo: 'Título predeterminado',
        descripcion: 'Descripción predeterminada',
        imagen: imagen1, // Resetear previsualización a predeterminada
      });
    } catch (error) {
      console.error('Error al agregar el ítem:', error);
      toast.error('Error al agregar el ítem');
    } finally {
      setUploading(false);
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormValues(null);
    setUploading(false);
    setPreviewItem({
      titulo: 'Título predeterminado',
      descripcion: 'Descripción predeterminada',
      imagen: imagen1, // Resetear previsualización a predeterminada si se cancela
    });
  };

  return (
    <div className="container mt-5">
      <h2>Agregar Ítem al Carrusel</h2>
      <Formik
        initialValues={{ titulo: '', descripcion: '', imagen: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, setSubmitting }) => (
          <Form encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">Título</label>
              <Field
                type="text"
                name="titulo"
                className="form-control"
                placeholder="Ingrese el título"
              />
              <ErrorMessage name="titulo" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <Field
                type="text"
                name="descripcion"
                className="form-control"
                placeholder="Ingrese la descripción"
              />
              <ErrorMessage name="descripcion" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="imagen" className="form-label">Imagen</label>
              <input
                type="file"
                name="imagen"
                accept="image/*"
                className="form-control"
                onChange={(event) => {
                  setFieldValue('imagen', event.currentTarget.files[0]);
                  previewChanges({
                    ...values,
                    imagen: event.currentTarget.files[0],
                  });
                }}
              />
              <ErrorMessage name="imagen" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn custom-button2" disabled={uploading}>
              {uploading ? 'Subiendo...' : 'Agregar Ítem'}
            </button>
          </Form>
        )}
      </Formik>

      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Adición</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas agregar este ítem al carrusel?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmSubmit}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="mt-4">
        <h3>Previsualización</h3>
        <Carousel className="carusel align-items-md-center p-2 mb-5">
          <Carousel.Item className="carusel">
            <img src={previewItem.imagen} alt={previewItem.titulo} className="d-block w-100" />
            <Carousel.Caption className="carousel-caption-dark">
              <h3>{previewItem.titulo}</h3>
              <p>{previewItem.descripcion}</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};

export default AgregarCaruselItem;
