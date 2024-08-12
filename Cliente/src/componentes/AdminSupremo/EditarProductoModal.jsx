import React, { useState, useEffect } from 'react';

const EditarProductoModal = ({ productoSeleccionado, mostrarModal, handleEditarProducto, setMostrarModal, setProductoSeleccionado }) => {
  const [imagenPreview, setImagenPreview] = useState('');

  // Efecto para actualizar la previsualización cuando se seleccione un producto
  useEffect(() => {
    if (productoSeleccionado) {
      const urlBase = 'http://localhost:3001/';
      const urlImagen = `${urlBase}${productoSeleccionado.imagenSrc}`;
      console.log('URL de la imagen:', urlImagen);
      setImagenPreview(urlImagen);
    }
  }, [productoSeleccionado]);
    
  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear un FormData para enviar la imagen junto con otros datos del producto
    const formData = new FormData();
    formData.append('nombre', productoSeleccionado.nombre);
    formData.append('descripcion', productoSeleccionado.descripcion);
    formData.append('precio', productoSeleccionado.precio);
    formData.append('categoria', productoSeleccionado.categoria);

    // Verifica si hay un nuevo archivo de imagen seleccionado
    if (productoSeleccionado.nuevaImagen) {
      formData.append('imagen', productoSeleccionado.nuevaImagen);
    }

    handleEditarProducto(formData);
    setMostrarModal(false); // Cerrar el modal al enviar
  };

  if (!productoSeleccionado) {
    return null;
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Almacenar el archivo en el producto seleccionado
      setProductoSeleccionado({ ...productoSeleccionado, nuevaImagen: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result); // Actualizar la previsualización
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {mostrarModal && (
        <div
          className="modal-backdrop"
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setMostrarModal(false)}
        ></div>
      )}

      <div className={`modal ${mostrarModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: mostrarModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="card">
              {imagenPreview && (
                <img
                  src={imagenPreview}
                  alt="Imagen del producto"
                  className="card-img-top"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">Editar Producto</h5>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="imagen">Imagen:</label>
                    <input
                      type="file"
                      className="form-control"
                      id="imagen"
                      accept="image/*"
                      onChange={handleImagenChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={productoSeleccionado.nombre || ''}
                      onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, nombre: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="descripcion"
                      value={productoSeleccionado.descripcion || ''}
                      onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, descripcion: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="precio">Precio:</label>
                    <input
                      type="number"
                      className="form-control"
                      id="precio"
                      value={productoSeleccionado.precio || ''}
                      onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, precio: e.target.value })}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="categoria">Categoría:</label>
                    <select
                      className="form-control"
                      id="categoria"
                      value={productoSeleccionado.categoria || ''}
                      onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, categoria: e.target.value })}
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="Comida">Comida</option>
                      <option value="Bebida">Bebida</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </form>
              </div>
            </div>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => setMostrarModal(false)}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarProductoModal;
