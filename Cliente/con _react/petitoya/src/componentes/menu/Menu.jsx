import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente de Producto (puedes mantener tu componente existente)
const Producto = ({ nombre, descripcion, precio, imagenSrc }) => (
    <div className="card mb-4 box-shadow">
        <img className="card-img-top" src={imagenSrc} alt={nombre} />
        <div className="card-body">
            <h5 className="card-title">{nombre}</h5>
            <p className="card-text">{descripcion}</p>
            <p className="card-text">{`Precio: ${precio}`}</p>
        </div>
    </div>
);

// Componente Comidas (puedes tener algo similar para Bebidas)
const Comidas = ({ productos }) => (
    <>
        {productos.map((producto, index) => (
            <Producto
                key={index}
                nombre={producto.nombre}
                descripcion={producto.descripcion}
                precio={producto.precio}
                imagenSrc={producto.imagen_url}
            />
        ))}
    </>
);

const Menu = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/productos');
                setProductos(response.data);
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };

        fetchProductos();
    }, []);

    const productosComidas = productos.filter(producto => producto.categoria === 'Comida');
    const productosBebidas = productos.filter(producto => producto.categoria === 'Bebida');

    return (
        <div className="sugerencias d-flex">
            <div className="comidas flex-grow-1 pr-3">
                <h4>Comidas</h4>
                {/* Renderiza los productos de comida aquí */}
                {productosComidas.map(producto => (
                    <div key={producto.id_producto}>
                        {/* Muestra la información del producto */}
                        <p>{producto.nombre}</p>
                        <p>{producto.descripcion}</p>
                        <p>{producto.precio}</p>
                    </div>
                ))}
            </div>
            <div className="bebidas red flex-grow-1 pr-3">
                <h4>Bebidas</h4>
                {/* Renderiza los productos de bebida aquí */}
                {productosBebidas.map(producto => (
                    <div key={producto.id_producto}>
                        {/* Muestra la información del producto */}
                        <p>{producto.nombre}</p>
                        <p>{producto.descripcion}</p>
                        <p>{producto.precio}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
