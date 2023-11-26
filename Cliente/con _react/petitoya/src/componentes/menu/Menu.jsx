import React, { useEffect, useState } from 'react';
import axios from 'axios';
import imagen from '../../img/cafe.jpg';
import { useAuth } from '../autenticacion/AuthContext';
import AnadirProducto from '../AdminSupremo/AnadirProducto';

// Componente de Producto (puedes mantener tu componente existente)
const Producto = ({ nombre, descripcion, precio, imagenSrc }) => (
    <div className="row bg-white mt-4 rounded">
        <div className='col-md-2 d-flex align-items-center justify-content-center' style={{ minWidth: '120px' }}>
            <img
                className="rounded-circle"
                src={imagenSrc}
                alt={nombre}
                style={{ width: '90px', height: '90px' }}
            />
        </div>
        <div className="col-md">
            <h5 className="card-title">{nombre}</h5>
            <p className="card-text">{descripcion}</p>
            <p className="card-text">{`Precio: ${precio}`}</p>
        </div>
    </div>
);

export const Menu = () => {

    const { isLoggedIn, isAdmin } = useAuth();
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

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

    console.log('Mostrar Modal:', mostrarModal);
    console.log('Producto Seleccionado:', productoSeleccionado);

    return (
        <div className='content'>
            <div className="row">
                {isLoggedIn && isAdmin && (
                    <AnadirProducto />
                )}

                <div className="col-md">
                    <h4 className='cuerpo'>Comidas</h4>
                    <div className='container mt-4'>
                        {/* Renderiza los productos de comida aquí */}
                        {productosComidas.map(producto => (
                            <div key={producto.id_producto}>
                                <Producto
                                    nombre={producto.nombre}
                                    descripcion={producto.descripcion}
                                    precio={producto.precio}
                                    imagenSrc={imagen}
                                />
                                {isLoggedIn && isAdmin && (
                                    <button
                                        onClick={() => {
                                            setProductoSeleccionado(producto);
                                            setMostrarModal(true);
                                        }}
                                    >
                                        Editar Producto
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md">
                    <h4 className='cuerpo'>Bebidas</h4>
                    {/* Renderiza los productos de bebida aquí */}
                    <div className='container mt-4'>
                        {productosBebidas.map(producto => (
                            <div key={producto.id_producto}>
                                <Producto
                                    nombre={producto.nombre}
                                    descripcion={producto.descripcion}
                                    precio={producto.precio}
                                    imagenSrc={imagen}
                                />
                                {isLoggedIn && isAdmin && (
                                    <button
                                        onClick={() => {
                                            setProductoSeleccionado(producto);
                                            setMostrarModal(true);
                                        }}
                                    >
                                        Editar Producto
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {mostrarModal && productoSeleccionado && (
                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Producto</h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setMostrarModal(false)}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditarProducto}>
                                    {/* Campos de entrada para la edición del producto */}
                                    <label>Nombre:</label>
                                    <input
                                        type="text"
                                        value={productoSeleccionado.nombre}
                                        onChange={(e) =>
                                            setProductoSeleccionado({
                                                ...productoSeleccionado,
                                                nombre: e.target.value,
                                            })
                                        }
                                    />
                                    {/* Agrega campos similares para otros detalles del producto (descripcion, precio, etc.) */}

                                    {/* Botón para guardar los cambios */}
                                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
