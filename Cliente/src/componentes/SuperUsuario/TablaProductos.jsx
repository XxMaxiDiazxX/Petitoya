import React from "react";
import EliminarProducto from "../AdminSupremo/DesactivarProducto";
import HabilitarProducto from "../AdminSupremo/HabilitarProducto";
import AnadirProducto from "../AdminSupremo/AnadirProducto";

export const TablaProductos = ({
  productosActivos,
  productos,
  productosInactivos,
  toggleProductos,
  handleAbrirEditarProductoModal,
  handleProductoDesactivado,
  handleProductoHabilitado,
  setProductos,
  setProductosInactivos,
  apiUrl,
}) => {
  return (
    <div className="row mt-4">
      <div className="col-md-12">
        <AnadirProducto setProductos={setProductos} />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="cuerpo">Todos los Productos</h4>
          <div className="btn-group" role="group" aria-label="Opciones de productos">
            <button
              type="button"
              className={`btn ${productosActivos ? "custom-button" : "btn-secondary"}`}
              onClick={() => toggleProductos(true)}
            >
              Activos
            </button>
            <button
              type="button"
              className={`btn ${!productosActivos ? "custom-button" : "btn-secondary"}`}
              onClick={() => toggleProductos(false)}
            >
              Inactivos
            </button>
          </div>
        </div>

        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th scope="col">Imagen</th>
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Precio</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(productosActivos ? productos : productosInactivos).map((producto) => (
              <tr key={producto.id_producto}>
                <td>
                  <img
                    src={`${apiUrl}${producto.imagenSrc}`}
                    alt={producto.nombre}
                    className="table-img"
                  />
                </td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.precio}</td>
                <td>
                  {productosActivos ? (
                    <>
                      <button
                        className="btn btn-primary me-2 custom-button1"
                        onClick={() => handleAbrirEditarProductoModal(producto)}
                      >
                        Editar
                      </button>
                      <EliminarProducto
                        id_producto={producto.id_producto}
                        setProductos={setProductos}
                        onProductoEliminado={handleProductoDesactivado}
                      />
                    </>
                  ) : (
                    <HabilitarProducto
                      id_producto={producto.id_producto}
                      setProductos={setProductosInactivos}
                      onProductoHabilitado={handleProductoHabilitado}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaProductos;
