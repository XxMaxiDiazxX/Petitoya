export const Producto = ({ nombre, descripcion, precio, imagenSrc, onClick }) => (
  <div 
    className="card" 
    onClick={onClick} 
    style={{ 
      cursor: 'pointer', 
      height: '450px'  // Altura fija
    }}
  >
    <img 
      className="card-img-top" 
      src={imagenSrc} 
      alt={nombre} 
      style={{ 
        width: '100%',  // La imagen ocupa todo el ancho de la tarjeta
        height: '200px', // Altura fija para la imagen
        objectFit: 'cover'  // Para que la imagen se ajuste bien sin deformarse
      }} 
    />
    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '250px' }}>
      <h5 className="card-title">{nombre}</h5>
      <p 
        className="card-text" 
        style={{
          flexGrow: 1, // Ocupar el máximo espacio posible
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          display: '-webkit-box', 
          WebkitLineClamp: 6, // Máximo de líneas que puede ocupar
          WebkitBoxOrient: 'vertical', 
          lineHeight: '1.2em', // Altura de línea para ajustarse a las líneas
          maxHeight: '7.2em'  // Limitar a 3 líneas en total
        }}
      >
        {descripcion}
      </p>
      <p className="card-text"><strong>Precio: </strong>{precio}</p>
    </div>
  </div>
);

export default Producto;
