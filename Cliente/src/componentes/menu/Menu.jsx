import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Producto from './Producto';
import { useAuth } from '../autenticacion/AuthContext';
import AnadirProducto from '../AdminSupremo/AnadirProducto';
import EditarProductoModal from '../AdminSupremo/EditarProductoModal';
import EliminarProducto from '../AdminSupremo/DesactivarProducto';
import PedidoModalMenu from './PedidoModalMenu';
import '../../styles/menu/Menu.scss'; // Importa tu archivo de estilos SASS o CSS

const apiUrl = 'http://localhost:3001/';

export const Menu = () => {
    const { isLoggedIn, role, user } = useAuth();
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarPedidoModal, setMostrarPedidoModal] = useState(false);
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${apiUrl}products`);
                setProductos(response.data);
                
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };

        fetchProductos();
    }, []);

    const handleEditarProducto = async (productoEditado) => {
        try {
            await axios.put(
                `http://localhost:3001/products/${productoSeleccionado.id_producto}`,
                productoSeleccionado
            );

            const response = await axios.get(`${apiUrl}/products`);
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


    const handleRealizarPedido = async () => {
        try {
            await axios.post(`${apiUrl}/orders`, {
                id_cliente: user.id_cliente,
                productos: carrito // Asegúrate de tener definida la variable `carrito` en tu contexto
            });
            setCarrito([]); // Asegúrate de tener definida la variable `setCarrito` en tu contexto
        } catch (error) {
            console.error('Error realizando pedido:', error);
        }
    };

    return (
        <div className='content'>
            <div className="row">
                {isLoggedIn && (role === 2 || role === 3) && <AnadirProducto setProductos={setProductos} />}

                <div className="col-md-6 col-lg-6">
                    <h4 className='cuerpo'>Comidas</h4>
                    <div className='container mt-4'>
                        {productos.map(producto => (
                            producto.categoria === 'Comida' && producto.estado !== 'inactivo' && (
                                <div key={producto.id_producto} className="producto-item">
                                    <Producto
                                        nombre={producto.nombre}
                                        descripcion={producto.descripcion}
                                        precio={producto.precio}
                                        imagenSrc={`${apiUrl}${producto.imagenSrc}`} // Ajustar según la estructura de la API y la ruta de las imágenes
                                        onClick={() => handleAbrirPedidoModal(producto)}
                                    />
                                    {isLoggedIn && (role === 2 || role === 3) && (
                                        <div className="d-flex">
                                            <button
                                                className='btn btn-primary me-2'
                                                onClick={() => handleAbrirEditarProductoModal(producto)}
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
                <div className="col-md-6 col-lg-6">
                    <h4 className='cuerpo'>Bebidas</h4>
                    <div className='container mt-4'>
                        {productos.map(producto => (
                            producto.categoria === 'Bebida' && producto.estado !== 'inactivo' && (
                                <div key={producto.id_producto} className="producto-item">
                                    <Producto
                                        nombre={producto.nombre}
                                        descripcion={producto.descripcion}
                                        precio={producto.precio}
                                        imagenSrc={`${apiUrl}${producto.imagenSrc}`} // Ajustar según la estructura de la API y la ruta de las imágenes
                                        onClick={() => handleAbrirPedidoModal(producto)}
                                    />
                                    {isLoggedIn && (role === 2 || role === 3) && (
                                        <div className="d-flex">
                                            <button
                                                className='btn btn-primary me-2'
                                                onClick={() => handleAbrirEditarProductoModal(producto)}
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
                <PedidoModalMenu
                    producto={productoSeleccionado}
                    mostrarModal={mostrarPedidoModal}
                    setMostrarModal={setMostrarPedidoModal}
                    id_cliente={user.id}
                />
            )}
        </div>
    );
};

export default Menu;
