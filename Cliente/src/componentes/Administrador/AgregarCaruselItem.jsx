import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const apiUrl = import.meta.env.VITE_API_URL;


const AgregarCaruselItem = () => {
  const [uploading, setUploading] = useState(false);

  const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('El título es obligatorio'),
    descripcion: Yup.string().required('La descripción es obligatoria'),
    imagen: Yup.mixed().required('La imagen es obligatoria'),
  });


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('titulo', values.titulo);
    formData.append('descripcion', values.descripcion);
    formData.append('imagen', values.imagen);

    try {
      await axios.post(`${apiUrl}/products/anadircarru`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Item agregado al carrusel con éxito');
      resetForm();
    } catch (error) {
      console.error('Error al agregar el ítem:', error);
      alert('Error al agregar el ítem');
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Agregar Ítem al Carrusel</h2>
      <Formik
        initialValues={{ titulo: '', descripcion: '', imagen: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
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
                onChange={(event) => setFieldValue('imagen', event.currentTarget.files[0])}
              />
              <ErrorMessage name="imagen" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Subiendo...' : 'Agregar Ítem'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AgregarCaruselItem;
