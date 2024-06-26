export const EstadoProducto = ({ productosActivos, toggleProductos }) => (
    <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className='cuerpo'>Todos los Productos</h4>
        <div className="btn-group" role="group" aria-label="Opciones de productos">
            <button
                type="button"
                className={`btn ${productosActivos ? 'custom-button' : 'btn-secondary'}`}
                onClick={() => toggleProductos(true)}
            >
                Activos
            </button>
            <button
                type="button"
                className={`btn ${!productosActivos ? 'custom-button' : 'btn-secondary'}`}
                onClick={() => toggleProductos(false)}
            >
                Inactivos
            </button>
        </div>
    </div>

);

export default EstadoProducto;