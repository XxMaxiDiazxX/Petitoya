// OrdersManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/super/pendientes');
      setOrders(response.data);
      setError(null); // Reiniciar el estado de error si la carga fue exitosa
    } catch (error) {
      console.error('Error fetching pending orders:', error.message);
      setError('Error al cargar los pedidos pendientes. Inténtelo de nuevo más tarde.'); // Mensaje de error
    }
  };

  const handleUpdateOrderStatus = async (idPedido, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:3001/super/${idPedido}`, { nuevoEstado });
      const updatedOrders = orders.map(order => {
        if (order.id_pedido === idPedido) {
          return { ...order, estado: nuevoEstado };
        }
        return order;
      });
      setOrders(updatedOrders); // Actualizar el estado de orders
      setError(null); // Reiniciar el estado de error si la actualización fue exitosa
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error al actualizar el estado del pedido. Inténtelo de nuevo más tarde.'); // Mensaje de error
    }
  };

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="col-md-6">
          <h2>Pedidos Pendientes</h2>
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
                  <button
                    type="button"
                    className={`btn btn-sm ${order.estado === 'en proceso' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleUpdateOrderStatus(order.id_pedido, 'en proceso')}
                  >
                    Marcar como En Proceso
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${order.estado === 'por entrega' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleUpdateOrderStatus(order.id_pedido, 'por entrega')}
                  >
                    Marcar como Por Entrega
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${order.estado === 'entregado' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleUpdateOrderStatus(order.id_pedido, 'entregado')}
                  >
                    Marcar como Entregado
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default OrdersManagement;
