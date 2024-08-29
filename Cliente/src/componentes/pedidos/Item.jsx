import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pedido from './Pedido'; // Asegúrate de importar el componente Pedido
import '../../styles/pedidos/Item.scss'; // Importa el archivo SCSS para los estilos personalizados
const apiUrl = import.meta.env.VITE_API_URL;

export const Item = ({ id_cliente }) => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [ordersType, setOrdersType] = useState('pendiente'); // Default filter

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(`${apiUrl}/orders/cliente/${id_cliente}`);
        setPedidos(response.data);
        filterPedidos(response.data, 'pendiente'); // Initial filter on first load
      } catch (error) {
        console.error('Error fetching Pedidos:', error);
      }
    };

    fetchPedidos();
  }, [id_cliente]);

  const filterPedidos = (pedidos, status) => {
    const filtered = pedidos.filter(pedido => pedido.estado === status);
    setFilteredPedidos(filtered);
  };

  const changeOrdersType = (type) => {
    setOrdersType(type);
    filterPedidos(pedidos, type);
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
              className={`btn ${ordersType === 'pendiente' ? 'custom-button' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('pendiente')}
            >
              Pendientes
            </button>
            <button
              type="button"
              className={`btn ${ordersType === 'en proceso' ? 'custom-button' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('en proceso')}
            >
              En Proceso
            </button>
            <button
              type="button"
              className={`btn ${ordersType === 'por entrega' ? 'custom-button' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('por entrega')}
            >
              Por Entrega
            </button>
            <button
              type="button"
              className={`btn ${ordersType === 'entregado' ? 'custom-button' : 'btn-secondary'}`}
              onClick={() => changeOrdersType('entregado')}
            >
              Entregado
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {filteredPedidos.map(pedido => (
          <div key={pedido.id_pedido} className="col-md-6 col-lg-4 mb-4">
            <Pedido
              id_pedido={pedido.id_pedido}
              estado={pedido.estado}
              fecha_compra={pedido.fecha_compra}
              total_pagar={pedido.monto_total} // Nueva prop total_pagar
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Item;
