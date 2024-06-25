import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../autenticacion/AuthContext';
import { Table } from 'react-bootstrap';
import '../../styles/Inicio/Carrito.scss';


const apiUrl = 'http://localhost:3001/';


const Carrito = () => {
    const [carrito, setCarrito] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.id) {
            const fetchCarrito = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/cart/${user.id}`);
                    setCarrito(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error('Error fetching carrito:', error);
                }
            };

            fetchCarrito();
        }
    }, [user]);

    if (!user) {
        return <div>Cargando...</div>; // O cualquier indicador de carga
    }

    const handleCantidadChange = async (id_producto, cantidad) => {
        try {
            await axios.post(`http://localhost:3001/cart`, {
                id_cliente: user.id,
                id_producto,
                cantidad
            });
            setCarrito((prevCarrito) =>
                prevCarrito.map((item) =>
                    item.id_producto === id_producto ? { ...item, cantidad } : item
                )
            );
        } catch (error) {
            console.error('Error updating cantidad:', error);
        }
    };

    const handleEliminarProducto = async (id_producto) => {
        try {
            await axios.delete(`http://localhost:3001/cart/${user.id}/${id_producto}`);
            setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id_producto !== id_producto));
        } catch (error) {
            console.error(`Error eliminando producto ${id_producto} del carrito:`, error);
        }
    };

    const handleRealizarPedido = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/orders`, {
                id_cliente: user.id,
                productos: carrito
            });

            if (response.data && response.data.id_pedido) {
                setCarrito([]);
                alert('Pedido realizado con éxito');
            } else {
                alert('Error al realizar el pedido');
            }
        } catch (error) {
            console.error('Error realizando pedido:', error);
            alert('Error al realizar el pedido');
        }
    };

    return (
        <div className="container mt-4 carrito-container">
            <h2>Carrito de Compras</h2>
            {carrito.length === 0 ? (
                <p>No hay productos en el carrito.</p>
            ) : (
                <>
                    <div className="d-none d-md-block">
                        <Table responsive="sm" striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map((producto) => (
                                    <tr key={producto.id_producto}>
                                        <td>
                                            <img src={`${apiUrl}${producto.imagen}`} alt={producto.nombre} style={{ width: '50px', height: '50px' }} />
                                            {producto.nombre}
                                        </td>
                                        <td>{producto.descripcion}</td>
                                        <td>{producto.precio}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={producto.cantidad}
                                                min="1"
                                                onChange={(e) => handleCantidadChange(producto.id_producto, parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleEliminarProducto(producto.id_producto)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-block d-md-none">
                        {carrito.map((producto) => (
                            <div key={producto.id_producto} className="carrito-item-mobile">
                                <img src={`${apiUrl}${producto.imagen}`} alt={producto.nombre} style={{ width: '50px', height: '50px' }} />
                                <div>
                                    <h4>{producto.nombre}</h4>
                                    <p>{producto.descripcion}</p>
                                    <p>{`Precio: ${producto.precio}`}</p>
                                    <input
                                        type="number"
                                        value={producto.cantidad}
                                        min="1"
                                        onChange={(e) => handleCantidadChange(producto.id_producto, parseInt(e.target.value))}
                                    />
                                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminarProducto(producto.id_producto)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleRealizarPedido}>
                        Realizar Pedido
                    </button>
                </>
            )}
        </div>
    );
};

export default Carrito;
