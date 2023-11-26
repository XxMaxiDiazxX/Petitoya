import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';

const AnadirProducto = () => {
  // Función para manejar el envío del formulario
  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Enviar solicitud POST al servidor
      await axios.post('http://localhost:3001/productos', values);

      // Limpiar los campos después de una inserción exitosa
      resetForm();

      // Puedes hacer algo después de una inserción exitosa, como mostrar un mensaje al usuario
      console.log('Producto añadido exitosamente');
    } catch (error) {
      // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
      console.error('Error al añadir el producto', error);
    }
  };

  return (
    <div className="container mt-5 text-center mb-5" >
      <h2 className="mb-4">Añadir Producto</h2>
      <Formik
        initialValues={{ id_producto: '', nombre: '', descripcion: '', precio: '', categoria: '' }}
        onSubmit={handleSubmit}
      >
        <Form className='w-75 container bg-Barra2 text-white rounded p-3'>
          <div className='row'>
            <div className="mb-1 col-md-6">
              <label className="form-label">id:</label>
              <Field type="text" name="id_producto" className="form-control" />
            </div>

            <div className="mb-1 col-md-6">
              <label className="form-label">Nombre:</label>
              <Field type="text" name="nombre" className="form-control" />
            </div>
          </div>
          <div className="mb-1 col-md">
            <label className="form-label">Descripción:</label>
            <Field type="text" name="descripcion" className="form-control" />
          </div>
          <div className='row'>
            <div className="mb-1 col-md-6">
              <label className="form-label">Precio:</label>
              <Field type="text" name="precio" className="form-control" />
            </div>

            <div className="mb-1 col-md-6 mb-4">
              <label className="form-label">Categoría:</label>
              <Field type="text" name="categoria" className="form-control" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Añadir Producto
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default AnadirProducto;
