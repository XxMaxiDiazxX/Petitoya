import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/pedidos/Item.scss'; // Importa el archivo SCSS para los estilos personalizados

const Pedido = ({ id_pedido, estado, fecha_compra }) => {
    // Función para formatear la fecha de compra
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', options); // Ajusta 'es-ES' según tu localización
    };
  
    return (
      <div className="card custom-card">
        <div className="card-body">
          <h5 className="card-title">{`Pedido ID: ${id_pedido}`}</h5>
          <p className="card-text">{`Estado: ${estado}`}</p>
          <p className="card-text">{`Fecha de Compra: ${formatDate(fecha_compra)}`}</p>
        </div>
      </div>
    );
  };


export const Item = ({ id_cliente }) => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                // Hacer la solicitud solo para los pedidos del cliente específico
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
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Item;
