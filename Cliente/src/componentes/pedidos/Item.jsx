import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pedido from './Pedido'; // Asegúrate de importar el componente Pedido
import '../../styles/pedidos/Item.scss'; // Importa el archivo SCSS para los estilos personalizados

export const Item = ({ id_cliente }) => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/orders/cliente/${id_cliente}`);
        setPedidos(response.data);
      } catch (error) {
        console.error('Error fetching Pedidos:', error);
      }
    };

    fetchPedidos();
  }, [id_cliente]);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {pedidos.map(pedido => (
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
