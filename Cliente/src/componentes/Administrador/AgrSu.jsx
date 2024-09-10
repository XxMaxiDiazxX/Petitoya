import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import AgregarCaruselItem from './AgregarCaruselItem';
import ConsultarSuper from './ConsultarSuper';
import EstadisticasVentas from './Stats';
import RegistroEmpleado from './RegistroEmpleado'; // Este es tu formulario de registro

export const AgrSu = () => {
  const [activeSection, setActiveSection] = useState('registro'); // Estado para controlar la sección activa

  return (
    <>
      <div className="h-100 d-flex flex-column align-items-center justify-content-center">
        <h4 className="text-center" style={{ fontSize: '45px' }}>Administración</h4>
        <div className="btn-group mb-4" role="group">
          <Button
            className={`btn ${activeSection === 'registro' ? 'custom-button' : 'btn-secondary'}`}
            onClick={() => setActiveSection('registro')}>
            Registro de empleados
          </Button>
          <Button
            className={`btn ${activeSection === 'carousel' ? 'custom-button' : 'btn-secondary'}`}
            onClick={() => setActiveSection('carousel')}>
            Agregar Carusel
          </Button>
          <Button
            className={`btn ${activeSection === 'consultar' ? 'custom-button' : 'btn-secondary'}`}
            onClick={() => setActiveSection('consultar')}>
            Consultar Supervisor
          </Button>
          <Button
            className={`btn ${activeSection === 'stats' ? 'custom-button' : 'btn-secondary'}`}
            onClick={() => setActiveSection('stats')}>
            Estadísticas de Ventas
          </Button>
        </div>

        {activeSection === 'registro' && <RegistroEmpleado />}
        {activeSection === 'carousel' && <AgregarCaruselItem />}
        {activeSection === 'consultar' && <ConsultarSuper />}
        {activeSection === 'stats' && <EstadisticasVentas />}
      </div>
    </>
  );
};

export default AgrSu;
