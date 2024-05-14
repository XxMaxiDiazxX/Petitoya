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
                const response = await axios.get('http://localhost:3001/products');
                setProductos(response.data);
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };

        fetchProductos();
    }, []);

    const handleEditarProducto = async () => {
        try {
            await axios.put(
                `http://localhost:3001/api/products/${productoSeleccionado.id_producto}`,
                productoSeleccionado
            );

            const response = await axios.get('http://localhost:3001/products');
            setProductos(response.data);

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
                {isLoggedIn && isAdmin && <AnadirProducto setProductos={setProductos} />}

                <div className="col-md">
                    <h4 className='cuerpo'>Comidas</h4>
                    <div className='container mt-4'>
                        {productos.map(producto => (
                            producto.categoria === 'Comida' && producto.estado !== 'inactivo' && (
                                <div key={producto.id_producto}>
                                    <Producto
                                        nombre={producto.nombre}
                                        descripcion={producto.descripcion}
                                        precio={producto.precio}
                                        imagenSrc={`data:image/jpeg;base64,${producto.imagenBase64}`}
                                    />
                                    {!isLoggedIn || !isAdmin ? (
                                        <button
                                            className='btn btn-primary'
                                            onClick={() => handleAbrirPedidoModal(producto)}
                                        >
                                            Realizar Pedido
                                        </button>
                                    ) : (
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
                                                setProductos={setProductos}
                                                onProductoEliminado={(id) => {
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
                    <div className='container mt-4'>
                        {productos.map(producto => (
                            producto.categoria === 'Bebida' && producto.estado !== 'inactivo' && (
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
                                    ) : (
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
                                                setProductos={setProductos}
                                                onProductoEliminado={(id) => {
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

export default Menu;
