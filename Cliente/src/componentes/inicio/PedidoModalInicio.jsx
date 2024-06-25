import { useState } from 'react';
import axios from 'axios';
import '../../styles/menu/PedidoModalMenu.scss'; // Importa el archivo de estilos

export const PedidoModalInicio = ({ producto, mostrarModal, setMostrarModal, id_cliente }) => {
  const [cantidad, setCantidad] = useState(1); // Inicializar con 1 para evitar valores cero

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:3001/cart', {
        id_cliente,
        id_producto: producto.id_producto,
        cantidad,
      });
      alert('Producto añadido al carrito con éxito.');
      setMostrarModal(false);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al añadir el producto al carrito. Por favor, inténtalo de nuevo.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!id_cliente) {
      // Redireccionar al usuario al login si no está autenticado
      window.location.href = '/';
      return;
    }

    try {
      await axios.post('http://localhost:3001/cart', {
        id_cliente,
        id_producto: producto.id_producto,
        cantidad,
      });

      const response = await axios.post('http://localhost:3001/orders', {
        id_cliente,
      });
      alert(`Pedido realizado con éxito: ${response.data.message}`);
      setMostrarModal(false);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al realizar el pedido. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div>
      {mostrarModal && (
        <div
          className="modal-backdrop"
          onClick={() => setMostrarModal(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />
      )}

      <div className={`modal ${mostrarModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: mostrarModal ? 'block' : 'none' }} onClick={handleModalClick}>
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
              <p><strong>Precio: ${producto.precio}</strong></p>
              <form onSubmit={(e) => e.preventDefault()}>
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
                <div className="d-flex justify-content-between mt-3">
                  {id_cliente && (
                    <button type="button" className="btn btn-primary custom-button1" onClick={handleAddToCart}>
                      Añadir al Carrito
                    </button>
                  )}
                  <button type="button" className="btn btn-success custom-button2" onClick={handlePlaceOrder}>
                    {id_cliente ? 'Realizar Pedido' : 'Iniciar Sesión para Realizar Pedido'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoModalInicio;
