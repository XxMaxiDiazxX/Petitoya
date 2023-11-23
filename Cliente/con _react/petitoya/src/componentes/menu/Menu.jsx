import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente de Producto (puedes mantener tu componente existente)
const Producto = ({ nombre, descripcion, precio, imagenSrc }) => (
    <div className='container'>
        <div className="row">
            <div className='col-md-2 d-flex align-items-center justify-content-center red' style={{  minWidth: '120px'}}>
                <img
                    className="rounded-circle red"
                    src={imagenSrc}
                    alt={nombre}
                    style={{ width: '90px', height: '90px' }}
                />
            </div>
            <div className="col-md red">
                <h5 className="card-title">{nombre}</h5>
                <p className="card-text">{descripcion}</p>
                <p className="card-text">{`Precio: ${precio}`}</p>
            </div>
        </div>
    </div>
);



export const Menu = () => {
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
        <div className='content'>
            <div className="row">
                <div className="col-md">
                    <h4>Comidas</h4>
                    {/* Renderiza los productos de comida aquí */}
                    {productosComidas.map(producto => (
                        <Producto
                            key={producto.id_producto}
                            nombre={producto.nombre}
                            descripcion={producto.descripcion}
                            precio={producto.precio}
                            imagenSrc={producto.imagen_url}
                        />
                    ))}
                </div>
                <div className="col-md">
                    <h4>Bebidas</h4>
                    {/* Renderiza los productos de bebida aquí */}
                    {productosBebidas.map(producto => (
                        <Producto
                            key={producto.id_producto}
                            nombre={producto.nombre}
                            descripcion={producto.descripcion}
                            precio={producto.precio}
                            imagenSrc={producto.imagen_url}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
