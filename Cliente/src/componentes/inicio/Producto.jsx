export const Producto = ({ nombre, descripcion, precio, imagenSrc, onClick }) => (
  <div
    className="col-md-3"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <div className="card mb-4 box-shadow">
      <img className="card-img-top" src={imagenSrc} />
      <div className="card-body">
        <p className="card-text">{descripcion}</p>
        <div className="d-flex justify-content-between align-items-center">
          <p className="card-text">{precio}</p>
        </div>
      </div>
    </div>
  </div>
);

export default Producto;