export const Producto = ({ imgSrc, alt, description, price }) => (
  <div className="col-md-3">
    <div className="card mb-4 box-shadow">
      <img className="card-img-top" src={imgSrc} alt={alt} />
      <div className="card-body">
        <p className="card-text">{description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <p className="card-text">{price}</p>
        </div>
      </div>
    </div>
  </div>
);

