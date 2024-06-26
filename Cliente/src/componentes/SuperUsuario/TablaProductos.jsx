import React from 'react';

export const TablaProductos = ({ productos, productosActivos, productosInactivos, handleAbrirEditarProductoModal, eliminarProducto }) => (
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
            {(productosActivos ? productos : productosInactivos).map(producto => (
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
                        <button
                            className='btn btn-danger'
                            onClick={() => eliminarProducto(producto.id_producto)}
                        >
                            Eliminar
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default TablaProductos;
