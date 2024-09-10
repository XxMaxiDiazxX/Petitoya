import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Importar toast y ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Estilos CSS para react-toastify
import "../../styles/menu/PedidoModalMenu.scss"; // Importa el archivo de estilos
import { Modal } from "react-bootstrap"; // Importa Modal de react-bootstrap

const apiUrl = import.meta.env.VITE_API_URL;

export const PedidoModalMenu = ({
  producto,
  mostrarModal,
  setMostrarModal,
  id_cliente,
  isLoggedIn,
}) => {
  const [cantidad, setCantidad] = useState(1); // Inicializar con 1 para evitar valores cero
  const [mostrarConfirmacionAgregar, setMostrarConfirmacionAgregar] = useState(false);
  const [mostrarConfirmacionPedido, setMostrarConfirmacionPedido] = useState(false);
  const urlImagen = `${apiUrl}/${producto.imagenSrc}`;
  const modalRef = useRef(null);

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.info("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    try {
      await axios.post(`${apiUrl}/cart`, {
        id_cliente,
        id_producto: producto.id_producto,
        cantidad,
      });

      // Mostrar notificación de éxito
      toast.success("Producto añadido al carrito con éxito", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setMostrarModal(false);
    } catch (error) {
      console.error(error);
      // Mostrar notificación de error
      toast.error(
        "Hubo un error al añadir el producto al carrito. Por favor, inténtalo de nuevo",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.info("Debes iniciar sesión para realizar un pedido.");
      return;
    }
  
    try {
      // Realizar el pedido de un producto específico
      await axios.post(`${apiUrl}/orders/pedido`, {
        id_cliente,
        id_producto: producto.id_producto,
        cantidad,
      });
  
      // Mostrar notificación de éxito
      toast.success("Pedido realizado con éxito", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      setMostrarModal(false);
    } catch (error) {
      console.error(error);
      // Mostrar notificación de error
      toast.error(
        "Hubo un error al realizar el pedido. Por favor, inténtalo de nuevo",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };
  

  const confirmarAgregarAlCarrito = () => {
    handleAddToCart();
    setMostrarConfirmacionAgregar(false);
  };

  const confirmarRealizarPedido = () => {
    handlePlaceOrder();
    setMostrarConfirmacionPedido(false);
  };

  return (
    <div>
      {mostrarModal && (
        <div
          className="modal-backdrop"
          onClick={() => setMostrarModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        ></div>
      )}

      <div
        className={`modal ${mostrarModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{
          display: mostrarModal ? "block" : "none",
          position: "fixed",
          zIndex: 1050,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onClick={handleModalClick}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Realizar Pedido</h5>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => setMostrarModal(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img
                src={urlImagen}
                alt="Imagen del producto"
                className="card-img-top"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
              <h5>{producto.nombre}</h5>
              <p>{producto.descripcion}</p>
              <p>
                <strong>Precio: ${producto.precio}</strong>
              </p>
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
                  <button
                    type="button"
                    className="btn btn-primary custom-button1"
                    onClick={() => setMostrarConfirmacionAgregar(true)}
                  >
                    Añadir al Carrito
                  </button>
                  <button
                    type="button"
                    className="btn btn-success custom-button1"
                    onClick={() => setMostrarConfirmacionPedido(true)}
                  >
                    Realizar Pedido
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Modal show={mostrarConfirmacionAgregar} onHide={() => setMostrarConfirmacionAgregar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Añadir al Carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas añadir el producto al carrito?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn custom-button1"
            onClick={() => setMostrarConfirmacionAgregar(false)}
          >
            Cancelar
          </button>
          <button
            className="btn custom-button2"
            onClick={confirmarAgregarAlCarrito}
          >
            Confirmar
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={mostrarConfirmacionPedido} onHide={() => setMostrarConfirmacionPedido(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas realizar el pedido con los productos actuales? Una vez realizado el pedido, no se podrá cancelar.
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn custom-button1"
            onClick={() => setMostrarConfirmacionPedido(false)}
          >
            Cancelar
          </button>
          <button
            className="btn custom-button2"
            onClick={confirmarRealizarPedido}
          >
            Confirmar Pedido
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PedidoModalMenu;
