import { Link } from 'react-router-dom';
import Fondo from '../../img/error/fondo.jpg'

const PageNotFound = () => {
  return (
    <section
      className="fondo u-clearfix u-container-align-center u-image u-block-control current-section u-block-2d2e-1"
      style={{
        width: '100%',
      }}
      id="carousel_4e3b"
      data-id="2d2e"
    >
      <div
        className="u-clearfix u-sheet u-valign-middle-md u-valign-middle-sm u-valign-middle-xs u-block-2d2e-2"
        style={{ minHeight: '100vh' }}
      >
        <div
          className="u-align-center u-container-align-center u-container-style u-expanded-width-md u-expanded-width-sm u-expanded-width-xs u-grey-80 u-group u-radius-39 u-shape-round u-block-control u-block-2d2e-3 vertical-texts"
          style={{
            width: '763px',
            minHeight: '794px',
            boxShadow: '5px 5px 17px 0 rgba(0,0,0,0.1)',
            marginTop: '103px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '0',
          }}
        >
          <div
            className="u-container-layout u-valign-middle u-block-2d2e-4"
            style={{
              paddingTop: '50px',
              paddingRight: '50px',
              paddingBottom: '50px',
              paddingLeft: '49px',
            }}
          >
            <h3
              className="u-align-center u-text u-block-control u-block-2d2e-11"
              style={{
                fontSize: '12.5rem',
                fontWeight: '700',
                lineHeight: '1.2',
                marginTop: '0',
                marginBottom: '0',
              }}
            >
              404
            </h3>
            <h5
              className="u-align-center u-custom-font u-font-lato u-text u-text-palette-1-dark-1 u-block-control u-block-2d2e-6"
              style={{
                textTransform: 'uppercase',
                fontWeight: '700',
                fontSize: '3rem',
                marginTop: '10px',
                marginBottom: '0',
              }}
            >
              Página No Encontrada
            </h5>
            <p
              className="u-align-center u-text u-block-control u-block-2d2e-7"
              style={{
                fontSize: '1.5rem',
                fontWeight: '500',
                marginTop: '38px',
                marginLeft: '1px',
                marginRight: '1px',
                marginBottom: '0',
              }}
            >
              Buscamos por todos lados pero no pudimos encontrar lo que estás buscando. Vamos a encontrar un mejor lugar para ti.
            </p>
            <Link
              as={Link}
              to="/"
              className="u-active-white u-align-center u-border-none u-btn u-btn-round u-button-style u-hover-feature u-hover-white u-palette-1-dark-1 u-radius-41 u-text-active-black u-text-body-alt-color u-text-hover-black u-block-control u-block-2d2e-8"
              style={{
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                boxShadow: '4px 4px 0px 0 rgba(0,0,0,0.15)',
                marginTop: '38px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '0',
                paddingTop: '20px',
                paddingBottom: '20px',
                paddingLeft: '77px',
                paddingRight: '77px',
                transitionDuration: '0.5s',
              }}
            >
              Ir a Inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
