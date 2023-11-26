// EditarProductoModal.js

const EditarProductoModal = ({ productoSeleccionado, mostrarModal, handleEditarProducto, setMostrarModal, setProductoSeleccionado }) => {
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
                value={productoSeleccionado.nombre || ''}
                onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, nombre: e.target.value })}
              />

              {/* Agrega campos similares para otros detalles del producto (descripcion, precio, etc.) */}
              <label>Descripción:</label>
              <input
                type="text"
                value={productoSeleccionado.descripcion || ''}
                onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, descripcion: e.target.value })}
              />

              <label>Precio:</label>
              <input
                type="text"
                value={productoSeleccionado.precio || ''}
                onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, precio: e.target.value })}
              />

              <label>Categoría:</label>
              <label>Categoría:</label>
              <select
                value={productoSeleccionado.categoria || ''}
                onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, categoria: e.target.value })}
              >
                <option value="">Selecciona una categoría</option>
                <option value="Comida">Comida</option>
                <option value="Bebida">Bebida</option>
              </select>

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
