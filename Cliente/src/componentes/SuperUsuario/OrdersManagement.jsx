import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrdersManagement = () => {
  const [ordersType, setOrdersType] = useState('pendiente'); // Estado para controlar el tipo de pedidos
  const [orders, setOrders] = useState([]); // Estado para almacenar los pedidos según el tipo seleccionado
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    fetchOrders(ordersType); // Llamar a la función para obtener los pedidos iniciales
  }, [ordersType]); // Ejecutar cada vez que cambie ordersType

  // Función para obtener pedidos según el tipo seleccionado
  const fetchOrders = async (type) => {
    let url = `http://localhost:3001/super/${type}`;

    try {
      const response = await axios.get(url);
      setOrders(response.data);
      setError(null); // Reiniciar el estado de error si la carga fue exitosa
    } catch (error) {
      console.error(`Error fetching ${type} orders:`, error.message);
      setError('Error al cargar los pedidos. Inténtelo de nuevo más tarde.'); // Mensaje de error
    }
  };

  // Función para actualizar el estado de un pedido
  const handleUpdateOrderStatus = async (idPedido, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:3001/super/${idPedido}`, { nuevoEstado });
      // Actualizar el estado localmente después de la actualización en el servidor
      const updatedOrders = orders.map(order => {
        if (order.id_pedido === idPedido) {
          return { ...order, estado: nuevoEstado };
        }
        return order;
      });
      setOrders(updatedOrders);
      setError(null); // Reiniciar el estado de error si la actualización fue exitosa

      // Mostrar notificación de éxito
      toast.success(`El estado del pedido ${idPedido} se ha actualizado a ${nuevoEstado}.`);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error al actualizar el estado del pedido. Inténtelo de nuevo más tarde.'); // Mensaje de error
    }
  };

  // Función para cambiar el tipo de pedidos mostrados
  const changeOrdersType = (type) => {
    setOrdersType(type);
  };

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="col-md-6">
          <h2>Pedidos {ordersType.charAt(0).toUpperCase() + ordersType.slice(1)}</h2>
        </div>
        <div className="col-md-6 d-flex justify-content-end align-items-center">
          <div className="btn-group" role="group" aria-label="Opciones de tipo de pedidos">
            <button
              type="button"
              className={`btn ${ordersType === 'pendiente' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('pendiente')}
            >
              Pendientes
            </button>
            <button
              type="button"
              className={`btn ${ordersType === 'en proceso' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('en proceso')}
            >
              En Proceso
            </button>
            <button
              type="button"
              className={`btn ${ordersType === 'por entrega' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('por entrega')}
            >
              Por Entrega
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {orders.map(order => (
          <div key={order.id_pedido} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">ID Pedido: {order.id_pedido}</h5>
                <p className="card-text">Cliente: {order.id_cliente}</p>
                <p className="card-text">Estado: {order.estado}</p>
                <p className="card-text">Fecha de Compra: {new Date(order.fecha_compra).toLocaleString()}</p>
                <div className="btn-group" role="group" aria-label="Opciones de estado">
                  {ordersType === 'pendiente' && (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => handleUpdateOrderStatus(order.id_pedido, 'en proceso')}
                    >
                      Marcar como En Proceso
                    </button>
                  )}
                  {ordersType === 'en proceso' && (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => handleUpdateOrderStatus(order.id_pedido, 'por entrega')}
                    >
                      Marcar como Por Entrega
                    </button>
                  )}
                  {ordersType === 'por entrega' && (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => handleUpdateOrderStatus(order.id_pedido, 'entregado')}
                    >
                      Marcar como Entregado
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <ToastContainer />
    </div>
  );
};

export default OrdersManagement;
