import React from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';

const AñadirProducto = () => {
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
    <div>
      <h2>Añadir Producto</h2>
      <Formik
        initialValues={{ nombre: '', descripcion: '', precio: '', categoria: '' }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label>Nombre:</label>
            <Field type="text" name="nombre" />
          </div>

          <div>
            <label>Descripción:</label>
            <Field type="text" name="descripcion" />
          </div>

          <div>
            <label>Precio:</label>
            <Field type="text" name="precio" />
          </div>

          <div>
            <label>Categoría:</label>
            <Field type="text" name="categoria" />
          </div>

          <button type="submit">Añadir Producto</button>
        </Form>
      </Formik>
    </div>
  );
};

export default AñadirProducto;
