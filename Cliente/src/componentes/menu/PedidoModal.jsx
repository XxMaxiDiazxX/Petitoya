// PedidoModal.js
import { useState } from 'react';


export const PedidoModal = ({ producto, mostrarModal, setMostrarModal }) => {
  const [cantidad, setCantidad] = useState(0);

  const handleModalClick = (e) => {
    // Evita que los clics lleguen a los elementos detrás de la modal
    e.stopPropagation();
  };

  const handlePedidoSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar el pedido al servidor o realizar alguna acción con la cantidad y el producto seleccionados
    console.log(`Pedido realizado: ${cantidad} x ${producto.nombre}`);
    // Cierra la ventana modal después de enviar el pedido
    setMostrarModal(false);
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
              <h5 className="modal-title">Realizar Pedido</h5>
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
              <h5>{producto.nombre}</h5>
              <p>{producto.descripcion}</p>
              <p>{`Precio: ${producto.precio}`}</p>
              <form onSubmit={handlePedidoSubmit}>
                <div className="form-group">
                  <label htmlFor="cantidad">Cantidad:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="cantidad"
                    value={cantidad}
                    min={1}
                    onChange={(e) => setCantidad(parseInt(e.target.value))}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Realizar Pedido</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoModal;