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

export default Producto;