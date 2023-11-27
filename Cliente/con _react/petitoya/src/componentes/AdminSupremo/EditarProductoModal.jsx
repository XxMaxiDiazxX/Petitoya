// EditarProductoModal.js
import React from 'react';

const EditarProductoModal = ({ productoSeleccionado, mostrarModal, handleEditarProducto, setMostrarModal, setProductoSeleccionado }) => {
  // Verifica si productoSeleccionado es null o undefined
  if (!productoSeleccionado) {
    return null; // O puedes mostrar un mensaje indicando que no hay producto seleccionado
  }

  const handleModalClick = (e) => {
    // Evita que los clics lleguen a los elementos detrás de la modal
    e.stopPropagation();
  };

  return (
    <div>
      {mostrarModal && (
        <div
          className="modal-backdrop"
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        ></div>
      )}

      <div className={`modal ${mostrarModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: mostrarModal ? 'block' : 'none' }} onClick={handleModalClick}>
        {/* Contenido de la ventana modal */}
        <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Producto</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setMostrarModal(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditarProducto}>
                {/* Campos de entrada para la edición del producto */}
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

                {/* Agrega campos similares para otros detalles del producto (descripcion, precio, etc.) */}
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
                    type="text"
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

                {/* Botón para guardar los cambios */}
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarProductoModal;
