export const Producto = ({ nombre, descripcion, precio, imagenSrc, onClick }) => (
  <div className="card" onClick={onClick} style={{ cursor: 'pointer' }}>
    <img className="card-img-top" src={imagenSrc} alt={nombre} />
    <div className="card-body">
      <h5 className="card-title">{nombre}</h5>
      <p className="card-text">{descripcion}</p>
      <p className="card-text"><strong>Precio: </strong>{precio}</p>
    </div>
  </div>
);

export default Producto;
