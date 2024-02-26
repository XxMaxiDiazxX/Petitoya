// Menu.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import imagen from '../../img/cafe.jpg';
import { useAuth } from '../autenticacion/AuthContext';
import AnadirProducto from '../AdminSupremo/AnadirProducto';
import Producto from './Producto';
import EditarProductoModal from '../AdminSupremo/EditarProductoModal';
import EliminarProducto from '../AdminSupremo/DesactivarProducto';
import PedidoModal from './PedidoModal';

export const Menu = () => {
    const { isLoggedIn, isAdmin } = useAuth();
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarPedidoModal, setMostrarPedidoModal] = useState(false);



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

    const handleEditarProducto = async (e) => {
        e.preventDefault();

        try {
            // Realiza la solicitud de actualización al servidor
            await axios.put(
                `http://localhost:3001/productos/${productoSeleccionado.id_producto}`,
                {
                    nombre: productoSeleccionado.nombre,
                    descripcion: productoSeleccionado.descripcion,
                    precio: productoSeleccionado.precio,
                    categoria: productoSeleccionado.categoria,
                    estado: productoSeleccionado.estado
                }

            );

            // Actualiza la lista de productos después de la edición
            const response = await axios.get('http://localhost:3001/productos');
            setProductos(response.data);

            // Cierra la ventana modal después de la edición
            setMostrarModal(false);
        } catch (error) {
            console.error('Error al editar el producto:', error);
        }
    };

    const handleAbrirPedidoModal = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarPedidoModal(true);
    };


    return (
        <div className='content'>
            <div className="row">
                {isLoggedIn && isAdmin && (
                    <AnadirProducto setProductos={setProductos} />
                )}

                <div className="col-md">
                    <h4 className='cuerpo'>Comidas</h4>
                    <div className='container mt-4'>
                        {/* Renderiza los productos de comida aquí */}
                        {productosComidas.map(producto => (
                            (producto.estado !== "inactivo") && (
                                <div key={producto.id_producto}>
                                    <Producto
                                        nombre={producto.nombre}
                                        descripcion={producto.descripcion}
                                        precio={producto.precio}
                                        imagenSrc={imagen}
                                    />

                                    {!isLoggedIn || !isAdmin ? (
                                        <button
                                            className='btn btn-primary'
                                            onClick={() => handleAbrirPedidoModal(producto)}
                                        >
                                            Realizar Pedido
                                        </button>
                                    ) : null}

                                    {isLoggedIn && isAdmin && (
                                        <div className="d-flex">
                                            <button
                                                className='btn btn-primary'
                                                onClick={() => {
                                                    setProductoSeleccionado(producto);
                                                    setMostrarModal(true);
                                                }}
                                            >
                                                Editar Producto
                                            </button>
                                            <EliminarProducto
                                                id_producto={producto.id_producto}
                                                setProductos={setProductos}  // Asegúrate de pasar setProductos aquí
                                                onProductoEliminado={(id) => {
                                                    // Lógica para actualizar la lista de productos después de la eliminación
                                                    const updatedProductos = productos.filter(p => p.id_producto !== id);
                                                    setProductos(updatedProductos);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </div>
                <div className="col-md">
                    <h4 className='cuerpo'>Bebidas</h4>
                    {/* Renderiza los productos de bebida aquí */}
                    <div className='container mt-4'>
                        {productosBebidas.map(producto => (
                            (producto.estado !== "inactivo") && (

                                <div key={producto.id_producto}>
                                    <Producto
                                        nombre={producto.nombre}
                                        descripcion={producto.descripcion}
                                        precio={producto.precio}
                                        imagenSrc={imagen}
                                    />

                                    {!isLoggedIn || !isAdmin ? (
                                        <button
                                            className='btn btn-primary'
                                            onClick={() => handleAbrirPedidoModal(producto)}
                                        >
                                            Realizar Pedido
                                        </button>
                                    ) : null}
                                    {isLoggedIn && isAdmin && (
                                        <div className="d-flex">
                                            <button
                                                className='btn btn-primary'
                                                onClick={() => {
                                                    setProductoSeleccionado(producto);
                                                    setMostrarModal(true);
                                                }}
                                            >
                                                Editar Producto
                                            </button>
                                            <EliminarProducto
                                                id_producto={producto.id_producto}
                                                setProductos={setProductos}  // Asegúrate de pasar setProductos aquí
                                                onProductoEliminado={(id) => {
                                                    // Lógica para actualizar la lista de productos después de la eliminación
                                                    const updatedProductos = productos.filter(p => p.id_producto !== id);
                                                    setProductos(updatedProductos);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
            {mostrarModal && productoSeleccionado && (
                <EditarProductoModal
                    productoSeleccionado={productoSeleccionado}
                    mostrarModal={mostrarModal}
                    handleEditarProducto={handleEditarProducto}
                    setMostrarModal={setMostrarModal}
                    setProductoSeleccionado={setProductoSeleccionado}
                />

            )}

            {mostrarPedidoModal && productoSeleccionado && (
                <PedidoModal
                    producto={productoSeleccionado}
                    mostrarModal={mostrarPedidoModal}
                    setMostrarModal={setMostrarPedidoModal}
                />
            )}


        </div>
    );
};

