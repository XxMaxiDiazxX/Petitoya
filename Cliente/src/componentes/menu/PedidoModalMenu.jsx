import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Importar toast y ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Estilos CSS para react-toastify
import "../../styles/menu/PedidoModalMenu.scss"; // Importa el archivo de estilos
import { useAuth } from "../autenticacion/AuthContext";

const apiUrl = "http://localhost:3001/";

export const PedidoModalMenu = ({
  producto,
  mostrarModal,
  setMostrarModal,
  id_cliente,
  isLoggedIn,
}) => {
  const [cantidad, setCantidad] = useState(1); // Inicializar con 1 para evitar valores cero
  const urlImagen = `${apiUrl}${producto.imagenSrc}`;
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
      await axios.post("http://localhost:3001/cart", {
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
      await axios.post("http://localhost:3001/cart", {
        id_cliente,
        id_producto: producto.id_producto,
        cantidad,
      });

      const response = await axios.post("http://localhost:3001/orders", {
        id_cliente,
      });

      // Mostrar notificación de éxito
      toast.success(`Pedido realizado con éxito`, {
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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMostrarModal(false);
      }
    };

    if (mostrarModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [mostrarModal, setMostrarModal]);


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
          ref={modalRef}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Realizar Pedido</h5>
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
                    onClick={handleAddToCart}
                  >
                    Añadir al Carrito
                  </button>
                  <button
                    type="button"
                    className="btn btn-success custom-button1"
                    onClick={handlePlaceOrder}
                  >
                    Realizar Pedido
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

export default PedidoModalMenu;
