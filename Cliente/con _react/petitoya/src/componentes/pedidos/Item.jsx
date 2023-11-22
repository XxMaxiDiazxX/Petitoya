import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente de Producto (puedes mantener tu componente existente)
const Producto = ({ nombre, descripcion, precio, imagenSrc }) => (
    <div className="card custom-card">
        <img className="card-img-top" src={imagenSrc} alt={nombre} />
        <div className="card-body">
            <h5 className="card-title">{nombre}</h5>
            <p className="card-text">{descripcion}</p>
            <p className="card-text">{`Precio: ${precio}`}</p>
        </div>
    </div>
);

export const Item = () => {
    const [productos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/pedidos');
                setPedidos(response.data);
            } catch (error) {
                console.error('Error fetching Pedidos:', error);
            }
        };

        fetchProductos();
    }, []);

    return (
        <div className="sugerencias d-flex">

            {/* Renderiza los productos de comida aquí */}
            {productos.map(producto => (
                <Producto
                    key={producto.id_pedido}
                    nombre={producto.id_cliente}
                    descripcion={producto.estado}
                    precio={producto.fecha_compra}
                    imagenSrc={producto.imagen_url}
                />
            ))}
        </div>
    );
};
