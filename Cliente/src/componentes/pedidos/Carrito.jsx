import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../autenticacion/AuthContext';

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.id) {
            const fetchCarrito = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/cart/${user.id}`);
                    setCarrito(response.data);
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
            // Primero realizamos la solicitud para crear el pedido
            const response = await axios.post(`http://localhost:3001/orders`, {
                id_cliente: user.id,
                productos: carrito
            });
    
            // Verificar si el pedido se creó correctamente en el backend
            if (response.data && response.data.id_pedido) {
                // Si todo está bien, actualizar el estado local o realizar otras acciones necesarias
                setCarrito([]); // Vaciamos el carrito localmente después de realizar el pedido
                alert('Pedido realizado con éxito');
            } else {
                // Manejar cualquier error o situación inesperada
                alert('Error al realizar el pedido');
            }
        } catch (error) {
            // Manejar errores de red o del servidor
            console.error('Error realizando pedido:', error);
            alert('Error al realizar el pedido');
        }
    };
        

    return (
        <div className="carrito">
            <h2>Carrito de Compras</h2>
            {carrito.length === 0 ? (
                <p>No hay productos en el carrito.</p>
            ) : (
                <div>
                    {carrito.map((producto) => (
                        <div key={producto.id_producto} className="carrito-item">
                            <img src={`data:image/jpeg;base64,${producto.imagenBase64}`} alt={producto.nombre} style={{ width: '50px', height: '50px' }} />
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
                                <button onClick={() => handleEliminarProducto(producto.id_producto)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleRealizarPedido}>Realizar Pedido</button>
                </div>
            )}
        </div>
    );
};

export default Carrito;
