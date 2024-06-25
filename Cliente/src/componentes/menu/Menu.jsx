import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Producto from './Producto';
import { useAuth } from '../autenticacion/AuthContext';
import AnadirProducto from '../AdminSupremo/AnadirProducto';
import EditarProductoModal from '../AdminSupremo/EditarProductoModal';
import EliminarProducto from '../AdminSupremo/DesactivarProducto';
import PedidoModalMenu from './PedidoModalMenu';
import { ToastContainer, toast } from 'react-toastify'; // Importar ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Estilos CSS para react-toastify
import '../../styles/menu/Menu.scss'; // Importa tu archivo de estilos SASS o CSS

const apiUrl = 'http://localhost:3001/';

export const Menu = () => {
    const { isLoggedIn, role, user } = useAuth();
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarPedidoModal, setMostrarPedidoModal] = useState(false);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${apiUrl}products`);
                const productosActivos = response.data.filter(producto => producto.estado !== 'inactivo');
                setProductos(productosActivos);
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };
        console.log(productos);
        fetchProductos();
    }, []);

    const handleEditarProducto = async (productoEditado) => {
        try {
            await axios.put(
                `${apiUrl}products/${productoSeleccionado.id_producto}`,
                productoSeleccionado
            );

            const response = await axios.get(`${apiUrl}products`);
            const productosActivos = response.data.filter(producto => producto.estado !== 'inactivo');
            setProductos(productosActivos);
            setMostrarModal(false);

            // Mostrar notificación de éxito
            toast.success('Producto editado exitosamente', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Error al editar el producto:', error);
            // Mostrar notificación de error
            toast.error('Error al editar el producto', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleAbrirEditarProductoModal = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarModal(true);
    }

    const handleAbrirPedidoModal = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarPedidoModal(true);
    };

    return (
        <div className='content'>
            <ToastContainer /> {/* Contenedor de las notificaciones */}
            {role !== 2 && role !==3 && (
                <div className="row">

                    <div className="col-md-6 col-lg-6">
                        <h4 className='cuerpo'>Comidas</h4>
                        <div className='container mt-4'>
                            {productos.map(producto => (
                                producto.categoria === 'Comida' && (
                                    <div key={producto.id_producto} className="producto-item">
                                        <Producto
                                            nombre={producto.nombre}
                                            descripcion={producto.descripcion}
                                            precio={producto.precio}
                                            imagenSrc={`${apiUrl}${producto.imagenSrc}`}
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
                                producto.categoria === 'Bebida' && (
                                    <div key={producto.id_producto} className="producto-item">
                                        <Producto
                                            nombre={producto.nombre}
                                            descripcion={producto.descripcion}
                                            precio={producto.precio}
                                            imagenSrc={`${apiUrl}${producto.imagenSrc}`}
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

            )}

            {isLoggedIn && (role === 2 || role === 3) && (
                <div className="row mt-4">
                    {isLoggedIn && (role === 2 || role === 3) && <AnadirProducto setProductos={setProductos} />}

                    <div className="col-md-12">
                        <h4 className='cuerpo'>Todos los Productos</h4>
                        <table className="table table-striped mt-4">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(producto => (
                                    <tr key={producto.id_producto}>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.descripcion}</td>
                                        <td>{producto.precio}</td>
                                        <td>
                                            <button
                                                className='btn btn-primary me-2 custom-button1'
                                                onClick={() => handleAbrirEditarProductoModal(producto)}
                                            >
                                                Editar
                                            </button>
                                            <EliminarProducto
                                                id_producto={producto.id_producto}
                                                setProductos={setProductos}
                                                onProductoEliminado={(id) => {
                                                    const updatedProductos = productos.filter(p => p.id_producto !== id);
                                                    setProductos(updatedProductos);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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
