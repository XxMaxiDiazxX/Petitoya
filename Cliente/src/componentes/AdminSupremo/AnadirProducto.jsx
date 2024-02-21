import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';

const AnadirProducto = ({ setProductos }) => {
  const [idExistError, setIdExistError] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Verificar si el ID ya existe
      const idExistResponse = await axios.get(`http://localhost:3001/productos/${values.id_producto}`);

      if (idExistResponse.data.length > 0) {
        // Si el ID ya existe, muestra un mensaje de error
        setIdExistError('El ID ya existe. Por favor, elige otro.');
      } else {
        // Si el ID no existe, procede con la inserción
        setIdExistError('');

        // Enviar solicitud POST al servidor
        await axios.post('http://localhost:3001/productos', values);

        // Obtener la lista actualizada de productos después de la inserción
        const response = await axios.get('http://localhost:3001/productos');

        // Actualizar el estado local con la nueva lista de productos
        setProductos(response.data);

        // Limpiar los campos después de una inserción exitosa
        resetForm();

        console.log('Producto añadido exitosamente');
      }
    } catch (error) {
      console.error('Error al añadir el producto', error);
    }
  };

  // Utiliza useEffect para forzar la actualización después de que se establezca el estado
  useEffect(() => {
    // Puedes agregar lógica adicional aquí si es necesario
  }, [idExistError]);

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
                {idExistError && <span className="text-danger">{idExistError}</span>}
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
              <Field as="select" name="categoria" className="form-control">
                <option value="" disabled>Selecciona una categoría</option>
                <option value="Comida">Comida</option>
                <option value="Bebida">Bebida</option>
              </Field>
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
