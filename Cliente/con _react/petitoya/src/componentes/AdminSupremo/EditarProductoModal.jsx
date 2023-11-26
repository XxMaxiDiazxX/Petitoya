// EditarProductoModal.js
import React from 'react';

const EditarProductoModal = ({ productoSeleccionado, mostrarModal, handleEditarProducto, setMostrarModal }) => {
  // Verifica si productoSeleccionado es null o undefined
  if (!productoSeleccionado) {
    return null; // O puedes mostrar un mensaje indicando que no hay producto seleccionado
  }

  return (
    <div className={`modal fade ${mostrarModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: mostrarModal ? 'block' : 'none' }}>
      {/* Contenido de la ventana modal */}
      <div className="modal-dialog" role="document">
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
              <label>Nombre:</label>
              <input
                type="text"
                value={productoSeleccionado.nombre}
                onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, nombre: e.target.value })}
              />
              {/* Agrega campos similares para otros detalles del producto (descripcion, precio, etc.) */}

              {/* Botón para guardar los cambios */}
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarProductoModal;
